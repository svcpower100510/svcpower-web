import java.sql.*;
import java.util.concurrent.*;
import java.util.logging.*;

/**
 * TechHub Pro v6.0 — SQLite数据库工具类
 * 连接池 + 初始化表结构 + 用户/订单/会话管理
 */
public class DatabaseUtil {
    private static final Logger logger = Logger.getLogger("DBUtil");
    private static final String DB_URL = "jdbc:sqlite:techhub_pro_v6.db";
    private static BlockingQueue<Connection> pool;
    private static final int POOL_SIZE = 10;

    static {
        try {
            Class.forName("org.sqlite.JDBC");
            pool = new LinkedBlockingQueue<>(POOL_SIZE);
            for (int i = 0; i < POOL_SIZE; i++) {
                Connection conn = DriverManager.getConnection(DB_URL);
                pool.offer(conn);
            }
            initTables();
            logger.info("Database initialized: " + DB_URL);
        } catch (Exception e) {
            logger.severe("DB init failed: " + e.getMessage());
        }
    }

    private static void initTables() throws SQLException {
        String[] sqls = {
            "CREATE TABLE IF NOT EXISTS users (" +
                "email TEXT PRIMARY KEY, username TEXT NOT NULL, " +
                "password_hash TEXT NOT NULL, is_vip INTEGER DEFAULT 0, " +
                "vip_expires_at INTEGER DEFAULT 0, created_at INTEGER NOT NULL, " +
                "last_login_at INTEGER DEFAULT 0, login_count INTEGER DEFAULT 0)",
            "CREATE TABLE IF NOT EXISTS courses (" +
                "id INTEGER PRIMARY KEY, title TEXT NOT NULL, category TEXT, " +
                "price REAL NOT NULL, rating REAL DEFAULT 0, students INTEGER DEFAULT 0, " +
                "description TEXT, tags TEXT, url TEXT, hot INTEGER DEFAULT 0)",
            "CREATE TABLE IF NOT EXISTS orders (" +
                "order_id TEXT PRIMARY KEY, email TEXT NOT NULL, course_id TEXT, " +
                "amount REAL NOT NULL, timestamp INTEGER NOT NULL, signature TEXT, " +
                "status TEXT DEFAULT 'pending', retry_count INTEGER DEFAULT 0, " +
                "is_vip_order INTEGER DEFAULT 0, created_at INTEGER NOT NULL)",
            "CREATE TABLE IF NOT EXISTS sessions (" +
                "token TEXT PRIMARY KEY, email TEXT NOT NULL, " +
                "expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)",
            "CREATE TABLE IF NOT EXISTS transactions (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL, " +
                "email TEXT NOT NULL, amount REAL NOT NULL, type TEXT, " +
                "status TEXT DEFAULT 'completed', created_at INTEGER NOT NULL)",
            "CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email)",
            "CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)",
        };
        try (Connection conn = getConnection()) {
            for (String sql : sqls) {
                try (Statement stmt = conn.createStatement()) { stmt.execute(sql); }
            }
        }
    }

    public static Connection getConnection() throws SQLException {
        try {
            Connection c = pool.poll(3, TimeUnit.SECONDS);
            if (c == null || c.isClosed()) {
                c = DriverManager.getConnection(DB_URL);
            }
            return c;
        } catch (InterruptedException e) { throw new SQLException("Pool interrupted", e); }
    }

    public static void releaseConnection(Connection conn) {
        if (conn == null) return;
        try {
            if (!conn.isClosed() && !pool.offer(conn, 1, TimeUnit.SECONDS)) {
                conn.close();
            }
        } catch (Exception e) { /* ignore */ }
    }

    public static void closeAll() {
        Connection c;
        while ((c = pool.poll()) != null) {
            try { c.close(); } catch (Exception ignored) {}
        }
        logger.info("All DB connections closed");
    }

    // ========== 用户操作 ==========
    public static boolean insertUser(String email, String username, String pwdHash) {
        try (Connection conn = getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO users(email,username,password_hash,created_at) VALUES(?,?,?,?)");
            ps.setString(1, email);
            ps.setString(2, username);
            ps.setString(3, pwdHash);
            ps.setLong(4, System.currentTimeMillis());
            int r = ps.executeUpdate();
            releaseConnection(conn);
            return r > 0;
        } catch (Exception e) { logger.warning("insertUser error: " + e.getMessage()); return false; }
    }

    public static String getUserPasswordHash(String email) {
        try (Connection conn = getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT password_hash FROM users WHERE email=?");
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            String hash = rs.next() ? rs.getString(1) : null;
            releaseConnection(conn);
            return hash;
        } catch (Exception e) { return null; }
    }

    public static boolean updateUserLogin(String email) {
        try (Connection conn = getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE users SET last_login_at=?, login_count=login_count+1 WHERE email=?");
            ps.setLong(1, System.currentTimeMillis());
            ps.setString(2, email);
            int r = ps.executeUpdate();
            releaseConnection(conn);
            return r > 0;
        } catch (Exception e) { return false; }
    }

    public static boolean setVIP(String email, long expiresAt) {
        try (Connection conn = getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE users SET is_vip=1, vip_expires_at=? WHERE email=?");
            ps.setLong(1, expiresAt);
            ps.setString(2, email);
            int r = ps.executeUpdate();
            releaseConnection(conn);
            return r > 0;
        } catch (Exception e) { return false; }
    }

    public static boolean addPurchasedCourse(String email, String courseId) {
        // 用JSON存到单独表或直接追加到用户记录
        try (Connection conn = getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "INSERT OR IGNORE INTO orders(order_id,email,course_id,amount,timestamp,status,created_at) " +
                "VALUES(?,?,?,0,?, 'purchased',?)");
            ps.setString(1, "PUR-" + System.currentTimeMillis());
            ps.setString(2, email);
            ps.setString(3, courseId);
            ps.setLong(4, System.currentTimeMillis());
            ps.setLong(5, System.currentTimeMillis());
            int r = ps.executeUpdate();
            releaseConnection(conn);
            return r > 0;
        } catch (Exception e) { return false; }
    }

    // ========== 订单操作 ==========
    public static boolean insertOrder(String orderId, String email, String courseId,
                                     double amount, String signature, boolean isVIP) {
        try (Connection conn = getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO orders(order_id,email,course_id,amount,timestamp,signature,status,is_vip_order,created_at) " +
                "VALUES(?,?,?,?,?,?, 'pending',?,?)");
            ps.setString(1, orderId);
            ps.setString(2, email);
            ps.setString(3, courseId);
            ps.setDouble(4, amount);
            ps.setLong(5, System.currentTimeMillis());
            ps.setString(6, signature);
            ps.setInt(7, isVIP ? 1 : 0);
            ps.setLong(8, System.currentTimeMillis());
            int r = ps.executeUpdate();
            releaseConnection(conn);
            return r > 0;
        } catch (Exception e) { return false; }
    }

    public static boolean updateOrderStatus(String orderId, String status) {
        try (Connection conn = getConnection()) {
            PreparedStatement ps = conn.prepareStatement("UPDATE orders SET status=? WHERE order_id=?");
            ps.setString(1, status);
            ps.setString(2, orderId);
            int r = ps.executeUpdate();
            releaseConnection(conn);
            return r > 0;
        } catch (Exception e) { return false; }
    }

    public static ResultSet getOrder(String orderId) throws SQLException {
        Connection conn = getConnection();
        PreparedStatement ps = conn.prepareStatement("SELECT * FROM orders WHERE order_id=?");
        ps.setString(1, orderId);
        return ps.executeQuery();
    }

    // ========== 统计 ==========
    public static int getUserCount() {
        try (Connection conn = getConnection()) {
            Statement s = conn.createStatement();
            ResultSet rs = s.executeQuery("SELECT COUNT(*) FROM users");
            int c = rs.next() ? rs.getInt(1) : 0;
            releaseConnection(conn);
            return c;
        } catch (Exception e) { return 0; }
    }

    public static int getCourseCount() {
        try (Connection conn = getConnection()) {
            Statement s = conn.createStatement();
            ResultSet rs = s.executeQuery("SELECT COUNT(*) FROM courses");
            int c = rs.next() ? rs.getInt(1) : 0;
            releaseConnection(conn);
            return c;
        } catch (Exception e) { return 0; }
    }
}
