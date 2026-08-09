/**
 * TechHub Pro v4.0 — CourseService
 * 课程业务逻辑：种子数据 / CRUD / 搜索 / 统计
 */
import java.util.*;
import java.sql.*;

public class CourseService {

    // ========== 从数据库查询 ==========
    public static List<Course> getAllCourses() {
        List<Course> list = new ArrayList<>();
        List<Map<String, Object>> rows = DatabaseUtil.query(
            "SELECT * FROM courses ORDER BY featured DESC, rating DESC, price ASC"
        );
        for (Map<String, Object> r : rows) list.add(fromRow(r));
        if (list.isEmpty()) {
            // DB 为空时回退到内置种子
            list = buildSeedCourses();
        }
        return list;
    }

    public static Course getById(String id) {
        List<Map<String, Object>> rows = DatabaseUtil.query("SELECT * FROM courses WHERE id=?", id);
        return rows.isEmpty() ? null : fromRow(rows.get(0));
    }

    public static List<Course> getByCategory(String cat) {
        List<Course> list = new ArrayList<>();
        List<Map<String, Object>> rows = DatabaseUtil.query(
            "SELECT * FROM courses WHERE category=? ORDER BY rating DESC", cat
        );
        for (Map<String, Object> r : rows) list.add(fromRow(r));
        return list;
    }

    public static List<Course> search(String q) {
        List<Course> list = new ArrayList<>();
        String like = "%" + q.toLowerCase() + "%";
        List<Map<String, Object>> rows = DatabaseUtil.query(
            "SELECT * FROM courses WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? " +
            "OR LOWER(instructor) LIKE ? OR LOWER(category) LIKE ? " +
            "ORDER BY rating DESC", like, like, like, like
        );
        for (Map<String, Object> r : rows) list.add(fromRow(r));
        return list;
    }

    public static Map<String, Object> getStats() {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("total", DatabaseUtil.query("SELECT COUNT(*) c FROM courses").get(0).get("c"));
        s.put("free", DatabaseUtil.query("SELECT COUNT(*) c FROM courses WHERE is_free=1").get(0).get("c"));
        s.put("paid", DatabaseUtil.query("SELECT COUNT(*) c FROM courses WHERE is_free=0").get(0).get("c"));

        List<Map<String, Object>> pd = DatabaseUtil.query(
            "SELECT price, COUNT(*) c FROM courses GROUP BY price ORDER BY price"
        );
        Map<Integer, Integer> priceDist = new LinkedHashMap<>();
        for (Map<String, Object> r : pd) {
            priceDist.put((Integer) r.get("price"), ((Number) r.get("c")).intValue());
        }
        s.put("priceDistribution", priceDist);

        List<Map<String, Object>> cd = DatabaseUtil.query(
            "SELECT category, COUNT(*) c FROM courses GROUP BY category ORDER BY c DESC"
        );
        Map<String, Integer> catDist = new LinkedHashMap<>();
        for (Map<String, Object> r : cd) {
            catDist.put((String) r.get("category"), ((Number) r.get("c")).intValue());
        }
        s.put("categories", catDist);

        double avg = 0;
        List<Map<String, Object>> a = DatabaseUtil.query("SELECT AVG(rating) a FROM courses");
        if (!a.isEmpty() && a.get(0).get("a") != null) avg = ((Number) a.get(0).get("a")).doubleValue();
        s.put("avgRating", Math.round(avg * 10) / 10.0);

        return s;
    }

    public static void saveCourse(Course c) {
        DatabaseUtil.update(
            "INSERT OR REPLACE INTO courses(id,title,category,category_label,description," +
            "long_description,instructor,platform,level,price,is_free,rating,students," +
            "duration,lessons,tags,cover,redirect_url,bilibili_url,github_url," +
            "resource_url,updated_at,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            c.id, c.title, c.category, c.categoryLabel, c.description,
            c.longDescription, c.instructor, c.platform, c.level, c.price,
            c.isFree ? 1 : 0, c.rating, c.students, c.duration,
            c.lessons, join(c.tags, ","), c.cover, c.redirectUrl,
            c.bilibiliUrl, c.githubUrl, c.resourceUrl, c.updatedAt, c.featured ? 1 : 0
        );
    }

    public static void deleteCourse(String id) {
        DatabaseUtil.update("DELETE FROM courses WHERE id=?", id);
    }

    // ========== 内置种子（120门，DB 为空时使用） ==========
    public static List<Course> buildSeedCourses() {
        List<Course> list = new ArrayList<>();
        // 模板：(分类, 标签, 副标题)
        Object[][] tpl = {
            // 网络安全
            {"web-security", "Web安全", "Web应用安全：OWASP Top 10 实战"},
            {"web-security", "Web安全", "Burp Suite 从入门到精通"},
            {"web-security", "Web安全", "PortSwigger Web Security Academy 通关"},
            {"web-security", "Web安全", "API安全测试与 GraphQL 漏洞挖掘"},
            {"web-security", "Web安全", "Java代码审计：Spring/ThinkPHP白盒测试"},
            {"web-security", "Web安全", "PHP代码审计与CMS漏洞挖掘"},
            {"web-security", "Web安全", "Node.js应用安全与Express漏洞防御"},
            {"web-security", "Web安全", "现代前端安全：CSP/SRI/Trusted Types"},
            {"penetration", "渗透测试", "Kali Linux 从零到实战"},
            {"penetration", "渗透测试", "Metasploit Framework 深度利用"},
            {"penetration", "渗透测试", "Nmap 高级扫描与 NSE 脚本编写"},
            {"penetration", "渗透测试", "SQLMap 自动化注入与绕过WAF"},
            {"penetration", "渗透测试", "内网渗透：域环境横向移动与黄金票据"},
            {"penetration", "渗透测试", "社会工程学实战：钓鱼邮件与SET"},
            {"penetration", "渗透测试", "无线网络渗透：WPA2/WPA3 破解"},
            {"penetration", "渗透测试", "云环境渗透测试：AWS/Azure/GCP"},
            {"penetration", "渗透测试", "Active Directory 攻防：从域用户到域管"},
            {"penetration", "渗透测试", "红队全链路：C2框架实战"},
            {"ctf", "CTF竞赛", "CTF入门：Web/Pwn/Reverse/Crypto全题型"},
            {"ctf", "CTF竞赛", "PWN入门：栈溢出/ROP/堆利用"},
            {"ctf", "CTF竞赛", "Reverse：IDA Pro/Ghidra 逆向分析"},
            {"ctf", "CTF竞赛", "Crypto：RSA/AES/ECC 数学原理"},
            {"ctf", "CTF竞赛", "Misc：隐写术/取证/流量分析"},
            {"ctf", "CTF竞赛", "Web CTF：SSTI/反序列化漏洞"},
            {"ctf", "CTF竞赛", "高级堆利用：House of XXX 技术"},
            {"reverse", "逆向工程", "Windows逆向：PE结构/脱壳/反调试"},
            {"reverse", "逆向工程", "Android逆向：APK脱壳/SMALI/Frida"},
            {"reverse", "逆向工程", "恶意代码分析：静态+动态分析"},
            {"reverse", "逆向工程", "固件逆向：IoT设备固件提取"},
            {"reverse", "逆向工程", "LLVM混淆还原与符号恢复"},
            {"crypto", "密码学", "密码学基础：对称/非对称/哈希/签名"},
            {"crypto", "密码学", "TLS/SSL 协议深度解析与中间人攻击"},
            {"crypto", "密码学", "区块链安全：智能合约审计与重入攻击"},
            {"redblue", "红蓝对抗", "蓝队防守：SIEM/Splunk/ELK 日志分析"},
            {"redblue", "红蓝对抗", "威胁狩猎：ATT&CK框架与TTP识别"},
            {"redblue", "红蓝对抗", "应急响应：入侵排查/勒索病毒处置"},
            {"redblue", "红蓝对抗", "EDR绕过与防御规避技术"},
            {"redblue", "红蓝对抗", "蜜罐部署与攻击者欺骗防御"},
            {"malware", "恶意代码", "恶意软件分析：Cuckoo自动化分析"},
            {"malware", "恶意代码", "Rootkit技术：内核级隐藏与检测"},
            {"malware", "恶意代码", "勒索软件逆向与解密密钥恢复"},
            {"compliance", "合规治理", "等保2.0三级系统建设实战"},
            {"compliance", "合规治理", "GDPR/个人信息保护法合规落地"},
            {"compliance", "合规治理", "ISO 27001 信息安全管理体系"},
            {"compliance", "合规治理", "安全开发生命周期SDLC与DevSecOps"},
            {"forensics", "数字取证", "计算机取证：内存/磁盘/流量"},
            {"forensics", "数字取证", "移动端取证：iOS/Android数据提取"},
            // 编程/AI/系统
            {"python", "Python", "Python从入门到精通：语法/数据结构/OOP"},
            {"python", "Python", "Python数据分析：Pandas/NumPy实战"},
            {"python", "Python", "Python自动化办公：Excel/Word/PDF"},
            {"python", "Python", "Python网络爬虫：Scrapy/Selenium"},
            {"python", "Python", "Python Web开发：Django/Flask/FastAPI"},
            {"python", "Python", "Python安全脚本：端口扫描/爆破/漏洞检测"},
            {"python", "Python", "Python机器学习：Scikit-learn入门"},
            {"javascript", "JavaScript", "JavaScript核心：闭包/原型链/异步"},
            {"javascript", "JavaScript", "TypeScript从入门到项目实战"},
            {"javascript", "JavaScript", "Node.js后端开发：Express/Koa"},
            {"javascript", "JavaScript", "前端工程化：Webpack/Vite/Rollup"},
            {"frontend", "前端开发", "React 18全家桶：Hooks/Redux/Next.js"},
            {"frontend", "前端开发", "Vue 3 + Pinia + Vite 企业级开发"},
            {"frontend", "前端开发", "CSS3高级：Grid/Flex/动画/响应式"},
            {"frontend", "前端开发", "前端性能优化：Core Web Vitals"},
            {"frontend", "前端开发", "Web Components 与微前端架构"},
            {"backend", "后端开发", "Java Spring Boot 3 企业级开发"},
            {"backend", "后端开发", "Java架构师：高并发/分布式/微服务"},
            {"backend", "后端开发", "Go语言实战：Gin/Echo/微服务"},
            {"backend", "后端开发", "Rust系统编程：从零到生产级应用"},
            {"backend", "后端开发", "C++高性能编程：内存/多线程/网络"},
            {"database", "数据库", "MySQL高级：索引优化/慢SQL/分库分表"},
            {"database", "数据库", "Redis深度：数据结构/集群/缓存穿透"},
            {"database", "数据库", "MongoDB与NoSQL设计模式"},
            {"database", "数据库", "PostgreSQL高级特性与性能调优"},
            {"database", "数据库", "数据库安全：注入防御/权限/审计"},
            {"devops", "DevOps", "Docker容器化：从入门到K8s编排"},
            {"devops", "DevOps", "Kubernetes生产级集群部署与运维"},
            {"devops", "DevOps", "CI/CD流水线：GitHub Actions/Jenkins"},
            {"devops", "DevOps", "Terraform基础设施即代码实战"},
            {"devops", "DevOps", "Prometheus + Grafana 监控告警"},
            {"devops", "DevOps", "AWS云架构：EC2/S3/Lambda/RDS"},
            {"devops", "DevOps", "Linux系统管理：从用户到内核调优"},
            {"ai", "AI/大模型", "Python AI入门：从线性回归到大模型原理"},
            {"ai", "AI/大模型", "LangChain + RAG 构建企业知识库"},
            {"ai", "AI/大模型", "LLM微调：LoRA/QLoRA/全参数微调"},
            {"ai", "AI/大模型", "AI Agent开发：AutoGPT/CrewAI/LangGraph"},
            {"ai", "AI/大模型", "多模态大模型：视觉/语音/跨模态应用"},
            {"ai", "AI/大模型", "AI安全：提示注入/越狱/模型窃取防御"},
            {"system-design", "系统设计", "系统设计面试：从URL到架构推演"},
            {"system-design", "系统设计", "分布式系统：CAP/BASE/Paxos/Raft"},
            {"system-design", "系统设计", "高并发秒杀系统设计与实现"},
            {"network", "网络基础", "TCP/IP详解：三次握手/拥塞控制/QUIC"},
            {"network", "网络基础", "Wireshark抓包分析实战"},
            {"network", "网络基础", "HTTP/2与HTTP/3深度解析"},
            {"os", "操作系统", "Linux内核原理：进程/内存/文件系统"},
            {"os", "操作系统", "Windows系统管理：AD/组策略/PowerShell"},
            {"git", "工具链", "Git高级：rebase/cherry-pick/bisect"},
            {"git", "工具链", "Vim/Neovim 高效编辑器配置"},
            {"git", "工具链", "正则表达式精通：从入门到引擎原理"},
            {"career", "求职面试", "算法面试：LeetCode高频题分类精讲"},
            {"career", "求职面试", "简历优化与面试话术：技术岗通关指南"},
            {"career", "求职面试", "网络安全求职：面试真题与红队案例"},
        };

        String[] instructors = {
            "svcliny", "小迪安全", "暗月MOON", "合天网安", "湖科大教书匠",
            "千锋网络安全", "凌曦安全", "MS08067实验室", "老杨聊渗透", "泷羽Sec",
            "Nathan House", "Mike Meyers", "Jason Dion", "Martin Voelk",
            "Zaid Sabih", "阮一峰", "尤雨溪", "廖雪峰", "吴恩达", "李沐"
        };
        String[] platforms = {"B站", "Coursera", "Udemy", "edX", "TryHackMe",
            "PortSwigger", "MIT OCW", "学堂在线", "极客时间", "慕课网", "FreeCodeCamp"};
        String[] levels = {"入门", "初级", "中级", "中高级", "高级", "专家级"};

        int total = 120;
        // 价格池：60免费 + 60付费
        int[] paidPrices = {5,5,5,5,5,5,5,5,5,5,5,5, 15,15,15,15,15,15,15,15,15,15,
            25,25,25,25,25,25,25,25,25,25, 35,35,35,35,35,35,35,35,
            45,45,45,45,45,45,45,45, 55,55,55,55,55, 65,65,65,65,65,
            75,75,75, 90,90};
        boolean[] isFree = new boolean[total];
        for (int i = 0; i < 60; i++) isFree[i] = true;
        for (int i = 60; i < total; i++) isFree[i] = false;
        shuffleBool(isFree);

        for (int i = 0; i < total && i < tpl.length; i++) {
            Object[] t = tpl[i];
            String cat = (String) t[0];
            String tag = (String) t[1];
            String sub = (String) t[2];

            Course c = new Course();
            c.id = "TH-" + (1000 + i);
            c.category = cat;
            c.categoryLabel = tag;
            c.title = tag + "实战精讲：" + sub;
            c.description = "系统讲解" + tag + "领域的" + sub + "，由资深讲师主讲，覆盖理论到实战完整链路。";
            c.longDescription = "本课程由资深讲师精心打造，系统讲解" + tag + "方向的核心知识。\n\n【你将学到】\n• " + sub + " 的核心原理\n• 真实环境下的攻防/开发实战\n• 行业最佳实践与避坑指南\n• 面试高频题与解题思路";
            c.instructor = instructors[i % instructors.length];
            c.platform = platforms[i % platforms.length];
            c.level = levels[i % levels.length];
            c.isFree = isFree[i];
            c.price = isFree[i] ? 0 : paidPrices[i - 60];
            c.rating = Math.round((isFree[i] ? 4.2 + Math.random() * 0.7 : 4.4 + Math.random() * 0.6) * 10) / 10.0;
            c.students = 500 + (int) (Math.random() * 50000);
            c.duration = (3 + (int) (Math.random() * 50)) + "-" + (8 + (int) (Math.random() * 60)) + " 小时";
            c.lessons = 6 + (int) (Math.random() * 30);
            c.tags = Arrays.asList(tag, c.level, isFree[i] ? "免费" : "付费", cat);
            c.cover = "";
            c.redirectUrl = isFree[i]
                ? "https://www.bilibili.com/video/BV1xx411x7mD"
                : "https://techhub-svcliny.pages.dev/courses/" + c.id;
            c.bilibiliUrl = "https://www.bilibili.com/video/BV1xx411x7mD";
            c.githubUrl = "https://github.com/search?q=" + cat;
            c.resourceUrl = "https://portswigger.net/web-security";
            c.updatedAt = "2026-08-" + String.format("%02d", 1 + (int) (Math.random() * 28));
            c.featured = i < 12;
            list.add(c);
        }
        return list;
    }

    // ========== 工具 ==========
    private static Course fromRow(Map<String, Object> r) {
        Course c = new Course();
        c.id = (String) r.get("id");
        c.title = (String) r.get("title");
        c.category = (String) r.get("category");
        c.categoryLabel = (String) r.get("category_label");
        c.description = (String) r.get("description");
        c.longDescription = (String) r.get("long_description");
        c.instructor = (String) r.get("instructor");
        c.platform = (String) r.get("platform");
        c.level = (String) r.get("level");
        c.price = r.get("price") != null ? ((Number) r.get("price")).intValue() : 0;
        c.isFree = r.get("is_free") != null && ((Number) r.get("is_free")).intValue() == 1;
        c.rating = r.get("rating") != null ? ((Number) r.get("rating")).doubleValue() : 0;
        c.students = r.get("students") != null ? ((Number) r.get("students")).intValue() : 0;
        c.duration = (String) r.get("duration");
        c.lessons = r.get("lessons") != null ? ((Number) r.get("lessons")).intValue() : 0;
        String tags = (String) r.get("tags");
        c.tags = tags != null && !tags.isEmpty() ? Arrays.asList(tags.split(",")) : new ArrayList<>();
        c.cover = (String) r.get("cover");
        c.redirectUrl = (String) r.get("redirect_url");
        c.bilibiliUrl = (String) r.get("bilibili_url");
        c.githubUrl = (String) r.get("github_url");
        c.resourceUrl = (String) r.get("resource_url");
        c.updatedAt = (String) r.get("updated_at");
        c.featured = r.get("featured") != null && ((Number) r.get("featured")).intValue() == 1;
        return c;
    }

    private static void shuffleBool(boolean[] a) {
        Random r = new Random(42);
        for (int i = a.length - 1; i > 0; i--) {
            int j = r.nextInt(i + 1);
            boolean t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }

    private static String join(List<String> list, String sep) {
        if (list == null || list.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(sep);
            sb.append(list.get(i));
        }
        return sb.toString();
    }
}
