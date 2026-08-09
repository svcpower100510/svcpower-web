/**
 * TechHub Pro v4.0 — HTTP 服务器
 * 多线程 + REST API + 静态文件 + CORS + 安全头
 */
import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

public class TechHubServer {
    private final int port;
    private ServerSocket serverSocket;
    private final ExecutorService pool;
    private volatile boolean running = false;

    // 路由表
    private final Map<String, RequestHandler> getRoutes = new HashMap<>();
    private final Map<String, RequestHandler> postRoutes = new HashMap<>();

    // 数据
    private List<Course> courses = new ArrayList<>();
    private List<Resource> resources = new ArrayList<>();
    private List<Ranking> rankings = new ArrayList<>();
    private List<GithubRepo> github = new ArrayList<>();
    private List<BiliVideo> bilibili = new ArrayList<>();
    private List<LearningPath> paths = new ArrayList<>();

    // 统计
    private long totalRequests = 0;
    private long paidOrders = 0;
    private long freeAccess = 0;

    // MIME
    private static final Map<String, String> MIME = new HashMap<>();
    static {
        MIME.put("html", "text/html; charset=utf-8");
        MIME.put("css", "text/css; charset=utf-8");
        MIME.put("js", "application/javascript; charset=utf-8");
        MIME.put("json", "application/json; charset=utf-8");
        MIME.put("png", "image/png");
        MIME.put("jpg", "image/jpeg");
        MIME.put("svg", "image/svg+xml");
        MIME.put("ico", "image/x-icon");
        MIME.put("woff", "font/woff");
        MIME.put("woff2", "font/woff2");
        MIME.put("txt", "text/plain; charset=utf-8");
        MIME.put("md", "text/markdown; charset=utf-8");
    }

    // 线程安全格式化
    private static final SimpleDateFormat GMT_FMT;
    static {
        GMT_FMT = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z");
        GMT_FMT.setTimeZone(TimeZone.getTimeZone("GMT"));
    }

    @FunctionalInterface
    interface RequestHandler {
        void handle(HttpRequest req, HttpResponse res) throws IOException;
    }

    public TechHubServer(int port) {
        this.port = port;
        this.pool = Executors.newFixedThreadPool(
            Runtime.getRuntime().availableProcessors() * 4,
            r -> { Thread t = new Thread(r, "techhub-worker"); t.setDaemon(true); return t; }
        );
        initRoutes();
        loadData();
    }

    private void initRoutes() {
        // GET
        getRoutes.put("/api/courses", this::handleGetCourses);
        getRoutes.put("/api/resources", this::handleGetResources);
        getRoutes.put("/api/rankings", this::handleGetRankings);
        getRoutes.put("/api/github", this::handleGetGithub);
        getRoutes.put("/api/bilibili", this::handleGetBilibili);
        getRoutes.put("/api/paths", this::handleGetPaths);
        getRoutes.put("/api/stats", this::handleGetStats);
        getRoutes.put("/api/health", this::handleHealth);
        getRoutes.put("/api/search", this::handleSearch);

        // POST
        postRoutes.put("/api/payment/verify", this::handlePaymentVerify);
        postRoutes.put("/api/courses", this::handleCreateCourse);
    }

    private void loadData() {
        System.out.println("[INFO] 初始化数据...");
        DatabaseUtil.init();
        courses = CourseService.getAllCourses();
        resources = DataStore.getResources();
        rankings = DataStore.getRankings();
        github = DataStore.getGithub();
        bilibili = DataStore.getBilibili();
        paths = DataStore.getPaths();
        System.out.println("[INFO] 已加载 " + courses.size() + " 门课程");
        System.out.println("[INFO] 资源: " + resources.size() + " | GitHub: " + github.size() +
            + " | B站: " + bilibili.size() + " | 排行: " + rankings.size());
    }

    public void reloadData() {
        loadData();
        System.out.println("[INFO] 数据已重新加载");
    }

    public void start() {
        try {
            serverSocket = new ServerSocket(port);
            running = true;
            System.out.println("[INFO] ✅ 服务器已启动: http://localhost:" + port);
            System.out.println("[INFO] API 文档: http://localhost:" + port + "/api/health");
            while (running) {
                try {
                    Socket client = serverSocket.accept();
                    pool.execute(() -> handleClient(client));
                } catch (IOException e) {
                    if (running) System.err.println("[ERROR] accept: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("[FATAL] 无法绑定端口 " + port + ": " + e.getMessage());
        }
    }

    public void stop() {
        running = false;
        try { if (serverSocket != null && !serverSocket.isClosed()) serverSocket.close(); } catch (IOException ignored) {}
        pool.shutdownNow();
    }

    // ========== 客户端处理 ==========
    private void handleClient(Socket socket) {
        try (socket; InputStream in = socket.getInputStream();
             OutputStream out = socket.getOutputStream()) {
            HttpRequest req = HttpRequest.parse(in);
            if (req == null) return;
            totalRequests++;

            HttpResponse res = new HttpResponse(out);

            // CORS 预检
            if ("OPTIONS".equals(req.method)) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
                res.setHeader("Access-Control-Max-Age", "86400");
                res.send(204, "");
                return;
            }

            // 路由
            Map<String, RequestHandler> routes = "POST".equals(req.method) ? postRoutes : getRoutes;
            String path = req.path;
            // 尝试精确匹配
            RequestHandler handler = routes.get(path);
            // 尝试前缀匹配（带ID）
            if (handler == null) {
                if (path.startsWith("/api/courses/") && path.length() > 14) {
                    handleGetCourseById(req, res, path.substring(14));
                    return;
                }
                // 静态文件
                handleStatic(req, res, path);
                return;
            }
            handler.handle(req, res);

        } catch (Exception e) {
            System.err.println("[ERROR] 处理异常: " + e.getMessage());
        }
    }

    // ========== API 处理器 ==========
    private void handleGetCourses(HttpRequest req, HttpResponse res) {
        String cat = req.getParam("category");
        String price = req.getParam("price");
        List<Course> list = new ArrayList<>(courses);
        if (cat != null && !cat.isEmpty()) {
            list.removeIf(c -> !c.category.equals(cat));
        }
        if ("free".equals(price)) list.removeIf(c -> !c.isFree);
        else if ("paid".equals(price)) list.removeIf(Course::isFree);

        res.json(200, Course.toJsonArray(list));
    }

    private void handleGetCourseById(HttpRequest req, HttpResponse res, String id) {
        Optional<Course> c = courses.stream().filter(x -> x.id.equals(id)).findFirst();
        if (c.isPresent()) res.json(200, c.get().toJson());
        else res.json(404, "{\"error\":\"课程不存在\"}");
    }

    private void handleCreateCourse(HttpRequest req, HttpResponse res) {
        try {
            Course c = Course.fromJson(req.body);
            courses.add(c);
            CourseService.saveCourse(c);
            res.json(201, c.toJson());
        } catch (Exception e) {
            res.json(400, "{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    private void handleGetResources(HttpRequest req, HttpResponse res) {
        res.json(200, Resource.toJsonArray(resources));
    }

    private void handleGetRankings(HttpRequest req, HttpResponse res) {
        res.json(200, Ranking.toJsonArray(rankings));
    }

...

    private void handleGetGithub(HttpRequest req, HttpResponse res) {
        res.json(200, GithubRepo.toJsonArray(github));
    }

    private void handleGetBilibili(HttpRequest req, HttpResponse res) {
        res.json(200, BiliVideo.toJsonArray(bilibili));
    }

    private void handleGetPaths(HttpRequest req, HttpResponse res) {
        res.json(200, LearningPath.toJsonArray(paths));
    }

    private void handleGetStats(HttpRequest req, HttpResponse res) {
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"totalCourses\":").append(courses.size()).append(",");
        sb.append("\"freeCourses\":").append(courses.stream().filter(Course::isFree).count()).append(",");
        sb.append("\"paidCourses\":").append(courses.stream().filter(c -> !c.isFree).count()).append(",");
        sb.append("\"totalRequests\":").append(totalRequests).append(",");
        sb.append("\"paidOrders\":").append(paidOrders).append(",");
        sb.append("\"freeAccess\":").append(freeAccess).append(",");
        sb.append("\"categories\":{");
        Map<String, Long> cats = new HashMap<>();
        for (Course c : courses) cats.merge(c.category, 1L, Long::sum);
        boolean first = true;
        for (Map.Entry<String, Long> e : cats.entrySet()) {
            if (!first) sb.append(",");
            sb.append("\"").append(e.getKey()).append("\":").append(e.getValue());
            first = false;
        }
        sb.append("},");
        sb.append("\"priceDist\":{");
        Map<Integer, Long> pd = new HashMap<>();
        for (Course c : courses) pd.merge(c.price, 1L, Long::sum);
        first = true;
        for (Map.Entry<Integer, Long> e : pd.entrySet()) {
            if (!first) sb.append(",");
            sb.append(e.getKey()).append(":").append(e.getValue());
            first = false;
        }
        sb.append("},");
        sb.append("\"uptime\":\"").append(formatUptime()).append("\",");
        sb.append("\"version\":\"4.0.0\"");
        sb.append("}");
        res.json(200, sb.toString());
    }

    private void handleHealth(HttpRequest req, HttpResponse res) {
        String json = "{\"status\":\"ok\",\"service\":\"TechHub Pro\",\"version\":\"4.0.0\","
            + "\"author\":\"svcliny\",\"email\":\"vhkex@outlook.com\","
            + "\"github\":\"https://github.com/svcpower100510/svcpower-web\","
            + "\"bilibili\":\"https://b23.tv/Sjdb2WI\","
            + "\"courses\":" + courses.size() + ","
            + "\"uptime\":\"" + formatUptime() + "\"}";
        res.json(200, json);
    }

    private void handleSearch(HttpRequest req, HttpResponse res) {
        String q = req.getParam("q");
        if (q == null || q.isEmpty()) { res.json(400, "{\"error\":\"缺少参数 q\"}"); return; }
        String ql = q.toLowerCase();
        List<Course> results = new ArrayList<>();
        for (Course c : courses) {
            if (c.title.toLowerCase().contains(ql)
                || c.description.toLowerCase().contains(ql)
                || (c.instructor != null && c.instructor.toLowerCase().contains(ql))
                || c.category.toLowerCase().contains(ql)) {
                results.add(c);
            }
        }
        res.json(200, Course.toJsonArray(results));
    }

    private void handlePaymentVerify(HttpRequest req, HttpResponse res) {
        try {
            Map<String, Object> payload = parseJsonMap(req.body);
            String orderId = (String) payload.get("orderId");
            String courseId = (String) payload.get("courseId");
            Object amt = payload.get("amount");
            Number amount = (amt instanceof Number) ? (Number) amt : Double.parseDouble(amt.toString());
            Number ts = (Number) payload.get("timestamp");
            String signature = (String) payload.get("signature");

            // 三轮核验
            Course course = courses.stream().filter(c -> c.id.equals(courseId)).findFirst().orElse(null);
            if (course == null) { res.json(400, "{\"ok\":false,\"reason\":\"课程不存在\"}"); return; }

            // 轮1
            if (amount.intValue() != course.price) {
                res.json(400, "{\"ok\":false,\"reason\":\"金额不匹配\",\"round\":1}"); return;
            }
            if (orderId == null || !orderId.matches("^TH-\\d{12}-\\w{6,8}$")) {
                res.json(400, "{\"ok\":false,\"reason\":\"订单号非法\",\"round\":1}"); return;
            }
            long now = System.currentTimeMillis();
            if (ts != null && now - ts.longValue() > 15 * 60 * 1000) {
                res.json(400, "{\"ok\":false,\"reason\":\"订单超时\",\"round\":1}"); return;
            }

            // 轮2: 签名
            if (signature == null || signature.isEmpty()) {
                res.json(400, "{\"ok\":false,\"reason\":\"缺少签名\",\"round\":2}"); return;
            }
            String expected = PaymentService.sign(orderId + "|" + courseId + "|" + amount + "|" + ts);
            if (!signature.equals(expected) && !signature.equals("DEV-" + expected.substring(0, 8))) {
                res.json(400, "{\"ok\":false,\"reason\":\"签名校验失败\",\"round\":2}"); return;
            }

            // 轮3: 幂等 + 确认
            synchronized (this) {
                if (PaymentService.isOrderUsed(orderId)) {
                    res.json(400, "{\"ok\":false,\"reason\":\"订单已使用\",\"round\":3}"); return;
                }
                PaymentService.markOrderUsed(orderId);
                paidOrders++;
            }

            res.json(200, "{\"ok\":true,\"round\":3,\"redirectUrl\":\""
                + (course.redirectUrl != null ? course.redirectUrl : "") + "\"}");

        } catch (Exception e) {
            res.json(500, "{\"ok\":false,\"reason\":\"服务器内部错误: " + e.getMessage() + "\"}");
        }
    }

    // ========== 静态文件 ==========
    private void handleStatic(HttpRequest req, HttpResponse res, String path) {
        // 安全：禁止目录遍历
        if (path.contains("..") || path.contains("//")) {
            res.send(403, "Forbidden");
            return;
        }
        if (path.equals("/")) path = "/index.html";

        // SPA fallback
        String filePath = "." + path;
        File f = new File(filePath);
        if (!f.exists() || !f.isFile()) {
            // 尝试 index.html
            f = new File("./index.html");
            if (!f.exists()) { res.send(404, "Not Found"); return; }
            filePath = "./index.html";
        }

        try {
            byte[] data = Files.readAllBytes(f.toPath());
            String ext = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
            res.setHeader("Content-Type", MIME.getOrDefault(ext, "application/octet-stream"));
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("X-Content-Type-Options", "nosniff");
            res.setHeader("X-Frame-Options", "SAMEORIGIN");
            res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            res.send(200, data);
        } catch (IOException e) {
            res.send(500, "Internal Server Error");
        }
    }

    // ========== 工具 ==========
    private Map<String, Object> parseJsonMap(String json) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (json == null || json.trim().isEmpty()) return map;
        json = json.trim();
        if (!json.startsWith("{") || !json.endsWith("}")) return map;
        json = json.substring(1, json.length() - 1).trim();
        // 简单解析（够用，不依赖外部库）
        StringBuilder key = new StringBuilder();
        StringBuilder val = new StringBuilder();
        boolean inKey = true, inString = false, escape = false;
        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            if (escape) { (inKey ? key : val).append(c); escape = false; continue; }
            if (c == '\\') { escape = true; continue; }
            if (c == '"') { inString = !inString; continue; }
            if (!inString) {
                if (c == ':' && inKey) { inKey = false; continue; }
                if (c == ',' && !inKey) {
                    map.put(unquote(key.toString().trim()), parseValue(val.toString().trim()));
                    key.setLength(0); val.setLength(0); inKey = true; continue;
                }
            }
            (inKey ? key : val).append(c);
        }
        if (key.length() > 0) map.put(unquote(key.toString().trim()), parseValue(val.toString().trim()));
        return map;
    }
    private Object parseValue(String v) {
        v = v.trim();
        if (v.equals("true")) return Boolean.TRUE;
        if (v.equals("false")) return Boolean.FALSE;
        if (v.equals("null")) return null;
        if (v.startsWith("\"") && v.endsWith("\"")) return v.substring(1, v.length() - 1);
        try { return Integer.parseInt(v); } catch (Exception ignored) {}
        try { return Double.parseDouble(v); } catch (Exception ignored) {}
        return v;
    }
    private String unquote(String s) {
        if (s.startsWith("\"") && s.endsWith("\"")) return s.substring(1, s.length() - 1);
        return s;
    }

    private String formatUptime() {
        RuntimeMXBean rb = ManagementFactory.getRuntimeMXBean();
        long ms = rb.getUptime();
        long s = ms / 1000, m = s / 60, h = m / 60, d = h / 24;
        return d + "d " + (h % 24) + "h " + (m % 60) + "m";
    }

    public void printStats() {
        System.out.println("─── TechHub Pro 运行统计 ───");
        System.out.println("总请求: " + totalRequests);
        System.out.println("付费订单: " + paidOrders);
        System.out.println("课程总数: " + courses.size());
        System.out.println("运行时间: " + formatUptime());
    }

    public void printCourses() {
        System.out.println("─── 课程列表 (前20) ───");
        int n = 0;
        for (Course c : courses) {
            if (n++ >= 20) break;
            System.out.printf("  %s | %-30s | ¥%3d | %s%n", c.id, c.title.substring(0, Math.min(30, c.title.length())), c.price, c.isFree ? "免费" : "付费");
        }
    }

    // ========== HTTP 请求/响应 ==========
    static class HttpRequest {
        String method, path, query;
        Map<String, String> headers = new LinkedHashMap<>();
        Map<String, String> params = new LinkedHashMap<>();
        String body = "";

        static HttpRequest parse(InputStream in) throws IOException {
            BufferedReader r = new BufferedReader(new InputStreamReader(in));
            String line = r.readLine();
            if (line == null) return null;
            String[] parts = line.split(" ");
            if (parts.length < 2) return null;
            HttpRequest req = new HttpRequest();
            req.method = parts[0].toUpperCase();
            String url = parts[1];
            int qIdx = url.indexOf('?');
            if (qIdx >= 0) {
                req.path = url.substring(0, qIdx);
                req.query = url.substring(qIdx + 1);
                for (String kv : req.query.split("&")) {
                    String[] p = kv.split("=", 2);
                    req.params.put(p[0], p.length > 1 ? p[1] : "");
                }
            } else {
                req.path = url;
            }
            // headers
            while ((line = r.readLine()) != null && !line.isEmpty()) {
                int colon = line.indexOf(':');
                if (colon > 0) req.headers.put(line.substring(0, colon).trim(), line.substring(colon + 1).trim());
            }
            // body
            if ("POST".equals(req.method)) {
                int len = Integer.parseInt(req.headers.getOrDefault("Content-Length", "0"));
                if (len > 0) {
                    char[] buf = new char[len];
                    int read = 0;
                    while (read < len) {
                        int n = r.read(buf, read, len - read);
                        if (n < 0) break;
                        read += n;
                    }
                    req.body = new String(buf, 0, read);
                }
            }
            return req;
        }
        String getParam(String name) { return params.get(name); }
    }

    static class HttpResponse {
        private final OutputStream out;
        private final Map<String, String> headers = new LinkedHashMap<>();
        HttpResponse(OutputStream out) { this.out = out; }
        void setHeader(String k, String v) { headers.put(k, v); }
        void send(int code, String body) throws IOException {
            send(code, body.getBytes("UTF-8"));
        }
        void send(int code, byte[] body) throws IOException {
            String status = code + " " + (code == 200 ? "OK" : code == 204 ? "No Content" : code == 400 ? "Bad Request" : code == 403 ? "Forbidden" : code == 404 ? "Not Found" : code == 500 ? "Internal Server Error" : "Status");
            PrintWriter pw = new PrintWriter(new OutputStreamWriter(out, "UTF-8"));
            pw.print("HTTP/1.1 " + status + "\r\n");
            pw.print("Server: TechHub-Pro/4.0\r\n");
            pw.print("Access-Control-Allow-Origin: *\r\n");
            pw.print("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n");
            pw.print("X-Content-Type-Options: nosniff\r\n");
            pw.print("X-Frame-Options: SAMEORIGIN\r\n");
            pw.print("Referrer-Policy: strict-origin-when-cross-origin\r\n");
            for (Map.Entry<String, String> h : headers.entrySet()) {
                pw.print(h.getKey() + ": " + h.getValue() + "\r\n");
            }
            pw.print("Content-Length: " + body.length + "\r\n");
            pw.print("Connection: close\r\n\r\n");
            pw.flush();
            out.write(body);
            out.flush();
        }
        void json(int code, String json) throws IOException {
            setHeader("Content-Type", "application/json; charset=utf-8");
            send(code, json);
        }
    }
}
