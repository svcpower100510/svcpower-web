# TechHub Pro v6.0 正式版

> 科技区精品课程付费平台 — 愿行无止之境 svcliny

## ✨ 版本亮点（v6.0 正式版）

- **200 门精品课程**，21 个技术分类，价格统一 **¥9.9 ~ ¥19.9**，全部付费
- **用户系统**：注册 / 登录 / 会话管理，密码强度策略（大小写+数字+特殊字符）
- **防暴力破解**：密码错误 5 次锁定 30 分钟；每小时最多注册 3 次
- **VIP 会员**：月度 ¥99 / 年度 ¥499，VIP 畅听全部 200 门；普通用户免费畅听 100 门
- **三轮安全核验支付**：订单完整性 → HMAC-SHA256 签名 → 服务端确认 + 幂等
- **收款码 6 级降级链**：PNG → 相对路径 → 主域名 → CDN，确保 100% 可用
- **付费后自动跳转**：三轮核验通过 → 自动 `window.open(redirectUrl)` 解锁学习页
- **全部栏目链接打通**：B站（12 个真实 BV 号）/ GitHub（12 个真实仓库）/ 资源（12 个验证链接）/ 排行（官方文档）/ 路线（roadmap.sh）
- **50 条科技新闻**：AI / 前端 / 后端 / 安全 / 云原生 / 开源 / 硬件 / 行业
- **版权保护**：禁止右键复制课程内容，控制台版权警告，CSP 安全头
- **双主题**：深色 / 浅色 CSS 变量切换，localStorage 记忆

## 📂 项目结构

```
TechHub-Pro/
├── index.html              # 网站入口（串联全部栏目）
├── css/
│   ├── style.css          # 主样式（深色/浅色双主题 + 响应式）
│   ├── animations.css     # 入场/滚动进度动画
│   ├── auth.css           # 用户认证与面板样式
│   └── payment.css        # 支付弹窗/二维码/Toast 样式
├── js/
│   ├── config.js          # 全局配置（价格/用户/支付/收款信息）
│   ├── data.js            # 全站数据（200课程/资源/排行/GitHub/B站/新闻/路线）
│   ├── auth.js            # 用户认证（注册/登录/防爆破/防批量注册）
│   ├── payment.js         # 三轮核验支付 + 收款码降级 + 自动跳转
│   ├── main.js            # 核心逻辑（渲染/筛选/主题/导航/用户面板/详情）
│   └── animations.js      # Canvas 粒子背景/3D 倾斜/鼠标光晕/数字增长
├── server/                # Java 11 后端
│   ├── Application.java   # 启动类 + 优雅关闭
│   ├── TechHubServer.java # HTTP 服务器 + REST API + 静态文件 + CORS/安全头
│   ├── DatabaseUtil.java  # SQLite 连接池 + 建表
│   ├── CourseService.java # 课程 CRUD/搜索/统计/数据种子
│   ├── PaymentService.java# 订单创建/三轮核验/支付确认/幂等
│   └── DataStore.java     # 静态数据层（无外部 JSON 依赖，手写 JSON）
├── assets/                # 收款码 PNG（微信/支付宝/银行/绿色推荐图/favicon）
├── lib/                   # Java JSON 库 + SQLite JDBC 驱动占位
├── compile.sh             # Java 编译脚本
├── run.sh                 # 运行脚本
├── LICENSE                # Apache License 2.0
└── README.md
```

## 🛠️ 技术栈

- **前端**：原生 JavaScript（无框架依赖）、CSS3 变量主题、Canvas 粒子
- **后端**：Java 11+ Socket HTTP 服务器、SQLite、RESTful API
- **部署**：Cloudflare Pages 全球 CDN（前端静态托管）+ 可选 Java 后端
- **安全**：HMAC-SHA256、CSP 头、防篡改、三轮核验、防暴力破解

## 🚀 快速开始

### 前端（推荐，直接部署）

```bash
# 方式 1：浏览器直接打开 index.html
# 方式 2：本地服务器预览
python3 -m http.server 3000
# 访问 http://localhost:3000
```

### 推送到 GitHub 自动部署（Cloudflare Pages）

```bash
cd TechHub-Pro
git init && git add .
git commit -m "TechHub Pro v6.0 正式版"
git remote add origin https://github.com/svcpower100510/svcpower-web.git
git push -u origin main
# Cloudflare Pages 自动构建 → techhub-svcliny.pages.dev
```

### 后端 Java（需 JDK 11+ 与 sqlite-jdbc.jar）

```bash
# 将真实的 sqlite-jdbc-3.42.0.jar 放入 lib/ 覆盖占位文件
chmod +x compile.sh run.sh
./compile.sh          # 编译所有 Java 源文件
./run.sh              # 启动服务器（默认端口 8080）
# 访问 http://localhost:8080
# API 示例：http://localhost:8080/api/courses
```

## 📋 REST API 端点

| 端点 | 方法 | 说明 |
|---|---|---|
| `/api/courses` | GET | 获取课程列表 |
| `/api/search?q=` | GET | 搜索课程 |
| `/api/resources` | GET | 干货资源 |
| `/api/rankings` | GET | 技术含金量排行 |
| `/api/github` | GET | GitHub 精选仓库 |
| `/api/bilibili` | GET | B站优质教程 |
| `/api/roadmaps` | GET | 学习路线 |
| `/api/news` | GET | 科技新闻 |
| `/api/stats` | GET | 课程统计 |
| `/api/payment/info` | GET | 收款信息 |
| `/api/payment/create` | GET | 创建订单（?courseId=&userId=） |
| `/api/payment/verify` | POST | 支付验证 |
| `/api/health` | GET | 健康检查 |

## 💰 定价体系（v6.0 统一）

| 项目 | 说明 |
|---|---|
| 课程价格 | ¥9.9 ~ ¥19.9（全部付费） |
| 普通用户 | 免费畅听 100 门，超出升级 VIP |
| VIP 月度 | ¥99 / 月，畅听全部 200 门 |
| VIP 年度 | ¥499 / 年（省 ¥689），畅听全部 200 门 |

## 🔒 收款保障

- 收款码为 **svcliny 个人微信收款码**（PNG + SVG 双重保障 + 6 级降级链）
- 用户扫码 = 直接给微信转账，**不经过任何第三方**，钱一定到账
- 订单号后 4 位作为备注，方便在微信账单里核对
- 前端三轮核验仅控制「是否放行课程链接」，不影响收款

## © 版权声明

```
Copyright 2026 svcliny (方). All Rights Reserved.
本网站所有课程内容均受版权保护，未经授权不得转载、分发或用于商业用途。
付费课程购买后永久有效，虚拟商品一经售出概不退换。
网站代码基于 Apache License 2.0 开源。
作者：愿行无止之境 svcliny
GitHub: @svcpower100510  B站：科技区 svcliny  邮箱：vhkex@outlook.com
域名：techhub-svcliny.pages.dev
```

## 📊 数据总览

- 200 门精品课程（21 分类，价格 ¥9.9~19.9，全部付费）
- 12 个干货资源（全部验证可用）
- 12 个 GitHub 仓库（全部真实链接）
- 12 个 B站教程（全部真实 BV 号）
- 10 项技术含金量排行（关联官方文档）
- 5 条学习路线（关联 roadmap.sh）
- 50 条科技新闻
- 三轮安全核验 + 自动跳转 + 6 级收款码降级
