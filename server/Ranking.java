/** Ranking 模型 */
import java.util.*;
public class Ranking {
    int rank; String name; int score; String reason, url;
    public static String toJsonArray(List<Ranking> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < l.size(); i++) {
            if (i > 0) sb.append(",");
            Ranking r = l.get(i);
            sb.append("{\"rank\":").append(r.rank).append(",");
            sb.append("\"name\":\"").append(esc(r.name)).append("\",");
            sb.append("\"score\":").append(r.score).append(",");
            sb.append("\"reason\":\"").append(esc(r.reason)).append("\",");
            sb.append("\"url\":\"").append(esc(r.url)).append("\"}");
        }
        sb.append("]"); return sb.toString();
    }
    private static String esc(String s) { return s == null ? "" : s.replace("\\","\\\\").replace("\"","\\\""); }
}
