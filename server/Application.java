/**
 * TechHub Pro v4.0 — Application 启动类
 * 启动 HTTP 服务器并优雅关闭
 */
public class Application {
    public static void main(String[] args) {
        int port = 8080;
        if (args.length > 0) {
            try { port = Integer.parseInt(args[0]); } catch (NumberFormatException ignored) {}
        }

        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║   TechHub Pro v4.0 — svcliny        ║");
        System.out.println("║   愿行无止之境 svcliny 科技区平台    ║");
        System.out.println("╚══════════════════════════════════════╝");
        System.out.println("[INFO] 正在启动服务器，端口: " + port);
        System.out.println("[INFO] 邮箱: vhkex@outlook.com");
        System.out.println("[INFO] GitHub: https://github.com/svcpower100510/svcpower-web");

        TechHubServer server = new TechHubServer(port);
        server.start();

        // 优雅关闭
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\n[INFO] 收到关闭信号，正在释放资源...");
            server.stop();
            DatabaseUtil.closeAll();
            System.out.println("[INFO] 已优雅关闭。感谢使用 TechHub Pro!");
        }, "shutdown-hook"));

        // 控制台命令
        java.util.Scanner sc = new java.util.Scanner(System.in);
        while (sc.hasNextLine()) {
            String cmd = sc.nextLine().trim().toLowerCase();
            switch (cmd) {
                case "stats": server.printStats(); break;
                case "courses": server.printCourses(); break;
                case "help":
                    System.out.println("可用命令: stats | courses | reload | quit");
                    break;
                case "reload":
                    System.out.println("[INFO] 重新加载数据...");
                    server.reloadData();
                    break;
                case "quit": case "exit":
                    System.out.println("[INFO] 正在关闭...");
                    server.stop();
                    DatabaseUtil.closeAll();
                    System.exit(0);
                    break;
                default:
                    if (!cmd.isEmpty()) System.out.println("[WARN] 未知命令: " + cmd + " (输入 help 查看帮助)");
            }
        }
    }
}
