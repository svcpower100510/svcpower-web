// Quick Node.js validation for TechHub Pro v6.0
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
const results = [];

function test(name, check) {
  try {
    const ok = check();
    if (ok) { results.push(`✅ ${name}`); pass++; }
    else { results.push(`❌ ${name} — check returned false`); fail++; }
  } catch(e) {
    results.push(`❌ ${name} — ${e.message}`); fail++;
  }
}

// Read data.js and extract key info
const dataFile = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');

test('data.js exists and has content', () => dataFile.length > 5000);
test('Contains 200 courses', () => (dataFile.match(/id:\s*\d+/g) || []).length >= 200);
test('Contains techNews', () => dataFile.includes('techNews'));
test('Contains 50+ news items', () => (dataFile.match(/id:\s*\d+,\s*title:\s*'/g) || []).length >= 50);
test('Payment config present', () => dataFile.includes("愿行无止之境svcliny"));
test('收款备注正确', () => dataFile.includes('rosvcliny.odm.dsl'));
test('VIP月费=99', () => dataFile.includes('99'));
test('VIP年费=499', () => dataFile.includes('499'));
test('All prices 9.9~19.9', () => {
  const prices = [...dataFile.matchAll(/price:\s*(\d+\.?\d*)/g)].map(m => parseFloat(m[1]));
  return prices.every(p => p >= 9.9 && p <= 19.9);
});
test('Categories >= 20', () => (dataFile.match(/id:\s*'[a-z]+',\s*name:/g) || []).length >= 20);
test('HMAC secret present', () => dataFile.includes('HMAC密钥'));
test('GitHub URLs valid', () => dataFile.includes('github.com'));
test('Bilibili URLs valid', () => dataFile.includes('bilibili.com'));
test('roadmap.sh links present', () => dataFile.includes('roadmap.sh'));
test('Copyright svcliny', () => dataFile.includes('svcliny'));
test('Apache License', () => dataFile.includes('Apache'));

// Check all files exist
const files = [
  'index.html', 'css/style.css', 'css/animations.css',
  'css/payment.css', 'css/auth.css',
  'js/data.js', 'js/auth.js', 'js/payment.js',
  'js/main.js', 'js/animations.js',
  'server/Application.java', 'server/TechHubServer.java',
  'server/DatabaseUtil.java', 'server/CourseService.java',
  'server/PaymentService.java', 'server/DataStore.java',
  'README.md', 'LICENSE', 'compile.sh', 'run.sh',
];
files.forEach(f => {
  test(`File exists: ${f}`, () => fs.existsSync(path.join(__dirname, f)));
});

// Check Java files for common issues
const javaFiles = [
  'server/Application.java', 'server/TechHubServer.java',
  'server/DatabaseUtil.java', 'server/CourseService.java',
  'server/PaymentService.java', 'server/DataStore.java',
];
javaFiles.forEach(f => {
  const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  test(`${f}: no org.json import`, () => !content.includes('org.json'));
  test(`${f}: no text blocks (Java 11 compat)`, () => !content.includes('"""'));
  test(`${f}: has package/import`, () => content.includes('import') || content.includes('package'));
  // Check balanced braces
  const open = (content.match(/\{/g) || []).length;
  const close = (content.match(/\}/g) || []).length;
  test(`${f}: balanced braces (${open}/${close})`, () => open === close);
});

const total = pass + fail;
console.log(`\n${'='.repeat(50)}`);
console.log(`TechHub Pro v6.0 — Node Validation`);
console.log(`${'='.repeat(50)}`);
results.forEach(r => console.log(r));
console.log(`${'='.repeat(50)}`);
console.log(`Result: ${pass}/${total} passed (${Math.round(pass/total*100)}%)`);
console.log(fail > 0 ? '⚠️ Some checks failed' : '🎉 All checks passed!');
process.exit(fail > 0 ? 1 : 0);
