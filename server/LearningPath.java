/** LearningPath 模型 */
import java.util.*;
public class LearningPath {
    String id, title, duration, url;
    List<String> steps = new ArrayList<>();
    public static String toJsonArray(List<LearningPath> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < l.size(); i++) {
            if (i > 0) sb.append(",");
            LearningPath p = l.get(i);
            sb.append("{\"id\":\"").append(p.id).append("\",");
            sb.append("\"title\":\"").append(esc(p.title)).append("\",");
            sb.append("\"duration\":\"").append(esc(p.duration)).append("\",");
            sb.append("\"steps\":[");
            for (int j = 0; j < p.steps.size(); j++) {
                if (j > 0) sb.append(",");
                sb.append("\"").append(esc(p.steps.get(j))).append("\"");
            }
            sb.append("],");
            sb.append("\"url\":\"").append(esc(p.url)).append("\"}");
        }
        sb.append("]"); return sb.toString();
    }
    private static String esc(String s) { return s == null ? "" : s.replace("\\","\\\\").replace("\"","\\\""); }
}
