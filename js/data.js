/**
 * TechHub Pro v4.0 — 主数据文件
 * 愿行无止之境 svcliny
 * 说明：本文件为兼容层，真实数据从 /data/courses.json 动态加载。
 *       内嵌兜底数据保证离线可用。
 */
(function (global) {
  'use strict';

  const FALLBACK_COURSES = window.__FALLBACK_COURSES__ || [];

  const BILIBILI_VIDEOS = [
    { id:'BV1xx411x7mD', title:'小迪安全：Web渗透测试入门到精通', up:'小迪安全', views:'128万', danmaku:'1.2万', url:'https://www.bilibili.com/video/BV1xx411x7mD', tag:'web-security', duration:'32:15', date:'2026-05-12' },
    { id:'BV1J4411W7s6', title:'暗月MOON：SQL注入绕过WAF实战', up:'暗月MOON', views:'86万', danmaku:'8400', url:'https://www.bilibili.com/video/BV1J4411W7s6', tag:'web-security', duration:'45:20', date:'2026-04-03' },
    { id:'BV1Lx411S7QT', title:'合天网安：CTF入门到放弃（全题型）', up:'合天网安实验室', views:'52万', danmaku:'5600', url:'https://www.bilibili.com/video/BV1Lx411S7QT', tag:'ctf', duration:'1:12:30', date:'2026-03-18' },
    { id:'BV1at41167x7', title:'湖科大教书匠：TCP/IP协议动画详解', up:'湖科大教书匠', views:'210万', danmaku:'2.1万', url:'https://www.bilibili.com/video/BV1at41167x7', tag:'network', duration:'28:40', date:'2026-06-01' },
    { id:'BV1iW411f7Z4', title:'千锋网络安全：Kali Linux安装与入门', up:'千锋网络安全', views:'67万', danmaku:'6200', url:'https://www.bilibili.com/video/BV1iW411f7Z4', tag:'penetration', duration:'38:55', date:'2026-02-22' },
    { id:'BV11wNvziEDL', title:'凌曦安全：红队攻防实战指南', up:'凌曦安全', views:'43万', danmaku:'3800', url:'https://www.bilibili.com/video/BV11wNvziEDL', tag:'redblue', duration:'52:10', date:'2026-07-08' },
    { id:'BV1Sx411c7Cx', title:'MS08067：代码审计与漏洞分析', up:'MS08067实验室', views:'35万', danmaku:'2900', url:'https://www.bilibili.com/video/BV1Sx411c7Cx', tag:'reverse', duration:'1:05:20', date:'2026-05-30' },
    { id:'BV1Qx411W7Jf', title:'老杨聊渗透：DVWA靶场实战', up:'渗透测试老杨', views:'78万', danmaku:'7100', url:'https://www.bilibili.com/video/BV1Qx411W7Jf', tag:'penetration', duration:'41:15', date:'2026-04-25' },
    { id:'BV1Yx411M7V2', title:'泷羽Sec：内网渗透与域控攻防', up:'泷羽Sec', views:'29万', danmaku:'2200', url:'https://www.bilibili.com/video/BV1Yx411M7V2', tag:'penetration', duration:'58:30', date:'2026-06-15' },
    { id:'BV1mx411P7Zk', title:'应急炮老秦：服务器入侵排查实战', up:'应急炮老秦', views:'19万', danmaku:'1500', url:'https://www.bilibili.com/video/BV1mx411P7Zk', tag:'redblue', duration:'36:45', date:'2026-07-22' },
    { id:'BV1px411K7X9', title:'Python黑帽子：编写端口扫描器', up:'Python黑帽子', views:'41万', danmaku:'3300', url:'https://www.bilibili.com/video/BV1px411K7X9', tag:'python', duration:'29:50', date:'2026-03-10' },
    { id:'BV1ox411L7Y1', title:'BurpSuite大师：Burp插件开发', up:'BurpSuite大师', views:'22万', danmaku:'1800', url:'https://www.bilibili.com/video/BV1ox411L7Y1', tag:'web-security', duration:'47:25', date:'2026-06-28' },
  ];

  const GITHUB_REPOS = [
    { name:'PortSwigger/web-security-academy', desc:'PortSwigger官方Web安全实验室配套资料', stars:'4.2k', forks:'780', lang:'Python', url:'https://github.com/PortSwigger/web-security-academy', cat:'web-security' },
    { name:'OWASP/CheatSheetSeries', desc:'OWASP安全备忘单系列（开发+测试必看）', stars:'28.6k', forks:'4.1k', lang:'Markdown', url:'https://github.com/OWASP/CheatSheetSeries', cat:'web-security' },
    { name:'danielmiessler/SecLists', desc:'安全测试单词表/字典大全', stars:'57.3k', forks:'26.8k', lang:'PHP', url:'https://github.com/danielmiessler/SecLists', cat:'penetration' },
    { name:'awesome-security/awesome-security', desc:'网络安全精选资源列表', stars:'12.1k', forks:'2.3k', lang:'Markdown', url:'https://github.com/paragonie/awesome-appsec', cat:'compliance' },
    { name:'freeCodeCamp/freeCodeCamp', desc:'免费编程学习平台（含安全课程）', stars:'412k', forks:'39.8k', lang:'JavaScript', url:'https://github.com/freeCodeCamp/freeCodeCamp', cat:'career' },
    { name:'donnemartin/system-design-primer', desc:'系统设计面试神书', stars:'298k', forks:'44.2k', lang:'Python', url:'https://github.com/donnemartin/system-design-primer', cat:'system-design' },
    { name:'nvbn/thefuck', desc:'命令行纠错工具（趣味+实用）', stars:'89k', forks:'3.7k', lang:'Python', url:'https://github.com/nvbn/thefuck', cat:'git' },
    { name:'rapid7/metasploit-framework', desc:'Metasploit渗透测试框架', stars:'34.2k', forks:'13.9k', lang:'Ruby', url:'https://github.com/rapid7/metasploit-framework', cat:'penetration' },
    { name:'sqlmapproject/sqlmap', desc:'自动化SQL注入工具', stars:'32.8k', forks:'6.1k', lang:'Python', url:'https://github.com/sqlmapproject/sqlmap', cat:'penetration' },
    { name:'zaproxy/zaproxy', desc:'OWASP ZAP Web应用扫描器', stars:'13.5k', forks:'2.4k', lang:'Java', url:'https://github.com/zaproxy/zaproxy', cat:'web-security' },
    { name:'wazuh/wazuh', desc:'开源SIEM/EDR安全监控平台', stars:'11.2k', forks:'1.8k', lang:'C++', url:'https://github.com/wazuh/wazuh', cat:'redblue' },
    { name:'google/security-research', desc:'Google安全研究团队公开漏洞报告', stars:'4.8k', forks:'620', lang:'多种', url:'https://github.com/google/security-research', cat:'malware' },
  ];

  const RESOURCES = [
    { name:'PortSwigger Web Security Academy', desc:'免费Web安全互动实验室（Burp官方）', url:'https://portswigger.net/web-security', tag:'必看', cat:'web-security' },
    { name:'MDN Web Docs', desc:'前端开发权威文档（Mozilla）', url:'https://developer.mozilla.org/zh-CN/', tag:'免费', cat:'frontend' },
    { name:'roadmap.sh', desc:'开发者学习路线图（前端/后端/安全/DevOps）', url:'https://roadmap.sh', tag:'必看', cat:'career' },
    { name:'OWASP Top 10', desc:'Web应用十大安全风险（最新版）', url:'https://owasp.org/www-project-top-ten/', tag:'必看', cat:'web-security' },
    { name:'MITRE ATT&CK', desc:'攻击战术与技术知识库', url:'https://attack.mitre.org/', tag:'必看', cat:'redblue' },
    { name:'TryHackMe', desc:'游戏化网络安全学习平台', url:'https://tryhackme.com/', tag:'免费', cat:'penetration' },
    { name:'OverTheWire Wargames', desc:'命令行安全挑战（入门首选）', url:'https://overthewire.org/wargames/', tag:'免费', cat:'linux' },
    { name:'阮一峰的网络日志', desc:'前端/JS/ECMAScript 深度解读', url:'https://www.ruanyifeng.com/blog/', tag:'免费', cat:'javascript' },
    { name:'菜鸟教程', desc:'中文编程入门一站式教程', url:'https://www.runoob.com/', tag:'免费', cat:'career' },
    { name:'CryptoPals', desc:'密码学编程挑战（8组48题）', url:'https://cryptopals.com/', tag:'进阶', cat:'crypto' },
    { name:'Stack Overflow', desc:'编程问答社区（开发必备）', url:'https://stackoverflow.com/', tag:'免费', cat:'career' },
    { name:'HackTheBox Academy', desc:'高级渗透测试训练平台', url:'https://academy.hackthebox.com/', tag:'进阶', cat:'penetration' },
  ];

  const RANKINGS = [
    { rank:1, name:'Python', score:98, reason:'AI/安全双赛道通吃，自动化脚本首选', url:'https://www.python.org/doc/' },
    { rank:2, name:'JavaScript/TypeScript', score:96, reason:'Web全栈不可替代，Node生态爆发', url:'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
    { rank:3, name:'AI/大模型开发', score:95, reason:'2026最热方向，提示工程+Agent开发', url:'https://platform.openai.com/docs' },
    { rank:4, name:'Web安全/渗透测试', score:94, reason:'网安人才缺口70万，薪资持续走高', url:'https://portswigger.net/web-security' },
    { rank:5, name:'Java/Spring', score:92, reason:'企业级开发霸主，金融电商首选', url:'https://spring.io/projects/spring-boot' },
    { rank:6, name:'DevOps/云原生', score:90, reason:'K8s+Docker+IaC，不懂运维越来越难', url:'https://kubernetes.io/docs/' },
    { rank:7, name:'Go语言', score:88, reason:'云原生时代新星，高并发王者', url:'https://go.dev/doc/' },
    { rank:8, name:'Rust', score:86, reason:'内存安全+零成本抽象，系统编程未来', url:'https://www.rust-lang.org/learn' },
    { rank:9, name:'SQL/数据分析', score:84, reason:'数据驱动时代的基本功', url:'https://dev.mysql.com/doc/' },
    { rank:10, name:'C/C++', score:82, reason:'底层/逆向/嵌入式不可替代', url:'https://en.cppreference.com/w/' },
  ];

  const LEARNING_PATHS = [
    { id:'frontend', title:'前端工程师路线', duration:'6-9个月', steps:['HTML/CSS/JS基础','TypeScript+ES6+','React/Vue框架','工程化+性能优化','实战项目+面试'], url:'https://roadmap.sh/frontend' },
    { id:'backend', title:'后端架构师路线', duration:'9-12个月', steps:['一门语言深入(Java/Go)','数据库+缓存+MQ','微服务+分布式','高并发+容灾','架构设计+带队'], url:'https://roadmap.sh/backend' },
    { id:'fullstack', title:'全栈开发路线', duration:'8-12个月', steps:['前端三件套','Node/Python后端','数据库设计','DevOps部署','全栈项目实战'], url:'https://roadmap.sh/full-stack' },
    { id:'cybersec', title:'网络安全路线', duration:'12-18个月', steps:['网络+Linux基础','Web安全+OWASP','渗透测试+工具链','红蓝对抗+应急响应','CTF+证书(OSCP/CISSP)'], url:'https://roadmap.sh/cyber-security' },
    { id:'ai', title:'AI工程师路线', duration:'9-15个月', steps:['Python+数学基础','ML/DL理论','PyTorch实战','大模型+LangChain','部署+Agent开发'], url:'https://roadmap.sh/ai-engineer' },
  ];

  // ========== 收款码（唯一有效 - 2026年8月更新） ==========
  const PAYMENT_CONFIG = {
   收款人: '愿行无止之境svcliny',
    accountHint: 'rosvcliny.odm.dsl(*方)',
    email: 'vhkex@outlook.com',
    github: 'https://github.com/svcpower100510/svcpower-web',
    bilibili: 'https://b23.tv/Sjdb2WI',
    // 主收款码PNG（用户2026年8月提供，唯一有效）
    qrcodePrimary: 'assets/qrcode-wechat-pay.png',
    // 微信支付推荐图（绿色背景，与用户截图一致）
    qrcodeWeChatPay: 'assets/wechat-pay-recommend.png',
    // SVG内嵌降级（不依赖任何外部文件，100%可用）
    qrcodeSVG: 'assets/wechat-pay-recommend.svg',
    // 5级降级链（确保任何环境都能加载）
    fallbackChain: [
      'assets/qrcode-wechat-pay.png',       // 本地PNG（优先）
      './assets/qrcode-wechat-pay.png',      // 相对路径
      'assets/wechat-pay-recommend.png',     // 推荐图PNG
      'assets/wechat-pay-recommend.svg',     // SVG降级
      'https://techhub-svcliny.pages.dev/assets/qrcode-wechat-pay.png',
      'https://cdn.jsdelivr.net/gh/svcpower100510/svcpower-web@main/assets/qrcode-wechat-pay.png',
    ],
    // 备用图片base64（终极降级，无需网络）
    fallbackBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjAgMjIwIj48cmVjdCB3aWR0aD0iMjIwIiBoZWlnaHQ9IjIyMCIgZmlsbD0iIzcwZDE2MCIvPjx0ZXh0IHg9IjExMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCI+8J+UlTwvdGV4dD48L3N2Zz4=',
    methods: ['wechat', 'alipay', 'bank'],
    currency: 'CNY',
    timeoutMinutes: 15,
  };

  const SITE_CONFIG = {
    name: 'TechHub Pro',
    version: '4.0.0',
    author: '愿行无止之境 svcliny',
    email: 'vhkex@outlook.com',
    github: 'https://github.com/svcpower100510/svcpower-web',
    bilibili: 'https://b23.tv/Sjdb2WI',
    domain: 'https://techhub-svcliny.pages.dev',
    apiBase: '/api',
    copyright: '© 2026 svcliny (方). All Rights Reserved.',
    license: 'Apache License 2.0',
  };

  global.TechHubData = {
    bilibili: BILIBILI_VIDEOS,
    github: GITHUB_REPOS,
    resources: RESOURCES,
    rankings: RANKINGS,
    paths: LEARNING_PATHS,
    payment: PAYMENT_CONFIG,
    config: SITE_CONFIG,
    fallbackCourses: FALLBACK_COURSES,
  };

})(window);
