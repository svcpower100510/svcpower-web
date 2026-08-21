// DatabaseUtil.java - SQLite 数据库连接池（Java 11 兼容）
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayDeque;
import java.util.Deque;

public class DatabaseUtil {
    private static String url = "jdbc:sqlite:techhub.db";
    private static final Deque<Connection> pool = new ArrayDeque<>();
    private static final int MAX = 8;
    private static boolean driverLoaded = false;

    public static void init(String dbPath) {
        if (dbPath != null && !dbPath.isEmpty()) url = "jdbc:sqlite:" + dbPath;
        try { Class.forName("org.sqlite.JDBC"); driverLoaded = true; } catch (ClassNotFoundException e) { driverLoaded = false; }
        runUpdate("CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, title TEXT, category TEXT, price REAL, rating REAL, students TEXT, teacher TEXT, platform TEXT, description TEXT, tags TEXT, redirect_url TEXT, bilibili_url TEXT, github_url TEXT, free INTEGER DEFAULT 0)");
        runUpdate("CREATE TABLE IF NOT EXISTS orders (order_no TEXT PRIMARY KEY, user_id TEXT, course_id INTEGER, price REAL, status TEXT, created_at INTEGER, paid_at INTEGER)");
        runUpdate("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, username TEXT UNIQUE, password_hash TEXT, vip INTEGER DEFAULT 0, vip_until INTEGER, purchased TEXT, registered_at INTEGER)");
        runUpdate("CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, order_no TEXT, user_id TEXT, amount REAL, ts INTEGER)");
        runUpdate("CREATE TABLE IF NOT EXISTS payment_config (k TEXT PRIMARY KEY, v TEXT)");
    }

    public static Connection getConnection() throws Exception {
        if (!driverLoaded) Class.forName("org.sqlite.JDBC");
        synchronized (pool) { Connection c = pool.poll(); if (c != null && !c.isClosed()) return c; }
        return DriverManager.getConnection(url);
    }
    public static void release(Connection c) { if (c == null) return; synchronized (pool) { if (pool.size() < MAX) pool.offer(c); else try { c.close(); } catch (Exception ignored) {} } }
    public static void close() { synchronized (pool) { for (Connection c : pool) try { c.close(); } catch (Exception ignored) {} pool.clear(); } }

    public static int runUpdate(String sql) { Connection c = null; Statement s = null; try { c = getConnection(); s = c.createStatement(); return s.executeUpdate(sql); } catch (Exception e) { return 0; } finally { if (s != null) try { s.close(); } catch (Exception ignored) {} release(c); } }
    public static ResultSet query(String sql) throws Exception { Connection c = getConnection(); Statement s = c.createStatement(); return s.executeQuery(sql); }
    public static PreparedStatement prepare(String sql) throws Exception { return getConnection().prepareStatement(sql); }
    public static boolean tableExists(String name) { Connection c = null; ResultSet rs = null; try { c = getConnection(); rs = c.getMetaData().getTables(null, null, name, null); boolean e = rs.next(); return e; } catch (Exception e2) { return false; } finally { if (rs != null) try { rs.close(); } catch (Exception ignored) {} release(c); } }
}
