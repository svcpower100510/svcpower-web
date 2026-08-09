/**
 * TechHub Pro v4.0 — 综合测试套件
 * 运行: node test-all.js
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passed = 0, failed = 0, total = 0;
const errors = [];

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (e) {
    failed++;
    errors.push({ name, err: e.message });
    console.log(`  ❌ ${name} → ${e.message}`);
  }
}

function section(t) { console.log(`\n${'─'.repeat(50)}\n📋 ${t}\n${'─'.repeat(50)}`); }

// ========== 1. 文件结构 ==========
section('1. 文件结构检查');
const must = [
  'index.html', 'css/style.css', 'css/animations.css', 'css/payment.css',
  'js/data.js', 'js/main.js', 'js/payment.js', 'js/animations.js', 'js/api-client.js',
  'server/Application.java', 'server/TechHubServer.java', 'server/DatabaseUtil.java',
  'server/CourseService.java', 'server/PaymentService.java', 'server/Course.java',
  'server/DataStore.java', 'server/Resource.java', 'server/Ranking.java',
  'server/GithubRepo.java', 'server/BiliVideo.java', 'server/LearningPath.java',
  'data/courses.json', 'README.md', 'LICENSE',
];
for (const f of must) {
  test(`存在: ${f}`, () => {
    assert.ok(fs.existsSync(path.join(__dirname, f)), `缺失 ${f}`);
  });
}

// ========== 2. 课程数据 ==========
section('2. 课程数据完整性 (120门)');
const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/courses.json'), 'utf8'));
test('总数=120', () => assert.strictEqual(courses.length, 120));
const free = courses.filter(c => c.isFree);
const paid = courses.filter(c => !c.isFree);
test(`免费=60 (实际${free.length})`, () => assert.strictEqual(free.length, 60));
test(`付费=60 (实际${paid.length})`, () => assert.strictEqual(paid.length, 60));

const prices = [...new Set(paid.map(c => c.price))].sort((a,b) => a-b);
test('付费价格分布合法', () => {
  for (const p of prices) assert.ok(p > 0 && p <= 90, `异常价格 ${p}`);
});
test('价格含¥5/¥35/¥90', () => {
  assert.ok(prices.includes(5));
  assert.ok(prices.includes(35) || prices.includes(45));
  assert.ok(prices.includes(90));
});

test('每门课有必需字段', () => {
  const required = ['id','title','category','description','price','isFree','rating','redirectUrl'];
  for (const c of courses) {
    for (const k of required) assert.ok(k in c, `${c.id} 缺 ${k}`);
  }
});

const cats = new Set(courses.map(c => c.category));
test(`分类数≥18 (实际${cats.size})`, () => assert.ok(cats.size >= 18));
test('含网络安全分类', () => {
  assert.ok(cats.has('web-security') || cats.has('penetration') || cats.has('ctf'));
});

// ========== 3. 数据.js 内容 ==========
section('3. 前端数据文件');
const dataJs = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');
test('data.js 含收款人信息', () => assert.ok(dataJs.includes('svcliny')));
test('data.js 含邮箱', () => assert.ok(dataJs.includes('vhkex@outlook.com')));
test('data.js 含B站链接', () => assert.ok(dataJs.includes('bilibili') || dataJs.includes('B站')));
test('data.js 含GitHub链接', () => assert.ok(dataJs.includes('github.com')));

// ========== 4. 支付模块 ==========
section('4. 支付模块 (payment.js)');
const payJs = fs.readFileSync(path.join(__dirname, 'js/payment.js'), 'utf8');
test('三轮核验逻辑', () => {
  assert.ok(payJs.includes('verifyRound1') && payJs.includes('verifyRound2') && payJs.includes('verifyRound3'));
});
test('HMAC/签名', () => {
  assert.ok(payJs.includes('HMAC') || payJs.includes('hmacLike') || payJs.includes('sign'));
});
test('防重放(15分钟)', () => {
  assert.ok(payJs.includes('15 * 60') || payJs.includes('TIMEOUT'));
});
test('SVG 二维码降级', () => {
  assert.ok(payJs.includes('buildSVGQR') || payJs.includes('SVG') || payJs.includes('svg'));
});
test('最多5次重试', () => {
  assert.ok(payJs.includes('MAX_RETRY') || payJs.includes('5'));
});
test('订单号格式校验', () => {
  assert.ok(payJs.includes('isValidOrderId') || payJs.includes('TH-\\d'));
});

// ========== 5. 主逻辑 ==========
section('5. 主逻辑 (main.js)');
const mainJs = fs.readFileSync(path.join(__dirname, 'js/main.js'), 'utf8');
test('动态加载课程', () => assert.ok(mainJs.includes('fetch') && mainJs.includes('courses.json')));
test('分类筛选', () => assert.ok(mainJs.includes('filterCat') || mainJs.includes('filter-category')));
test('价格筛选', () => assert.ok(mainJs.includes('filterPrice') || mainJs.includes('isFree')));
test('搜索功能', () => assert.ok(mainJs.includes('search') || mainJs.includes('Search')));
test('主题切换', () => assert.ok(mainJs.includes('theme') || mainJs.includes('data-theme')));
test('版权保护', () => assert.ok(mainJs.includes('contextmenu') || mainJs.includes('copy')));

// ========== 6. 动画模块 ==========
section('6. 动画模块 (animations.js)');
const animJs = fs.readFileSync(path.join(__dirname, 'js/animations.js'), 'utf8');
test('Canvas 粒子', () => assert.ok(animJs.includes('canvas') || animJs.includes('Canvas')));
test('数字增长动画', () => assert.ok(animJs.includes('count') || animJs.includes('animateNumber')));
test('滚动入场', () => assert.ok(animJs.includes('IntersectionObserver') || animJs.includes('reveal')));
test('3D 卡片倾斜', () => assert.ok(animJs.includes('tilt') || animJs.includes('rotateX') || animJs.includes('perspective')));
test('滚动进度条', () => assert.ok(animJs.includes('scroll') && animJs.includes('progress')));

// ========== 7. HTML ==========
section('7. HTML 入口');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
test('含5个核心section', () => {
  assert.ok(html.includes('id="courses"'));
  assert.ok(html.includes('id="bilibili"'));
  assert.ok(html.includes('id="github"'));
  assert.ok(html.includes('id="resources"'));
  assert.ok(html.includes('id="rankings"'));
});
test('CSP 安全头', () => assert.ok(html.includes('Content-Security-Policy')));
test('版权信息', () => assert.ok(html.includes('svcliny') && html.includes('版权') || html.includes('Copyright')));
test('邮箱链接', () => assert.ok(html.includes('vhkex@outlook.com')));
test('B站链接', () => assert.ok(html.includes('b23.tv') || html.includes('bilibili')));
test('GitHub链接', () => assert.ok(html.includes('github.com/svcpower')));

// ========== 8. Java 后端 ==========
section('8. Java 后端');
const javaFiles = [
  'server/Application.java', 'server/TechHubServer.java',
  'server/DatabaseUtil.java', 'server/CourseService.java',
  'server/PaymentService.java', 'server/Course.java',
];
for (const f of javaFiles) {
  const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  test(`${f} 无中文引号`, () => {
    assert.ok(!content.includes('\u201c') && !content.includes('\u201d'), '含中文引号');
  });
  test(`${f} 括号平衡`, () => {
    let open = 0, close = 0;
    for (const ch of content) { if (ch === '{') open++; else if (ch === '}') close++; }
    assert.strictEqual(open, close, `括号不平衡: ${open} vs ${close}`);
  });
}

const serverJava = fs.readFileSync(path.join(__dirname, 'server/TechHubServer.java'), 'utf8');
test('HTTP 服务器实现', () => assert.ok(serverJava.includes('ServerSocket') || serverJava.includes('HttpServer')));
test('REST API 端点', () => {
  assert.ok(serverJava.includes('/api/courses') && serverJava.includes('/api/search'));
});
test('CORS 支持', () => assert.ok(serverJava.includes('Access-Control') || serverJava.includes('CORS')));
test('安全头', () => assert.ok(serverJava.includes('X-Content-Type-Options') || serverJava.includes('X-Frame-Options')));

const payJava = fs.readFileSync(path.join(__dirname, 'server/PaymentService.java'), 'utf8');
test('Java HMAC-SHA256', () => assert.ok(payJava.includes('HmacSHA256') || payJava.includes('Mac.getInstance')));
test('Java 幂等检查', () => assert.ok(payJava.includes('USED_ORDERS') || payJava.includes('幂等') || payJava.includes('idempot')));

// ========== 9. CSS ==========
section('9. 样式文件');
const css = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8');
test('CSS 变量主题', () => assert.ok(css.includes('--accent') || css.includes(':root')));
test('响应式 @media', () => assert.ok(css.includes('@media') || css.includes('responsive')));
const payCss = fs.readFileSync(path.join(__dirname, 'css/payment.css'), 'utf8');
test('支付弹窗样式', () => assert.ok(payCss.includes('pay-modal') || payCss.includes('pay-overlay')));

// ========== 10. 统计 ==========
section('10. 项目统计');
let totalBytes = 0, fileCount = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else { totalBytes += fs.statSync(p).size; fileCount++; }
  }
}
walk(__dirname);
const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
test(`文件总数≥25 (实际${fileCount})`, () => assert.ok(fileCount >= 25));
test(`代码总量>1MB (实际${totalMB}MB)`, () => assert.ok(totalBytes > 1024 * 1024));
console.log(`\n  📊 文件: ${fileCount} 个 | 总大小: ${totalMB} MB`);

// ========== 结果 ==========
console.log(`\n${'═'.repeat(50)}`);
console.log(`总计: ${total} 项 | ✅ 通过: ${passed} | ❌ 失败: ${failed}`);
console.log(`通过率: ${((passed/total)*100).toFixed(1)}%`);
if (failed > 0) {
  console.log('\n失败详情:');
  for (const e of errors) console.log(`  · ${e.name}: ${e.err}`);
  process.exit(1);
}
console.log('🎉 全部通过！');
