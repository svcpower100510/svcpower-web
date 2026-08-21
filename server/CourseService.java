// CourseService.java - 课程业务逻辑（Java 11 兼容，无 org.json）
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CourseService {
    public static void seedIfEmpty() {
        try { ResultSet rs = DatabaseUtil.query("SELECT COUNT(*) c FROM courses"); if (rs.next() && rs.getInt("c") > 0) { rs.close(); return; } rs.close(); } catch (Exception e) { return; }
        // 从 DataStore 读取内嵌课程并写入数据库
        List<Object> list = DataStore.getCourses();
        String sql = "INSERT INTO courses(id,title,category,price,rating,students,teacher,platform,description,tags,redirect_url,bilibili_url,github_url,free) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        for (int i = 0; i < list.size(); i++) {
            Object o = list.get(i);
            if (!(o instanceof java.util.Map)) continue;
            java.util.Map m = (java.util.Map) o;
            try {
                PreparedStatement ps = DatabaseUtil.prepare(sql);
                ps.setInt(1, intVal(m.get("id")));
                ps.setString(2, strVal(m.get("title")));
                ps.setString(3, strVal(m.get("category")));
                ps.setDouble(4, dblVal(m.get("price")));
                ps.setDouble(5, dblVal(m.get("rating")));
                ps.setString(6, strVal(m.get("students")));
                ps.setString(7, strVal(m.get("teacher")));
                ps.setString(8, strVal(m.get("platform")));
                ps.setString(9, strVal(m.get("description")));
                ps.setString(10, strVal(m.get("tags")));
                ps.setString(11, strVal(m.get("redirectUrl")));
                ps.setString(12, strVal(m.get("bilibiliUrl")));
                ps.setString(13, strVal(m.get("githubUrl")));
                ps.setInt(14, boolVal(m.get("free")) ? 1 : 0);
                ps.executeUpdate(); ps.close();
            } catch (Exception ignored) {}
        }
        System.out.println("[CourseService] seeded " + list.size() + " courses");
    }

    public static String listAll() { return DataStore.coursesToJson(); }
    public static String search(String q) { return DataStore.searchCourses(q); }
    public static String stats() { return DataStore.statsJson(); }

    private static int intVal(Object v) { return v instanceof Number ? ((Number) v).intValue() : 0; }
    private static double dblVal(Object v) { return v instanceof Number ? ((Number) v).doubleValue() : 0; }
    private static String strVal(Object v) { return v == null ? "" : String.valueOf(v); }
    private static boolean boolVal(Object v) { return v instanceof Boolean && (Boolean) v; }
}
