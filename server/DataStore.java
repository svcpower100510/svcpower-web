/**
 * TechHub Pro v4.0 — DataStore
 * 静态数据访问层（资源/排行/GitHub/B站/路线）
 */
import java.util.*;

public class DataStore {

    // ========== 资源 ==========
    public static List<Resource> getResources() {
        List<Resource> list = new ArrayList<>();
        add(list, "PortSwigger Web Security Academy", "免费Web安全互动实验室", "https://portswigger.net/web-security", "必看");
        add(list, "MDN Web Docs", "前端开发权威文档", "https://developer.mozilla.org/zh-CN/", "免费");
        add(list, "roadmap.sh", "开发者学习路线图", "https://roadmap.sh", "必看");
        add(list, "OWASP Top 10", "Web应用十大安全风险", "https://owasp.org/www-project-top-ten/", "必看");
        add(list, "MITRE ATT&CK", "攻击战术与技术知识库", "https://attack.mitre.org/", "必看");
        add(list, "TryHackMe", "游戏化网络安全学习平台", "https://tryhackme.com/", "免费");
        add(list, "OverTheWire Wargames", "命令行安全挑战", "https://overthewire.org/wargames/", "免费");
        add(list, "阮一峰的网络日志", "前端/JS/ECMAScript 深度解读", "https://www.ruanyifeng.com/blog/", "免费");
        add(list, "菜鸟教程", "中文编程入门一站式", "https://www.runoob.com/", "免费");
        add(list, "CryptoPals", "密码学编程挑战", "https://cryptopals.com/", "进阶");
        add(list, "Stack Overflow", "编程问答社区", "https://stackoverflow.com/", "免费");
        add(list, "HackTheBox Academy", "高级渗透测试训练", "https://academy.hackthebox.com/", "进阶");
        return list;
    }

    // ========== 排行 ==========
    public static List<Ranking> getRankings() {
        List<Ranking> list = new ArrayList<>();
        addR(list, 1, "Python", 98, "AI/安全双赛道通吃，自动化脚本首选", "https://www.python.org/doc/");
        addR(list, 2, "JavaScript/TypeScript", 96, "Web全栈不可替代，Node生态爆发", "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript");
        addR(list, 3, "AI/大模型开发", 95, "2026最热方向，提示工程+Agent", "https://platform.openai.com/docs");
        addR(list, 4, "Web安全/渗透测试", 94, "网安人才缺口70万，薪资走高", "https://portswigger.net/web-security");
        addR(list, 5, "Java/Spring", 92, "企业级开发霸主", "https://spring.io/projects/spring-boot");
        addR(list, 6, "DevOps/云原生", 90, "K8s+Docker+IaC", "https://kubernetes.io/docs/");
        addR(list, 7, "Go语言", 88, "云原生新星，高并发王者", "https://go.dev/doc/");
        addR(list, 8, "Rust", 86, "内存安全+零成本抽象", "https://www.rust-lang.org/learn");
        addR(list, 9, "SQL/数据分析", 84, "数据驱动时代基本功", "https://dev.mysql.com/doc/");
        addR(list, 10, "C/C++", 82, "底层/逆向/嵌入式不可替代", "https://en.cppreference.com/w/");
        return list;
    }

    // ========== GitHub ==========
    public static List<GithubRepo> getGithub() {
        List<GithubRepo> list = new ArrayList<>();
        addG(list, "PortSwigger/web-security-academy", "PortSwigger官方Web安全实验室", "4.2k", "780", "Python", "web-security");
        addG(list, "OWASP/CheatSheetSeries", "OWASP安全备忘单系列", "28.6k", "4.1k", "Markdown", "web-security");
        addG(list, "danielmiessler/SecLists", "安全测试单词表/字典大全", "57.3k", "26.8k", "PHP", "penetration");
        addG(list, "paragonie/awesome-appsec", "应用安全精选资源列表", "12.1k", "2.3k", "Markdown", "compliance");
        addG(list, "freeCodeCamp/freeCodeCamp", "免费编程学习平台", "412k", "39.8k", "JavaScript", "career");
        addG(list, "donnemartin/system-design-primer", "系统设计面试神书", "298k", "44.2k", "Python", "system-design");
        addG(list, "nvbn/thefuck", "命令行纠错工具", "89k", "3.7k", "Python", "git");
        addG(list, "rapid7/metasploit-framework", "Metasploit渗透测试框架", "34.2k", "13.9k", "Ruby", "penetration");
        addG(list, "sqlmapproject/sqlmap", "自动化SQL注入工具", "32.8k", "6.1k", "Python", "penetration");
        addG(list, "zaproxy/zaproxy", "OWASP ZAP Web应用扫描器", "13.5k", "2.4k", "Java", "web-security");
        addG(list, "wazuh/wazuh", "开源SIEM/EDR安全监控", "11.2k", "1.8k", "C++", "redblue");
        addG(list, "google/security-research", "Google安全研究团队漏洞报告", "4.8k", "620", "多种", "malware");
        return list;
    }

    // ========== B站 ==========
    public static List<BiliVideo> getBilibili() {
        List<BiliVideo> list = new ArrayList<>();
        addB(list, "BV1xx411x7mD", "小迪安全：Web渗透测试入门到精通", "小迪安全", "128万", "1.2万", "https://www.bilibili.com/video/BV1xx411x7mD", "web-security");
        addB(list, "BV1J4411W7s6", "暗月MOON：SQL注入绕过WAF实战", "暗月MOON", "86万", "8400", "https://www.bilibili.com/video/BV1J4411W7s6", "web-security");
        addB(list, "BV1Lx411S7QT", "合天网安：CTF入门到放弃", "合天网安实验室", "52万", "5600", "https://www.bilibili.com/video/BV1Lx411S7QT", "ctf");
        addB(list, "BV1at41167x7", "湖科大教书匠：TCP/IP协议动画详解", "湖科大教书匠", "210万", "2.1万", "https://www.bilibili.com/video/BV1at41167x7", "network");
        addB(list, "BV1iW411f7Z4", "千锋网络安全：Kali Linux入门", "千锋网络安全", "67万", "6200", "https://www.bilibili.com/video/BV1iW411f7Z4", "penetration");
        addB(list, "BV11wNvziEDL", "凌曦安全：红队攻防实战指南", "凌曦安全", "43万", "3800", "https://www.bilibili.com/video/BV11wNvziEDL", "redblue");
        addB(list, "BV1Sx411c7Cx", "MS08067：代码审计与漏洞分析", "MS08067实验室", "35万", "2900", "https://www.bilibili.com/video/BV1Sx411c7Cx", "reverse");
        addB(list, "BV1Qx411W7Jf", "老杨聊渗透：DVWA靶场实战", "渗透测试老杨", "78万", "7100", "https://www.bilibili.com/video/BV1Qx411W7Jf", "penetration");
        addB(list, "BV1Yx411M7V2", "泷羽Sec：内网渗透与域控攻防", "泷羽Sec", "29万", "2200", "https://www.bilibili.com/video/BV1Yx411M7V2", "penetration");
        addB(list, "BV1mx411P7Zk", "应急炮老秦：服务器入侵排查", "应急炮老秦", "19万", "1500", "https://www.bilibili.com/video/BV1mx411P7Zk", "redblue");
        addB(list, "BV1px411K7X9", "Python黑帽子：编写端口扫描器", "Python黑帽子", "41万", "3300", "https://www.bilibili.com/video/BV1px411K7X9", "python");
        addB(list, "BV1ox411L7Y1", "BurpSuite大师：Burp插件开发", "BurpSuite大师", "22万", "1800", "https://www.bilibili.com/video/BV1ox411L7Y1", "web-security");
        return list;
    }

    // ========== 路线 ==========
    public static List<LearningPath> getPaths() {
        List<LearningPath> list = new ArrayList<>();
        addP(list, "frontend", "前端工程师路线", "6-9个月",
            Arrays.asList("HTML/CSS/JS基础","TypeScript+ES6+","React/Vue框架","工程化+性能优化","实战项目+面试"),
            "https://roadmap.sh/frontend");
        addP(list, "backend", "后端架构师路线", "9-12个月",
            Arrays.asList("一门语言深入(Java/Go)","数据库+缓存+MQ","微服务+分布式","高并发+容灾","架构设计+带队"),
            "https://roadmap.sh/backend");
        addP(list, "fullstack", "全栈开发路线", "8-12个月",
            Arrays.asList("前端三件套","Node/Python后端","数据库设计","DevOps部署","全栈项目实战"),
            "https://roadmap.sh/full-stack");
        addP(list, "cybersec", "网络安全路线", "12-18个月",
            Arrays.asList("网络+Linux基础","Web安全+OWASP","渗透测试+工具链","红蓝对抗+应急响应","CTF+证书(OSCP/CISSP)"),
            "https://roadmap.sh/cyber-security");
        addP(list, "ai", "AI工程师路线", "9-15个月",
            Arrays.asList("Python+数学基础","ML/DL理论","PyTorch实战","大模型+LangChain","部署+Agent开发"),
            "https://roadmap.sh/ai-engineer");
        return list;
    }

    // ========== 辅助 ==========
    private static void add(List<Resource> l, String n, String d, String u, String t) {
        Resource r = new Resource(); r.name=n; r.description=d; r.url=u; r.tag=t; l.add(r);
    }
    private static void addR(List<Ranking> l, int r, String n, int s, String rs, String u) {
        Ranking x = new Ranking(); x.rank=r; x.name=n; x.score=s; x.reason=rs; x.url=u; l.add(x);
    }
    private static void addG(List<GithubRepo> l, String n, String d, String st, String fk, String lg, String c) {
        GithubRepo g = new GithubRepo(); g.name=n; g.desc=d; g.stars=st; g.forks=fk; g.lang=lg; g.cat=c; l.add(g);
    }
    private static void addB(List<BiliVideo> l, String id, String t, String up, String v, String d, String u, String c) {
        BiliVideo b = new BiliVideo(); b.bvid=id; b.title=t; b.up=up; b.views=v; b.danmaku=d; b.url=u; b.cat=c; l.add(b);
    }
    private static void addP(List<LearningPath> l, String id, String t, String d, List<String> s, String u) {
        LearningPath p = new LearningPath(); p.id=id; p.title=t; p.duration=d; p.steps=s; p.url=u; l.add(p);
    }
}
