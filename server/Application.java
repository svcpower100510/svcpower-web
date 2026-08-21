// Application.java - TechHub Pro v6.0 正式版 启动类
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Application {
    private static final String VERSION = "6.0.0";
    private static int port = 8080;
    private static String webRoot = ".";
    private static String dbPath = "techhub.db";

    public static void main(String[] args) throws IOException {
        for (int i = 0; i < args.length; i++) {
            if ("--port".equals(args[i]) && i + 1 < args.length) port = Integer.parseInt(args[++i]);
            else if ("--web".equals(args[i]) && i + 1 < args.length) webRoot = args[++i];
            else if ("--db".equals(args[i]) && i + 1 < args.length) dbPath = args[++i];
        }
        // 优先读取 techhub.properties
        File propFile = new File("techhub.properties");
        if (propFile.exists()) {
            Properties p = new Properties();
            try (InputStream in = new FileInputStream(propFile)) { p.load(in); }
            if (p.getProperty("port") != null) port = Integer.parseInt(p.getProperty("port"));
            if (p.getProperty("webroot") != null) webRoot = p.getProperty("webroot");
            if (p.getProperty("db") != null) dbPath = p.getProperty("db");
        }
        System.out.println("[TechHub Pro] v" + VERSION + " starting...");
        System.out.println("[TechHub Pro] port=" + port + " webroot=" + webRoot + " db=" + dbPath);
        DatabaseUtil.init(dbPath);
        CourseService.seedIfEmpty();
        TechHubServer server = new TechHubServer(port, webRoot);
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("[TechHub Pro] shutting down...");
            DatabaseUtil.close();
            server.stop();
        }));
        server.start();
    }
}
