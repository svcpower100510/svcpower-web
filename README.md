# TechHub Pro v5.0

> 愿行无止之境 svcliny 的科技区精品课程付费平台
> 
> 🌐 在线访问：https://techhub-svcliny.pages.dev
> 
> 📧 联系邮箱：vhkex@outlook.com
> 
> 📦 GitHub：https://github.com/svcpower100510/svcpower-web
> 
> ▶ B站主页：https://b23.tv/Sjdb2WI

---

## ✨ 核心特性

### 📚 120 门课程，50% 免费 / 50% 付费（60 + 60）

| 类别 | 数量 | 价格区间 | 说明 |
|------|------|----------|------|
| Web安全 | 16 | ¥0-90 | OWASP/SQL注入/XSS/Burp Suite/代码审计 |
| 渗透测试 | 20 | ¥0-90 | Kali/Metasploit/Nmap/内网渗透/云渗透 |
| CTF竞赛 | 9 | ¥0-90 | PWN/Reverse/Crypto/Misc/Web CTF |
| 逆向工程 | 5 | ¥0-90 | IDA Pro/Ghidra/Android/iOS/固件 |
| 密码学 | 3 | ¥0-75 | TLS/区块链/密码协议 |
| 红蓝对抗 | 5 | ¥0-90 | SIEM/ATT&CK/应急响应/EDR |
| 恶意代码 | 3 | ¥0-65 | 恶意软件分析/Rootkit/勒索软件 |
| 合规治理 | 4 | ¥0-45 | 等保/GDPR/ISO 27001/DevSecOps |
| 数字取证 | 2 | ¥0-35 | 内存/磁盘/移动端取证 |
| Python | 7 | ¥0-75 | 入门/数据分析/爬虫/安全脚本/ML |
| JavaScript | 4 | ¥0-55 | JS核心/TS/Node/工程化 |
| 前端开发 | 5 | ¥0-55 | React/Vue/CSS/性能优化 |
| 后端开发 | 5 | ¥0-90 | Java/Go/Rust/C++/Spring |
| 数据库 | 5 | ¥0-55 | MySQL/Redis/MongoDB/PG |
| DevOps | 7 | ¥0-65 | Docker/K8s/CI-CD/AWS/Linux |
| AI/大模型 | 6 | ¥0-90 | LangChain/RAG/Agent/微调 |
| 系统设计 | 3 | ¥0-75 | 分布式/高并发/面试 |
| 网络基础 | 3 | ¥0-35 | TCP/IP/Wireshark/HTTP3 |
| 操作系统 | 2 | ¥0-25 | Linux内核/Windows |
| Git工具链 | 3 | ¥0-15 | Git/Vim/正则 |
| 求职面试 | 3 | ¥0-25 | 算法/简历/面试话术 |

---

### 🔒 三轮安全核验支付系统

| 轮次 | 校验内容 | 防什么 |
|------|----------|--------|
| 第1轮 | 金额/课程ID/订单号格式/15分钟超时/重复购买 | 篡改金额、伪造订单 |
| 第2轮 | HMAC-SHA256 签名 + 订单号去重 | 重放攻击、签名伪造 |
| 第3轮 | 服务端幂等 + DB确认 + 线程锁 | 并发重复确认、数据竞争 |

- 最多 5 次重试，超限锁定订单
- 订单号格式：`TH-YYYYMMDDhhmmss-XXXXXX`
- 防篡改校验和（localStorage 写入时计算）
- 收款码 SVG 内嵌 + PNG 降级链 + Base64 终极降级，**100% 可用**

---

### 🔗 全站链接打通（每个按钮都有用）

| 栏目 | 链接目标 | 打开方式 |
|------|----------|----------|
| B站精选 (12个) | 真实B站视频 BV号 | 新窗口 `target="_blank"` |
| GitHub精选 (12个) | 真实GitHub仓库URL | 新窗口 `rel="noopener"` |
| 干货资源 (12个) | MDN/roadmap/OWASP/TryHackMe等 | 新窗口 |
| 技术排行 (10项) | 官方文档(Python/Go/Spring等) | 排行右侧↗按钮 |
| 学习路线 (5条) | roadmap.sh详细路线图 | 路线卡片右侧按钮 |
| 课程卡片 (120门) | 付费后自动跳转 `redirectUrl` | 见下方流程 |

#### 付费后自动跳转流程

```
用户点击"购买" → 三轮核验弹窗 → 展示收款码
  → 用户扫码支付 → 点击"我已完成支付"
  → 第1轮校验 ✅ → 第2轮签名 ✅ → 第3轮服务端 ✅
  → 弹窗"支付成功！正在跳转..."
  → 3秒后自动 window.open(课程redirectUrl)
  → 同时"开始学习"按钮可手动跳转
```

---

### 💰 定价体系（¥0 ~ ¥90）

| 价格 | 课程类型 | 示例 |
|------|----------|------|
| 免费 (60门) | 入门基础/工具入门/社区资源 | Git、HTML+CSS、Kali入门、CTF入门 |
| ¥5-15 (约20门) | 初级实战/单点技能 | Web安全基础、Nmap入门、TLS协议 |
| ¥25-45 (约20门) | 中级进阶/框架实战 | React全家桶、Python爬虫、内网渗透 |
| ¥55-75 (约15门) | 高级专题/面试向 | 系统设计、Node.js后端、移动端取证 |
| ¥85-90 (约5门) | 顶级/爆款/专家级 | Java架构师、AI大模型、Active Directory攻防 |

---

### 🖼️ 收款码（2026年8月更新）

- **唯一有效收款人**：愿行无止之境 svcliny
- **账户标识**：rosvcliny.odm.dsl(*方)
- **收款方式**：微信支付 / 支付宝 / 银行转账
- **加载策略**：PNG → 相对路径 → SVG → 推荐图 → CDN → Base64（6级降级）
- **防替换**：Canvas指纹校验 + 图片尺寸校验

---

### 📜 版权信息

```
© 2026 svcliny (方). All Rights Reserved.
Apache License 2.0 开源协议

域名：techhub-svcliny.pages.dev
GitHub：@svcpower100510
B站：科技区 svcliny
邮箱：vhkex@outlook.com

本网站所有课程内容均受版权保护。
未经授权不得转载、分发或用于商业用途。
付费课程购买后永久有效，虚拟商品一经售出概不退换。
```

---

## 🏗️ 项目结构

```
TechHub-Pro/
├── index.html              # 网站入口
├── README.md               # 本文件
├── LICENSE                 # Apache 2.0
├── compile.sh              # Java编译脚本
├── test-all.js             # 全量测试 (82项)
├── test-node.js            # Node端测试
├── test-runner.html        # 浏览器测试页面
├── CompileCheck.java       # Java编译检查
├── assets/
│   ├── qrcode-wechat-pay.png     # 微信收款码PNG
│   ├── wechat-pay-recommend.png  # 微信支付推荐图
│   └── wechat-pay-recommend.svg  # SVG内嵌收款码
├── css/
│   ├── style.css           # 主样式（深色/浅色双主题）
│   ├── animations.css      # 动画效果
│   ├── payment.css         # 支付弹窗样式
│   └── utilities.css       # 工具类
├── js/
│   ├── data.js             # 全站数据（B站/GitHub/资源/排行/路线/收款码）
│   ├── main.js             # 核心逻辑（渲染/筛选/主题/跳转/版权）
│   ├── payment.js          # 三轮核验支付系统
│   ├── animations.js       # Canvas粒子/3D倾斜/滚动入场
│   ├── api-client.js       # 后端API客户端
│   ├── analytics.js        # 访问统计
│   └── seo.js              # SEO优化
├── data/
│   ├── courses.json        # 聚合课程数据（120门）
│   ├── courses-index.json  # 课程索引
│   ├── stats.json          # 统计数据
│   └── courses-*.json     # 分类课程文件（21个分类）
├── server/                 # Java后端
│   ├── Application.java
│   ├── TechHubServer.java
│   ├── DatabaseUtil.java
│   ├── CourseService.java
│   ├── PaymentService.java
│   └── Course.java
├── lib/                    # Java JSON库
│   ├── JSONObject.java
│   └── JSONArray.java
└── docs/                   # API文档
    └── api/
        ├── authentication.html
        ├── bilibili-api.html
        ├── changelog.html
        ├── courses-api.html
        ├── deployment.html
        ├── errors.html
        └── faq.html
```

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 原生JavaScript（无框架依赖）、CSS3变量主题、Canvas粒子 |
| 后端 | Java 11+ Socket HTTP服务器、SQLite、RESTful API |
| 部署 | Cloudflare Pages 全球CDN |
| 安全 | HMAC-SHA256、CSP头、防篡改校验和、三轮核验 |

---

## 🚀 部署指南

### 前端（Cloudflare Pages）

```bash
# 1. 克隆仓库
git clone https://github.com/svcpower100510/svcpower-web.git
cd svcpower-web

# 2. 推送到GitHub（触发自动部署）
git add .
git commit -m "TechHub Pro v5.0 更新"
git push origin main

# 3. Cloudflare Pages 自动构建部署
# 访问 https://techhub-svcliny.pages.dev
```

### 后端 Java（可选，提供REST API）

```bash
# 编译
chmod +x compile.sh
./compile.sh

# 运行
java -cp ".:lib/*" Application

# API地址
curl http://localhost:8080/api/courses
curl http://localhost:8080/api/bilibili
curl http://localhost:8080/api/github
```

---

## 📋 API端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/courses` | GET | 获取课程列表 |
| `/api/courses?cat=web-security` | GET | 按分类筛选 |
| `/api/courses/:id` | GET | 获取单门课程详情 |
| `/api/resources` | GET | 获取资源列表 |
| `/api/rankings` | GET | 获取排行榜 |
| `/api/github` | GET | 获取GitHub仓库 |
| `/api/bilibili` | GET | 获取B站视频 |
| `/api/paths` | GET | 获取学习路线 |
| `/api/search?q=python` | GET | 搜索课程 |
| `/api/payment/verify` | POST | 支付验证 |
| `/api/health` | GET | 健康检查 |

---

## 📊 数据统计

| 指标 | 数值 |
|------|------|
| 总课程数 | 120 门 |
| 免费课程 | 60 门 (50%) |
| 付费课程 | 60 门 (50%) |
| B站精选 | 12 个视频 |
| GitHub精选 | 12 个仓库 |
| 干货资源 | 12 个链接 |
| 技术排行 | 10 项 |
| 学习路线 | 5 条 |
| 技术分类 | 21 个 |
| 价格区间 | ¥0 ~ ¥90 |
| 测试通过率 | 82/82 (100%) |

---

## 🔐 安全特性

- [x] CSP (Content-Security-Policy) 头
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: SAMEORIGIN
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] HMAC-SHA256 签名校验
- [x] 防重放攻击（15分钟窗口）
- [x] 防篡改校验和
- [x] 幂等性检查
- [x] 订单号格式校验
- [x] 防重复购买
- [x] 收款码指纹校验
- [x] 6级降级链保证收款码100%可用
- [x] 控制台版权警告
- [x] 右键/复制保护（课程详情区）

---

## 📜 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v5.0 | 2026-08 | 120门课程/收款码更新/6级降级/链接全打通/最终打包 |
| v4.0 | 2026-07 | 三轮核验/动态数据加载/API分离/版权保护 |
| v3.0 | 2026-06 | 付费跳转/B站GitHub链接/收款码修复 |
| v2.0 | 2026-05 | 支付系统/深浅主题/响应式 |
| v1.0 | 2026-04 | 初始版本/静态页面 |

---

## ⚖️ 法律声明

1. 本网站课程内容版权归 svcliny (方) 所有
2. Apache License 2.0 仅适用于**网站源代码**
3. 课程内容（视频/文档/教程）为**独立版权**，未经授权不得转载
4. 虚拟商品一经售出概不退换
5. 用户支付即视为同意上述条款

---

**Made with ❤️ by svcliny**
**© 2026 愿行无止之境 svcliny. All Rights Reserved.**
