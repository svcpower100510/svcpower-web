import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.logging.*;
import java.text.SimpleDateFormat;

/**
 * TechHub Pro v6.0 — HTTP服务器 + REST API
 * 支持：静态文件服务 + 12个API端点 + CORS + 安全头
 */
public class TechHubServer {
    private static final Logger logger = Logger.getLogger("TechHubServer");
    private final int port;
    private final ExecutorService pool;
    private final Map<String, String> mimeTypes = new HashMap<>();
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private final Map<String, Order> pendingOrders = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private ServerSocket serverSocket;
    private volatile boolean running = true;

    // ========== 数据模型 ==========
    static class User {
        String email, username, passwordHash;
        boolean isVIP;
        long vipExpiresAt;
        Set<String> purchasedCourses = ConcurrentHashMap.newKeySet();
        long createdAt, lastLoginAt;
        int loginCount;
    }
    static class Session {
        String email, token;
        long expiresAt;
        boolean isVIP;
    }
    static class Order {
        String orderId, courseId;
        double amount;
        long timestamp;
        String signature, status;
        int retryCount;
        boolean isVIPOrder;
    }

    public TechHubServer(int port) {
        this.port = port;
        this.pool = Executors.newFixedThreadPool(20, r -> {
            Thread t = new Thread(r, "http-worker");
            t.setDaemon(true);
            return t;
        });
        initMimeTypes();
        loadUsers();
        logger.info("TechHubServer initialized on port " + port);
    }

    private void initMimeTypes() {
        mimeTypes.put(".html", "text/html; charset=utf-8");
        mimeTypes.put(".css", "text/css; charset=utf-8");
        mimeTypes.put(".js", "application/javascript; charset=utf-8");
        mimeTypes.put(".json", "application/json; charset=utf-8");
        mimeTypes.put(".png", "image/png");
        mimeTypes.put(".jpg", "image/jpeg");
        mimeTypes.put(".svg", "image/svg+xml");
        mimeTypes.put(".ico", "image/x-icon");
    }

    private void loadUsers() {
        // 从持久化文件加载（简化版，实际可用SQLite）
        File f = new File("techhub_users.dat");
        if (f.exists()) {
            try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(f))) {
                Map<String, User> loaded = (Map<String, User>) ois.readObject();
                users.putAll(loaded);
                logger.info("Loaded " + users.size() + " users");
            } catch (Exception e) {
                logger.warning("Failed to load users: " + e.getMessage());
            }
        }
    }

    private void saveUsers() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("techhub_users.dat"))) {
            oos.writeObject(users);
        } catch (Exception e) {
            logger.warning("Failed to save users: " + e.getMessage());
        }
    }

    public void start() {
        try {
            serverSocket = new ServerSocket(port);
            logger.info("Server listening on http://localhost:" + port);
            while (running) {
                try {
                    Socket client = serverSocket.accept();
                    pool.submit(() -> handleClient(client));
                } catch (SocketException e) {
                    if (running) logger.warning("Socket error: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            logger.severe("Failed to start server: " + e.getMessage());
        }
    }

    private void handleClient(Socket client) {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            OutputStream out = client.getOutputStream();
            String line = in.readLine();
            if (line == null) { client.close(); return; }

            String[] requestLine = line.split(" ");
            if (requestLine.length < 2) { client.close(); return; }
            String method = requestLine[0];
            String path = requestLine[1];

            // 解析headers
            Map<String, String> headers = new HashMap<>();
            String h;
            while ((h = in.readLine()) != null && !h.isEmpty()) {
                int idx = h.indexOf(':');
                if (idx > 0) headers.put(h.substring(0, idx).trim().toLowerCase(), h.substring(idx+1).trim());
            }

            // 读取body
            String body = "";
            if ("POST".equals(method) || "PUT".equals(method)) {
                int contentLength = Integer.parseInt(headers.getOrDefault("content-length", "0"));
                if (contentLength > 0) {
                    char[] buf = new char[contentLength];
                    in.read(buf, 0, contentLength);
                    body = new String(buf);
                }
            }

            // 路由
            if (path.equals("/api/courses") && "GET".equals(method)) {
                sendJson(out, getCoursesJson());
            } else if (path.equals("/api/courses/featured") && "GET".equals(method)) {
                sendJson(out, getFeaturedCoursesJson());
            } else if (path.equals("/api/resources") && "GET".equals(method)) {
                sendJson(out, getResourcesJson());
            } else if (path.equals("/api/rankings") && "GET".equals(method)) {
                sendJson(out, getRankingsJson());
            } else if (path.equals("/api/github") && "GET".equals(method)) {
                sendJson(out, getGithubJson());
            } else if (path.equals("/api/bilibili") && "GET".equals(method)) {
                sendJson(out, getBilibiliJson());
            } else if (path.equals("/api/roadmaps") && "GET".equals(method)) {
                sendJson(out, getRoadmapsJson());
            } else if (path.equals("/api/news") && "GET".equals(method)) {
                sendJson(out, getNewsJson());
            } else if (path.equals("/api/search") && "GET".equals(method)) {
                String q = headers.getOrDefault("x-search-query", "");
                sendJson(out, searchCourses(q));
            } else if (path.equals("/api/auth/register") && "POST".equals(method)) {
                sendJson(out, handleRegister(body));
            } else if (path.equals("/api/auth/login") && "POST".equals(method)) {
                sendJson(out, handleLogin(body));
            } else if (path.equals("/api/auth/logout") && "POST".equals(method)) {
                sendJson(out, handleLogout(headers));
            } else if (path.equals("/api/auth/me") && "GET".equals(method)) {
                sendJson(out, handleGetMe(headers));
            } else if (path.equals("/api/payment/create") && "POST".equals(method)) {
                sendJson(out, handleCreateOrder(body));
            } else if (path.equals("/api/payment/verify") && "POST".equals(method)) {
                sendJson(out, handleVerifyPayment(body));
            } else if (path.equals("/api/payment/confirm") && "POST".equals(method)) {
                sendJson(out, handleConfirmPayment(body));
            } else if (path.equals("/api/vip/upgrade") && "POST".equals(method)) {
                sendJson(out, handleVIPUpgrade(body, headers));
            } else if (path.equals("/api/stats") && "GET".equals(method)) {
                sendJson(out, getStatsJson());
            } else if (path.equals("/api/health") && "GET".equals(method)) {
                sendJson(out, "{\"status\":\"ok\",\"version\":\"6.0\",\"time\":" + System.currentTimeMillis() + "}");
            } else if ("GET".equals(method)) {
                serveStatic(client, out, path);
            } else {
                send404(out);
            }
        } catch (Exception e) {
            logger.warning("Request error: " + e.getMessage());
        } finally {
            try { client.close(); } catch (Exception ignored) {}
        }
    }

    // ========== API Handlers ==========
    private String handleRegister(String body) {
        try {
            Map<String,String> data = parseJson(body);
            String email = data.get("email");
            String username = data.get("username");
            String password = data.get("password");

            if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                return jsonError("邮箱格式不正确");
            }
            if (username == null || username.length() < 2 || username.length() > 20) {
                return jsonError("用户名2-20个字符");
            }
            if (password == null || password.length() < 8) {
                return jsonError("密码至少8位");
            }
            if (!password.matches(".*[A-Z].*") || !password.matches(".*[0-9].*") || !password.matches(".*[^A-Za-z0-9].*")) {
                return jsonError("密码需包含大写字母、数字和特殊字符");
            }
            if (users.containsKey(email)) {
                return jsonError("该邮箱已注册");
            }

            User u = new User();
            u.email = email;
            u.username = username;
            u.passwordHash = hashPassword(password);
            u.createdAt = System.currentTimeMillis();
            users.put(email, u);
            saveUsers();

            logger.info("New user registered: " + email);
            return jsonSuccess("注册成功", "{\"email\":\"" + email + "\"}");
        } catch (Exception e) {
            return jsonError("注册失败: " + e.getMessage());
        }
    }

    private String handleLogin(String body) {
        try {
            Map<String,String> data = parseJson(body);
            String email = data.get("email");
            String password = data.get("password");
            boolean remember = "true".equals(data.get("remember"));

            User u = users.get(email);
            if (u == null || !u.passwordHash.equals(hashPassword(password))) {
                return jsonError("邮箱或密码错误");
            }

            String token = generateToken();
            Session s = new Session();
            s.email = email;
            s.token = token;
            s.expiresAt = System.currentTimeMillis() + (remember ? 7 : 1) * 86400000L;
            s.isVIP = u.isVIP && u.vipExpiresAt > System.currentTimeMillis();
            sessions.put(token, s);

            u.lastLoginAt = System.currentTimeMillis();
            u.loginCount++;
            saveUsers();

            return jsonSuccess("登录成功", "{\"token\":\"" + token + "\",\"isVIP\":" + s.isVIP + ",\"username\":\"" + u.username + "\"}");
        } catch (Exception e) {
            return jsonError("登录失败: " + e.getMessage());
        }
    }

    private String handleLogout(Map<String,String> headers) {
        String token = headers.getOrDefault("authorization", "").replace("Bearer ", "");
        sessions.remove(token);
        return jsonSuccess("已退出", "{}");
    }

    private String handleGetMe(Map<String,String> headers) {
        String token = headers.getOrDefault("authorization", "").replace("Bearer ", "");
        Session s = sessions.get(token);
        if (s == null) return jsonError("未登录");
        User u = users.get(s.email);
        if (u == null) return jsonError("用户不存在");
        boolean vip = u.isVIP && u.vipExpiresAt > System.currentTimeMillis();
        return "{\"success\":true,\"user\":{\"email\":\"" + u.email + "\",\"username\":\"" + u.username + "\",\"isVIP\":" + vip + ",\"purchasedCount\":" + u.purchasedCourses.size() + "}}";
    }

    private String handleCreateOrder(String body) {
        try {
            Map<String,String> data = parseJson(body);
            String courseId = data.get("courseId");
            double amount = Double.parseDouble(data.getOrDefault("amount", "0"));
            boolean isVIP = "true".equals(data.getOrDefault("isVIP", "false"));

            if (amount < 9.9 || amount > 499) return jsonError("金额异常");

            String orderId = "TH6-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase() + "-" + UUID.randomUUID().toString().substring(0,6).toUpperCase();
            String signData = orderId + "|" + courseId + "|" + amount + "|" + System.currentTimeMillis();
            String signature = hmacSign(signData, "TechHub-Pro-v6-2026-svcliny-secret-key");

            Order o = new Order();
            o.orderId = orderId;
            o.courseId = courseId;
            o.amount = amount;
            o.timestamp = System.currentTimeMillis();
            o.signature = signature;
            o.status = "pending";
            o.isVIPOrder = isVIP;
            pendingOrders.put(orderId, o);

            return jsonSuccess("订单创建成功", "{\"orderId\":\"" + orderId + "\",\"signature\":\"" + signature + "\",\"amount\":" + amount + "}");
        } catch (Exception e) {
            return jsonError("创建订单失败: " + e.getMessage());
        }
    }

    private String handleVerifyPayment(String body) {
        try {
            Map<String,String> data = parseJson(body);
            String orderId = data.get("orderId");
            String signature = data.get("signature");
            double amount = Double.parseDouble(data.getOrDefault("amount", "0"));

            Order o = pendingOrders.get(orderId);
            if (o == null) return jsonError("订单不存在");

            // Round 1: 完整性
            if (Math.abs(System.currentTimeMillis() - o.timestamp) > 15 * 60 * 1000) {
                return jsonError("订单已超时");
            }
            if (o.retryCount > 5) return jsonError("重试次数超限，订单锁定");

            // Round 2: 签名
            String expectedSign = o.signature;
            if (!expectedSign.equals(signature)) {
                o.retryCount++;
                return jsonError("签名校验失败");
            }

            // Round 3: 服务端确认
            o.status = "verified";
            return jsonSuccess("核验通过", "{\"round\":3}");
        } catch (Exception e) {
            return jsonError("核验失败: " + e.getMessage());
        }
    }

    private String handleConfirmPayment(String body) {
        try {
            Map<String,String> data = parseJson(body);
            String orderId = data.get("orderId");
            Order o = pendingOrders.get(orderId);
            if (o == null) return jsonError("订单不存在");

            if (!"verified".equals(o.status)) {
                return jsonError("请先完成核验");
            }

            // 执行购买/VIP升级
            if (o.isVIPOrder) {
                // 找到对应用户（从token获取）
                String token = data.getOrDefault("token", "");
                Session s = sessions.get(token);
                if (s != null) {
                    User u = users.get(s.email);
                    if (u != null) {
                        u.isVIP = true;
                        long months = o.amount >= 499 ? 12 : 1;
                        long baseMs = Math.max(u.vipExpiresAt, System.currentTimeMillis());
                        u.vipExpiresAt = baseMs + months * 30 * 86400000L;
                        s.isVIP = true;
                        saveUsers();
                    }
                }
            } else {
                String token = data.getOrDefault("token", "");
                Session s = sessions.get(token);
                if (s != null) {
                    User u = users.get(s.email);
                    if (u != null && o.courseId != null) {
                        u.purchasedCourses.add(o.courseId);
                        saveUsers();
                    }
                }
            }

            o.status = "confirmed";
            pendingOrders.remove(orderId);
            return jsonSuccess("支付确认成功", "{}");
        } catch (Exception e) {
            return jsonError("确认失败: " + e.getMessage());
        }
    }

    private String handleVIPUpgrade(String body, Map<String,String> headers) {
        try {
            Map<String,String> data = parseJson(body);
            int months = Integer.parseInt(data.getOrDefault("months", "1"));
            String token = headers.getOrDefault("authorization", "").replace("Bearer ", "");
            Session s = sessions.get(token);
            if (s == null) return jsonError("请先登录");

            User u = users.get(s.email);
            if (u == null) return jsonError("用户不存在");

            u.isVIP = true;
            long baseMs = Math.max(u.vipExpiresAt, System.currentTimeMillis());
            u.vipExpiresAt = baseMs + months * 30 * 86400000L;
            s.isVIP = true;
            saveUsers();

            return jsonSuccess("VIP已激活", "{\"expiresAt\":" + u.vipExpiresAt + "}");
        } catch (Exception e) {
            return jsonError("VIP升级失败: " + e.getMessage());
        }
    }

    // ========== 数据API ==========
    private String getCoursesJson() {
        return "{\"total\":200,\"courses\":[/* 200 courses JSON - served from data.js on frontend */]}";
    }
    private String getFeaturedCoursesJson() {
        return "{\"featured\":[{\"id\":19,\"title\":\"Python零基础到全栈\",\"hot\":true},{\"id\":91,\"title\":\"AI大模型应用开发\",\"hot\":true}]}";
    }
    private String getResourcesJson() {
        return "{\"resources\":[{\"name\":\"MDN\",\"url\":\"https://developer.mozilla.org\"},{\"name\":\"roadmap.sh\",\"url\":\"https://roadmap.sh\"}]}";
    }
    private String getRankingsJson() {
        return "{\"rankings\":[{\"rank\":1,\"name\":\"Python\",\"score\":98},{\"rank\":2,\"name\":\"AI/大模型\",\"score\":97}]}";
    }
    private String getGithubJson() {
        return "{\"repos\":[{\"name\":\"freeCodeCamp\",\"stars\":\"400k+\"},{\"name\":\"system-design-primer\",\"stars\":\"280k+\"}]}";
    }
    private String getBilibiliJson() {
        return "{\"videos\":[{\"title\":\"Python零基础\",\"author\":\"小甲鱼\",\"views\":\"580万\"}]}";
    }
    private String getRoadmapsJson() {
        return "{\"roadmaps\":[{\"title\":\"前端工程师\",\"months\":\"6-9个月\"},{\"title\":\"AI工程师\",\"months\":\"9-12个月\"}]}";
    }
    private String getNewsJson() {
        return "{\"news\":[{\"title\":\"OpenAI发布GPT-5\",\"cat\":\"AI\",\"date\":\"2026-08-18\"},{\"title\":\"Rust 1.80发布\",\"cat\":\"编程语言\"}]}";
    }
    private String searchCourses(String q) {
        return "{\"query\":\"" + q + "\",\"results\":[]}";
    }
    private String getStatsJson() {
        return "{\"totalCourses\":200,\"categories\":21,\"freeQuota\":100,\"vipPrice\":99,\"vipYearly\":499}";
    }

    // ========== 工具方法 ==========
    private String hashPassword(String pwd) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest((pwd + "_techhub_salt_v6").getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) { return pwd; }
    }

    private String hmacSign(String data, String key) {
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

    private String generateToken() {
        return UUID.randomUUID().toString().replace("-", "") + Long.toString(System.currentTimeMillis(), 36);
    }

    private Map<String,String> parseJson(String json) {
        Map<String,String> map = new HashMap<>();
        // 简易JSON解析（避免外部依赖）
        json = json.trim();
        if (json.startsWith("{")) json = json.substring(1);
        if (json.endsWith("}")) json = json.substring(0, json.length()-1);
        String[] pairs = json.split(",");
        for (String p : pairs) {
            String[] kv = p.split(":", 2);
            if (kv.length == 2) {
                String k = kv[0].trim().replace("\"", "");
                String v = kv[1].trim().replace("\"", "").replace("'", "");
                map.put(k, v);
            }
        }
        return map;
    }

    private String jsonSuccess(String msg, String data) {
        return "{\"success\":true,\"message\":\"" + msg + "\",\"data\":" + data + "}";
    }
    private String jsonError(String msg) {
        return "{\"success\":false,\"message\":\"" + msg + "\"}";
    }

    // ========== 静态文件服务 ==========
    private void serveStatic(Socket client, OutputStream out, String path) throws IOException {
        if (path.equals("/") || path.isEmpty()) path = "/index.html";
        String filePath = "." + path;
        File f = new File(filePath);
        if (!f.exists() || f.isDirectory()) {
            f = new File(filePath + "/index.html");
        }
        if (!f.exists()) { send404(out); return; }

        String ext = "";
        int dot = f.getName().lastIndexOf('.');
        if (dot > 0) ext = f.getName().substring(dot).toLowerCase();

        byte[] content = Files.readAllBytes(f.toPath());
        String mime = mimeTypes.getOrDefault(ext, "application/octet-stream");

        PrintWriter pw = new PrintWriter(new OutputStreamWriter(out, "UTF-8"));
        pw.println("HTTP/1.1 200 OK");
        pw.println("Content-Type: " + mime);
        pw.println("Content-Length: " + content.length);
        pw.println("Cache-Control: no-cache");
        pw.println("X-Content-Type-Options: nosniff");
        pw.println("X-Frame-Options: DENY");
        pw.println("Referrer-Policy: no-referrer");
        pw.println("Access-Control-Allow-Origin: *");
        pw.println("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        pw.println("Access-Control-Allow-Headers: Content-Type, Authorization");
        pw.println();
        pw.flush();
        out.write(content);
        out.flush();
    }

    private void sendJson(OutputStream out, String json) throws IOException {
        byte[] data = json.getBytes("UTF-8");
        PrintWriter pw = new PrintWriter(new OutputStreamWriter(out, "UTF-8"));
        pw.println("HTTP/1.1 200 OK");
        pw.println("Content-Type: application/json; charset=utf-8");
        pw.println("Content-Length: " + data.length);
        pw.println("Cache-Control: no-store");
        pw.println("X-Content-Type-Options: nosniff");
        pw.println("Access-Control-Allow-Origin: *");
        pw.println("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        pw.println("Access-Control-Allow-Headers: Content-Type, Authorization");
        pw.println();
        pw.flush();
        out.write(data);
        out.flush();
    }

    private void send404(OutputStream out) throws IOException {
        String msg = "{\"error\":\"Not Found\"}";
        byte[] data = msg.getBytes("UTF-8");
        PrintWriter pw = new PrintWriter(new OutputStreamWriter(out, "UTF-8"));
        pw.println("HTTP/1.1 404 Not Found");
        pw.println("Content-Type: application/json");
        pw.println("Content-Length: " + data.length);
        pw.println();
        pw.flush();
        out.write(data);
        out.flush();
    }

    // ========== 清理任务 ==========
    public void cleanupExpiredSessions() {
        long now = System.currentTimeMillis();
        sessions.entrySet().removeIf(e -> e.getValue().expiresAt < now);
    }
    public void cleanupExpiredOrders() {
        long now = System.currentTimeMillis();
        pendingOrders.entrySet().removeIf(e -> now - e.getValue().timestamp > 30 * 60 * 1000);
    }

    public void shutdown() {
        running = false;
        try { if (serverSocket != null && !serverSocket.isClosed()) serverSocket.close(); } catch (Exception ignored) {}
        pool.shutdownNow();
    }
}
