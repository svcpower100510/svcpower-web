/**
 * TechHub Pro v4.0 — 数据库工具
 * SQLite + 简单连接池 + 建表 + 种子数据
 * 兼容 Java 11
 */
import java.sql.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.logging.*;

public class DatabaseUtil {
    private static final Logger LOG = Logger.getLogger("TechHub.DB");
    private static final String DB_URL = "jdbc:sqlite:techhub.db";
    private static final int POOL_SIZE = 8;
    private static final BlockingQueue<Connection> pool = new LinkedBlockingQueue<>(POOL_SIZE);
    private static volatile boolean initialized = false;

    public static synchronized void init() {
        if (initialized) return;
        try {
            Class.forName("org.sqlite.JDBC");
            // 预填充池
            for (int i = 0; i < POOL_SIZE; i++) {
                Connection c = DriverManager.getConnection(DB_URL);
                c.setAutoCommit(true);
                pool.offer(c);
            }
            LOG.info("[DB] 连接池就绪 (size=" + POOL_SIZE + ")");
            createTables();
            seedIfEmpty();
            initialized = true;
        } catch (Exception e) {
            LOG.severe("[DB] 初始化失败: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public static Connection getConnection() throws SQLException {
        Connection c = pool.poll();
        if (c == null || c.isClosed()) {
            c = DriverManager.getConnection(DB_URL);
            c.setAutoCommit(true);
        }
        return c;
    }

    public static void release(Connection c) {
        if (c == null) return;
        try {
            if (!c.isClosed() && !pool.offer(c)) c.close();
        } catch (SQLException ignored) {}
    }

    public static void closeAll() {
        Connection c;
        while ((c = pool.poll()) != null) {
            try { c.close(); } catch (SQLException ignored) {}
        }
        LOG.info("[DB] 连接池已关闭");
    }

    // ========== 建表 ==========
    private static void createTables() {
        String[] ddl = {
            "CREATE TABLE IF NOT EXISTS courses (" +
                "id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT, category_label TEXT," +
                " description TEXT, long_description TEXT, instructor TEXT, platform TEXT," +
                " level TEXT, price INTEGER DEFAULT 0, is_free INTEGER DEFAULT 1," +
                " rating REAL DEFAULT 0, students INTEGER DEFAULT 0, duration TEXT," +
                " lessons INTEGER DEFAULT 0, tags TEXT, cover TEXT, redirect_url TEXT," +
                " bilibili_url TEXT, github_url TEXT, resource_url TEXT," +
                " updated_at TEXT, featured INTEGER DEFAULT 0)",
            "CREATE INDEX IF NOT EXISTS idx_courses_cat ON courses(category)",
            "CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price)",

            "CREATE TABLE IF NOT EXISTS orders (" +
                "order_id TEXT PRIMARY KEY, course_id TEXT, amount INTEGER," +
                " timestamp INTEGER, signature TEXT, status TEXT DEFAULT 'pending'," +
                " created_at TEXT DEFAULT (datetime('now')), confirmed_at TEXT)",

            "CREATE TABLE IF NOT EXISTS users (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE," +
                " display_name TEXT, created_at TEXT DEFAULT (datetime('now')))",

            "CREATE TABLE IF NOT EXISTS transactions (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT," +
                " type TEXT, amount INTEGER, status TEXT, created_at TEXT DEFAULT (datetime('now')))",

            "CREATE TABLE IF NOT EXISTS payment_config (" +
                "k TEXT PRIMARY KEY, v TEXT)",

            "CREATE TABLE IF NOT EXISTS course_views (" +
                "course_id TEXT, viewed_at TEXT DEFAULT (datetime('now')))"
        };
        Connection c = null;
        try {
            c = getConnection();
            Statement s = c.createStatement();
            for (String d : ddl) s.execute(d);
            s.close();
            LOG.info("[DB] 表结构就绪");
        } catch (SQLException e) {
            LOG.severe("[DB] 建表失败: " + e.getMessage());
        } finally {
            release(c);
        }
    }

    // ========== 种子数据 ==========
    private static void seedIfEmpty() {
        Connection c = null;
        try {
            c = getConnection();
            ResultSet rs = c.createStatement().executeQuery("SELECT COUNT(*) FROM courses");
            if (rs.next() && rs.getInt(1) > 0) { rs.close(); return; }
            rs.close();
            LOG.info("[DB] 正在写入种子数据...");

            // 从 JSON 数据文件批量插入
            List<Course> seed = CourseService.buildSeedCourses();
            PreparedStatement ps = c.prepareStatement(
                "INSERT INTO courses(id,title,category,category_label,description," +
                "long_description,instructor,platform,level,price,is_free,rating,students," +
                "duration,lessons,tags,cover,redirect_url,bilibili_url,github_url," +
                "resource_url,updated_at,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            );
            int n = 0;
            for (Course course : seed) {
                ps.setString(1, course.id);
                ps.setString(2, course.title);
                ps.setString(3, course.category);
                ps.setString(4, course.categoryLabel);
                ps.setString(5, course.description);
                ps.setString(6, course.longDescription);
                ps.setString(7, course.instructor);
                ps.setString(8, course.platform);
                ps.setString(9, course.level);
                ps.setInt(10, course.price);
                ps.setInt(11, course.isFree ? 1 : 0);
                ps.setDouble(12, course.rating);
                ps.setInt(13, course.students);
                ps.setString(14, course.duration);
                ps.setInt(15, course.lessons);
                ps.setString(16, join(course.tags, ","));
                ps.setString(17, course.cover);
                ps.setString(18, course.redirectUrl);
                ps.setString(19, course.bilibiliUrl);
                ps.setString(20, course.githubUrl);
                ps.setString(21, course.resourceUrl);
                ps.setString(22, course.updatedAt);
                ps.setInt(23, course.featured ? 1 : 0);
                ps.addBatch();
                n++;
            }
            ps.executeBatch();
            ps.close();
            LOG.info("[DB] 已写入 " + n + " 门课程");

            // 支付配置
            PreparedStatement pc = c.prepareStatement("INSERT OR REPLACE INTO payment_config(k,v) VALUES(?,?)");
            setConfig(pc, "merchant_name", "愿行无止之境svcliny");
            setConfig(pc, "merchant_hint", "rosvcliny.odm.dsl(*方)");
            setConfig(pc, "email", "vhkex@outlook.com");
            setConfig(pc, "github", "https://github.com/svcpower100510/svcpower-web");
            setConfig(pc, "bilibili", "https://b23.tv/Sjdb2WI");
            setConfig(pc, "currency", "CNY");
            setConfig(pc, "timeout_minutes", "15");
            setConfig(pc, "max_retry", "5");
            pc.close();
            LOG.info("[DB] 支付配置就绪");

        } catch (SQLException e) {
            LOG.severe("[DB] 种子失败: " + e.getMessage());
        } finally {
            release(c);
        }
    }

    private static void setConfig(PreparedStatement ps, String k, String v) throws SQLException {
        ps.setString(1, k); ps.setString(2, v); ps.execute();
    }

    // ========== 查询工具 ==========
    public static List<Map<String, Object>> query(String sql, Object... params) {
        List<Map<String, Object>> rows = new ArrayList<>();
        Connection c = null;
        try {
            c = getConnection();
            PreparedStatement ps = c.prepareStatement(sql);
            for (int i = 0; i < params.length; i++) ps.setObject(i + 1, params[i]);
            ResultSet rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            int cols = md.getColumnCount();
            while (rs.next()) {
                Map<String, Object> row = new LinkedHashMap<>();
                for (int i = 1; i <= cols; i++) row.put(md.getColumnName(i), rs.getObject(i));
                rows.add(row);
            }
            rs.close(); ps.close();
        } catch (SQLException e) {
            LOG.warning("[DB] 查询失败: " + e.getMessage());
        } finally {
            release(c);
        }
        return rows;
    }

    public static int update(String sql, Object... params) {
        Connection c = null;
        try {
            c = getConnection();
            PreparedStatement ps = c.prepareStatement(sql);
            for (int i = 0; i < params.length; i++) ps.setObject(i + 1, params[i]);
            int n = ps.executeUpdate();
            ps.close();
            return n;
        } catch (SQLException e) {
            LOG.warning("[DB] 更新失败: " + e.getMessage());
            return 0;
        } finally {
            release(c);
        }
    }

    public static String getConfig(String key) {
        List<Map<String, Object>> r = query("SELECT v FROM payment_config WHERE k=?", key);
        return r.isEmpty() ? null : String.valueOf(r.get(0).get("v"));
    }

    private static String join(List<String> list, String sep) {
        if (list == null || list.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(sep);
            sb.append(list.get(i));
        }
        return sb.toString();
    }
}
