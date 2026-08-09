/** Resource 模型 */
import java.util.*;
public class Resource {
    String name, description, url, tag;
    public static String toJsonArray(List<Resource> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < l.size(); i++) {
            if (i > 0) sb.append(",");
            Resource r = l.get(i);
            sb.append("{\"name\":\"").append(esc(r.name)).append("\",");
            sb.append("\"description\":\"").append(esc(r.description)).append("\",");
            sb.append("\"url\":\"").append(esc(r.url)).append("\",");
            sb.append("\"tag\":\"").append(esc(r.tag)).append("\"}");
        }
        sb.append("]"); return sb.toString();
    }
    private static String esc(String s) { return s == null ? "" : s.replace("\\","\\\\").replace("\"","\\\""); }
}
