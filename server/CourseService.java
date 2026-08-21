import java.sql.*;
import java.util.*;
import java.util.logging.*;

/**
 * TechHub Pro v6.0 — 课程服务层
 * 课程CRUD / 搜索 / 统计 / 分类查询
 */
public class CourseService {
    private static final Logger logger = Logger.getLogger("CourseService");

    // ========== 课程数据结构 ==========
    public static class Course {
        public int id;
        public String title, category, description, url;
        public double price;
        public double rating;
        public int students;
        public String tags;
        public boolean hot;
    }

    // ========== 查询全部 ==========
    public static List<Course> getAllCourses() {
        List<Course> list = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection()) {
            Statement s = conn.createStatement();
            ResultSet rs = s.executeQuery("SELECT * FROM courses ORDER BY id");
            while (rs.next()) {
                Course c = new Course();
                c.id = rs.getInt("id");
                c.title = rs.getString("title");
                c.category = rs.getString("category");
                c.price = rs.getDouble("price");
                c.rating = rs.getDouble("rating");
                c.students = rs.getInt("students");
                c.description = rs.getString("description");
                c.tags = rs.getString("tags");
                c.url = rs.getString("url");
                c.hot = rs.getInt("hot") == 1;
                list.add(c);
            }
            DatabaseUtil.releaseConnection(conn);
        } catch (Exception e) { logger.warning("getAllCourses: " + e.getMessage()); }
        return list;
    }

    // ========== 按分类查询 ==========
    public static List<Course> getByCategory(String cat) {
        List<Course> list = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM courses WHERE category=? ORDER BY rating DESC");
            ps.setString(1, cat);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Course c = new Course();
                c.id = rs.getInt("id");
                c.title = rs.getString("title");
                c.category = rs.getString("category");
                c.price = rs.getDouble("price");
                c.rating = rs.getDouble("rating");
                c.students = rs.getInt("students");
                c.description = rs.getString("description");
                c.tags = rs.getString("tags");
                c.url = rs.getString("url");
                c.hot = rs.getInt("hot") == 1;
                list.add(c);
            }
            DatabaseUtil.releaseConnection(conn);
        } catch (Exception e) { logger.warning("getByCategory: " + e.getMessage()); }
        return list;
    }

    // ========== 搜索 ==========
    public static List<Course> search(String query) {
        List<Course> list = new ArrayList<>();
        if (query == null || query.isEmpty()) return list;
        String q = "%" + query.toLowerCase() + "%";
        try (Connection conn = DatabaseUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "SELECT * FROM courses WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? ORDER BY rating DESC");
            ps.setString(1, q);
            ps.setString(2, q);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Course c = new Course();
                c.id = rs.getInt("id");
                c.title = rs.getString("title");
                c.category = rs.getString("category");
                c.price = rs.getDouble("price");
                c.rating = rs.getDouble("rating");
                c.students = rs.getInt("students");
                c.description = rs.getString("description");
                c.tags = rs.getString("tags");
                c.url = rs.getString("url");
                c.hot = rs.getInt("hot") == 1;
                list.add(c);
            }
            DatabaseUtil.releaseConnection(conn);
        } catch (Exception e) { logger.warning("search: " + e.getMessage()); }
        return list;
    }

    // ========== 统计 ==========
    public static Map<String, Object> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        try (Connection conn = DatabaseUtil.getConnection()) {
            Statement s = conn.createStatement();
            ResultSet rs1 = s.executeQuery("SELECT COUNT(*) FROM courses");
            stats.put("totalCourses", rs1.next() ? rs1.getInt(1) : 0);

            ResultSet rs2 = s.executeQuery("SELECT AVG(rating) FROM courses");
            stats.put("avgRating", rs2.next() ? Math.round(rs2.getDouble(1) * 10) / 10.0 : 0);

            ResultSet rs3 = s.executeQuery("SELECT SUM(students) FROM courses");
            stats.put("totalStudents", rs3.next() ? rs3.getLong(1) : 0);

            ResultSet rs4 = s.executeQuery("SELECT COUNT(DISTINCT category) FROM courses");
            stats.put("categories", rs4.next() ? rs4.getInt(1) : 0);

            DatabaseUtil.releaseConnection(conn);
        } catch (Exception e) { logger.warning("getStats: " + e.getMessage()); }
        return stats;
    }

    // ========== 热门课程 ==========
    public static List<Course> getHotCourses(int limit) {
        List<Course> list = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM courses WHERE hot=1 ORDER BY students DESC LIMIT ?");
            ps.setInt(1, limit);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Course c = new Course();
                c.id = rs.getInt("id");
                c.title = rs.getString("title");
                c.category = rs.getString("category");
                c.price = rs.getDouble("price");
                c.rating = rs.getDouble("rating");
                c.students = rs.getInt("students");
                c.description = rs.getString("description");
                c.tags = rs.getString("tags");
                c.url = rs.getString("url");
                c.hot = true;
                list.add(c);
            }
            DatabaseUtil.releaseConnection(conn);
        } catch (Exception e) { logger.warning("getHotCourses: " + e.getMessage()); }
        return list;
    }

    // ========== 种子数据 ==========
    public static void seedCoursesIfEmpty() {
        try (Connection conn = DatabaseUtil.getConnection()) {
            Statement s = conn.createStatement();
            ResultSet rs = s.executeQuery("SELECT COUNT(*) FROM courses");
            if (rs.next() && rs.getInt(1) > 0) { DatabaseUtil.releaseConnection(conn); return; }

            // 插入200门课程种子数据（简化版，实际由前端data.js驱动）
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO courses(id,title,category,price,rating,students,description,tags,url,hot) VALUES(?,?,?,?,?,?,?,?,?,?)");

            String[][] seed = {
                {"1","HTML5+CSS3 现代布局实战","web","9.9","4.7","28000","Flex/Grid/Subgrid实战","入门/必学","https://developer.mozilla.org","0"},
                {"19","Python零基础到全栈工程师","python","19.9","4.9","35000","从print到Django全栈","入门/全栈/爆款","https://docs.python.org","1"},
                {"91","AI大模型应用开发实战","ai","19.9","4.95","18000","GPT/Claude/国产大模型API","大模型/爆款","https://platform.openai.com","1"},
                {"35","Java零基础到高级开发","java","18.9","4.8","28000","从JDK安装到Java21新特性","入门/进阶","https://docs.oracle.com","1"},
                {"49","JavaScript核心原理深度解析","javascript","15.9","4.8","18000","闭包/原型链/事件循环/V8","JS/原理","https://developer.mozilla.org","1"},
                {"63","React 19 深度解析","frontend","16.9","4.75","11000","Server Components/Suspense","React/新特性","https://react.dev/","0"},
                {"77","Go语言高并发实战","backend","16.9","4.75","9200","Goroutine/Channel/微服务","Go/并发","https://go.dev/doc/","0"},
                {"129","Web安全攻防实战入门","security","15.9","4.7","6200","OWASP Top 10/SQL注入/XSS","安全/入门","https://owasp.org","0"},
                {"143","LeetCode 300题精讲","algorithm","14.9","4.8","22000","分类刷题/动态规划/回溯","LeetCode/面试","https://leetcode.cn/","1"},
                {"153","Android开发从零到一","mobile","14.9","4.5","5200","Kotlin/Compose/ViewModel","Android/Kotlin","https://developer.android.com/","0"},
            };

            for (String[] c : seed) {
                ps.setInt(1, Integer.parseInt(c[0]));
                ps.setString(2, c[1]);
                ps.setString(3, c[2]);
                ps.setDouble(4, Double.parseDouble(c[3]));
                ps.setDouble(5, Double.parseDouble(c[4]));
                ps.setInt(6, Integer.parseInt(c[5]));
                ps.setString(7, c[6]);
                ps.setString(8, c[7]);
                ps.setString(9, c[8]);
                ps.setInt(10, Integer.parseInt(c[9]));
                ps.addBatch();
            }
            ps.executeBatch();
            DatabaseUtil.releaseConnection(conn);
            logger.info("Seeded " + seed.length + " courses");
        } catch (Exception e) { logger.warning("seedCourses: " + e.getMessage()); }
    }
}
