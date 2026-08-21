import java.util.*;
import java.util.logging.*;

/**
 * TechHub Pro v6.0 — 静态数据访问层
 * 提供资源/排行/新闻/GitHub/B站/路线数据
 */
public class DataStore {
    private static final Logger logger = Logger.getLogger("DataStore");

    // ========== 干货资源 ==========
    public static List<Map<String,String>> getResources() {
        List<Map<String,String>> list = new ArrayList<>();
        add(list, "1", "MDN Web Docs", "Mozilla官方Web技术文档", "https://developer.mozilla.org/zh-CN/", "📘", "必看", "true");
        add(list, "2", "roadmap.sh", "开发者学习路线图", "https://roadmap.sh/", "🗺️", "必看", "true");
        add(list, "3", "阮一峰博客", "国内最优质技术博客", "https://www.ruanyifeng.com/blog/", "✍️", "必看", "true");
        add(list, "4", "菜鸟教程", "中文编程入门首选", "https://www.runoob.com/", "🐦", "入门", "true");
        add(list, "5", "freeCodeCamp", "免费编程学习平台", "https://www.freecodecamp.org/", "⚡", "免费认证", "true");
        add(list, "6", "Stack Overflow", "全球最大编程问答社区", "https://stackoverflow.com/", "💬", "必看", "true");
        add(list, "7", "GitHub Docs", "GitHub官方文档", "https://docs.github.com/", "🐙", "免费", "true");
        add(list, "8", "Python官方文档", "Python标准库全覆盖", "https://docs.python.org/zh-cn/3/", "🐍", "免费", "true");
        add(list, "9", "Docker官方文档", "容器化技术指南", "https://docs.docker.com/", "🐳", "免费", "true");
        add(list, "10", "Kubernetes官方文档", "K8s云原生必读", "https://kubernetes.io/zh-cn/docs/", "☸️", "免费", "true");
        add(list, "11", "LeetCode", "算法刷题平台", "https://leetcode.cn/", "🧩", "面试", "true");
        add(list, "12", "DevDocs", "聚合100+技术文档", "https://devdocs.io/", "📚", "工具", "true");
        return list;
    }

    // ========== 技术排行 ==========
    public static List<Map<String,Object>> getRankings() {
        List<Map<String,Object>> list = new ArrayList<>();
        addRank(list, 1, "Python", 98, "AI/ML时代第一语言", "https://www.python.org/");
        addRank(list, 2, "AI/大模型开发", 97, "2026最热方向", "https://platform.openai.com/docs");
        addRank(list, 3, "JavaScript/TS", 95, "Web开发不可替代", "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript");
        addRank(list, 4, "Rust", 94, "内存安全+零成本抽象", "https://doc.rust-lang.org/book/");
        addRank(list, 5, "Go语言", 93, "云原生时代新星", "https://go.dev/");
        addRank(list, 6, "系统设计能力", 92, "从码农到架构师", "https://github.com/donnemartin/system-design-primer");
        addRank(list, 7, "Java/Spring", 91, "企业级开发霸主", "https://spring.io/");
        addRank(list, 8, "DevOps/云原生", 90, "Docker+K8s+AWS", "https://kubernetes.io/");
        addRank(list, 9, "网络安全", 89, "人才缺口百万级", "https://owasp.org/");
        addRank(list, 10, "SQL/数据分析", 87, "数据驱动决策基本功", "https://www.postgresql.org/docs/");
        return list;
    }

    // ========== GitHub精选 ==========
    public static List<Map<String,String>> getGithubRepos() {
        List<Map<String,String>> list = new ArrayList<>();
        add(list, "freeCodeCamp", "免费编程学习平台", "400k+", "TypeScript", "学习", "https://github.com/freeCodeCamp/freeCodeCamp");
        add(list, "system-design-primer", "系统设计学习指南", "280k+", "Java", "面试", "https://github.com/donnemartin/system-design-primer");
        add(list, "awesome", "精选资源列表合集", "310k+", "Various", "资源", "https://github.com/sindresorhus/awesome");
        add(list, "developer-roadmap", "开发者学习路线图", "290k+", "TypeScript", "学习", "https://github.com/kamranahmedse/developer-roadmap");
        add(list, "build-your-own-x", "从零构建技术系统", "290k+", "Various", "实践", "https://github.com/codecrafters-io/build-your-own-x");
        add(list, "public-apis", "免费公共API合集", "310k+", "Python", "资源", "https://github.com/public-apis/public-apis");
        add(list, "tech-interview-handbook", "技术面试手册", "115k+", "Various", "面试", "https://github.com/yangshun/tech-interview-handbook");
        add(list, "clean-code-javascript", "JS整洁代码指南", "90k+", "JavaScript", "规范", "https://github.com/ryanmcdermott/clean-code-javascript");
        add(list, "kubernetes", "容器编排王者", "109k+", "Go", "DevOps", "https://github.com/kubernetes/kubernetes");
        add(list, "tensorflow", "深度学习框架", "184k+", "C++", "AI", "https://github.com/tensorflow/tensorflow");
        add(list, "spring-boot", "Java企业级框架", "74k+", "Java", "后端", "https://github.com/spring-projects/spring-boot");
        add(list, "react", "前端UI框架", "226k+", "JavaScript", "前端", "https://github.com/facebook/react");
        return list;
    }

    // ========== B站视频 ==========
    public static List<Map<String,String>> getBilibiliVideos() {
        List<Map<String,String>> list = new ArrayList<>();
        addBili(list, "Python零基础入门到精通", "小甲鱼", "580万", "8.2万", "https://www.bilibili.com/video/BV1c4411e77d", "BV1c4411e77d");
        addBili(list, "C语言程序设计（翁恺）", "浙江大学", "420万", "5.6万", "https://www.bilibili.com/video/BV19x4117voW", "BV19x4117voW");
        addBili(list, "Java零基础教程（韩顺平）", "韩顺平", "890万", "12万", "https://www.bilibili.com/video/BV1fh411y7R8", "BV1fh411y7R8");
        addBili(list, "尚硅谷React全家桶教程", "尚硅谷", "320万", "4.8万", "https://www.bilibili.com/video/BV18b4y1y7xx", "BV18b4y1y7xx");
        addBili(list, "黑马程序员前端基础", "黑马程序员", "650万", "9.3万", "https://www.bilibili.com/video/BV1nW411L7Nf", "BV1nW411L7Nf");
        addBili(list, "数据结构与算法（王道）", "王道考研", "280万", "3.5万", "https://www.bilibili.com/video/BV1b7411N798", "BV1b7411N798");
        addBili(list, "Linux入门到精通", "狂神说Java", "190万", "2.8万", "https://www.bilibili.com/video/BV1WY411w7aS", "BV1WY411w7aS");
        addBili(list, "Docker+K8s容器化实战", "尚硅谷", "150万", "2.1万", "https://www.bilibili.com/video/BV1uK411n7kN", "BV1uK411n7kN");
        addBili(list, "Python爬虫实战", "崔庆才", "230万", "3.2万", "https://www.bilibili.com/video/BV1Yh411o7S5", "BV1Yh411o7S5");
        addBili(list, "Spring Boot 3实战教程", "雷丰阳", "310万", "4.5万", "https://www.bilibili.com/video/BV1Td4y1m7Ts", "BV1Td4y1m7Ts");
        addBili(list, "AI大模型应用开发", "李沐", "180万", "2.6万", "https://www.bilibili.com/video/BV1Ms411p7BM", "BV1Ms411p7BM");
        addBili(list, "Git与GitHub协作开发", "CodeSheep", "120万", "1.8万", "https://www.bilibili.com/video/BV1FE411P7B3", "BV1FE411P7B3");
        return list;
    }

    // ========== 学习路线 ==========
    public static List<Map<String,Object>> getRoadmaps() {
        List<Map<String,Object>> list = new ArrayList<>();
        Map<String,Object> m1 = new LinkedHashMap<>();
        m1.put("id", 1); m1.put("title", "前端工程师路线"); m1.put("icon", "🎨");
        m1.put("months", "6-9个月");
        List<Map<String,String>> s1 = new ArrayList<>();
        addStep(s1, "基础阶段", "HTML/CSS/JS基础、ES6+、Git");
        addStep(s1, "框架阶段", "React/Vue、TypeScript、状态管理");
        addStep(s1, "工程化阶段", "Webpack/Vite、CI/CD、测试");
        addStep(s1, "架构阶段", "微前端、性能优化、SSR/SSG");
        m1.put("steps", s1); m1.put("url", "https://roadmap.sh/frontend");
        list.add(m1);

        Map<String,Object> m2 = new LinkedHashMap<>();
        m2.put("id", 2); m2.put("title", "后端工程师路线"); m2.put("icon", "⚙️");
        m2.put("months", "8-12个月");
        List<Map<String,String>> s2 = new ArrayList<>();
        addStep(s2, "编程语言", "Java/Python/Go 选一门深入");
        addStep(s2, "数据库与缓存", "MySQL/Redis/MongoDB");
        addStep(s2, "微服务架构", "Spring Cloud/gRPC/K8s");
        addStep(s2, "高并发与分布式", "消息队列/限流熔断/分库分表");
        m2.put("steps", s2); m2.put("url", "https://roadmap.sh/backend");
        list.add(m2);

        Map<String,Object> m3 = new LinkedHashMap<>();
        m3.put("id", 3); m3.put("title", "AI工程师路线"); m3.put("icon", "🤖");
        m3.put("months", "9-12个月");
        List<Map<String,String>> s3 = new ArrayList<>();
        addStep(s3, "数学基础", "线性代数/概率论/微积分");
        addStep(s3, "机器学习", "Scikit-learn/经典算法/特征工程");
        addStep(s3, "深度学习", "PyTorch/TensorFlow/CNN/RNN");
        addStep(s3, "大模型应用", "LLM API/RAG/Agent/微调");
        m3.put("steps", s3); m3.put("url", "https://roadmap.sh/ai-data-scientist");
        list.add(m3);

        Map<String,Object> m4 = new LinkedHashMap<>();
        m4.put("id", 4); m4.put("title", "全栈工程师路线"); m4.put("icon", "🛡️");
        m4.put("months", "10-14个月");
        List<Map<String,String>> s4 = new ArrayList<>();
        addStep(s4, "前端基础", "HTML/CSS/JS/React或Vue");
        addStep(s4, "后端开发", "Node.js/Python/Java + 数据库");
        addStep(s4, "DevOps", "Docker/K8s/CI-CD/云服务器");
        addStep(s4, "项目实战", "全栈项目部署/性能优化/安全");
        m4.put("steps", s4); m4.put("url", "https://roadmap.sh/full-stack");
        list.add(m4);

        Map<String,Object> m5 = new LinkedHashMap<>();
        m5.put("id", 5); m5.put("title", "云原生架构师路线"); m5.put("icon", "☁️");
        m5.put("months", "12-18个月");
        List<Map<String,String>> s5 = new ArrayList<>();
        addStep(s5, "容器化基础", "Docker/Kubernetes核心概念");
        addStep(s5, "微服务治理", "服务网格/Istio/API网关");
        addStep(s5, "可观测性", "Prometheus/Grafana/ELK");
        addStep(s5, "架构设计", "高可用/容灾/混沌工程");
        m5.put("steps", s5); m5.put("url", "https://roadmap.sh/devops");
        list.add(m5);

        return list;
    }

    // ========== 科技新闻 ==========
    public static List<Map<String,String>> getTechNews() {
        List<Map<String,String>> list = new ArrayList<>();
        addNews(list, "1", "OpenAI发布GPT-5：推理能力再突破", "AI", "2026-08-18", "OpenAI正式发布GPT-5模型", "OpenAI官方", "https://openai.com/blog");
        addNews(list, "2", "Google DeepMind AlphaFold 3开源", "AI", "2026-08-15", "AlphaFold 3完整代码开源", "Nature", "https://deepmind.google/discover/blog/");
        addNews(list, "3", "Cloudflare Workers AI 支持本地模型部署", "云原生", "2026-08-14", "Workers AI Local延迟降低80%", "Cloudflare Blog", "https://blog.cloudflare.com/");
        addNews(list, "4", "Rust 1.80 稳定版发布", "编程语言", "2026-08-12", "异步Trait正式落地", "Rust Blog", "https://blog.rust-lang.org/");
        addNews(list, "5", "Vue 3.5 发布：性能提升40%", "前端", "2026-08-10", "Vue 3.5新响应式系统", "Vue.js官方", "https://vuejs.org/blog/");
        addNews(list, "6", "Linux 6.10 内核发布", "操作系统", "2026-08-08", "EEVDF调度器默认启用", "Linus Torvalds", "https://kernelnewbies.org/Linux_6.10");
        addNews(list, "7", "英伟达发布B200 GPU", "硬件", "2026-08-05", "AI训练性能是H100的5倍", "NVIDIA", "https://nvidianews.nvidia.com/");
        addNews(list, "8", "苹果M4 Ultra芯片发布", "硬件", "2026-08-03", "40核CPU+80核GPU", "Apple", "https://www.apple.com/newsroom/");
        addNews(list, "9", "Kubernetes 1.31 发布", "云原生", "2026-08-01", "Sidecar正式GA", "Kubernetes Blog", "https://kubernetes.io/blog/");
        addNews(list, "10", "GitHub Copilot X 支持全仓库理解", "AI", "2026-07-30", "跨文件代码生成", "GitHub Blog", "https://github.blog/");
        return list;
    }

    // ========== Helper methods ==========
    private static void add(List<Map<String,String>> list, String id, String name, String desc, String stars, String lang, String tag, String url) {
        Map<String,String> m = new LinkedHashMap<>();
        m.put("id", id); m.put("name", name); m.put("desc", desc);
        m.put("stars", stars); m.put("lang", lang); m.put("tag", tag); m.put("url", url);
        list.add(m);
    }
    private static void addBili(List<Map<String,String>> list, String title, String author, String views, String danmaku, String url, String bvid) {
        Map<String,String> m = new LinkedHashMap<>();
        m.put("title", title); m.put("author", author); m.put("views", views);
        m.put("danmaku", danmaku); m.put("url", url); m.put("bvid", bvid);
        list.add(m);
    }
    private static void addRank(List<Map<String,Object>> list, int rank, String name, int score, String reason, String url) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("rank", rank); m.put("name", name); m.put("score", score);
        m.put("reason", reason); m.put("url", url);
        list.add(m);
    }
    private static void addStep(List<Map<String,String>> list, String phase, String desc) {
        Map<String,String> m = new LinkedHashMap<>();
        m.put("phase", phase); m.put("desc", desc);
        list.add(m);
    }
    private static void addNews(List<Map<String,String>> list, String id, String title, String cat, String date, String summary, String source, String url) {
        Map<String,String> m = new LinkedHashMap<>();
        m.put("id", id); m.put("title", title); m.put("cat", cat);
        m.put("date", date); m.put("summary", summary);
        m.put("source", source); m.put("url", url);
        list.add(m);
    }
}
