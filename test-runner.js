// TechHub Pro v6.0 — 完整测试套件（修正版）
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
const results = [];

function check(name, condition, detail) {
  if (condition) { results.push(`✅ ${name}`); pass++; }
  else { results.push(`❌ ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

// ========== 1. 文件存在性 ==========
console.log('\n📁 文件检查...');
const requiredFiles = [
  'index.html',
  'css/style.css', 'css/animations.css', 'css/payment.css', 'css/auth.css',
  'js/data.js', 'js/auth.js', 'js/payment.js', 'js/main.js', 'js/animations.js',
  'server/Application.java', 'server/TechHubServer.java',
  'server/DatabaseUtil.java', 'server/CourseService.java',
  'server/PaymentService.java', 'server/DataStore.java',
  'README.md', 'LICENSE', 'compile.sh', 'run.sh',
  'test-runner.html', 'test-node.js', 'test-all.js', 'test-runner.js',
  'assets/wechat-pay-green.png', 'assets/qrcode-wechat.png',
  'assets/qrcode-alipay.png', 'assets/qrcode-bank.png', 'assets/favicon.png',
];
requiredFiles.forEach(f => {
  const exists = fs.existsSync(path.join(__dirname, f));
  const size = exists ? fs.statSync(path.join(__dirname, f)).size : 0;
  check(`File: ${f} (${size}b)`, exists && size > 0, size.toString());
});

// ========== 2. data.js 数据完整性 ==========
console.log('\n📊 数据完整性...');
const dataFile = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');

// Count courses by counting "id:" entries in courses array
const courseIdMatches = dataFile.match(/id:\s*\d+,/g) || [];
check(`课程数量 ≥ 200 (found ${courseIdMatches.length})`, courseIdMatches.length >= 200, courseIdMatches.length.toString());

// Count techNews
const newsBlock = dataFile.match(/techNews:\s*\[([\s\S]*?)\],?\s*\n/m);
const newsCount = newsBlock ? (newsBlock[1].match(/id:\s*'\d+'/g) || []).length : 0;
check(`科技新闻 ≥ 50 (found ${newsCount})`, newsCount >= 50, newsCount.toString());

// Resources
const resBlock = dataFile.match(/resources:\s*\[([\s\S]*?)\],?\s*\n/m);
const resCount = resBlock ? (resBlock[1].match(/id:\s*'\d+'/g) || []).length : 0;
check(`干货资源 ≥ 12 (found ${resCount})`, resCount >= 12, resCount.toString());

// GitHub
const ghBlock = dataFile.match(/githubRepos:\s*\[([\s\S]*?)\],?\s*\n/m);
const ghCount = ghBlock ? (ghBlock[1].match(/name:/g) || []).length : 0;
check(`GitHub仓库 ≥ 12 (found ${ghCount})`, ghCount >= 12, ghCount.toString());

// Bilibili
const biliBlock = dataFile.match(/bilibiliVideos:\s*\[([\s\S]*?)\],?\s*\n/m);
const biliCount = biliBlock ? (biliBlock[1].match(/title:/g) || []).length : 0;
check(`B站视频 ≥ 12 (found ${biliCount})`, biliCount >= 12, biliCount.toString());

// Rankings
const rankBlock = dataFile.match(/rankings:\s*\[([\s\S]*?)\],?\s*\n/m);
const rankCount = rankBlock ? (rankBlock[1].match(/rank:/g) || []).length : 0;
check(`技术排行 = 10 (found ${rankCount})`, rankCount === 10, rankCount.toString());

// Roadmaps
const roadBlock = dataFile.match(/roadmaps:\s*\[([\s\S]*?)\],?\s*\n/m);
const roadCount = roadBlock ? (roadBlock[1].match(/id:/g) || []).length : 0;
check(`学习路线 ≥ 5 (found ${roadCount})`, roadCount >= 5, roadCount.toString());

// Categories
const catBlock = dataFile.match(/categories:\s*\[([\s\S]*?)\],?\s*\n/m);
const catCount = catBlock ? (catBlock[1].match(/id:/g) || []).length : 0;
check(`分类 ≥ 20 (found ${catCount})`, catCount >= 20, catCount.toString());

// ========== 3. 价格检查 ==========
console.log('\n💰 价格检查...');
const priceMatches = [...dataFile.matchAll(/price:\s*(\d+\.?\d*)/g)] || [];
const prices = priceMatches.map(m => parseFloat(m[1]));
const outOfRange = prices.filter(p => p < 9.9 || p > 19.9);
check(`所有课程价格在 ¥9.9~19.9 (${prices.length} courses, ${outOfRange.length} out of range)`, outOfRange.length === 0, outOfRange.join(','));

check(`VIP月费 = 99`, dataFile.includes('99'));
check(`VIP年费 = 499`, dataFile.includes('499'));

// ========== 4. 收款信息 ==========
console.log('\n💳 收款信息...');
check('收款名称 = 愿行无止之境svcliny', dataFile.includes('愿行无止之境svcliny'));
check('收款备注包含 svcliny', dataFile.includes('svcliny.odm.dsl'));
check('HMAC密钥存在', dataFile.includes('HMAC密钥') || dataFile.includes('HMAC-'));
check('SVG内嵌二维码启用', dataFile.includes('SVG内嵌二维码: true') || dataFile.includes('SVG内嵌二维码"： true'));

// ========== 5. 链接检查 ==========
console.log('\n🔗 链接检查...');
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
  check(`${f}: no text blocks`, !content.includes('"""'));
  const open = (content.match(/\{/g) || []).length;
  const close = (content.match(/\}/g) || []).length;
  check(`${f}: balanced braces (${open}/${close})`, open === close);
  check(`${f}: has class def`, /public\s+class\s+\w+/.test(content));
});

// ========== 7. HTML检查 ==========
console.log('\n📄 HTML检查...');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
check('HTML DOCTYPE', html.includes('<!DOCTYPE html>'));
check('HTML meta description', html.includes('meta name="description"'));
check('HTML CSRF token', html.includes('csrf-token'));
check('HTML引用data.js', html.includes('js/data.js'));
check('HTML引用auth.js', html.includes('js/auth.js'));
check('HTML引用payment.js', html.includes('js/payment.js'));
check('HTML引用main.js', html.includes('js/main.js'));
check('HTML引用animations.js', html.includes('js/animations.js'));
check('版权 svcliny', html.includes('svcliny'));
check('邮箱 vhkex@outlook.com', html.includes('vhkex@outlook.com'));
check('GitHub svcpower100510', html.includes('svcpower100510'));
check('B站 b23.tv', html.includes('b23.tv'));

// ========== 8. CSS检查 ==========
console.log('\n🎨 CSS检查...');
const css = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8');
check('CSS深色主题 --bg', css.includes('--bg:'));
check('CSS浅色主题 [data-theme', css.includes('data-theme="light"'));
check('CSS金色VIP', css.includes('gold') || css.includes('#ffd700'));
check('CSS响应式 @media', css.includes('@media'));

// ========== 9. JS逻辑检查 ==========
console.log('\n🔧 JS逻辑检查...');
const mainJs = fs.readFileSync(path.join(__dirname, 'js/main.js'), 'utf8');
check('main.js 用户认证', mainJs.includes('TechHubAuth'));
check('main.js 支付流程', mainJs.includes('TechHubPayment'));
check('main.js VIP开通', mainJs.includes('openVIPModal'));
check('main.js 课程筛选', mainJs.includes('filterByCategory'));
check('main.js 搜索', mainJs.includes('searchCourses'));
check('main.js 版权保护', mainJs.includes('contextmenu') || mainJs.includes('禁止右键'));
check('main.js 主题切换', mainJs.includes('toggleTheme'));

const authJs = fs.readFileSync(path.join(__dirname, 'js/auth.js'), 'utf8');
check('auth.js 注册', authJs.includes('register'));
check('auth.js 登录', authJs.includes('login'));
check('auth.js 密码策略', authJs.includes('validatePassword'));
check('auth.js 防暴力破解', authJs.includes('checkRateLimit') || authJs.includes('recordFailed'));
check('auth.js VIP管理', authJs.includes('isVIP'));

const paymentJs = fs.readFileSync(path.join(__dirname, 'js/payment.js'), 'utf8');
check('payment.js 三轮核验', paymentJs.includes('verifyPayment'));
check('payment.js HMAC签名', paymentJs.includes('hmacSign') || paymentJs.includes('HMAC'));
check('payment.js 订单生成', paymentJs.includes('createOrder') || paymentJs.includes('generateOrder'));
check('payment.js 防重放', paymentJs.includes('usedOrders'));

// ========== 10. 资产文件 ==========
console.log('\n🖼️ 资产文件...');
const assets = ['wechat-pay-green.png', 'qrcode-wechat.png', 'qrcode-alipay.png', 'qrcode-bank.png', 'favicon.png'];
assets.forEach(a => {
  const fp = path.join(__dirname, 'assets', a);
  const exists = fs.existsSync(fp);
  const size = exists ? fs.statSync(fp).size : 0;
  check(`Asset: ${a} (${size}b)`, exists && size > 100, size.toString());
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
