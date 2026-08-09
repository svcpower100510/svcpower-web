/**
 * TechHub Pro v4.0 — Course 模型
 */
import java.util.*;

public class Course {
    String id, title, category, categoryLabel;
    String description, longDescription;
    String instructor, platform, level;
    int price;
    boolean isFree;
    double rating;
    int students, lessons;
    List<String> tags = new ArrayList<>();
    String cover, redirectUrl, bilibiliUrl, githubUrl, resourceUrl;
    String updatedAt;
    boolean featured;

    public String toJson() {
        StringBuilder sb = new StringBuilder("{");
        jp(sb, "id", id);
        jp(sb, "title", title);
        jp(sb, "category", category);
        jp(sb, "categoryLabel", categoryLabel);
        jp(sb, "description", description);
        jp(sb, "longDescription", longDescription);
        jp(sb, "instructor", instructor);
        jp(sb, "platform", platform);
        jp(sb, "level", level);
        sb.append("\"price\":").append(price).append(",");
        sb.append("\"isFree\":").append(isFree).append(",");
        sb.append("\"rating\":").append(rating).append(",");
        sb.append("\"students\":").append(students).append(",");
        jp(sb, "duration", "8-16 小时"); // placeholder
        sb.append("\"lessons\":").append(lessons).append(",");
        sb.append("\"tags\":[");
        for (int i = 0; i < tags.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("\"").append(esc(tags.get(i))).append("\"");
        }
        sb.append("],");
        jp(sb, "cover", cover);
        jp(sb, "redirectUrl", redirectUrl);
        jp(sb, "bilibiliUrl", bilibiliUrl);
        jp(sb, "githubUrl", githubUrl);
        jp(sb, "resourceUrl", resourceUrl);
        jp(sb, "updatedAt", updatedAt);
        sb.append("\"featured\":").append(featured);
        sb.append("}");
        return sb.toString();
    }

    public static String toJsonArray(List<Course> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(list.get(i).toJson());
        }
        sb.append("]");
        return sb.toString();
    }

    public static Course fromJson(String json) {
        // 复用 TechHubServer 的解析
        Map<String, Object> m = new TechHubServer.HttpRequest().parse(json); // not used this way
        // 简单实现
        Course c = new Course();
        // 使用 DatabaseUtil 风格的简易解析
        Map<String, Object> map = parseSimple(json);
        c.id = (String) map.get("id");
        c.title = (String) map.get("title");
        c.category = (String) map.get("category");
        c.categoryLabel = (String) map.get("categoryLabel");
        c.description = (String) map.get("description");
        c.instructor = (String) map.get("instructor");
        c.platform = (String) map.get("platform");
        c.level = (String) map.get("level");
        Object p = map.get("price"); if (p instanceof Number) c.price = ((Number) p).intValue();
        Object f = map.get("isFree"); if (f instanceof Boolean) c.isFree = (Boolean) f;
        Object rt = map.get("rating"); if (rt instanceof Number) c.rating = ((Number) rt).doubleValue();
        Object st = map.get("students"); if (st instanceof Number) c.students = ((Number) st).intValue();
        Object ls = map.get("lessons"); if (ls instanceof Number) c.lessons = ((Number) ls).intValue();
        c.redirectUrl = (String) map.get("redirectUrl");
        c.bilibiliUrl = (String) map.get("bilibiliUrl");
        c.githubUrl = (String) map.get("githubUrl");
        c.resourceUrl = (String) map.get("resourceUrl");
        c.updatedAt = (String) map.get("updatedAt");
        Object ft = map.get("featured"); if (ft instanceof Boolean) c.featured = (Boolean) ft;
        return c;
    }

    private static Map<String, Object> parseSimple(String json) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (json == null || json.trim().isEmpty()) return map;
        json = json.trim();
        if (!json.startsWith("{") || !json.endsWith("}")) return map;
        // 移除花括号，按逗号分割（简单版，不处理嵌套）
        String body = json.substring(1, json.length() - 1).trim();
        // 用栈处理嵌套
        List<String> parts = splitTopLevel(body);
        for (String kv : parts) {
            int colon = findColon(kv);
            if (colon < 0) continue;
            String k = unquote(kv.substring(0, colon).trim());
            String v = kv.substring(colon + 1).trim();
            if (v.startsWith("\"") && v.endsWith("\"")) map.put(k, unquote(v));
            else if (v.equals("true")) map.put(k, Boolean.TRUE);
            else if (v.equals("false")) map.put(k, Boolean.FALSE);
            else { try { map.put(k, Double.parseDouble(v)); } catch (Exception e) { map.put(k, v); } }
        }
        return map;
    }

    private static List<String> splitTopLevel(String s) {
        List<String> parts = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        int depth = 0; boolean inStr = false; char quote = '"';
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (inStr) {
                cur.append(c);
                if (c == '\\' && i + 1 < s.length()) { cur.append(s.charAt(++i)); continue; }
                if (c == quote) inStr = false;
                continue;
            }
            if (c == '"' || c == '\'') { inStr = true; quote = c; cur.append(c); continue; }
            if (c == '{' || c == '[') depth++;
            else if (c == '}' || c == ']') depth--;
            else if (c == ',' && depth == 0) { parts.add(cur.toString()); cur.setLength(0); continue; }
            cur.append(c);
        }
        if (cur.length() > 0) parts.add(cur.toString());
        return parts;
    }

    private static int findColon(String s) {
        int depth = 0; boolean inStr = false; char quote = '"';
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (inStr) {
                if (c == '\\' && i + 1 < s.length()) { i++; continue; }
                if (c == quote) inStr = false;
                continue;
            }
            if (c == '"' || c == '\'') { inStr = true; quote = c; continue; }
            if (c == '{' || c == '[') depth++;
            else if (c == '}' || c == ']') depth--;
            else if (c == ':' && depth == 0) return i;
        }
        return -1;
    }

    private static void jp(StringBuilder sb, String k, String v) {
        sb.append("\"").append(k).append("\":");
        if (v == null) sb.append("null"); else sb.append("\"").append(esc(v)).append("\"");
        sb.append(",");
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }

    private static String unquote(String s) {
        s = s.trim();
        if ((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'")))
            return s.substring(1, s.length() - 1);
        return s;
    }
}
