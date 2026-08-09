import java.util.LinkedHashMap;
import java.util.Map;

public class JSONObject {
    private Map<String, Object> map = new LinkedHashMap<>();
    
    public void put(String key, Object value) { map.put(key, value); }
    public Object get(String key) { return map.get(key); }
    public String optString(String key, String def) { 
        Object v = map.get(key); return v != null ? v.toString() : def; 
    }
    public String optString(String key) { return optString(key, ""); }
    public double optDouble(String key, double def) {
        Object v = map.get(key); 
        if (v instanceof Number) return ((Number)v).doubleValue();
        try { return Double.parseDouble(v.toString()); } catch(Exception e) { return def; }
    }
    public int optInt(String key, int def) {
        Object v = map.get(key);
        if (v instanceof Number) return ((Number)v).intValue();
        try { return Integer.parseInt(v.toString()); } catch(Exception e) { return def; }
    }
    public boolean optBoolean(String key, boolean def) {
        Object v = map.get(key);
        if (v instanceof Boolean) return (Boolean)v;
        return def;
    }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("{");
        int i = 0;
        for (Map.Entry<String,Object> e : map.entrySet()) {
            if (i++ > 0) sb.append(",");
            sb.append("\"").append(e.getKey()).append("\":");
            Object v = e.getValue();
            if (v instanceof String) sb.append("\"").append(((String)v).replace("\"","\\\"")).append("\"");
            else sb.append(v);
        }
        sb.append("}");
        return sb.toString();
    }
}
