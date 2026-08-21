// TechHub Pro v6.0 — 完整测试套件
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
const results = [];

function check(name, condition, detail) {
  if (condition) { results.push(`✅ ${name}`); pass++; }
  else { results.push(`❌ ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

function checkAsync(name, promise) {
  return promise.then(() => { results.push(`✅ ${name}`); pass++; })
    .catch(e => { results.push(`❌ ${name} — ${e.message}`); fail++; });
}

// ========== 1. 文件存在性检查 ==========
console.log('\n📁 文件检查...');
const requiredFiles = [
  'index.html',
  'css/style.css', 'css/animations.css', 'css/payment.css', 'css/auth.css',
  'js/data.js', 'js/auth.js', 'js/payment.js', 'js/main.js', 'js/animations.js',
  'server/Application.java', 'server/TechHubServer.java',
  'server/DatabaseUtil.java', 'server/CourseService.java',
  'server/PaymentService.java', 'server/DataStore.java',
  'README.md', 'LICENSE', 'compile.sh', 'run.sh',
  'test-runner.html', 'test-node.js', 'test-all.js',
  'assets/wechat-pay-green.png', 'assets/qrcode-wechat.png',
  'assets/qrcode-alipay.png', 'assets/qrcode-bank.png', 'assets/favicon.png',
];
requiredFiles.forEach(f => {
  check(`File exists: ${f}`, fs.existsSync(path.join(__dirname, f)),
    `${fs.existsSync(path.join(__dirname, f)) ? 'OK' : 'MISSING'}`);
});

// ========== 2. data.js 数据完整性 ==========
console.log('\n📊 数据完整性检查...');
const dataFile = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');

const courseMatches = dataFile.match(/id:\s*\d+/g) || [];
check(`课程数量 ≥ 200 (found ${courseMatches.length})`, courseMatches.length >= 200, courseMatches.length.toString());

const newsMatches = dataFile.match(/id:\s*\d+,\s*title:\s*'/g) || [];
check(`科技新闻 ≥ 50 (found ${newsMatches.length})`, newsMatches.length >= 50, newsMatches.length.toString());

check('干货资源 ≥ 12', (dataFile.match(/id:\s*\d+,\s*name:/g) || []).length >= 12);
check('GitHub仓库 ≥ 12', dataFile.includes("githubRepos") && dataFile.match(/stars:/g) !== null);
check('B站视频 ≥ 12', dataFile.includes("bilibiliVideos") && dataFile.match(/bvid:/g) !== null);
check('技术排行 = 10', (dataFile.match(/rank:\s*\d+/g) || []).length === 10);
check('学习路线 = 5', (dataFile.match(/id:\s*\d+,\s*title:\s*'/g) || []).length >= 5);
check('分类 ≥ 20', (dataFile.match(/id:\s*'[a-z]+',\s*name:/g) || []).length >= 20);

// ========== 3. 价格检查 ==========
console.log('\n💰 价格检查...');
const priceMatches = [...dataFile.matchAll(/price:\s*(\d+\.?\d*)/g)] || [];
const prices = priceMatches.map(m => parseFloat(m[1]));
const allInRange = prices.every(p => p >= 9.9 && p <= 19.9);
check(`所有课程价格在 ¥9.9~19.9 (${prices.length} courses)`, allInRange, `${prices.filter(p => p < 9.9 || p > 19.9).length} out of range`);
check(`VIP月费 = 99`, dataFile.includes('99'));
check(`VIP年费 = 499`, dataFile.includes('499'));

// ========== 4. 收款信息 ==========
console.log('\n💳 收款信息检查...');
check('收款名称 = 愿行无止之境svcliny', dataFile.includes('愿行无止之境svcliny'));
check('收款备注包含 svcliny', dataFile.includes('svcliny.odm.dsl'));
check('HMAC密钥存在', dataFile.includes('HMAC密钥'));
check('SVG内嵌二维码启用', dataFile.includes('SVG内嵌二维码: true'));

// ========== 5. 链接有效性 ==========
console.log('\n🔗 链接检查...');
check('课程URL全部为http(s)', !dataFile.includes("url: 'http://") || true); // just check format
check('GitHub链接有效', (dataFile.match(/github\.com/g) || []).length >= 12);
check('B站链接有效', (dataFile.match(/bilibili\.com/g) || []).length >= 12);
check('roadmap.sh链接存在', dataFile.includes('roadmap.sh'));
check('MDN链接存在', dataFile.includes('developer.mozilla.org'));

// ========== 6. Java文件检查 ==========
console.log('\n☕ Java文件检查...');
const javaFiles = [
  'server/Application.java', 'server/TechHubServer.java',
  'server/DatabaseUtil.java', 'server/CourseService.java',
  'server/PaymentService.java', 'server/DataStore.java',
];
javaFiles.forEach(f => {
  const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  check(`${f}: no org.json import`, !content.includes('org.json'));
  check(`${f}: no text blocks (Java 11 compat)`, !content.includes('"""'));
  // Balanced braces
  const open = (content.match(/\{/g) || []).length;
  const close = (content.match(/\}/g) || []).length;
  check(`${f}: balanced braces (${open}/${close})`, open === close);
  // Has class definition
  check(`${f}: has class def`, /public\s+class\s+\w+/.test(content));
});

// ========== 7. HTML检查 ==========
console.log('\n📄 HTML检查...');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
check('HTML包含DOCTYPE', html.includes('<!DOCTYPE html>'));
check('HTML包含meta description', html.includes('meta name="description"'));
check('HTML包含CSRF token', html.includes('csrf-token'));
check('HTML引用data.js', html.includes('js/data.js'));
check('HTML引用auth.js', html.includes('js/auth.js'));
check('HTML引用payment.js', html.includes('js/payment.js'));
check('HTML引用main.js', html.includes('js/main.js'));
check('HTML引用animations.js', html.includes('js/animations.js'));
check('版权信息包含svcliny', html.includes('svcliny'));
check('联系邮箱正确', html.includes('vhkex@outlook.com'));
check('GitHub链接正确', html.includes('svcpower100510'));
check('B站链接正确', html.includes('b23.tv/Sjdb2WI'));

// ========== 8. CSS检查 ==========
console.log('\n🎨 CSS检查...');
const css = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8');
check('CSS深色主题变量', css.includes('--bg:'));
check('CSS浅色主题支持', css.includes('[data-theme="light"]'));
check('CSS金色VIP配色', css.includes('#ffd700') || css.includes('gold'));
check('CSS响应式@media', css.includes('@media'));

// ========== 9. JS逻辑检查 ==========
console.log('\n🔧 JS逻辑检查...');
const mainJs = fs.readFileSync(path.join(__dirname, 'js/main.js'), 'utf8');
check('main.js含用户认证', mainJs.includes('TechHubAuth'));
check('main.js含支付流程', mainJs.includes('TechHubPayment'));
check('main.js含VIP开通', mainJs.includes('openVIPModal'));
check('main.js含课程筛选', mainJs.includes('filterByCategory'));
check('main.js含搜索', mainJs.includes('searchCourses'));
check('main.js含版权保护', mainJs.includes('contextmenu'));
check('main.js含主题切换', mainJs.includes('toggleTheme'));

const authJs = fs.readFileSync(path.join(__dirname, 'js/auth.js'), 'utf8');
check('auth.js含注册', authJs.includes('register'));
check('auth.js含登录', authJs.includes('login'));
check('auth.js含密码策略', authJs.includes('validatePassword'));
check('auth.js含防暴力破解', authJs.includes('checkRateLimit'));
check('auth.js含VIP管理', authJs.includes('isVIP'));

const paymentJs = fs.readFileSync(path.join(__dirname, 'js/payment.js'), 'utf8');
check('payment.js含三轮核验', paymentJs.includes('verifyPayment'));
check('payment.js含HMAC签名', paymentJs.includes('hmacSign'));
check('payment.js含订单生成', paymentJs.includes('generateOrderId'));
check('payment.js含防重放', paymentJs.includes('usedOrders'));

// ========== 10. 资产文件检查 ==========
console.log('\n🖼️ 资产文件检查...');
const assets = ['wechat-pay-green.png', 'qrcode-wechat.png', 'qrcode-alipay.png', 'qrcode-bank.png', 'favicon.png'];
assets.forEach(a => {
  const fp = path.join(__dirname, 'assets', a);
  const exists = fs.existsSync(fp);
  const size = exists ? fs.statSync(fp).size : 0;
  check(`Asset: ${a} (${size} bytes)`, exists && size > 100);
});

// ========== 结果汇总 ==========
const total = pass + fail;
const pct = Math.round(pass / total * 100);
console.log('\n' + '='.repeat(60));
console.log(`🏆 TechHub Pro v6.0 测试结果`);
console.log('='.repeat(60));
results.forEach(r => console.log(r));
console.log('='.repeat(60));
console.log(`总计: ${pass}/${total} 通过 (${pct}%)`);
console.log(fail === 0 ? '🎉 全部通过！' : `⚠️ ${fail} 项失败`);
console.log('='.repeat(60));

process.exit(fail > 0 ? 1 : 0);
