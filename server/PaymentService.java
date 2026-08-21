import java.sql.*;
import java.util.*;
import java.util.logging.*;

/**
 * TechHub Pro v6.0 — 支付服务 + 安全核验
 * 三轮核验：完整性 → 签名 → 服务端确认
 */
public class PaymentService {
    private static final Logger logger = Logger.getLogger("PaymentService");
    private static final String HMAC_SECRET = "TechHub-Pro-v6-2026-svcliny-secret-key";
    private static final long ORDER_TIMEOUT = 15 * 60 * 1000; // 15分钟
    private static final int MAX_RETRY = 5;

    // ========== 创建订单 ==========
    public static Map<String, Object> createOrder(String email, String courseId, double amount, boolean isVIP) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            if (amount < 9.9 || amount > 499) {
                result.put("success", false);
                result.put("message", "金额异常：超出允许范围");
                return result;
            }

            String orderId = "TH6-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase()
                          + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            long ts = System.currentTimeMillis();
            String signData = orderId + "|" + courseId + "|" + amount + "|" + ts;
            String signature = hmacSign(signData, HMAC_SECRET);

            boolean saved = DatabaseUtil.insertOrder(orderId, email, courseId, amount, signature, isVIP);

            if (saved) {
                result.put("success", true);
                result.put("orderId", orderId);
                result.put("signature", signature);
                result.put("amount", amount);
                result.put("timestamp", ts);
                logger.info("Order created: " + orderId + " email=" + email + " amount=" + amount);
            } else {
                result.put("success", false);
                result.put("message", "订单创建失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "系统错误: " + e.getMessage());
        }
        return result;
    }

    // ========== 三轮核验 ==========
    public static Map<String, Object> verifyPayment(String orderId, String clientSignature, int retryCount) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        try {
            // === Round 1: 订单完整性 ===
            if (orderId == null || !orderId.matches("^TH6-[A-Z0-9]+$")) {
                errors.add("订单号格式非法");
                result.put("passed", false); result.put("round", 1);
                result.put("errors", errors);
                return result;
            }

            ResultSet rs = DatabaseUtil.getOrder(orderId);
            if (rs == null || !rs.next()) {
                errors.add("订单不存在");
                result.put("passed", false); result.put("round", 1);
                result.put("errors", errors);
                return result;
            }

            long timestamp = rs.getLong("timestamp");
            double amount = rs.getDouble("amount");
            String status = rs.getString("status");

            if (System.currentTimeMillis() - timestamp > ORDER_TIMEOUT) {
                errors.add("订单已超时（15分钟）");
            }
            if (retryCount > MAX_RETRY) {
                errors.add("重试次数超限，订单已锁定");
            }
            if ("confirmed".equals(status)) {
                errors.add("订单已确认，禁止重复处理");
            }

            if (!errors.isEmpty()) {
                result.put("passed", false); result.put("round", 1);
                result.put("errors", errors);
                return result;
            }

            // === Round 2: 签名校验 ===
            String storedSig = rs.getString("signature");
            if (!storedSig.equals(clientSignature)) {
                // 尝试备用算法
                String altSig = sha256Fallback(orderId + "|" + rs.getString("course_id") + "|" + amount + "|" + timestamp + HMAC_SECRET);
                if (!altSig.equals(clientSignature)) {
                    errors.add("签名校验失败，订单可能被篡改");
                    result.put("passed", false); result.put("round", 2);
                    result.put("errors", errors);
                    return result;
                }
                warnings.add("使用了备用签名算法");
            }

            long timeDiff = Math.abs(System.currentTimeMillis() - timestamp);
            if (timeDiff > 5 * 60 * 1000) {
                warnings.add("订单时间戳偏差较大，请注意核对");
            }

            // === Round 3: 服务端确认 ===
            if ("verified".equals(status)) {
                // 已经核验过，直接通过
            } else {
                // 模拟服务端额外检查
                String email = rs.getString("email");
                if (email == null || email.isEmpty()) {
                    errors.add("服务端：订单关联用户缺失");
                    result.put("passed", false); result.put("round", 3);
                    result.put("errors", errors);
                    return result;
                }
            }

            // 全部通过 → 更新状态
            DatabaseUtil.updateOrderStatus(orderId, "verified");

            result.put("passed", true);
            result.put("round", 3);
            result.put("warnings", warnings);
            result.put("message", "支付核验全部通过");
            logger.info("Payment verified: " + orderId);

        } catch (Exception e) {
            errors.add("核验异常: " + e.getMessage());
            result.put("passed", false);
            result.put("round", 3);
            result.put("errors", errors);
        }
        return result;
    }

    // ========== 确认支付（最终执行） ==========
    public static Map<String, Object> confirmPayment(String orderId, String token) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            ResultSet rs = DatabaseUtil.getOrder(orderId);
            if (rs == null || !rs.next()) {
                result.put("success", false);
                result.put("message", "订单不存在");
                return result;
            }

            String status = rs.getString("status");
            if (!"verified".equals(status)) {
                result.put("success", false);
                result.put("message", "请先完成核验");
                return result;
            }

            String email = rs.getString("email");
            String courseId = rs.getString("course_id");
            boolean isVIP = rs.getInt("is_vip_order") == 1;

            if (isVIP) {
                // VIP升级
                long months = rs.getDouble("amount") >= 499 ? 12 : 1;
                long baseMs = System.currentTimeMillis();
                // 查现有VIP
                // 简化：直接延长
                long expiresAt = baseMs + months * 30 * 86400000L;
                DatabaseUtil.setVIP(email, expiresAt);
            } else if (courseId != null) {
                DatabaseUtil.addPurchasedCourse(email, courseId);
            }

            DatabaseUtil.updateOrderStatus(orderId, "confirmed");

            // 记录交易
            recordTransaction(orderId, email, rs.getDouble("amount"), isVIP ? "vip" : "course");

            result.put("success", true);
            result.put("message", "支付确认成功！");
            result.put("isVIP", isVIP);
            logger.info("Payment confirmed: " + orderId + " email=" + email);

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "确认失败: " + e.getMessage());
        }
        return result;
    }

    // ========== 工具方法 ==========
    private static String hmacSign(String data, String key) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec sk = new javax.crypto.spec.SecretKeySpec(key.getBytes(), "HmacSHA256");
            mac.init(sk);
            byte[] raw = mac.doFinal(data.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : raw) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) { return data; }
    }

    private static String sha256Fallback(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) { return input; }
    }

    private static void recordTransaction(String orderId, String email, double amount, String type) {
        try (Connection conn = DatabaseUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO transactions(order_id,email,amount,type,status,created_at) VALUES(?,?,?,'completed',?)");
            ps.setString(1, orderId);
            ps.setString(2, email);
            ps.setDouble(3, amount);
            ps.setString(4, type);
            ps.setLong(5, System.currentTimeMillis());
            ps.executeUpdate();
            DatabaseUtil.releaseConnection(conn);
        } catch (Exception e) { logger.warning("recordTx: " + e.getMessage()); }
    }

    // ========== 防重放检查 ==========
    public static boolean isOrderReplayed(String orderId) {
        // 已确认的订单不能再次使用
        try (Connection conn = DatabaseUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT status FROM orders WHERE order_id=?");
            ps.setString(1, orderId);
            ResultSet rs = ps.executeQuery();
            boolean replayed = rs.next() && "confirmed".equals(rs.getString("status"));
            DatabaseUtil.releaseConnection(conn);
            return replayed;
        } catch (Exception e) { return true; }
    }
}
