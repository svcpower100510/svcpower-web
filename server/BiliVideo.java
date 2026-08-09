/** BiliVideo 模型 */
import java.util.*;
public class BiliVideo {
    String bvid, title, up, views, danmaku, url, cat;
    public static String toJsonArray(List<BiliVideo> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < l.size(); i++) {
            if (i > 0) sb.append(",");
            BiliVideo b = l.get(i);
            sb.append("{\"bvid\":\"").append(esc(b.bvid)).append("\",");
            sb.append("\"title\":\"").append(esc(b.title)).append("\",");
            sb.append("\"up\":\"").append(esc(b.up)).append("\",");
            sb.append("\"views\":\"").append(esc(b.views)).append("\",");
            sb.append("\"danmaku\":\"").append(esc(b.danmaku)).append("\",");
            sb.append("\"url\":\"").append(esc(b.url)).append("\",");
            sb.append("\"cat\":\"").append(esc(b.cat)).append("\"}");
        }
        sb.append("]"); return sb.toString();
    }
    private static String esc(String s) { return s == null ? "" : s.replace("\\","\\\\").replace("\"","\\\""); }
}
