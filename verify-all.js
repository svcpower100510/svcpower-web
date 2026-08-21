// verify-all.js - TechHub Pro v6.0 正式版 完整性校验
const fs=require('fs'),path=require('path');
let pass=0,fail=0,issues=[];
function check(cond,msg){ if(cond){pass++;console.log('  ✅',msg);}else{fail++;issues.push(msg);console.log('  ❌',msg);} }
console.log('\n🔍 TechHub Pro v6.0 正式版 · 完整性校验\n');

// 1. 核心文件存在
console.log('【1】核心文件存在性'); const core=['index.html','README.md','LICENSE','compile.sh','run.sh'];
core.forEach(f=>check(fs.existsSync(path.join(__dirname,f)),'存在 '+f));

// 2. CSS 文件
console.log('\n【2】CSS 文件'); ['style.css','animations.css','auth.css','payment.css'].forEach(f=>check(fs.existsSync(path.join(__dirname,'css',f)),'css/'+f));

// 3. JS 文件
console.log('\n【3】JS 文件'); ['config.js','data.js','auth.js','payment.js','main.js','animations.js'].forEach(f=>check(fs.existsSync(path.join(__dirname,'js',f)),'js/'+f));

// 4. JS 语法检查
console.log('\n【4】JS 语法检查'); ['config.js','data.js','auth.js','payment.js','main.js','animations.js'].forEach(f=>{try{new Function(fs.readFileSync(path.join(__dirname,'js',f),'utf8'));check(true,'js/'+f+' 语法OK');}catch(e){check(false,'js/'+f+' 语法错误: '+e.message);}});

// 5. data.js 数据完整性
console.log('\n【5】data.js 数据完整性');
try{const c=fs.readFileSync(path.join(__dirname,'js/data.js'),'utf8');new Function(c);const g=globalThis;g.window=g;new Function(c)();const D=g.TechHubData;
 check(D&&D.courses,'courses 存在'); check(D.courses.length===200,'课程数=200 (实际:'+D.courses.length+')');
 const prices=D.courses.map(x=>x.price);check(Math.min.apply(null,prices)>=9.9,'最低价≥9.9 (实际:'+Math.min.apply(null,prices)+')');check(Math.max.apply(null,prices)<=19.9,'最高价≤19.9 (实际:'+Math.max.apply(null,prices)+')');
 check(D.courses.filter(x=>x.free).length===0,'全部付费(free=false)');check(D.categories&&D.categories.length>=21,'分类≥21 (实际:'+D.categories.length+')');
 check(D.resources&&D.resources.length===12,'资源=12');check(D.githubRepos&&D.githubRepos.length===12,'GitHub=12');check(D.bilibiliVideos&&D.bilibiliVideos.length===12,'B站=12');
 check(D.rankings&&D.rankings.length===10,'排行=10');check(D.roadmaps&&D.roadmaps.length===5,'路线=5');check(D.techNews&&D.techNews.length>=10,'新闻≥10 (实际:'+D.techNews.length+')');
 check(D.userSystem&&D.userSystem.freeQuota===100,'普通用户免费额度=100');check(D.payment&&D.payment.verifyRounds===3,'三轮核验');
 check(D.site&&/svcliny/.test(D.site.author||D.site.copyright||''),'含 svcliny 版权');
 // 链接有效性
 const biliOk=D.bilibiliVideos.every(v=>/^https:\/\/www\.bilibili\.com\/video\//.test(v.url));check(biliOk,'B站链接均为真实bilibili.com地址');
 const ghOk=D.githubRepos.every(v=>/^https:\/\/github\.com\//.test(v.url));check(ghOk,'GitHub链接均为真实github.com地址');
 const resOk=D.resources.every(v=>/^https?:\/\//.test(v.url));check(resOk,'资源链接均为http(s)地址');
}catch(e){check(false,'data.js 加载异常: '+e.message);}

// 6. Java 文件括号平衡
console.log('\n【6】Java 文件括号平衡');
['Application.java','TechHubServer.java','DatabaseUtil.java','CourseService.java','PaymentService.java','DataStore.java'].forEach(f=>{const s=fs.readFileSync(path.join(__dirname,'server',f),'utf8');let c=0;for(const ch of s){if(ch==='{')c++;else if(ch==='}')c--;}check(c===0,'server/'+f+' 括号平衡(差值='+c+')');});

// 7. Java 无 org.json / 无文本块 / 无中文引号
console.log('\n【7】Java 兼容性（无 org.json / 无文本块 / 无中文引号）');
['Application.java','TechHubServer.java','DatabaseUtil.java','CourseService.java','PaymentService.java','DataStore.java'].forEach(f=>{const s=fs.readFileSync(path.join(__dirname,'server',f),'utf8');const codeLines=s.split('\n').filter(l=>!l.trim().startsWith('//')).join('\n');check(!/org\.json/.test(codeLines),'server/'+f+' 无 org.json 引用');check(!/"""/.test(codeLines),'server/'+f+' 无文本块');check(!/[“”‘’]/.test(codeLines),'server/'+f+' 无中文引号');});

// 8. index.html 引用检查
console.log('\n【8】index.html 资源引用');const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
['css/style.css','css/animations.css','css/auth.css','css/payment.css','js/config.js','js/data.js','js/auth.js','js/payment.js','js/main.js','js/animations.js'].forEach(r=>check(new RegExp(r.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\\/g/,'/')).test(html),'引用 '+r));
check(/techhub-svcliny\.pages\.dev/.test(html),'含部署域名');check(/svcpower100510/.test(html),'含 GitHub 作者');check(/vhkex@outlook\.com/.test(html),'含联系邮箱');

// 9. 资产文件
console.log('\n【9】收款码/资产文件'); ['qrcode-wechat.png','qrcode-alipay.png','qrcode-bank.png','wechat-pay-green.png','favicon.png'].forEach(f=>{const p=path.join(__dirname,'assets',f);check(fs.existsSync(p),'assets/'+f);if(fs.existsSync(p))check(fs.statSync(p).size>100,'assets/'+f+' 非空('+fs.statSync(p).size+'B)');});

// 10. 关键功能：按钮/事件绑定
console.log('\n【10】关键功能代码检查');const main=fs.readFileSync(path.join(__dirname,'js/main.js'),'utf8');
check(/addEventListener.*click/.test(main)||/onclick/.test(main),'main.js 绑定点击事件');check(/Pay\.pay/.test(main),'main.js 调用 Pay.pay');check(/Auth\.canAccess/.test(main),'main.js 调用 Auth.canAccess');
const pay=fs.readFileSync(path.join(__dirname,'js/payment.js'),'utf8');check(/verifyRound1/.test(pay)&&/verifyRound2/.test(pay)&&/verifyRound3/.test(pay),'payment.js 含三轮核验');check(/tryLoadImg/.test(pay),'payment.js 含收款码降级');check(/window\.open.*redirectUrl/.test(pay),'payment.js 付费后自动跳转');
const auth=fs.readFileSync(path.join(__dirname,'js/auth.js'),'utf8');check(/maxLoginAttempts|lockMinutes/.test(auth),'auth.js 含防暴力破解');check(/registerPerHour/.test(auth),'auth.js 含防批量注册');

console.log('\n'+'='.repeat(42));
console.log('通过: '+pass+' | 失败: '+fail+' | 总计: '+(pass+fail));
if(fail>0){console.log('\n⚠ 待修复问题:');issues.forEach(i=>console.log('  · '+i));process.exit(1);}
else{console.log('\n🎉 全部校验通过，项目完整可发布');}
