import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.logging.*;

/**
 * TechHub Pro v6.0 — Java后端启动类
 * 功能：HTTP服务器 + REST API + 用户认证 + 支付核验
 */
public class Application {
    private static final Logger logger = Logger.getLogger("TechHubPro");
    private static final int PORT = 8080;
    private static TechHubServer server;

    public static void main(String[] args) {
        int port = PORT;
        if (args.length > 0) {
            try { port = Integer.parseInt(args[0]); } catch (Exception e) {}
        }

        logger.info("========================================");
        logger.info("  TechHub Pro v6.0 Beta");
        logger.info("  愿行无止之境 svcliny");
        logger.info("  端口: " + port);
        logger.info("========================================");

        server = new TechHubServer(port);
        server.start();

        // 优雅关闭
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("正在关闭服务器...");
            server.shutdown();
            DatabaseUtil.closeAll();
            logger.info("服务器已关闭");
        }, "shutdown-hook"));

        // 定时任务：清理过期会话/订单
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(() -> {
            server.cleanupExpiredSessions();
            server.cleanupExpiredOrders();
        }, 5, 5, TimeUnit.MINUTES);
    }

    public static TechHubServer getServer() { return server; }
}
