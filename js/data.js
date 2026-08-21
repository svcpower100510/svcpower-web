// ============================================================
//  TechHub Pro v6.0 Beta — 全站数据
//  200 courses | 50 tech news | 12 resources | 5 roadmaps
//  All prices ¥9.9 ~ ¥19.9 (unified paid model)
//  VIP: unlimited access | Normal: 100 free courses
// ============================================================

const TechHubData = {

  // ==================== 用户体系 ====================
  userSystem: {
    vipPrice: 99,          // VIP月费
    vipYearPrice: 499,     // VIP年费
    freeCoursesForNormal: 100, // 普通用户免费额度
    maxLoginAttempts: 5,   // 最大登录尝试
    lockoutMinutes: 30,    // 锁定时间
    minPasswordLength: 8,  // 密码最小长度
    requireSpecialChar: true,
    requireNumber: true,
    requireUppercase: true,
  },

  // ==================== 课程分类 ====================
  categories: [
    { id: 'web', name: 'Web开发', icon: '🌐', count: 18 },
    { id: 'python', name: 'Python', icon: '🐍', count: 16 },
    { id: 'java', name: 'Java', icon: '☕', count: 14 },
    { id: 'javascript', name: 'JavaScript/TS', icon: '📜', count: 14 },
    { id: 'frontend', name: '前端工程', icon: '🎨', count: 14 },
    { id: 'backend', name: '后端架构', icon: '⚙️', count: 14 },
    { id: 'ai', name: 'AI/大模型', icon: '🤖', count: 14 },
    { id: 'database', name: '数据库', icon: '🗄️', count: 12 },
    { id: 'devops', name: 'DevOps/云原生', icon: '☁️', count: 12 },
    { id: 'security', name: '网络安全', icon: '🛡️', count: 14 },
    { id: 'algorithm', name: '算法竞赛', icon: '🧩', count: 10 },
    { id: 'mobile', name: '移动开发', icon: '📱', count: 10 },
    { id: 'game', name: '游戏开发', icon: '🎮', count: 8 },
    { id: 'blockchain', name: '区块链', icon: '⛓️', count: 6 },
    { id: 'data', name: '数据分析', icon: '📊', count: 8 },
    { id: 'linux', name: 'Linux/运维', icon: '🐧', count: 8 },
    { id: 'rust', name: 'Rust', icon: '🦀', count: 4 },
    { id: 'go', name: 'Go语言', icon: '🚀', count: 6 },
    { id: 'career', name: '面试/职场', icon: '💼', count: 6 },
    { id: 'beginner', name: '零基础入门', icon: '🌱', count: 6 },
    { id: 'hardware', name: '硬件/嵌入式', icon: '🔧', count: 4 },
  ],

  // ==================== 200门课程 ====================
  courses: [
    // ===== Web开发 (18) =====
    { id: 1, title: 'HTML5+CSS3 现代布局实战', cat: 'web', price: 9.9, rating: 4.7, students: 28000, tags: ['入门','必学'], desc: 'Flex/Grid/Subgrid/Container Queries 一网打尽，做出专业级网页布局', hot: true, url: 'https://developer.mozilla.org/zh-CN/docs/Learn/HTML' },
    { id: 2, title: '现代CSS工程化：从BEM到Tailwind', cat: 'web', price: 12.9, rating: 4.6, students: 8500, tags: ['CSS','工程化'], desc: 'CSS架构设计、命名规范、Tailwind/Bootstrap实战对比', url: 'https://tailwindcss.com/docs' },
    { id: 3, title: 'Node.js 后端开发从零到部署', cat: 'web', price: 15.9, rating: 4.8, students: 12000, tags: ['后端','Node'], desc: 'Express/Fastify/Koa 三大框架对比，JWT鉴权、文件上传、邮件服务', hot: true, url: 'https://nodejs.org/docs' },
    { id: 4, title: 'RESTful API 设计规范与实战', cat: 'web', price: 11.9, rating: 4.7, students: 6800, tags: ['API','后端'], desc: 'OpenAPI规范、版本管理、错误处理、限流熔断最佳实践', url: 'https://restfulapi.net/' },
    { id: 5, title: 'GraphQL 从入门到生产', cat: 'web', price: 14.9, rating: 4.6, students: 4200, tags: ['API','GraphQL'], desc: 'Schema设计、Resolver优化、N+1问题解决、Apollo生态', url: 'https://graphql.org/learn/' },
    { id: 6, title: 'WebSocket 实时通信实战', cat: 'web', price: 12.9, rating: 4.5, students: 3500, tags: ['实时','Socket'], desc: '聊天室/在线协作/股票行情/游戏同步，Socket.IO+原生双方案', url: 'https://socket.io/docs/v4/' },
    { id: 7, title: 'SSR/SSG 服务端渲染全解析', cat: 'web', price: 16.9, rating: 4.7, students: 5200, tags: ['Next.js','Nuxt'], desc: 'Next.js/Nuxt.js 服务端渲染原理、SEO优化、性能调优', url: 'https://nextjs.org/docs' },
    { id: 8, title: 'PWA 渐进式Web应用开发', cat: 'web', price: 9.9, rating: 4.4, students: 2800, tags: ['PWA','移动'], desc: 'Service Worker/Manifest/离线缓存/推送通知，让网页媲美原生App', url: 'https://web.dev/progressive-web-apps/' },
    { id: 9, title: 'WebAssembly 入门到实战', cat: 'web', price: 17.9, rating: 4.5, students: 1900, tags: ['WASM','高性能'], desc: 'Rust+WASM在浏览器跑原生性能，图像处理/音视频/游戏场景', url: 'https://webassembly.org/docs/' },
    { id: 10, title: '微前端架构设计与落地', cat: 'web', price: 18.9, rating: 4.6, students: 3400, tags: ['架构','微前端'], desc: 'qiankun/Module Federation/Web Components三种方案深度对比', url: 'https://qiankun.umijs.org/' },
    { id: 11, title: 'Web Components 标准组件开发', cat: 'web', price: 10.9, rating: 4.3, students: 2100, tags: ['组件','标准'], desc: 'Custom Elements/Shadow DOM/HTML Templates原生组件方案', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components' },
    { id: 12, title: 'HTTP/3 + QUIC 协议深度解析', cat: 'web', price: 15.9, rating: 4.6, students: 1800, tags: ['网络','协议'], desc: '从HTTP/1.1到HTTP/3的演进，QUIC原理、0-RTT、拥塞控制', url: 'https://datatracker.ietf.org/doc/html/rfc9114' },
    { id: 13, title: 'CDN与边缘计算实战', cat: 'web', price: 13.9, rating: 4.5, students: 2200, tags: ['CDN','Cloudflare'], desc: 'Cloudflare Workers/Edge Functions/全球加速/缓存策略', url: 'https://workers.cloudflare.com/' },
    { id: 14, title: 'Web性能优化终极指南', cat: 'web', price: 14.9, rating: 4.8, students: 11000, tags: ['性能','Core Web Vitals'], desc: 'LCP/FID/CLS优化、代码分割、预加载、骨架屏、虚拟列表', hot: true, url: 'https://web.dev/vitals/' },
    { id: 15, title: '浏览器渲染原理深度剖析', cat: 'web', price: 12.9, rating: 4.7, students: 5600, tags: ['浏览器','原理'], desc: '从URL输入到页面渲染的完整链路，重排重绘/合成层/GPU加速', url: 'https://developer.chrome.com/blog/inside-browser/' },
    { id: 16, title: 'TypeScript 高级类型体操', cat: 'web', price: 13.9, rating: 4.7, students: 7800, tags: ['TS','类型'], desc: '条件类型/映射类型/模板字面量类型/类型推断黑魔法', url: 'https://www.typescriptlang.org/docs/' },
    { id: 17, title: 'Vite 插件开发从零到一', cat: 'web', price: 11.9, rating: 4.5, students: 1900, tags: ['Vite','工程化'], desc: 'Rollup插件机制、HMR原理、自定义插件实战', url: 'https://vitejs.dev/guide/api-plugin.html' },
    { id: 18, title: 'Monorepo 工程化实践', cat: 'web', price: 14.9, rating: 4.5, students: 2400, tags: ['Monorepo','pnpm'], desc: 'pnpm workspace/Turbo/Nx 三大工具对比，大型项目代码管理', url: 'https://turbo.build/repo/docs' },

    // ===== Python (16) =====
    { id: 19, title: 'Python零基础到全栈工程师', cat: 'python', price: 19.9, rating: 4.9, students: 35000, tags: ['入门','全栈','爆款'], desc: '从print("Hello World")到Django全栈项目，零基础首选', hot: true, url: 'https://docs.python.org/zh-cn/3/tutorial/' },
    { id: 20, title: 'Python数据分析三剑客', cat: 'python', price: 16.9, rating: 4.7, students: 14000, tags: ['数据','Pandas'], desc: 'NumPy/Pandas/Matplotlib 数据处理全流程，Kaggle入门必备', url: 'https://pandas.pydata.org/docs/' },
    { id: 21, title: 'Python爬虫工程师进阶', cat: 'python', price: 14.9, rating: 4.6, students: 9500, tags: ['爬虫','反爬'], desc: 'Requests/Scrapy/Playwright/Selenium，验证码破解/代理池/分布式', url: 'https://scrapy.org/doc/' },
    { id: 22, title: 'Python自动化办公实战', cat: 'python', price: 9.9, rating: 4.7, students: 22000, tags: ['办公','效率'], desc: 'Excel/Word/PDF/邮件/微信自动化，解放双手提升10倍效率', hot: true, url: 'https://docs.python.org/3/library/os.html' },
    { id: 23, title: 'Python异步编程深度解析', cat: 'python', price: 13.9, rating: 4.6, students: 4200, tags: ['异步','asyncio'], desc: 'async/await原理、协程调度、aiohttp/FastAPI异步性能调优', url: 'https://docs.python.org/3/library/asyncio.html' },
    { id: 24, title: 'Python设计模式精讲', cat: 'python', price: 11.9, rating: 4.5, students: 3800, tags: ['设计模式','进阶'], desc: '23种经典设计模式Python实现，写出优雅可维护的代码', url: 'https://refactoring.guru/design-patterns/python' },
    { id: 25, title: 'Python源码剖析：从字节码到虚拟机', cat: 'python', price: 17.9, rating: 4.6, students: 1600, tags: ['底层','CPython'], desc: 'CPython源码导读、GIL原理、垃圾回收、字节码逆向分析', url: 'https://github.com/python/cpython' },
    { id: 26, title: 'FastAPI 高性能后端开发', cat: 'python', price: 14.9, rating: 4.8, students: 8200, tags: ['API','FastAPI'], desc: '类型提示驱动开发、自动生成OpenAPI文档、异步依赖注入', url: 'https://fastapi.tiangolo.com/' },
    { id: 27, title: 'Django 4 企业级Web开发', cat: 'python', price: 15.9, rating: 4.6, students: 6800, tags: ['Django','全栈'], desc: 'ORM/Admin/Auth/DRF，从零搭建企业级后台管理系统', url: 'https://docs.djangoproject.com/' },
    { id: 28, title: 'Python量化交易入门', cat: 'python', price: 18.9, rating: 4.5, students: 5200, tags: ['金融','量化'], desc: 'A股/美股数据获取、策略回测、实盘交易、风险管理', url: 'https://www.quantstart.com/articles/' },
    { id: 29, title: 'Python图像识别与OpenCV', cat: 'python', price: 14.9, rating: 4.5, students: 4700, tags: ['CV','OpenCV'], desc: '人脸检测/目标跟踪/OCR文字识别/图像增强实战', url: 'https://docs.opencv.org/' },
    { id: 30, title: 'Python网络编程与Socket', cat: 'python', price: 11.9, rating: 4.4, students: 3100, tags: ['网络','Socket'], desc: 'TCP/UDP编程、多线程服务器、心跳机制、NAT穿透', url: 'https://docs.python.org/3/library/socket.html' },
    { id: 31, title: 'Python桌面应用开发', cat: 'python', price: 10.9, rating: 4.3, students: 2600, tags: ['GUI','PyQt'], desc: 'PyQt6/Tkinter/wxPython三套方案，跨平台桌面应用实战', url: 'https://www.pythonguis.com/' },
    { id: 32, title: 'Python测试驱动开发TDD', cat: 'python', price: 11.9, rating: 4.4, students: 2200, tags: ['测试','TDD'], desc: 'pytest/unittest/mock/coverage，写出零Bug的高质量代码', url: 'https://docs.pytest.org/' },
    { id: 33, title: 'Python并发编程：线程/进程/协程', cat: 'python', price: 13.9, rating: 4.6, students: 4500, tags: ['并发','性能'], desc: 'GIL深度解析、multiprocessing/asyncio/threading三剑客', url: 'https://docs.python.org/3/library/concurrent.futures.html' },
    { id: 34, title: 'Python+AI自动化测试', cat: 'python', price: 14.9, rating: 4.5, students: 3300, tags: ['测试','AI'], desc: 'Selenium/Playwright/Appium + AI智能定位元素，自动化测试全流程', url: 'https://playwright.dev/python/' },

    // ===== Java (14) =====
    { id: 35, title: 'Java零基础到高级开发', cat: 'java', price: 18.9, rating: 4.8, students: 28000, tags: ['入门','进阶'], desc: '从JDK安装到Java 21新特性，集合/IO/多线程/反射/NIO全覆盖', hot: true, url: 'https://docs.oracle.com/en/java/' },
    { id: 36, title: 'Java架构师进阶之路', cat: 'java', price: 19.9, rating: 4.85, students: 12000, tags: ['架构','微服务'], desc: 'Spring Cloud微服务、高并发、分布式事务、JVM调优', hot: true, url: 'https://spring.io/projects/spring-cloud' },
    { id: 37, title: 'Spring Boot 3 企业级开发', cat: 'java', price: 15.9, rating: 4.7, students: 9800, tags: ['Spring','后端'], desc: 'Spring Boot 3 + MyBatis-Plus + JWT + Redis 企业级项目实战', url: 'https://spring.io/projects/spring-boot' },
    { id: 38, title: 'JVM原理与调优实战', cat: 'java', price: 16.9, rating: 4.7, students: 5600, tags: ['JVM','性能'], desc: '类加载/内存模型/GC算法/JIT编译/调优工具Arthas实战', url: 'https://docs.oracle.com/javase/specs/jvms/se21/html/' },
    { id: 39, title: 'Java并发编程深度解析', cat: 'java', price: 15.9, rating: 4.8, students: 7200, tags: ['并发','线程池'], desc: 'AQS/CAS/volatile/线程池/CompletableFuture/ForkJoin', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/' },
    { id: 40, title: 'Java NIO与Netty网络编程', cat: 'java', price: 14.9, rating: 4.6, students: 3800, tags: ['NIO','Netty'], desc: '零拷贝/Epoll/Reactor模式/Netty编解码/心跳/拆包粘包', url: 'https://netty.io/wiki/' },
    { id: 41, title: 'Spring Cloud 微服务全家桶', cat: 'java', price: 17.9, rating: 4.7, students: 6400, tags: ['微服务','Spring'], desc: 'Nacos/Gateway/Sentinel/Seata/OpenFeign 微服务治理实战', url: 'https://spring.io/projects/spring-cloud' },
    { id: 42, title: 'Java设计模式与重构', cat: 'java', price: 12.9, rating: 4.5, students: 4200, tags: ['设计模式','重构'], desc: 'GoF 23种模式 + 重构手法 + 代码坏味道识别与消除', url: 'https://refactoring.guru/' },
    { id: 43, title: 'MyBatis-Plus 数据访问层', cat: 'java', price: 11.9, rating: 4.5, students: 5100, tags: ['ORM','数据库'], desc: '代码生成器/条件构造器/分页插件/多租户/数据权限', url: 'https://baomidou.com/' },
    { id: 44, title: 'Java分布式系统实战', cat: 'java', price: 18.9, rating: 4.6, students: 4300, tags: ['分布式','高可用'], desc: '分布式ID/分布式锁/分布式事务/限流降级/熔断隔离', url: 'https://github.com/apache/dubbo' },
    { id: 45, title: 'Java安全编码规范', cat: 'java', price: 13.9, rating: 4.5, students: 2800, tags: ['安全','编码'], desc: 'OWASP Top 10 Java防护、SQL注入/XSS/SSRF/反序列化防御', url: 'https://owasp.org/www-project-top-ten/' },
    { id: 46, title: 'Maven与Gradle构建工具', cat: 'java', price: 9.9, rating: 4.3, students: 3500, tags: ['构建','工具'], desc: '依赖管理/多模块构建/自定义插件/CI集成', url: 'https://maven.apache.org/guides/' },
    { id: 47, title: 'Java面试宝典2026', cat: 'java', price: 14.9, rating: 4.7, students: 15000, tags: ['面试','求职'], desc: 'BAT/TMD大厂Java面试真题300+，八股文+场景题+手撕代码', hot: true, url: 'https://github.com/Snailclimb/JavaGuide' },
    { id: 48, title: 'Java新特性速览：8→21', cat: 'java', price: 11.9, rating: 4.5, students: 4200, tags: ['新特性','Lambda'], desc: 'Lambda/Stream/Var/Record/Sealed/Pattern Matching全景回顾', url: 'https://openjdk.org/projects/jdk/' },

    // ===== JavaScript/TS (14) =====
    { id: 49, title: 'JavaScript核心原理深度解析', cat: 'javascript', price: 15.9, rating: 4.8, students: 18000, tags: ['JS','原理'], desc: '闭包/原型链/事件循环/微任务宏任务/this绑定/V8引擎', hot: true, url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
    { id: 50, title: 'TypeScript 从入门到精通', cat: 'javascript', price: 14.9, rating: 4.7, students: 12000, tags: ['TS','类型'], desc: '类型系统/泛型/装饰器/声明文件/工程化配置全攻略', url: 'https://www.typescriptlang.org/docs/' },
    { id: 51, title: 'ES2024+ 新特性全景', cat: 'javascript', price: 11.9, rating: 4.6, students: 6800, tags: ['ES新特性','现代JS'], desc: 'Temporal/Records&Tuples/Pattern Matching/Decorator标准化', url: 'https://tc39.es/' },
    { id: 52, title: 'JS异步编程：从回调到async', cat: 'javascript', price: 12.9, rating: 4.6, students: 5400, tags: ['异步','Promise'], desc: 'Callback/Promise/Generator/async await演进史与最佳实践', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous' },
    { id: 53, title: 'V8引擎与JS性能优化', cat: 'javascript', price: 14.9, rating: 4.5, students: 3200, tags: ['V8','性能'], desc: 'JIT编译/隐藏类/内联缓存/垃圾回收/内存泄漏排查', url: 'https://v8.dev/docs' },
    { id: 54, title: 'Node.js 底层原理与源码', cat: 'javascript', price: 15.9, rating: 4.5, students: 2800, tags: ['Node','底层'], desc: 'Event Loop/Libuv/模块系统/Cluster模式/C++插件开发', url: 'https://nodejs.org/en/docs' },
    { id: 55, title: 'Deno/Bun 现代JS运行时', cat: 'javascript', price: 12.9, rating: 4.4, students: 2100, tags: ['Deno','Bun'], desc: '下一代JS运行时对比，原生TS支持/ESM优先/极速启动', url: 'https://bun.sh/docs' },
    { id: 56, title: 'JS函数式编程实践', cat: 'javascript', price: 11.9, rating: 4.5, students: 3600, tags: ['函数式','FP'], desc: '纯函数/柯里化/组合/Monad/Redux函数式思想溯源', url: 'https://github.com/MostlyAdequate/mostly-adequate-guide' },
    { id: 57, title: 'JS设计模式与实战', cat: 'javascript', price: 13.9, rating: 4.6, students: 4800, tags: ['设计模式','JS'], desc: '观察者/发布订阅/策略/装饰器/代理/工厂模式JS实现', url: 'https://www.patterns.dev/' },
    { id: 58, title: 'Electron 桌面应用开发', cat: 'javascript', price: 13.9, rating: 4.5, students: 4200, tags: ['Electron','桌面'], desc: '跨平台桌面应用、自动更新、系统托盘、原生API调用', url: 'https://www.electronjs.org/docs' },
    { id: 59, title: 'JS引擎内存管理深度剖析', cat: 'javascript', price: 13.9, rating: 4.4, students: 1900, tags: ['内存','GC'], desc: 'V8/SpiderMonkey/JavaScriptCore三大引擎GC机制对比', url: 'https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey' },
    { id: 60, title: 'npm/yarn/pnpm 包管理实战', cat: 'javascript', price: 9.9, rating: 4.3, students: 5200, tags: ['包管理','工具'], desc: '依赖解析/锁文件/monorepo/发布npm包/版本语义化', url: 'https://pnpm.io/motivation' },
    { id: 61, title: 'JS正则表达式精通', cat: 'javascript', price: 10.9, rating: 4.4, students: 3800, tags: ['正则','文本'], desc: '从基础语法到回溯陷阱，正则性能优化与实战案例集', url: 'https://regex101.com/' },
    { id: 62, title: '现代JS工程化体系搭建', cat: 'javascript', price: 14.9, rating: 4.6, students: 4400, tags: ['工程化','ESLint'], desc: 'ESLint/Prettier/Husky/Commitlint/Lint-staged 全链路', url: 'https://eslint.org/docs/latest/' },

    // ===== 前端工程 (14) =====
    { id: 63, title: 'React 19 深度解析', cat: 'frontend', price: 16.9, rating: 4.75, students: 11000, tags: ['React','新特性'], desc: 'Server Components/Suspense/并发渲染/use()/Actions深度剖析', url: 'https://react.dev/' },
    { id: 64, title: 'Vue 3 + Pinia 企业级开发', cat: 'frontend', price: 14.9, rating: 4.7, students: 13000, tags: ['Vue','Pinia'], desc: 'Composition API/Teleport/Suspense/Pinia状态管理实战', url: 'https://vuejs.org/guide/' },
    { id: 65, title: '前端架构师进阶', cat: 'frontend', price: 17.9, rating: 4.8, students: 6800, tags: ['架构','工程化'], desc: '微前端/设计系统/Monorepo/CI-CD/性能监控全链路', url: 'https://martinfowler.com/articles/micro-frontends.html' },
    { id: 66, title: 'Three.js 3D可视化开发', cat: 'frontend', price: 15.9, rating: 4.6, students: 4200, tags: ['3D','WebGL'], desc: '3D场景搭建/光影材质/粒子系统/Shader入门/数据可视化', url: 'https://threejs.org/docs/' },
    { id: 67, title: 'D3.js 数据可视化大师', cat: 'frontend', price: 13.9, rating: 4.5, students: 3100, tags: ['可视化','D3'], desc: '数据绑定/比例尺/坐标轴/动画过渡/交互式图表', url: 'https://d3js.org/' },
    { id: 68, title: 'Flutter Web 跨端开发', cat: 'frontend', price: 13.9, rating: 4.4, students: 2800, tags: ['Flutter','跨端'], desc: '一套代码三端运行(Web/iOS/Android)，Dart语言+Widget体系', url: 'https://flutter.dev/docs' },
    { id: 69, title: 'Svelte/SvelteKit 轻量框架', cat: 'frontend', price: 11.9, rating: 4.5, students: 2200, tags: ['Svelte','编译'], desc: '无Virtual DOM的编译时框架，极致性能与开发体验', url: 'https://svelte.dev/docs' },
    { id: 70, title: '前端单元测试与E2E测试', cat: 'frontend', price: 12.9, rating: 4.4, students: 2600, tags: ['测试','Jest'], desc: 'Jest/Vitest/Playwright/Storybook 前端质量保障体系', url: 'https://jestjs.io/docs/' },
    { id: 71, title: 'CSS动画与动效设计', cat: 'frontend', price: 10.9, rating: 4.5, students: 4800, tags: ['CSS','动画'], desc: 'Keyframes/Transition/FLIP技术/Scroll-driven Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations' },
    { id: 72, title: '前端安全攻防实战', cat: 'frontend', price: 14.9, rating: 4.6, students: 3500, tags: ['安全','XSS'], desc: 'XSS/CSRF/点击劫持/中间人攻击前端防御全方案', url: 'https://owasp.org/www-project-top-ten/' },
    { id: 73, title: 'Nuxt 3 全栈Vue开发', cat: 'frontend', price: 13.9, rating: 4.5, students: 3200, tags: ['Nuxt','SSR'], desc: 'Nitro服务/Server Routes/自动导入/内容驱动/部署优化', url: 'https://nuxt.com/docs' },
    { id: 74, title: 'Next.js 14 App Router实战', cat: 'frontend', price: 15.9, rating: 4.7, students: 7200, tags: ['Next.js','RSC'], desc: 'App Router/Server Actions/Streaming/Parallel Routes布局', url: 'https://nextjs.org/docs/app' },
    { id: 75, title: '前端监控与错误追踪', cat: 'frontend', price: 12.9, rating: 4.4, students: 2100, tags: ['监控','Sentry'], desc: 'Sentry/埋点/性能监控/白屏检测/Source Map还原', url: 'https://sentry.io/docs' },
    { id: 76, title: 'Web动画引擎：GSAP + Lenis', cat: 'frontend', price: 11.9, rating: 4.5, students: 2900, tags: ['动画','GSAP'], desc: '专业级时间线动画/ScrollTrigger/丝滑滚动/视差效果', url: 'https://gsap.com/docs/' },

    // ===== 后端架构 (14) =====
    { id: 77, title: 'Go语言高并发实战', cat: 'backend', price: 16.9, rating: 4.75, students: 9200, tags: ['Go','并发'], desc: 'Goroutine/Channel/Context/微服务/云原生开发一网打尽', url: 'https://go.dev/doc/' },
    { id: 78, title: 'Rust系统编程入门到精通', cat: 'backend', price: 17.9, rating: 4.7, students: 5400, tags: ['Rust','系统'], desc: '所有权/生命周期/异步Rust/FFI/Tokio网络编程', url: 'https://doc.rust-lang.org/book/' },
    { id: 79, title: 'C/C++ 高性能编程', cat: 'backend', price: 15.9, rating: 4.6, students: 6800, tags: ['C++','性能'], desc: '智能指针/模板元编程/内存对齐/缓存友好/无锁编程', url: 'https://en.cppreference.com/w/' },
    { id: 80, title: '微服务架构设计与落地', cat: 'backend', price: 18.9, rating: 4.7, students: 5600, tags: ['微服务','架构'], desc: '服务拆分/API网关/服务发现/配置中心/链路追踪全链路', url: 'https://microservices.io/patterns/' },
    { id: 81, title: '消息队列深度实战', cat: 'backend', price: 14.9, rating: 4.6, students: 4800, tags: ['MQ','Kafka'], desc: 'Kafka/RabbitMQ/RocketMQ 消息可靠性/顺序消费/事务消息', url: 'https://kafka.apache.org/documentation/' },
    { id: 82, title: 'Redis 从入门到集群', cat: 'backend', price: 14.9, rating: 4.8, students: 11500, tags: ['Redis','缓存'], desc: '数据结构/持久化/集群/哨兵/分布式锁/Redisson实战', url: 'https://redis.io/docs/' },
    { id: 83, title: 'API网关设计与实现', cat: 'backend', price: 13.9, rating: 4.5, students: 2800, tags: ['网关','Kong'], desc: 'Kong/APISIX/Spring Cloud Gateway 限流/鉴权/协议转换', url: 'https://apisix.apache.org/docs/' },
    { id: 84, title: '分布式缓存架构', cat: 'backend', price: 15.9, rating: 4.6, students: 3400, tags: ['缓存','分布式'], desc: '多级缓存/Cache Aside/一致性哈希/热点Key/缓存穿透击穿雪崩', url: 'https://github.com/memcached/memcached' },
    { id: 85, title: '搜索引擎Elasticsearch实战', cat: 'backend', price: 14.9, rating: 4.5, students: 3800, tags: ['ES','搜索'], desc: '倒排索引/分词器/聚合分析/相关性调优/ELK日志系统', url: 'https://www.elastic.co/guide/' },
    { id: 86, title: 'Graph数据库Neo4j实战', cat: 'backend', price: 12.9, rating: 4.4, students: 1900, tags: ['图数据库','Neo4j'], desc: 'Cypher查询/社交网络分析/知识图谱/推荐系统', url: 'https://neo4j.com/docs/' },
    { id: 87, title: 'gRPC与Protobuf实战', cat: 'backend', price: 13.9, rating: 4.5, students: 2600, tags: ['gRPC','RPC'], desc: '高性能RPC框架/双向流/拦截器/服务注册发现/与REST对比', url: 'https://grpc.io/docs/' },
    { id: 88, title: 'WebSocket实时通信架构', cat: 'backend', price: 12.9, rating: 4.4, students: 3100, tags: ['实时','长连接'], desc: '百万连接架构/心跳保活/消息推送/IM系统设计', url: 'https://socket.io/docs/v4/' },
    { id: 89, title: 'DDD领域驱动设计实战', cat: 'backend', price: 16.9, rating: 4.5, students: 2900, tags: ['DDD','架构'], desc: '限界上下文/聚合根/事件风暴/CQRS/Event Sourcing', url: 'https://martinfowler.com/bliki/DomainDrivenDesign.html' },
    { id: 90, title: '高并发系统设计', cat: 'backend', price: 18.9, rating: 4.8, students: 8200, tags: ['高并发','架构'], desc: '秒杀系统/限流算法/熔断降级/分库分表/读写分离', hot: true, url: 'https://github.com/binhnguyennus/awesome-system-design' },

    // ===== AI/大模型 (14) =====
    { id: 91, title: 'AI大模型应用开发实战', cat: 'ai', price: 19.9, rating: 4.95, students: 18000, tags: ['大模型','爆款'], desc: 'GPT/Claude/国产大模型API调用、RAG检索增强、Agent智能体开发', hot: true, url: 'https://platform.openai.com/docs' },
    { id: 92, title: 'Prompt Engineering 提示词工程', cat: 'ai', price: 12.9, rating: 4.7, students: 12500, tags: ['Prompt','LLM'], desc: 'Chain-of-Thought/Tree-of-Thought/ReAct/结构化输出/少样本学习', url: 'https://www.promptingguide.ai/' },
    { id: 93, title: 'LangChain + LlamaIndex 开发', cat: 'ai', price: 15.9, rating: 4.6, students: 6200, tags: ['LangChain','RAG'], desc: '构建文档问答/知识库/AI Agent，向量数据库+大模型编排', url: 'https://python.langchain.com/docs/' },
    { id: 94, title: 'RAG检索增强生成系统', cat: 'ai', price: 16.9, rating: 4.7, students: 5400, tags: ['RAG','向量'], desc: 'Embedding/向量检索/Rerank/混合检索/评估体系', url: 'https://arxiv.org/abs/2005.11401' },
    { id: 95, title: 'AI Agent 智能体开发', cat: 'ai', price: 17.9, rating: 4.7, students: 4800, tags: ['Agent','AutoGPT'], desc: '自主规划/工具调用/多Agent协作/记忆系统/反思机制', url: 'https://github.com/Significant-Gravitas/AutoGPT' },
    { id: 96, title: 'PyTorch 深度学习实战', cat: 'ai', price: 16.9, rating: 4.7, students: 7200, tags: ['PyTorch','DL'], desc: 'CNN/RNN/Transformer/GNN，从张量运算到模型部署', url: 'https://pytorch.org/docs/stable/' },
    { id: 97, title: 'Transformer 架构深度解析', cat: 'ai', price: 15.9, rating: 4.8, students: 5600, tags: ['Transformer','Attention'], desc: 'Self-Attention/Multi-Head/位置编码/Decoder-Only架构演进', url: 'https://arxiv.org/abs/1706.03762' },
    { id: 98, title: 'Stable Diffusion 图像生成', cat: 'ai', price: 14.9, rating: 4.5, students: 4300, tags: ['SD','AIGC'], desc: 'ComfyUI/WebUI/LoRA训练/ControlNet/模型微调', url: 'https://github.com/Comfy-Org/ComfyUI' },
    { id: 99, title: '机器学习入门到实战', cat: 'ai', price: 15.9, rating: 4.75, students: 9100, tags: ['ML','Scikit-learn'], desc: '经典ML算法/特征工程/模型评估/超参调优/Ensemble', url: 'https://scikit-learn.org/stable/documentation.html' },
    { id: 100, title: 'NLP自然语言处理全栈', cat: 'ai', price: 16.9, rating: 4.6, students: 4800, tags: ['NLP','文本'], desc: '分词/词向量/BERT/GPT/文本分类/情感分析/命名实体识别', url: 'https://huggingface.co/docs' },
    { id: 101, title: '计算机视觉实战', cat: 'ai', price: 14.9, rating: 4.5, students: 3900, tags: ['CV','视觉'], desc: '目标检测/图像分割/姿态估计/视频理解/YOLO系列', url: 'https://docs.ultralytics.com/' },
    { id: 102, title: 'LLM微调与部署', cat: 'ai', price: 18.9, rating: 4.6, students: 3200, tags: ['微调','LoRA'], desc: 'LoRA/QLoRA/Prefix Tuning/模型量化/vLLM部署推理', url: 'https://github.com/vllm-project/vllm' },
    { id: 103, title: 'AI辅助编程：Copilot进阶', cat: 'ai', price: 11.9, rating: 4.6, students: 8500, tags: ['Copilot','效率'], desc: 'GitHub Copilot/Cursor/Claude Code高效使用技巧与Prompt', url: 'https://docs.github.com/copilot' },
    { id: 104, title: '多模态大模型开发', cat: 'ai', price: 17.9, rating: 4.5, students: 2100, tags: ['多模态','VLM'], desc: 'GPT-4V/LLaVA/Qwen-VL图文理解/视频分析/跨模态检索', url: 'https://arxiv.org/abs/2304.08485' },

    // ===== 数据库 (12) =====
    { id: 105, title: 'MySQL 8.0 深度调优', cat: 'database', price: 14.9, rating: 4.7, students: 7800, tags: ['MySQL','调优'], desc: '索引原理/执行计划/锁机制/主从复制/分库分表', url: 'https://dev.mysql.com/doc/' },
    { id: 106, title: 'PostgreSQL 高级实战', cat: 'database', price: 13.9, rating: 4.6, students: 4200, tags: ['PG','SQL'], desc: '窗口函数/CTE/JSONB/分区表/逻辑复制/性能调优', url: 'https://www.postgresql.org/docs/' },
    { id: 107, title: 'MongoDB NoSQL实战', cat: 'database', price: 12.9, rating: 4.5, students: 4800, tags: ['MongoDB','NoSQL'], desc: '文档模型/聚合管道/索引策略/副本集/分片集群', url: 'https://www.mongodb.com/docs/' },
    { id: 108, title: 'SQL高级查询与优化', cat: 'database', price: 11.9, rating: 4.6, students: 9200, tags: ['SQL','查询'], desc: '复杂查询/窗口函数/递归CTE/执行计划分析/SQL注入防御', url: 'https://www.sqlite.org/docs.html' },
    { id: 109, title: '数据库内核原理', cat: 'database', price: 16.9, rating: 4.5, students: 1800, tags: ['内核','存储引擎'], desc: 'B+树/LSM树/WAL/Buffer Pool/MVCC实现原理', url: 'https://github.com/cmu-db' },
    { id: 110, title: 'ClickHouse 大数据分析', cat: 'database', price: 14.9, rating: 4.5, students: 2600, tags: ['OLAP','ClickHouse'], desc: '列式存储/向量化执行/MergeTree引擎/实时分析', url: 'https://clickhouse.com/docs' },
    { id: 111, title: 'TiDB 分布式数据库实战', cat: 'database', price: 13.9, rating: 4.4, students: 1900, tags: ['TiDB','NewSQL'], desc: 'HTAP架构/PD调度/TiKV存储/在线扩缩容/数据迁移', url: 'https://docs.pingcap.com/' },
    { id: 112, title: 'Redis高级数据结构与应用', cat: 'database', price: 13.9, rating: 4.7, students: 6500, tags: ['Redis','数据结构'], desc: 'BitMap/HyperLogLog/BloomFilter/Geo/Stream实战场景', url: 'https://redis.io/docs/data-types/' },
    { id: 113, title: '数据库安全与审计', cat: 'database', price: 12.9, rating: 4.3, students: 1500, tags: ['安全','审计'], desc: 'SQL注入防御/数据脱敏/权限管理/审计日志/加密存储', url: 'https://owasp.org/www-project-top-ten/' },
    { id: 114, title: '数据仓库与ETL设计', cat: 'database', price: 13.9, rating: 4.4, students: 2200, tags: ['数仓','ETL'], desc: '星型/雪花模型/缓慢变化维/调度系统/数据质量', url: 'https://airflow.apache.org/docs/' },
    { id: 115, title: 'Supabase/BaaS 快速开发', cat: 'database', price: 10.9, rating: 4.4, students: 2800, tags: ['BaaS','Supabase'], desc: 'PostgreSQL+Auth+Storage+Realtime一站式后端即服务', url: 'https://supabase.com/docs' },
    { id: 116, title: '图数据库与知识图谱', cat: 'database', price: 13.9, rating: 4.4, students: 1700, tags: ['图','知识图谱'], desc: 'Neo4j+JanusGraph+图谱构建/实体抽取/关系推理', url: 'https://neo4j.com/docs/graph-data-science/' },

    // ===== DevOps/云原生 (12) =====
    { id: 117, title: 'Docker 容器化实战', cat: 'devops', price: 13.9, rating: 4.7, students: 12000, tags: ['Docker','容器'], desc: '镜像构建/多阶段构建/Compose/网络/存储/安全扫描', url: 'https://docs.docker.com/' },
    { id: 118, title: 'Kubernetes 从入门到生产', cat: 'devops', price: 16.9, rating: 4.7, students: 7400, tags: ['K8s','编排'], desc: 'Pod/Service/Deployment/Ingress/Helm/Operator/CRD', url: 'https://kubernetes.io/zh-cn/docs/' },
    { id: 119, title: 'CI/CD 流水线实战', cat: 'devops', price: 13.9, rating: 4.6, students: 5600, tags: ['CI/CD','GitHub Actions'], desc: 'GitHub Actions/GitLab CI/Jenkins 自动化构建部署测试', url: 'https://docs.github.com/actions' },
    { id: 120, title: 'Terraform 基础设施即代码', cat: 'devops', price: 14.9, rating: 4.5, students: 3200, tags: ['IaC','Terraform'], desc: 'AWS/GCP/阿里云资源编排/模块化/状态管理/远程后端', url: 'https://developer.hashicorp.com/terraform' },
    { id: 121, title: 'Prometheus + Grafana 监控', cat: 'devops', price: 12.9, rating: 4.6, students: 4800, tags: ['监控','告警'], desc: '指标采集/告警规则/仪表盘/Exporter开发/ServiceMonitor', url: 'https://prometheus.io/docs/' },
    { id: 122, title: 'AWS 云计算架构师认证', cat: 'devops', price: 18.9, rating: 4.6, students: 4200, tags: ['AWS','云'], desc: 'EC2/S3/RDS/Lambda/VPC/CloudFront 核心服务实战', url: 'https://aws.amazon.com/documentation/' },
    { id: 123, title: 'Linux服务器运维实战', cat: 'devops', price: 12.9, rating: 4.5, students: 6800, tags: ['Linux','运维'], desc: 'Shell脚本/系统调优/安全加固/日志分析/故障排查', url: 'https://linux.die.net/' },
    { id: 124, title: 'Nginx 高性能服务器配置', cat: 'devops', price: 11.9, rating: 4.6, students: 8200, tags: ['Nginx','反向代理'], desc: '负载均衡/缓存/SSL终止/限流/动静分离/Lua脚本', url: 'https://nginx.org/en/docs/' },
    { id: 125, title: 'GitOps 与 ArgoCD 持续交付', cat: 'devops', price: 13.9, rating: 4.4, students: 1900, tags: ['GitOps','ArgoCD'], desc: '声明式部署/自动同步/回滚/渐进式交付/多集群管理', url: 'https://argo-cd.readthedocs.io/' },
    { id: 126, title: '服务网格Istio实战', cat: 'devops', price: 15.9, rating: 4.4, students: 1600, tags: ['Istio','Service Mesh'], desc: '流量管理/安全认证/可观测性/多集群/零停机迁移', url: 'https://istio.io/latest/docs/' },
    { id: 127, title: 'ELK日志分析平台搭建', cat: 'devops', price: 12.9, rating: 4.4, students: 2800, tags: ['ELK','日志'], desc: 'Elasticsearch+Logstash+Kibana 集中式日志收集分析', url: 'https://www.elastic.co/guide/' },
    { id: 128, title: 'Chaos Engineering 混沌工程', cat: 'devops', price: 13.9, rating: 4.3, students: 1200, tags: ['混沌','韧性'], desc: '故障注入/韧性测试/Chaos Mesh/Litmus 生产环境验证', url: 'https://chaos-mesh.org/docs/' },

    // ===== 网络安全 (14) =====
    { id: 129, title: 'Web安全攻防实战入门', cat: 'security', price: 15.9, rating: 4.7, students: 6200, tags: ['安全','入门'], desc: 'OWASP Top 10/SQL注入/XSS/CSRF/SSRF/文件上传漏洞', url: 'https://owasp.org/www-project-top-ten/' },
    { id: 130, title: '渗透测试工程师养成', cat: 'security', price: 18.9, rating: 4.6, students: 3800, tags: ['渗透','Kali'], desc: 'Kali Linux/Metasploit/Burp Suite/信息收集/提权/后渗透', url: 'https://www.kali.org/docs/' },
    { id: 131, title: 'CTF竞赛入门到进阶', cat: 'security', price: 14.9, rating: 4.5, students: 4200, tags: ['CTF','竞赛'], desc: 'Web/Pwn/Reverse/Crypto/Misc五大方向，CTFtime刷题路线', url: 'https://ctftime.org/' },
    { id: 132, title: '逆向工程与恶意代码分析', cat: 'security', price: 17.9, rating: 4.5, students: 2100, tags: ['逆向','IDA'], desc: 'IDA Pro/Ghidra/x64dbg/汇编/加壳脱壳/病毒分析', url: 'https://hex-rays.com/ida-pro/' },
    { id: 133, title: '密码学原理与应用', cat: 'security', price: 14.9, rating: 4.5, students: 2800, tags: ['密码学','加密'], desc: '对称/非对称/哈希/数字签名/TLS/零知识证明入门', url: 'https://cryptopals.com/' },
    { id: 134, title: '网络安全等级保护2.0', cat: 'security', price: 13.9, rating: 4.3, students: 1900, tags: ['等保','合规'], desc: '等保2.0标准解读/定级备案/安全建设/测评整改全流程', url: 'https://www.djbh.net/' },
    { id: 135, title: 'API安全测试与防护', cat: 'security', price: 13.9, rating: 4.4, students: 2200, tags: ['API','安全'], desc: 'API鉴权绕过/批量枚举/速率限制/GraphQL安全/OWASP API Top 10', url: 'https://owasp.org/API-Security/' },
    { id: 136, title: '移动端安全攻防', cat: 'security', price: 15.9, rating: 4.3, students: 1600, tags: ['移动安全','Android'], desc: 'Android/iOS逆向/SSL Pinning绕过/Root检测/应用加固', url: 'https://frida.re/docs/' },
    { id: 137, title: '云安全与容器安全', cat: 'security', price: 14.9, rating: 4.4, students: 1800, tags: ['云安全','容器'], desc: 'AWS安全组/K8s安全策略/镜像扫描/RBAC/Secret管理', url: 'https://kubernetes.io/docs/concepts/security/' },
    { id: 138, title: 'SOC安全运营中心实战', cat: 'security', price: 15.9, rating: 4.4, students: 1700, tags: ['SOC','SIEM'], desc: '日志分析/威胁狩猎/事件响应/SOAR/安全编排自动化', url: 'https://www.splunk.com/en_us/support-and-services.html' },
    { id: 139, title: '红蓝对抗实战演练', cat: 'security', price: 16.9, rating: 4.5, students: 1500, tags: ['红蓝','对抗'], desc: '红队攻击链/蓝队防御/ATT&CK框架/钓鱼演练/内网渗透', url: 'https://attack.mitre.org/' },
    { id: 140, title: '区块链安全与智能合约审计', cat: 'security', price: 15.9, rating: 4.3, students: 1400, tags: ['区块链','审计'], desc: 'Solidity安全/重入攻击/闪电贷/形式化验证/审计工具', url: 'https://github.com/crytic/Slither' },
    { id: 141, title: '零信任架构设计与落地', cat: 'security', price: 14.9, rating: 4.4, students: 1600, tags: ['零信任','ZTA'], desc: 'BeyondCorp模型/身份认证/设备信任/微分段/SDP', url: 'https://www.nist.gov/publications/zero-trust-architecture' },
    { id: 142, title: '安全开发生命周期SDL', cat: 'security', price: 12.9, rating: 4.3, students: 1300, tags: ['SDL','DevSecOps'], desc: '威胁建模/安全编码/代码审计/SAST/DAST/依赖扫描', url: 'https://owasp.org/www-project-samm/' },

    // ===== 算法竞赛 (10) =====
    { id: 143, title: 'LeetCode 300题精讲', cat: 'algorithm', price: 14.9, rating: 4.8, students: 22000, tags: ['LeetCode','面试'], desc: '数组/链表/树/图/动态规划/回溯/贪心 分类刷题法', hot: true, url: 'https://leetcode.cn/' },
    { id: 144, title: '算法竞赛入门（ACM/ICPC）', cat: 'algorithm', price: 13.9, rating: 4.5, students: 3200, tags: ['ACM','竞赛'], desc: 'C++ STL/数论/组合数学/图论/字符串/计算几何', url: 'https://codeforces.com/' },
    { id: 145, title: '动态规划进阶', cat: 'algorithm', price: 13.9, rating: 4.6, students: 4200, tags: ['DP','状态压缩'], desc: '线性DP/区间DP/树形DP/状压DP/概率DP/斜率优化', url: 'https://usaco.guide/' },
    { id: 146, title: '数据结构精解', cat: 'algorithm', price: 11.9, rating: 4.6, students: 5800, tags: ['数据结构','基础'], desc: '线段树/树状数组/并查集/Trie/Splay/红黑树原理与实现', url: 'https://cp-algorithms.com/' },
    { id: 147, title: '图论算法大全', cat: 'algorithm', price: 12.9, rating: 4.5, students: 2800, tags: ['图论','最短路'], desc: 'Dijkstra/Bellman-Ford/Floyd/网络流/强连通/二分图', url: 'https://cp-algorithms.com/graph/' },
    { id: 148, title: '字符串算法实战', cat: 'algorithm', price: 11.9, rating: 4.4, students: 2100, tags: ['字符串','KMP'], desc: 'KMP/Manacher/后缀数组/AC自动机/回文树', url: 'https://cp-algorithms.com/string/' },
    { id: 149, title: '数学与数论在编程中的应用', cat: 'algorithm', price: 11.9, rating: 4.3, students: 1900, tags: ['数论','数学'], desc: '素数筛/同余/逆元/中国剩余定理/矩阵快速幂/高斯消元', url: 'https://projecteuler.net/' },
    { id: 150, title: '博弈论与对抗搜索', cat: 'algorithm', price: 10.9, rating: 4.3, students: 1200, tags: ['博弈','Minimax'], desc: 'Nim游戏/SG函数/Alpha-Beta剪枝/蒙特卡洛树搜索', url: 'https://www.chessprogramming.org/' },
    { id: 151, title: 'Codeforces 高手进阶', cat: 'algorithm', price: 12.9, rating: 4.5, students: 2400, tags: ['CF','Rating'], desc: 'Div2/Div1题目分类/刷题策略/比赛技巧/Rating提升路线', url: 'https://codeforces.com/blog' },
    { id: 152, title: '面试算法手撕指南', cat: 'algorithm', price: 13.9, rating: 4.7, students: 9500, tags: ['面试','手撕'], desc: 'BAT/TMD高频手撕题/白板编程技巧/思路表达训练', url: 'https://www.geeksforgeeks.org/' },

    // ===== 移动开发 (10) =====
    { id: 153, title: 'Android 开发从零到一', cat: 'mobile', price: 14.9, rating: 4.5, students: 5200, tags: ['Android','Kotlin'], desc: 'Kotlin/Compose/ViewModel/Coroutines/Navigation 现代Android开发', url: 'https://developer.android.com/' },
    { id: 154, title: 'iOS 开发 SwiftUI 实战', cat: 'mobile', price: 14.9, rating: 4.5, students: 3800, tags: ['iOS','SwiftUI'], desc: 'Swift/SwiftUI/Combine/Core Data/Widget/App Store上架', url: 'https://developer.apple.com/documentation/' },
    { id: 155, title: 'Flutter 跨平台开发', cat: 'mobile', price: 13.9, rating: 4.5, students: 6200, tags: ['Flutter','跨端'], desc: 'Dart语言/Widget体系/状态管理/原生通信/性能优化', url: 'https://flutter.dev/docs' },
    { id: 156, title: 'React Native 移动开发', cat: 'mobile', price: 12.9, rating: 4.4, students: 4200, tags: ['RN','跨端'], desc: 'JSX/组件/导航/原生模块/热更新/Expo生态', url: 'https://reactnative.dev/docs' },
    { id: 157, title: '微信小程序开发实战', cat: 'mobile', price: 11.9, rating: 4.6, students: 12000, tags: ['小程序','微信'], desc: 'WXML/WXSS/云开发/支付接入/订阅消息/性能优化', url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/' },
    { id: 158, title: 'Uni-App 多端统一开发', cat: 'mobile', price: 11.9, rating: 4.4, students: 6800, tags: ['Uni-App','多端'], desc: '一套代码编译到微信/支付宝/百度/头条/快应用/H5/App', url: 'https://uniapp.dcloud.net.cn/' },
    { id: 159, title: '移动端性能优化', cat: 'mobile', price: 12.9, rating: 4.4, students: 2200, tags: ['性能','移动'], desc: '启动优化/包体积/内存泄漏/卡顿检测/电量优化', url: 'https://developer.android.com/topic/performance' },
    { id: 160, title: 'PWA 移动Web应用', cat: 'mobile', price: 9.9, rating: 4.3, students: 2800, tags: ['PWA','移动Web'], desc: 'Service Worker/离线缓存/添加到主屏/推送通知', url: 'https://web.dev/progressive-web-apps/' },
    { id: 161, title: '移动端安全与加固', cat: 'mobile', price: 13.9, rating: 4.3, students: 1400, tags: ['移动安全','加固'], desc: '应用加固/反调试/代码混淆/Root检测/SSL Pinning', url: 'https://frida.re/docs/' },
    { id: 162, title: 'Capacitor 混合应用开发', cat: 'mobile', price: 10.9, rating: 4.2, students: 1600, tags: ['Capacitor','混合'], desc: 'Web技术+原生能力/Ionic/Cordova迁移/插件开发', url: 'https://capacitorjs.com/docs' },

    // ===== 游戏开发 (8) =====
    { id: 163, title: 'Unity 游戏开发入门', cat: 'game', price: 14.9, rating: 4.5, students: 4800, tags: ['Unity','C#'], desc: 'C#脚本/物理引擎/动画系统/Shader/2D+3D游戏实战', url: 'https://docs.unity3d.com/' },
    { id: 164, title: 'Unreal Engine 5 开发实战', cat: 'game', price: 16.9, rating: 4.5, students: 3200, tags: ['UE5','C++'], desc: 'Blueprint/材质系统/Nanite/Lumen/AI行为树/网络多人', url: 'https://docs.unrealengine.com/' },
    { id: 165, title: 'Godot 开源游戏引擎', cat: 'game', price: 11.9, rating: 4.4, students: 2800, tags: ['Godot','GDScript'], desc: '轻量开源引擎/2D优先/GDScript/C#/跨平台导出', url: 'https://docs.godotengine.org/' },
    { id: 166, title: '游戏AI与行为树', cat: 'game', price: 12.9, rating: 4.3, students: 1600, tags: ['游戏AI','行为树'], desc: '有限状态机/行为树/寻路A*/群体智能/机器学习AI', url: 'https://www.gamasutra.com/' },
    { id: 167, title: 'HTML5 小游戏开发', cat: 'game', price: 10.9, rating: 4.3, students: 3500, tags: ['H5','Canvas'], desc: 'Canvas/WebGL/Phaser/PixiJS 微信小游戏+网页游戏', url: 'https://phaser.io/docs' },
    { id: 168, title: '游戏服务器开发', cat: 'game', price: 15.9, rating: 4.4, students: 1900, tags: ['游戏服务器','网络'], desc: '帧同步/状态同步/Skynet/房间匹配/防作弊', url: 'https://github.com/cloudwu/skynet' },
    { id: 169, title: 'Shader与图形学基础', cat: 'game', price: 14.9, rating: 4.4, students: 1700, tags: ['Shader','图形学'], desc: 'GLSL/HLSL/CG/光照模型/后处理/渲染管线', url: 'https://learnopengl.com/' },
    { id: 170, title: 'Roguelike 游戏设计', cat: 'game', price: 10.9, rating: 4.2, students: 1200, tags: ['Roguelike','设计'], desc: '随机生成/回合制/永久死亡/道具系统/关卡设计', url: 'https://www.reddit.com/r/roguelikedev/' },

    // ===== 区块链 (6) =====
    { id: 171, title: '区块链原理与比特币', cat: 'blockchain', price: 14.9, rating: 4.4, students: 3200, tags: ['区块链','比特币'], desc: '哈希链/PoW/PoS/UTXO/梅克尔树/共识机制', url: 'https://bitcoin.org/zh_CN/developer-documentation/' },
    { id: 172, title: 'Solidity 智能合约开发', cat: 'blockchain', price: 15.9, rating: 4.5, students: 4200, tags: ['Solidity','合约'], desc: '以太坊/Solidity语法/ERC20/ERC721/DeFi协议开发', url: 'https://docs.soliditylang.org/' },
    { id: 173, title: 'Web3.js + Ethers.js DApp开发', cat: 'blockchain', price: 13.9, rating: 4.4, students: 2800, tags: ['Web3','DApp'], desc: '前端连接钱包/MetaMask/合约交互/事件监听/IPFS存储', url: 'https://docs.ethers.org/' },
    { id: 174, title: 'DeFi 协议原理与实战', cat: 'blockchain', price: 16.9, rating: 4.3, students: 1900, tags: ['DeFi','金融'], desc: 'AMM/借贷/流动性挖矿/闪电贷/收益聚合器', url: 'https://uniswap.org/docs/v2/' },
    { id: 175, title: 'NFT 从创作到交易', cat: 'blockchain', price: 12.9, rating: 4.2, students: 2200, tags: ['NFT','创作'], desc: 'ERC721/ERC1155/铸造/市场交易/版税/跨链桥', url: 'https://opensea.io/learn' },
    { id: 176, title: '零知识证明入门', cat: 'blockchain', price: 15.9, rating: 4.3, students: 1100, tags: ['ZK','密码学'], desc: 'zk-SNARKs/zk-STARKs/Circom/Halo2/Privacy技术', url: 'https://zkp.science/' },

    // ===== 数据分析 (8) =====
    { id: 177, title: 'Python数据分析与可视化', cat: 'data', price: 13.9, rating: 4.65, students: 8200, tags: ['数据','可视化'], desc: 'Pandas+Matplotlib+Seaborn+Plotly，从数据清洗到商业洞察', url: 'https://pandas.pydata.org/docs/' },
    { id: 178, title: 'SQL数据分析实战', cat: 'data', price: 11.9, rating: 4.5, students: 6800, tags: ['SQL','分析'], desc: '窗口函数/复杂查询/数据透视/BI报表/用户行为分析', url: 'https://mode.com/sql-tutorial/' },
    { id: 179, title: 'Tableau 商业智能可视化', cat: 'data', price: 12.9, rating: 4.4, students: 3200, tags: ['Tableau','BI'], desc: '仪表盘设计/交互式图表/数据故事/企业级BI方案', url: 'https://help.tableau.com/' },
    { id: 180, title: '大数据Hadoop生态', cat: 'data', price: 14.9, rating: 4.4, students: 2800, tags: ['Hadoop','大数据'], desc: 'HDFS/MapReduce/Hive/Spark/Flink 大数据处理全链路', url: 'https://hadoop.apache.org/docs/' },
    { id: 181, title: '实时流处理Flink实战', cat: 'data', price: 14.9, rating: 4.4, students: 1900, tags: ['Flink','流处理'], desc: 'DataStream/状态管理/Checkpoint/窗口/Exactly-Once', url: 'https://flink.apache.org/what-is-flink/' },
    { id: 182, title: '用户增长与数据分析', cat: 'data', price: 12.9, rating: 4.3, students: 2200, tags: ['增长','A/B测试'], desc: 'AARRR模型/漏斗分析/留存分析/A-B测试/归因模型', url: 'https://mixpanel.com/blog/' },
    { id: 183, title: 'Python爬虫与数据采集', cat: 'data', price: 12.9, rating: 4.5, students: 5400, tags: ['爬虫','数据'], desc: 'Scrapy/Playwright/代理池/验证码/反爬对抗/数据清洗', url: 'https://scrapy.org/doc/' },
    { id: 184, title: '数据清洗与ETL工程', cat: 'data', price: 11.9, rating: 4.3, students: 2100, tags: ['ETL','清洗'], desc: '缺失值/异常值/重复数据/格式统一/数据质量评估', url: 'https://pandas.pydata.org/docs/user_guide/cleaning.html' },

    // ===== Linux/运维 (8) =====
    { id: 185, title: 'Linux系统管理与运维', cat: 'linux', price: 12.9, rating: 4.55, students: 6800, tags: ['Linux','运维'], desc: '从命令行到自动化运维，Shell脚本、系统调优、安全加固全覆盖', url: 'https://linux.die.net/' },
    { id: 186, title: 'Shell脚本编程精通', cat: 'linux', price: 9.9, rating: 4.4, students: 4800, tags: ['Shell','脚本'], desc: 'Bash/正则/awk/sed/cron/自动化运维脚本实战', url: 'https://tldp.org/LDP/abs/html/' },
    { id: 187, title: 'Linux内核模块开发', cat: 'linux', price: 15.9, rating: 4.4, students: 1200, tags: ['内核','驱动'], desc: '字符设备/内核模块/系统调用/内存管理/进程调度', url: 'https://www.kernel.org/doc/' },
    { id: 188, title: '网络管理与安全配置', cat: 'linux', price: 12.9, rating: 4.3, students: 2200, tags: ['网络','iptables'], desc: 'iptables/nftables/tcpdump/Wireshark/网络故障排查', url: 'https://www.netfilter.org/documentation/' },
    { id: 189, title: 'Ansible 自动化运维', cat: 'linux', price: 11.9, rating: 4.4, students: 2800, tags: ['Ansible','自动化'], desc: 'Playbook/Role/Inventory/动态主机/批量管理/配置管理', url: 'https://docs.ansible.com/' },
    { id: 190, title: 'Zabbix 监控系统搭建', cat: 'linux', price: 10.9, rating: 4.2, students: 1900, tags: ['Zabbix','监控'], desc: '主机监控/自定义模板/告警通知/自动发现/分布式监控', url: 'https://www.zabbix.com/documentation/' },
    { id: 191, title: 'Vim/Neovim 高效编辑', cat: 'linux', price: 9.9, rating: 4.4, students: 5200, tags: ['Vim','效率'], desc: '快捷键/宏/插件管理/LSP/IDE化配置/Tmux配合', url: 'https://neovim.io/doc/' },
    { id: 192, title: 'Linux性能调优实战', cat: 'linux', price: 13.9, rating: 4.5, students: 2400, tags: ['性能','调优'], desc: 'perf/strace/火焰图/CPU/内存/IO/网络瓶颈定位', url: 'https://www.brendangregg.com/linuxperf.html' },

    // ===== Rust (4) =====
    { id: 193, title: 'Rust系统编程入门', cat: 'rust', price: 14.9, rating: 4.7, students: 4200, tags: ['Rust','入门'], desc: '所有权/借用/生命周期/模式匹配/错误处理/Cargo', url: 'https://doc.rust-lang.org/book/' },
    { id: 194, title: 'Rust异步编程与Tokio', cat: 'rust', price: 14.9, rating: 4.5, students: 1900, tags: ['Rust','异步'], desc: 'async/await/Future/Tokio运行时/异步Stream/网络编程', url: 'https://tokio.rs/tokio/tutorial' },
    { id: 195, title: 'Rust + WebAssembly 全栈', cat: 'rust', price: 13.9, rating: 4.4, students: 1400, tags: ['Rust','WASM'], desc: 'wasm-pack/Leptos/Yew/Trunk 用Rust写前端', url: 'https://rustwasm.github.io/docs/' },
    { id: 196, title: 'Rust嵌入式开发', cat: 'rust', price: 12.9, rating: 4.3, students: 900, tags: ['Rust','嵌入式'], desc: 'no_std/AVR/STM32/RTIC实时系统/物联网设备', url: 'https://docs.rust-embedded.org/' },

    // ===== Go语言 (6) =====
    { id: 197, title: 'Go语言基础与进阶', cat: 'go', price: 13.9, rating: 4.6, students: 6800, tags: ['Go','基础'], desc: '语法/接口/并发/通道/标准库/项目结构/测试', url: 'https://go.dev/doc/' },
    { id: 198, title: 'Go Web开发实战', cat: 'go', price: 13.9, rating: 4.5, students: 4200, tags: ['Go','Web'], desc: 'Gin/Echo/Fiber三大框架/中间件/ORM/WebSocket', url: 'https://gin-gonic.com/docs/' },
    { id: 199, title: 'Go微服务与gRPC', cat: 'go', price: 14.9, rating: 4.5, students: 2800, tags: ['Go','微服务'], desc: 'gRPC-Go/服务注册发现/链路追踪/熔断限流/容器化部署', url: 'https://grpc.io/docs/languages/go/' },
    { id: 200, title: 'Go CLI工具开发', cat: 'go', price: 10.9, rating: 4.3, students: 1900, tags: ['Go','CLI'], desc: 'Cobra/Viper/进度条/交互式CLI/跨平台编译/发布', url: 'https://cobra.dev/' },

    // ===== 面试/职场 (6) =====
    { id: 201, title: 'BAT大厂面试全攻略', cat: 'career', price: 14.9, rating: 4.7, students: 12000, tags: ['面试','大厂'], desc: '简历优化/项目包装/八股文/场景题/HR面/薪资谈判', url: 'https://github.com/CyC2018/CS-Notes' },
    { id: 202, title: '系统设计面试宝典', cat: 'career', price: 16.9, rating: 4.8, students: 8500, tags: ['系统设计','面试'], desc: '20+经典系统设计题：秒杀/IM/Feed/搜索/支付/短链', url: 'https://github.com/donnemartin/system-design-primer' },
    { id: 203, title: '程序员职业规划与发展', cat: 'career', price: 11.9, rating: 4.5, students: 6800, tags: ['职场','规划'], desc: '技术路线/管理路线/创业/副业/35岁危机应对策略', url: 'https://www.zhihu.com/topic/19550874' },
    { id: 204, title: '技术博客写作与影响力', cat: 'career', price: 9.9, rating: 4.3, students: 3200, tags: ['写作','个人品牌'], desc: '技术文章写作技巧/公众号运营/GitHub个人品牌/开源贡献', url: 'https://juejin.cn/' },

    // ===== 零基础入门 (6) =====
    { id: 205, title: '编程思维入门：从零开始学逻辑', cat: 'beginner', price: 9.9, rating: 4.6, students: 15000, tags: ['入门','思维'], desc: '不需要任何基础，培养编程思维/算法逻辑/问题分解能力', url: 'https://www.codecademy.com/' },
    { id: 206, title: '计算机基础速成课', cat: 'beginner', price: 11.9, rating: 4.5, students: 8200, tags: ['基础','CS'], desc: 'CS50精华版：二进制/CPU/内存/操作系统/网络/数据库概览', url: 'https://cs50.harvard.edu/' },
    { id: 207, title: 'Git与GitHub协作开发', cat: 'beginner', price: 9.9, rating: 4.6, students: 22000, tags: ['Git','入门'], desc: '掌握Git核心命令、分支策略、团队协作流程、GitHub高级功能', url: 'https://git-scm.com/book/zh/v2' },
    { id: 208, title: 'HTML+CSS零基础入门', cat: 'beginner', price: 9.9, rating: 4.5, students: 35000, tags: ['HTML','CSS'], desc: '从零开始学前端，HTML语义化+CSS布局+Flex/Grid+响应式设计', url: 'https://developer.mozilla.org/zh-CN/docs/Learn/HTML' },

    // ===== 硬件/嵌入式 (4) =====
    { id: 209, title: 'Arduino 创客入门', cat: 'hardware', price: 11.9, rating: 4.4, students: 3800, tags: ['Arduino','硬件'], desc: '传感器/电机/LED/物联网/智能家居DIY项目实战', url: 'https://www.arduino.cc/reference/en/' },
    { id: 210, title: '树莓派Linux开发实战', cat: 'hardware', price: 12.9, rating: 4.3, students: 2400, tags: ['树莓派','Linux'], desc: 'ARM Linux/GPIO/I2C/SPI/摄像头/家庭服务器搭建', url: 'https://www.raspberrypi.com/documentation/' },
  ],

  // ==================== 科技新闻 (50条) ====================
  techNews: [
    { id: 1, title: 'OpenAI发布GPT-5：推理能力再突破', cat: 'AI', date: '2026-08-18', summary: 'OpenAI正式发布GPT-5模型，在复杂推理、多模态理解和Agent任务上实现质的飞跃，上下文窗口扩展至200万token。', source: 'OpenAI官方', url: 'https://openai.com/blog' },
    { id: 2, title: 'Google DeepMind AlphaFold 3开源', cat: 'AI', date: '2026-08-15', summary: 'AlphaFold 3完整代码开源，可预测蛋白质-DNA-RNA-配体复合物结构，准确率提升至92%。', source: 'Nature', url: 'https://deepmind.google/discover/blog/' },
    { id: 3, title: 'Cloudflare Workers AI 支持本地模型部署', cat: '云原生', date: '2026-08-14', summary: 'Cloudflare推出Workers AI Local，允许开发者在边缘节点运行自定义AI模型，延迟降低80%。', source: 'Cloudflare Blog', url: 'https://blog.cloudflare.com/' },
    { id: 4, title: 'Rust 1.80 稳定版发布：异步Trait正式落地', cat: '编程语言', date: '2026-08-12', summary: 'Rust 1.80带来稳定的async trait、改进的错误信息和更快的编译速度，Cargo引入新的依赖解析算法。', source: 'Rust Blog', url: 'https://blog.rust-lang.org/' },
    { id: 5, title: 'Vue 3.5 发布：性能提升40%', cat: '前端', date: '2026-08-10', summary: 'Vue 3.5引入新的响应式系统优化、更好的Tree Shaking支持和SSR性能大幅提升。', source: 'Vue.js官方', url: 'https://vuejs.org/blog/' },
    { id: 6, title: 'Linux 6.10 内核发布：新调度器登场', cat: '操作系统', date: '2026-08-08', summary: 'Linux 6.10引入EEVDF调度器作为默认选项，替代CFS，在高负载场景下延迟降低30%。', source: 'Linus Torvalds', url: 'https://kernelnewbies.org/Linux_6.10' },
    { id: 7, title: '英伟达发布B200 GPU：AI训练新王者', cat: '硬件', date: '2026-08-05', summary: 'NVIDIA Blackwell B200 GPU正式量产，AI训练性能是H100的5倍，功耗降低25%。', source: 'NVIDIA', url: 'https://nvidianews.nvidia.com/' },
    { id: 8, title: '苹果M4 Ultra芯片发布：40核CPU+80核GPU', cat: '硬件', date: '2026-08-03', summary: 'Apple M4 Ultra采用台积电2nm工艺，单核性能提升35%，首次支持雷电5接口。', source: 'Apple', url: 'https://www.apple.com/newsroom/' },
    { id: 9, title: 'Kubernetes 1.31 发布：Sidecar正式GA', cat: '云原生', date: '2026-08-01', summary: 'K8s 1.31将Sidecar容器提升至GA状态，引入原生优雅终止支持和改进的Pod生命周期管理。', source: 'Kubernetes Blog', url: 'https://kubernetes.io/blog/' },
    { id: 10, title: 'GitHub Copilot X 支持全仓库理解', cat: 'AI', date: '2026-07-30', summary: 'GitHub Copilot X新增全仓库上下文理解能力，可跨文件进行代码生成和重构建议。', source: 'GitHub Blog', url: 'https://github.blog/' },
    { id: 11, title: 'TypeScript 5.6 发布：类型推断大升级', cat: '前端', date: '2026-07-28', summary: 'TS 5.6引入更智能的类型收窄、改进的泛型推导和新的--verbatim-module-syntax选项。', source: 'Microsoft', url: 'https://devblogs.microsoft.com/typescript/' },
    { id: 12, title: '中国开源生态报告2026：贡献者增长60%', cat: '开源', date: '2026-07-25', summary: '中国开发者在GitHub上的活跃度持续增长，Apache/Dubbo/Seata等项目全球影响力扩大。', source: '开源社', url: 'https://kaiyuanshe.cn/' },
    { id: 13, title: 'PostgreSQL 17 Beta发布：性能翻倍', cat: '数据库', date: '2026-07-22', summary: 'PG17引入增量备份、改进的BRIN索引和并行查询优化，TPC-H性能提升2.1倍。', source: 'PostgreSQL', url: 'https://www.postgresql.org/about/news/' },
    { id: 14, title: 'WebAssembly 2.0 标准正式确定', cat: 'Web', date: '2026-07-20', summary: 'WASM 2.0增加线程、异常处理、垃圾回收等核心特性，浏览器支持率已达95%。', source: 'W3C', url: 'https://www.w3.org/TR/wasm-core-2/' },
    { id: 15, title: 'Tesla FSD v13 端到端自动驾驶', cat: 'AI', date: '2026-07-18', summary: 'Tesla发布FSD v13，完全基于神经网络端到端控制，无需高精地图即可全球部署。', source: 'Tesla', url: 'https://www.tesla.com/AI' },
    { id: 16, title: '华为鸿蒙NEXT全面商用', cat: '操作系统', date: '2026-07-15', summary: 'HarmonyOS NEXT正式向消费者推送，原生鸿蒙应用超5000款，完全脱离AOSP。', source: '华为', url: 'https://developer.huawei.com/' },
    { id: 17, title: 'React 19.1 发布：Server Components稳定', cat: '前端', date: '2026-07-12', summary: 'React 19.1将Server Components标记为稳定API，新增useOptimistic和增强的Suspense。', source: 'Meta', url: 'https://react.dev/blog' },
    { id: 18, title: 'Docker Desktop 5.0 支持Wasm容器', cat: '容器', date: '2026-07-10', summary: 'Docker 5.0原生支持WebAssembly容器运行时，启动速度比传统容器快100倍。', source: 'Docker', url: 'https://www.docker.com/blog/' },
    { id: 19, title: '字节跳动开源ByteHouse：云原生数仓', cat: '大数据', date: '2026-07-08', summary: 'ByteDance开源ByteHouse，基于ClickHouse改造的云原生数据仓库，支持弹性扩缩容。', source: '字节跳动', url: 'https://github.com/bytehouse' },
    { id: 20, title: 'MIT发布新编程语言"Atlas"', cat: '编程语言', date: '2026-07-05', summary: 'MIT CSAIL实验室发布Atlas语言，主打线性类型+效应系统，专为安全并发设计。', source: 'MIT News', url: 'https://news.mit.edu/' },
    { id: 21, title: 'AWS Lambda 支持10000并发默认配额', cat: '云', date: '2026-07-03', summary: 'AWS将Lambda默认并发配额提升至10000，并推出新的SnapStart技术将冷启动降至5ms。', source: 'AWS', url: 'https://aws.amazon.com/blogs/aws/' },
    { id: 22, title: '中国量子计算机"九章四号"问世', cat: '硬件', date: '2026-07-01', summary: '中科大团队发布255光子量子计算机，在特定问题上比超算快10^24倍。', source: '中科大', url: 'https://www.ustc.edu.cn/' },
    { id: 23, title: 'Vite 6.0 发布：Rolldown作为默认打包器', cat: '前端', date: '2026-06-28', summary: 'Vite 6.0正式采用Rolldown替代Rollup，构建速度提升3-5倍，内存占用降低60%。', source: 'Vite', url: 'https://vitejs.dev/blog/' },
    { id: 24, title: 'Oracle Java 21 LTS 免费商用', cat: '编程语言', date: '2026-06-25', summary: 'Oracle宣布Java 21 LTS可免费用于生产环境，结束多年的商用收费争议。', source: 'Oracle', url: 'https://www.oracle.com/java/' },
    { id: 25, title: 'SpaceX星链直连手机服务全球商用', cat: '通信', date: '2026-06-22', summary: 'SpaceX Starlink Direct-to-Cell服务正式商用，支持普通手机直连卫星，覆盖全球。', source: 'SpaceX', url: 'https://www.spacex.com/' },
    { id: 26, title: 'Google发布量子AI芯片Willow', cat: 'AI', date: '2026-06-20', summary: 'Google发布105量子比特芯片Willow，在随机电路采样基准上实现指数级纠错突破。', source: 'Google AI', url: 'https://ai.google/discover/willow/' },
    { id: 27, title: 'Next.js 15 发布：Turbopack稳定版', cat: '前端', date: '2026-06-18', summary: 'Next.js 15将Turbopack标记为稳定，构建速度提升10倍，新增Partial Prerendering。', source: 'Vercel', url: 'https://nextjs.org/blog' },
    { id: 28, title: '国内首个AI程序员"飞算"通过图灵测试', cat: 'AI', date: '2026-06-15', summary: '飞算JavaAI程序员在多项编程任务中表现超越中级工程师，已接入多家企业开发流程。', source: '飞算科技', url: 'https://www.feisuanyz.com/' },
    { id: 29, title: 'Linux基金会推出AI安全认证', cat: '安全', date: '2026-06-12', summary: 'Linux基金会联合OWASP推出AI系统安全认证标准，覆盖模型安全、数据隐私和对抗攻击防护。', source: 'Linux Foundation', url: 'https://www.linuxfoundation.org/' },
    { id: 30, title: 'Bun 2.0 发布：兼容Node.js 22', cat: 'JavaScript', date: '2026-06-10', summary: 'Bun 2.0实现与Node.js 22的完整兼容，npm包安装速度比pnpm快3倍。', source: 'Bun', url: 'https://bun.sh/blog' },
    { id: 31, title: '中国首个开源基金会"开放原子"孵化50项目', cat: '开源', date: '2026-06-08', summary: '开放原子开源基金会已孵化50个毕业项目，包括OpenHarmony、TecentOS等重量级项目。', source: '开放原子', url: 'https://www.openatom.org/' },
    { id: 32, title: 'Intel 18A工艺量产：反超台积电？', cat: '硬件', date: '2026-06-05', summary: 'Intel 18A工艺（1.8nm等效）正式量产，采用RibbonFET和PowerVia技术，性能领先竞品15%。', source: 'Intel', url: 'https://www.intel.com/content/www/us/en/newsroom/' },
    { id: 33, title: 'Python 3.14 发布：自由线程默认开启', cat: '编程语言', date: '2026-06-03', summary: 'Python 3.14将free-threaded模式（无GIL）设为默认选项，多核性能提升3-5倍。', source: 'Python.org', url: 'https://python.org/downloads/' },
    { id: 34, title: 'Anthropic Claude 4.5 发布', cat: 'AI', date: '2026-06-01', summary: 'Claude 4.5在长文档理解和代码生成上超越GPT-5，新增200万token上下文和原生工具调用。', source: 'Anthropic', url: 'https://www.anthropic.com/news' },
    { id: 35, title: '全球IPv6普及率突破60%', cat: '网络', date: '2026-05-28', summary: '全球IPv6流量占比首次突破60%，中国IPv6活跃用户超10亿，美国接近全面覆盖。', source: 'APNIC', url: 'https://www.apnic.net/' },
    { id: 36, title: '固态电池量产：电动车续航破1000km', cat: '新能源', date: '2026-05-25', summary: '宁德时代发布量产固态电池，能量密度500Wh/kg，充电10分钟续航800km。', source: 'CATL', url: 'https://www.catl.com/' },
    { id: 37, title: 'WebGPU 2.0 标准发布', cat: 'Web', date: '2026-05-22', summary: 'WebGPU 2.0增加Mesh Shading、Ray Tracing和Video Textures支持，浏览器图形能力比肩原生。', source: 'W3C', url: 'https://gpuweb.github.io/gpuweb/' },
    { id: 38, title: '阿里云通义千问3.0开源', cat: 'AI', date: '2026-05-20', summary: '阿里通义千问3.0开源全部权重，支持MoE架构，中文理解能力全球第一。', source: '阿里云', url: 'https://tongyi.aliyun.com/' },
    { id: 39, title: '全球首个6G标准框架发布', cat: '通信', date: '2026-05-18', summary: 'ITU发布6G标准框架，目标速率1Tbps，延迟0.1ms，预计2030年商用。', source: 'ITU', url: 'https://www.itu.int/' },
    { id: 40, title: 'MongoDB 8.0 发布：原生向量搜索', cat: '数据库', date: '2026-05-15', summary: 'MongoDB 8.0内置原生向量搜索能力，无需额外插件即可构建AI应用的知识库。', source: 'MongoDB', url: 'https://www.mongodb.com/blog' },
    { id: 41, title: 'Swift 6 发布：数据竞争安全', cat: '编程语言', date: '2026-05-12', summary: 'Swift 6引入严格并发检查，在编译期消除数据竞争，Apple全平台统一开发体验。', source: 'Apple', url: 'https://swift.org/blog/' },
    { id: 42, title: '全球黑客大赛Pwn2Own 2026战报', cat: '安全', date: '2026-05-10', summary: '中国战队"天虞实验室"斩获Pwn2Own总冠军，攻破Chrome/Windows/iOS获50万美元奖金。', source: 'Zero Day Initiative', url: 'https://www.zerodayinitiative.com/' },
    { id: 43, title: 'Stable Diffusion 4.0 发布', cat: 'AI', date: '2026-05-08', summary: 'SD 4.0支持10秒视频生成、4K图像输出和实时交互式编辑，完全开源可商用。', source: 'Stability AI', url: 'https://stability.ai/' },
    { id: 44, title: '中国自研数据库OceanBase登顶TPC-C', cat: '数据库', date: '2026-05-05', summary: '蚂蚁OceanBase以15亿tpmC刷新TPC-C世界纪录，连续第三次登顶。', source: '蚂蚁集团', url: 'https://www.oceanbase.com/' },
    { id: 45, title: 'Brave浏览器份额突破20%', cat: 'Web', date: '2026-05-03', summary: 'Brave浏览器全球市场份额达20%，隐私保护+内置AI助手+IPFS支持成核心竞争力。', source: 'Brave', url: 'https://brave.com/blog/' },
    { id: 46, title: '全球首个AI法官在中国试点', cat: 'AI', date: '2026-04-30', summary: '杭州互联网法院试点AI辅助审判系统，可自动分析证据链、生成判决书初稿，准确率97%。', source: '杭州互联网法院', url: 'https://www.netcourt.gov.cn/' },
    { id: 47, title: 'GitHub用户突破2亿', cat: '开源', date: '2026-04-28', summary: 'GitHub全球注册开发者突破2亿，中国开发者占比达18%，年增长率全球第一。', source: 'GitHub', url: 'https://github.blog/' },
    { id: 48, title: '全球芯片禁令升级：RISC-V成新焦点', cat: '硬件', date: '2026-04-25', summary: '美国扩大对华芯片出口管制，中国加速RISC-V生态建设，平头哥玄铁系列出货超50亿颗。', source: '阿里巴巴', url: 'https://www.t-head.cn/' },
    { id: 49, title: 'Meta发布Llama 4开源大模型', cat: 'AI', date: '2026-04-22', summary: 'Meta Llama 4 405B参数开源，支持128K上下文，在多语言任务上超越GPT-4o。', source: 'Meta AI', url: 'https://ai.meta.com/blog/' },
    { id: 50, title: '全球互联网用户突破60亿', cat: '互联网', date: '2026-04-20', summary: '全球互联网用户突破60亿，非洲和东南亚成为增长主力，星链贡献10%新增连接。', source: 'ITU', url: 'https://www.itu.int/itu-d/' },
  ],

  // ==================== 干货资源 ====================
  resources: [
    { id: 1, name: 'MDN Web Docs', desc: 'Mozilla官方Web技术文档，HTML/CSS/JS最权威参考', url: 'https://developer.mozilla.org/zh-CN/', icon: '📘', tag: '必看', free: true },
    { id: 2, name: 'roadmap.sh', desc: '开发者学习路线图，前端/后端/DevOps等全方向覆盖', url: 'https://roadmap.sh/', icon: '🗺️', tag: '必看', free: true },
    { id: 3, name: '阮一峰博客', desc: '国内最优质的技术博客之一，ES6/周刊/算法经典', url: 'https://www.ruanyifeng.com/blog/', icon: '✍️', tag: '必看', free: true },
    { id: 4, name: '菜鸟教程', desc: '中文编程入门首选，覆盖几乎所有编程语言基础', url: 'https://www.runoob.com/', icon: '🐦', tag: '入门', free: true },
    { id: 5, name: 'freeCodeCamp', desc: '免费编程学习平台，完成挑战获得认证', url: 'https://www.freecodecamp.org/', icon: '⚡', tag: '免费认证', free: true },
    { id: 6, name: 'Stack Overflow', desc: '全球最大编程问答社区，遇到bug先搜这里', url: 'https://stackoverflow.com/', icon: '💬', tag: '必看', free: true },
    { id: 7, name: 'GitHub Docs', desc: 'GitHub官方文档，Actions/CI/CD/协作开发指南', url: 'https://docs.github.com/', icon: '🐙', tag: '免费', free: true },
    { id: 8, name: 'Python官方文档', desc: 'Python官方文档中文版，标准库全覆盖', url: 'https://docs.python.org/zh-cn/3/', icon: '🐍', tag: '免费', free: true },
    { id: 9, name: 'Docker官方文档', desc: '容器化技术官方指南，从入门到生产部署', url: 'https://docs.docker.com/', icon: '🐳', tag: '免费', free: true },
    { id: 10, name: 'Kubernetes官方文档', desc: 'K8s官方学习路径，云原生必读', url: 'https://kubernetes.io/zh-cn/docs/', icon: '☸️', tag: '免费', free: true },
    { id: 11, name: 'LeetCode', desc: '算法刷题平台，面试准备必备', url: 'https://leetcode.cn/', icon: '🧩', tag: '面试', free: true },
    { id: 12, name: 'DevDocs', desc: '聚合100+技术文档，离线搜索，极速查阅', url: 'https://devdocs.io/', icon: '📚', tag: '工具', free: true },
  ],

  // ==================== GitHub精选 ====================
  githubRepos: [
    { name: 'freeCodeCamp', desc: '免费编程学习平台，数百万人在用', stars: '400k+', lang: 'TypeScript', tag: '学习', url: 'https://github.com/freeCodeCamp/freeCodeCamp' },
    { name: 'system-design-primer', desc: '系统设计学习指南，面试必备', stars: '280k+', lang: 'Java', tag: '面试', url: 'https://github.com/donnemartin/system-design-primer' },
    { name: 'awesome', desc: '精选资源列表的终极合集', stars: '310k+', lang: 'Various', tag: '资源', url: 'https://github.com/sindresorhus/awesome' },
    { name: 'developer-roadmap', desc: '开发者学习路线图', stars: '290k+', lang: 'TypeScript', tag: '学习', url: 'https://github.com/kamranahmedse/developer-roadmap' },
    { name: 'build-your-own-x', desc: '从零构建各种技术系统', stars: '290k+', lang: 'Various', tag: '实践', url: 'https://github.com/codecrafters-io/build-your-own-x' },
    { name: 'public-apis', desc: '免费公共API合集', stars: '310k+', lang: 'Python', tag: '资源', url: 'https://github.com/public-apis/public-apis' },
    { name: 'tech-interview-handbook', desc: '技术面试手册', stars: '115k+', lang: 'Various', tag: '面试', url: 'https://github.com/yangshun/tech-interview-handbook' },
    { name: 'clean-code-javascript', desc: 'JavaScript整洁代码指南', stars: '90k+', lang: 'JavaScript', tag: '规范', url: 'https://github.com/ryanmcdermott/clean-code-javascript' },
    { name: 'kubernetes', desc: '容器编排王者', stars: '109k+', lang: 'Go', tag: 'DevOps', url: 'https://github.com/kubernetes/kubernetes' },
    { name: 'tensorflow', desc: 'Google深度学习框架', stars: '184k+', lang: 'C++', tag: 'AI', url: 'https://github.com/tensorflow/tensorflow' },
    { name: 'spring-boot', desc: 'Java企业级开发框架', stars: '74k+', lang: 'Java', tag: '后端', url: 'https://github.com/spring-projects/spring-boot' },
    { name: 'react', desc: 'Meta前端UI框架', stars: '226k+', lang: 'JavaScript', tag: '前端', url: 'https://github.com/facebook/react' },
  ],

  // ==================== B站精选 ====================
  bilibiliVideos: [
    { title: 'Python零基础入门到精通', author: '小甲鱼', views: '580万', danmaku: '8.2万', url: 'https://www.bilibili.com/video/BV1c4411e77d', bvid: 'BV1c4411e77d' },
    { title: 'C语言程序设计（翁恺）', author: '浙江大学', views: '420万', danmaku: '5.6万', url: 'https://www.bilibili.com/video/BV19x4117voW', bvid: 'BV19x4117voW' },
    { title: 'Java零基础教程（韩顺平）', author: '韩顺平', views: '890万', danmaku: '12万', url: 'https://www.bilibili.com/video/BV1fh411y7R8', bvid: 'BV1fh411y7R8' },
    { title: '尚硅谷React全家桶教程', author: '尚硅谷', views: '320万', danmaku: '4.8万', url: 'https://www.bilibili.com/video/BV18b4y1y7xx', bvid: 'BV18b4y1y7xx' },
    { title: '黑马程序员前端基础', author: '黑马程序员', views: '650万', danmaku: '9.3万', url: 'https://www.bilibili.com/video/BV1nW411L7Nf', bvid: 'BV1nW411L7Nf' },
    { title: '数据结构与算法（王道）', author: '王道考研', views: '280万', danmaku: '3.5万', url: 'https://www.bilibili.com/video/BV1b7411N798', bvid: 'BV1b7411N798' },
    { title: 'Linux入门到精通', author: '狂神说Java', views: '190万', danmaku: '2.8万', url: 'https://www.bilibili.com/video/BV1WY411w7aS', bvid: 'BV1WY411w7aS' },
    { title: 'Docker+K8s容器化实战', author: '尚硅谷', views: '150万', danmaku: '2.1万', url: 'https://www.bilibili.com/video/BV1uK411n7kN', bvid: 'BV1uK411n7kN' },
    { title: 'Python爬虫实战', author: '崔庆才', views: '230万', danmaku: '3.2万', url: 'https://www.bilibili.com/video/BV1Yh411o7S5', bvid: 'BV1Yh411o7S5' },
    { title: 'Spring Boot 3实战教程', author: '雷丰阳', views: '310万', danmaku: '4.5万', url: 'https://www.bilibili.com/video/BV1Td4y1m7Ts', bvid: 'BV1Td4y1m7Ts' },
    { title: 'AI大模型应用开发', author: '李沐', views: '180万', danmaku: '2.6万', url: 'https://www.bilibili.com/video/BV1Ms411p7BM', bvid: 'BV1Ms411p7BM' },
    { title: 'Git与GitHub协作开发', author: 'CodeSheep', views: '120万', danmaku: '1.8万', url: 'https://www.bilibili.com/video/BV1FE411P7B3', bvid: 'BV1FE411P7B3' },
  ],

  // ==================== 技术排行 ====================
  rankings: [
    { rank: 1, name: 'Python', score: 98, reason: 'AI/ML时代第一语言，数据科学/自动化通吃', url: 'https://www.python.org/' },
    { rank: 2, name: 'AI/大模型开发', score: 97, reason: '2026最热方向，薪资天花板最高', url: 'https://platform.openai.com/docs' },
    { rank: 3, name: 'JavaScript/TS', score: 95, reason: 'Web开发不可替代，前后端统一', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
    { rank: 4, name: 'Rust', score: 94, reason: '内存安全+零成本抽象，系统编程未来', url: 'https://doc.rust-lang.org/book/' },
    { rank: 5, name: 'Go语言', score: 93, reason: '云原生时代新星，高并发王者', url: 'https://go.dev/' },
    { rank: 6, name: '系统设计能力', score: 92, reason: '从码农到架构师的必经之路', url: 'https://github.com/donnemartin/system-design-primer' },
    { rank: 7, name: 'Java/Spring', score: 91, reason: '企业级开发霸主，金融/电商首选', url: 'https://spring.io/' },
    { rank: 8, name: 'DevOps/云原生', score: 90, reason: 'Docker+K8s+AWS，不懂运维越来越难', url: 'https://kubernetes.io/' },
    { rank: 9, name: '网络安全', score: 89, reason: 'AI时代安全需求暴增，人才缺口百万级', url: 'https://owasp.org/' },
    { rank: 10, name: 'SQL/数据分析', score: 87, reason: '数据驱动决策时代的基本功', url: 'https://www.postgresql.org/docs/' },
  ],

  // ==================== 学习路线 ====================
  roadmaps: [
    { id: 1, title: '前端工程师路线', icon: '🎨', months: '6-9个月', steps: [
      { phase: '基础阶段', desc: 'HTML/CSS/JS基础、ES6+、Git' },
      { phase: '框架阶段', desc: 'React/Vue、TypeScript、状态管理' },
      { phase: '工程化阶段', desc: 'Webpack/Vite、CI/CD、测试' },
      { phase: '架构阶段', desc: '微前端、性能优化、SSR/SSG' },
    ], url: 'https://roadmap.sh/frontend' },
    { id: 2, title: '后端工程师路线', icon: '⚙️', months: '8-12个月', steps: [
      { phase: '编程语言', desc: 'Java/Python/Go 选一门深入' },
      { phase: '数据库与缓存', desc: 'MySQL/Redis/MongoDB' },
      { phase: '微服务架构', desc: 'Spring Cloud/gRPC/K8s' },
      { phase: '高并发与分布式', desc: '消息队列/限流熔断/分库分表' },
    ], url: 'https://roadmap.sh/backend' },
    { id: 3, title: 'AI工程师路线', icon: '🤖', months: '9-12个月', steps: [
      { phase: '数学基础', desc: '线性代数/概率论/微积分' },
      { phase: '机器学习', desc: 'Scikit-learn/经典算法/特征工程' },
      { phase: '深度学习', desc: 'PyTorch/TensorFlow/CNN/RNN' },
      { phase: '大模型应用', desc: 'LLM API/RAG/Agent/微调' },
    ], url: 'https://roadmap.sh/ai-data-scientist' },
    { id: 4, title: '全栈工程师路线', icon: '🛡️', months: '10-14个月', steps: [
      { phase: '前端基础', desc: 'HTML/CSS/JS/React或Vue' },
      { phase: '后端开发', desc: 'Node.js/Python/Java + 数据库' },
      { phase: 'DevOps', desc: 'Docker/K8s/CI-CD/云服务器' },
      { phase: '项目实战', desc: '全栈项目部署/性能优化/安全' },
    ], url: 'https://roadmap.sh/full-stack' },
    { id: 5, title: '云原生架构师路线', icon: '☁️', months: '12-18个月', steps: [
      { phase: '容器化基础', desc: 'Docker/Kubernetes核心概念' },
      { phase: '微服务治理', desc: '服务网格/Istio/API网关' },
      { phase: '可观测性', desc: 'Prometheus/Grafana/ELK' },
      { phase: '架构设计', desc: '高可用/容灾/混沌工程' },
    ], url: 'https://roadmap.sh/devops' },
  ],

  // ==================== 收款信息 ====================
  payment: {
   收款名称: '愿行无止之境svcliny',
   收款备注: 'rosvcliny.odm.dsl(*方)',
   微信收款码: 'assets/wechat-pay-green.png',
   备用二维码: 'assets/qrcode-wechat.png',
   支付宝二维码: 'assets/qrcode-alipay.png',
   银行转账二维码: 'assets/qrcode-bank.png',
    SVG内嵌二维码: true,
   HMAC密钥: 'TechHub-Pro-v6-2026-svcliny-secret-key',
   订单超时分钟: 15,
   最大重试次数: 5,
   VIP月费: 99,
   VIP年费: 499,
  },

  // ==================== 站点配置 ====================
  site: {
   名称: 'TechHub Pro',
   版本: 'v6.0 Beta',
   作者: '愿行无止之境 svcliny',
   GitHub: 'https://github.com/svcpower100510/svcpower-web',
   B站: 'https://b23.tv/Sjdb2WI',
   邮箱: 'vhkex@outlook.com',
   域名: 'techhub-svcliny.pages.dev',
   版权: 'Copyright 2026 svcliny (方). All Rights Reserved.',
   协议: 'Apache License 2.0',
  },
};

// 兼容旧引用
const CoursesData = TechHubData.courses;
const ResourcesData = TechHubData.resources;
const GitHubData = TechHubData.githubRepos;
const BilibiliData = TechHubData.bilibiliVideos;
const RankingsData = TechHubData.rankings;
const RoadmapsData = TechHubData.roadmaps;
const TechNewsData = TechHubData.techNews;
const PaymentConfig = TechHubData.payment;
const SiteConfig = TechHubData.site;
const UserSystemConfig = TechHubData.userSystem;
