// TechHubServer.java - Java HTTP 服务器（静态文件 + REST API / Java 11 兼容）
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TechHubServer {
    private final int port; private final String webRoot; private ServerSocket ss; private final ExecutorService pool = Executors.newFixedThreadPool(32);
    public TechHubServer(int port, String webRoot) { this.port = port; this.webRoot = webRoot; }
    public void start() { try { ss = new ServerSocket(port); System.out.println("[TechHub Pro] HTTP server listening on http://localhost:" + port); while (!ss.isClosed()) { final Socket s = ss.accept(); pool.execute(() -> handle(s)); } } catch (IOException e) { if (!"Socket closed".equals(e.getMessage())) e.printStackTrace(); } }
    public void stop() { try { ss.close(); } catch (IOException ignored) {} pool.shutdown(); }

    private void handle(Socket s) {
        try (BufferedInputStream in = new BufferedInputStream(s.getInputStream()); OutputStream out = new BufferedOutputStream(s.getOutputStream())) {
            String line = readLine(in); if (line == null || line.isEmpty()) return;
            String[] parts = line.split(" "); if (parts.length < 2) return;
            String method = parts[0]; String pathRaw = parts[1];
            // 读取请求头（丢弃）
            while (true) { String hl = readLine(in); if (hl == null || hl.isEmpty()) break; }
            String path = URLDecoder.decode(pathRaw, StandardCharsets.UTF_8.name()); int qidx = path.indexOf('?'); String query = ""; if (qidx >= 0) { query = path.substring(qidx + 1); path = path.substring(0, qidx); }
            if (path.equals("/")) path = "/index.html";
            if (method.equals("GET") && path.startsWith("/api/")) { sendApi(out, path, query); return; }
            if (method.equals("POST") && path.startsWith("/api/")) { sendApi(out, path, query); return; }
            if (method.equals("OPTIONS")) { sendCorsPreflight(out); return; }
            sendFile(out, path);
        } catch (Exception ignored) {} finally { try { s.close(); } catch (IOException ignored) {} }
    }

    private void sendApi(OutputStream out, String path, String query) throws IOException {
        String body = "{\"error\":\"not found\"}"; int code = 404;
        if ("/api/courses".equals(path)) { body = CourseService.listAll(); code = 200; }
        else if ("/api/search".equals(path)) { String q = ""; for (String p : query.split("&")) { if (p.startsWith("q=")) q = p.substring(2); } body = CourseService.search(q); code = 200; }
        else if ("/api/resources".equals(path)) { body = DataStore.resourcesJson(); code = 200; }
        else if ("/api/rankings".equals(path)) { body = DataStore.rankingsJson(); code = 200; }
        else if ("/api/github".equals(path)) { body = DataStore.githubJson(); code = 200; }
        else if ("/api/bilibili".equals(path)) { body = DataStore.bilibiliJson(); code = 200; }
        else if ("/api/roadmaps".equals(path)) { body = DataStore.roadmapsJson(); code = 200; }
        else if ("/api/news".equals(path)) { body = DataStore.newsJson(); code = 200; }
        else if ("/api/stats".equals(path)) { body = CourseService.stats(); code = 200; }
        else if ("/api/payment/info".equals(path)) { body = PaymentService.payInfo(); code = 200; }
        else if ("/api/payment/create".equals(path)) { int cid = 0; String uid = "guest"; for (String p : query.split("&")) { if (p.startsWith("courseId=")) cid = Integer.parseInt(p.substring(10)); else if (p.startsWith("userId=")) uid = p.substring(7); } body = PaymentService.createOrder(cid, uid); code = 200; }
        else if ("/api/payment/verify".equals(path)) { body = PaymentService.confirm(""); code = 200; }
        else if ("/api/health".equals(path)) { body = "{\"status\":\"ok\",\"version\":\"6.0.0\"}"; code = 200; }
        byte[] b = body.getBytes(StandardCharsets.UTF_8);
        out.write(("HTTP/1.1 " + code + " OK\r\n").getBytes()); out.write(("Content-Type: application/json; charset=utf-8\r\n").getBytes()); out.write(("Content-Length: " + b.length + "\r\n").getBytes()); out.write("Access-Control-Allow-Origin: *\r\n".getBytes()); out.write("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n".getBytes()); out.write("X-Content-Type-Options: nosniff\r\n".getBytes()); out.write("X-Frame-Options: DENY\r\n".getBytes()); out.write("Referrer-Policy: no-referrer-when-downgrade\r\n".getBytes()); out.write("\r\n".getBytes()); out.write(b); out.flush();
    }

    private void sendCorsPreflight(OutputStream out) throws IOException { out.write("HTTP/1.1 204 No Content\r\n".getBytes()); out.write("Access-Control-Allow-Origin: *\r\n".getBytes()); out.write("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n".getBytes()); out.write("Access-Control-Allow-Headers: Content-Type\r\n".getBytes()); out.write("\r\n".getBytes()); out.flush(); }

    private void sendFile(OutputStream out, String path) throws IOException {
        File f = new File(webRoot, path).getCanonicalFile();
        if (!f.getPath().startsWith(new File(webRoot).getCanonicalPath())) { out.write("HTTP/1.1 403 Forbidden\r\n\r\n".getBytes()); return; }
        if (!f.exists() || !f.isFile()) { out.write("HTTP/1.1 404 Not Found\r\n\r\n".getBytes()); return; }
        String ct = "application/octet-stream"; String ext = f.getName().contains(".") ? f.getName().substring(f.getName().lastIndexOf('.') + 1).toLowerCase() : "";
        if ("html".equals(ext)) ct = "text/html; charset=utf-8"; else if ("css".equals(ext)) ct = "text/css; charset=utf-8"; else if ("js".equals(ext)) ct = "application/javascript; charset=utf-8"; else if ("json".equals(ext)) ct = "application/json; charset=utf-8"; else if ("png".equals(ext)) ct = "image/png"; else if ("jpg".equals(ext) || "jpeg".equals(ext)) ct = "image/jpeg"; else if ("svg".equals(ext)) ct = "image/svg+xml"; else if ("ico".equals(ext)) ct = "image/x-icon"; else if ("woff".equals(ext)) ct = "font/woff"; else if ("woff2".equals(ext)) ct = "font/woff2";
        byte[] data = readAll(f); out.write(("HTTP/1.1 200 OK\r\n").getBytes()); out.write(("Content-Type: " + ct + "\r\n").getBytes()); out.write(("Content-Length: " + data.length + "\r\n").getBytes()); out.write("X-Content-Type-Options: nosniff\r\n".getBytes()); out.write("\r\n".getBytes()); out.write(data); out.flush();
    }

    private byte[] readAll(File f) throws IOException { try (FileInputStream fis = new FileInputStream(f)) { byte[] buf = new byte[(int) f.length()]; int n = 0, r; while ((r = fis.read(buf, n, buf.length - n)) > 0) n += r; byte[] d = new byte[n]; System.arraycopy(buf, 0, d, 0, n); return d; } }
    private String readLine(BufferedInputStream in) throws IOException { StringBuilder sb = new StringBuilder(); int c; while ((c = in.read()) != -1) { if (c == '\r') continue; if (c == '\n') break; sb.append((char) c); if (sb.length() > 8192) break; } return sb.toString(); }
}
