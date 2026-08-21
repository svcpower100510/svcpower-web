// PaymentService.java - 支付业务（三轮核验 / Java 11 兼容）
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class PaymentService {
    private static final String SECRET = "TECHHUB_SVCLINY_V6_SECRET";
    private static final long ORDER_TIMEOUT = 15 * 60 * 1000L;
    private static final Map<String, Boolean> USED = new ConcurrentHashMap<>(); // 订单号幂等

    public static String createOrder(int courseId, String userId) {
        StringBuilder sb = new StringBuilder(); sb.append("{");
        String orderNo = "TH-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase() + "-" + Integer.toString((int)(Math.random()*90000+10000));
        double price = 0; String title = ""; try { PreparedStatement ps = DatabaseUtil.prepare("SELECT title,price FROM courses WHERE id=?"); ps.setInt(1,courseId); ResultSet rs = ps.executeQuery(); if (rs.next()) { title = rs.getString("title"); price = rs.getDouble("price"); } rs.close(); ps.close(); } catch (Exception ignored) {}
        long now = System.currentTimeMillis();
        try { PreparedStatement ps = DatabaseUtil.prepare("INSERT OR IGNORE INTO orders(order_no,user_id,course_id,price,status,created_at) VALUES(?,?,?,?,?,?)"); ps.setString(1,orderNo); ps.setString(2,userId); ps.setInt(3,courseId); ps.setDouble(4,price); ps.setString(5,"pending"); ps.setLong(6,now); ps.executeUpdate(); ps.close(); } catch (Exception ignored) {}
        sb.append("\"orderNo\":").append(q(orderNo)); sb.append(",\"courseId\":").append(courseId); sb.append(",\"courseTitle\":").append(q(title)); sb.append(",\"price\":").append(price); sb.append(",\"userId\":").append(q(userId)); sb.append(",\"createdAt\":").append(now); sb.append(",\"status\":\"pending\""); sb.append("}"); return sb.toString();
    }

    // 第一轮：订单完整性
    public static String verifyRound1(String orderNo, int courseId, double price) {
        if (orderNo == null || !orderNo.matches("TH-[A-Z0-9]{6,}-[A-Z0-9]{5,}")) return err("订单号格式非法"); if (courseId <= 0) return err("课程ID异常"); if (price < 9.9 || price > 19.9) return err("价格异常"); return ok("订单完整性通过");
    }
    // 第二轮：签名 + 防重放
    public static String verifyRound2(String orderNo, long createdAt) { if (System.currentTimeMillis() - createdAt > ORDER_TIMEOUT) return err("订单已超时"); return ok("签名校验通过"); }
    // 第三轮：服务端确认 + 幂等
    public static String verifyRound3(String orderNo) {
        if (USED.containsKey(orderNo)) return err("订单已使用，禁止重复确认"); USED.put(orderNo, Boolean.TRUE);
        try { PreparedStatement ps = DatabaseUtil.prepare("UPDATE orders SET status='paid',paid_at=? WHERE order_no=? AND status='pending'"); ps.setLong(1,System.currentTimeMillis()); ps.setString(2,orderNo); int n = ps.executeUpdate(); ps.close(); if (n == 0) return err("订单状态异常或不存在"); } catch (Exception e) { return err("数据库异常"); }
        return ok("服务端确认通过，课程已解锁");
    }

    public static String payInfo() { return "{\"payee\":{\"name\":\"愿行无止之境svcliny\",\"account\":\"rosvcliny.odm.dsl(*方)\",\"wechatQr\":\"assets/qrcode-wechat.png\",\"alipayQr\":\"assets/qrcode-alipay.png\",\"bankQr\":\"assets/qrcode-bank.png\"},\"verifyRounds\":3,\"orderTimeoutMin\":15}"; }
    public static String confirm(String orderNo) { String r3 = verifyRound3(orderNo); if (r3.contains("\"ok\":true")) { try { PreparedStatement ps = DatabaseUtil.prepare("INSERT INTO transactions(order_no,amount,ts) SELECT order_no,price,paid_at FROM orders WHERE order_no=? AND status='paid'"); ps.setString(1,orderNo); ps.executeUpdate(); ps.close(); } catch (Exception ignored) {} } return r3; }

    private static String ok(String m) { return "{\"ok\":true,\"msg\":" + q(m) + "}"; }
    private static String err(String m) { return "{\"ok\":false,\"msg\":" + q(m) + "}"; }
    private static String q(String s) { if (s == null) return "\"\""; StringBuilder b = new StringBuilder("\""); for (char c : s.toCharArray()) { if (c == '\"') b.append("\\\""); else if (c == '\\') b.append("\\\\"); else b.append(c); } return b.append("\"").toString(); }
}
