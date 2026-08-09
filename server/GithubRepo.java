/** GithubRepo 模型 */
import java.util.*;
public class GithubRepo {
    String name, desc, stars, forks, lang, cat;
    public static String toJsonArray(List<GithubRepo> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < l.size(); i++) {
            if (i > 0) sb.append(",");
            GithubRepo g = l.get(i);
            sb.append("{\"name\":\"").append(esc(g.name)).append("\",");
            sb.append("\"desc\":\"").append(esc(g.desc)).append("\",");
            sb.append("\"stars\":\"").append(esc(g.stars)).append("\",");
            sb.append("\"forks\":\"").append(esc(g.forks)).append("\",");
            sb.append("\"lang\":\"").append(esc(g.lang)).append("\",");
            sb.append("\"cat\":\"").append(esc(g.cat)).append("\"}");
        }
        sb.append("]"); return sb.toString();
    }
    private static String esc(String s) { return s == null ? "" : s.replace("\\","\\\\").replace("\"","\\\""); }
}
