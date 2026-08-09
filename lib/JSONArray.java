import java.util.ArrayList;
import java.util.List;

public class JSONArray {
    private List<Object> list = new ArrayList<>();
    
    public void put(Object o) { list.add(o); }
    public int length() { return list.size(); }
    public Object get(int i) { return list.get(i); }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            Object o = list.get(i);
            if (o instanceof String) sb.append("\"").append(((String)o).replace("\"","\\\"")).append("\"");
            else sb.append(o);
        }
        sb.append("]");
        return sb.toString();
    }
}
