# TechHub Pro v6.0 Beta

> 愿行无止之境 svcliny 的科技区精品课程付费平台

## 🚀 版本亮点 (v6.0)

### ✅ 用户认证系统
- 注册/登录/会话管理
- 密码强度策略（大小写+数字+特殊字符）
- 防暴力破解（5次/30分钟锁定）
- 防批量注册（3次/小时，封禁临时邮箱）
- 7天免登录（Remember Me）
- SHA-256 + HMAC-SHA256 加密

### ✅ 三轮安全核验支付
- **第一轮**：订单完整性（格式/金额/超时/重放）
- **第二轮**：HMAC-SHA256 签名校验 + 备用算法降级
- **第三轮**：服务端确认 + 幂等性检查
- 15分钟订单超时
- 5次重试锁定
- 防重放攻击

### ✅ VIP会员体系
- 月度VIP ¥99 / 年度VIP ¥499
- VIP畅听全部200门课程
- 普通用户免费额度100门
- VIP到期自动降级

### ✅ 统一价格体系
- 全部课程 ¥9.9 ~ ¥19.9
- 无免费课程（除资源区外）
- 价格区间：低(9.9-12.9) / 中(13.9-15.9) / 高(16.9-19.9)

### ✅ 科技新闻模块
- 50条精选科技新闻
- 自动滚动头条
- 分类标签（AI/硬件/云原生/编程语言等）
- 来源链接直跳

### ✅ 全站链接打通
- B站精选 → 真实BV号视频链接
- GitHub精选 → 真实仓库URL
- 干货资源 → 官方文档链接
- 技术排行 → 官方技术主页
- 学习路线 → roadmap.sh 详细路线

### ✅ 收款码修复
- PNG主收款码（绿色推荐图 400x520）
- 4级URL降级链
- SVG Canvas备用二维码
- 图片指纹校验防替换

### ✅ 版权保护
- 禁止右键（课程区域）
- 禁止复制（>100字符）
- 控制台警告
- CSP安全头
- 页脚完整版权声明

## 📂 项目结构

```
TechHub-Pro/
├── index.html              # 网站入口
├── css/
│   ├── style.css          # 主样式（深色/浅色双主题）
│   ├── animations.css     # 动画效果
│   ├── payment.css       # 支付弹窗样式
│   └── auth.css          # 认证系统样式
├── js/
│   ├── data.js           # 全站数据（200课程+50新闻+资源+排行+路线）
│   ├── auth.js           # 用户认证与安全系统
│   ├── payment.js        # 三轮核验支付系统
│   ├── main.js           # 主逻辑（渲染/筛选/跳转/UI）
│   └── animations.js     # 视觉效果（粒子/3D/滚动）
├── server/               # Java后端
│   ├── Application.java
│   ├── TechHubServer.java
│   ├── DatabaseUtil.java
│   ├── CourseService.java
│   ├── PaymentService.java
│   ├── DataStore.java
│   └── CompileCheck.java
├── assets/               # 收款码图片
│   ├── wechat-pay-green.png
│   ├── qrcode-wechat.png
│   ├── qrcode-alipay.png
│   ├── qrcode-bank.png
│   └── favicon.png
├── compile.sh            # Java编译脚本
├── run.sh                # 启动脚本
├── test-all.js           # Node.js完整测试
├── test-runner.html      # 浏览器测试运行器
├── LICENSE               # Apache 2.0
└── README.md
```

## 📊 数据统计

| 项目 | 数量 |
|------|------|
| 精品课程 | 200门 |
| 技术分类 | 21个 |
| 科技新闻 | 50条 |
| 干货资源 | 12个 |
| GitHub仓库 | 12个 |
| B站教程 | 12个 |
| 学习路线 | 5条 |
| 技术排行 | 10项 |
| 价格区间 | ¥9.9 ~ ¥19.9 |
| VIP月费 | ¥99 |
| VIP年费 | ¥499 |

## 🛠️ 技术栈

- **前端**：原生JavaScript（无框架依赖）
- **样式**：CSS3变量主题 + 响应式设计
- **动画**：Canvas粒子 + IntersectionObserver + CSS3D
- **后端**：Java 11+ Socket HTTP服务器
- **数据库**：SQLite + JDBC连接池
- **安全**：HMAC-SHA256 + SHA-256 + CSP + Rate Limiting
- **部署**：Cloudflare Pages 全球CDN

## 🚀 快速开始

### 前端（直接打开）
```bash
# 方式1：浏览器直接打开 index.html
# 方式2：本地服务器
python3 -m http.server 3000
# 访问 http://localhost:3000
```

### 后端Java
```bash
# 编译
chmod +x compile.sh && ./compile.sh

# 启动（默认端口8080）
./run.sh

# 或指定端口
java -cp "bin:lib/sqlite-jdbc.jar" Application 9090
```

### 测试
```bash
# Node.js验证
node test-node.js

# 完整测试套件
node test-all.js

# 浏览器测试
# 打开 test-runner.html
```

## 📋 API端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/courses` | GET | 获取课程列表 |
| `/api/courses/featured` | GET | 精选课程 |
| `/api/resources` | GET | 干货资源 |
| `/api/rankings` | GET | 技术排行 |
| `/api/github` | GET | GitHub仓库 |
| `/api/bilibili` | GET | B站视频 |
| `/api/roadmaps` | GET | 学习路线 |
| `/api/news` | GET | 科技新闻 |
| `/api/search?q=` | GET | 搜索课程 |
| `/api/auth/register` | POST | 注册 |
| `/api/auth/login` | POST | 登录 |
| `/api/auth/logout` | POST | 登出 |
| `/api/auth/me` | GET | 当前用户 |
| `/api/payment/create` | POST | 创建订单 |
| `/api/payment/verify` | POST | 三轮核验 |
| `/api/payment/confirm` | POST | 确认支付 |
| `/api/vip/upgrade` | POST | VIP升级 |
| `/api/stats` | GET | 统计数据 |
| `/api/health` | GET | 健康检查 |

## 🔒 安全特性

1. **密码策略**：≥8位 + 大写 + 小写 + 数字 + 特殊字符
2. **防暴力破解**：5次失败→锁定30分钟
3. **防批量注册**：每小时最多3次 + 临时邮箱黑名单
4. **HMAC签名**：每个订单独立签名，防篡改
5. **防重放攻击**：订单号单次使用 + 15分钟窗口
6. **CSP安全头**：防止XSS注入
7. **版权保护**：禁止右键/复制 + 控制台警告
8. **会话管理**：Token + 过期时间 + 安全存储

## 📜 版权声明

```
Copyright 2026 svcliny (方). All Rights Reserved.

本网站所有课程内容均受版权保护，未经授权不得转载、分发或用于商业用途。
付费课程购买后永久有效，支持扫码支付，虚拟商品一经售出概不退换。

作者：愿行无止之境 svcliny
GitHub: @svcpower100510
B站：科技区 svcliny
邮箱：vhkex@outlook.com
域名：techhub-svcliny.pages.dev

开源协议：Apache License 2.0
```

## 📞 联系方式

- **邮箱**：vhkex@outlook.com
- **GitHub**：https://github.com/svcpower100510/svcpower-web
- **B站主页**：https://b23.tv/Sjdb2WI
- **网站**：https://techhub-svcliny.pages.dev

---

**愿行无止之境 — 技术成长永无止境** 🚀
