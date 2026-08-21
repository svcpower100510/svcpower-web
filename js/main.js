// main.js - 核心逻辑与UI渲染（TechHub Pro v6.0 正式版）
(function (global) {
  'use strict';
  const C = global.TechHubConfig, D = global.TechHubData, $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  const Auth = global.TechHubAuth, Pay = global.TechHubPay;
  const ESC = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };

  // ---------- 工具 ----------
  function toast(msg, type) { if (Pay && Pay.toast) Pay.toast(msg, type); else console.log(msg); }
  function fmtPrice(p) { return '¥' + (p == null ? '0' : Number(p).toFixed(1)); }
  function renderStars(r) { let s = ''; for (let i = 0; i < 5; i++) s += i < Math.round(r) ? '★' : '☆'; return s; }

  // ---------- 导航高亮 ----------
  function initNav() {
    const links = $$('.nav-links a[href^="#"]');
    links.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); const id = a.getAttribute('href').slice(1); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); links.forEach(function (x) { x.classList.remove('active'); }); a.classList.add('active'); }); });
    window.addEventListener('scroll', function () { let cur = ''; ['home','courses','resources','roadmap','ranking','github','bilibili','news'].forEach(function (id) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 120) cur = id; }); if (cur) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); }); }, { passive: true });
  }

  // ---------- 主题切换 ----------
  function initTheme() { const btn = $('#theme-toggle'); if (!btn) return; const set = function (t) { document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('th_theme', t); } catch (e) {} }; const saved = (function () { try { return localStorage.getItem('th_theme'); } catch (e) { return null; } })(); set(saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')); btn.addEventListener('click', function () { set(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }); }

  // ---------- 渲染：课程 ----------
  function renderCourses(list) {
    const box = $('#courses-grid'); if (!box) return;
    if (!list.length) { box.innerHTML = '<div class="empty">暂无符合条件的课程</div>'; return; }
    box.innerHTML = list.map(function (c) {
      const tags = (c.tags || []).map(function (t) { return '<span class="tag">' + ESC(t) + '</span>'; }).join('');
      return '<div class="course-card" data-id="' + c.id + '">'
        + '<div class="course-head"><span class="course-cat">' + ESC(c.category) + '</span>' + (c.hot ? '<span class="badge hot">热销</span>' : '') + (c.new ? '<span class="badge new">新课</span>' : '') + (c.recommend ? '<span class="badge rec">推荐</span>' : '') + '</div>'
        + '<div class="course-title">' + ESC(c.title) + '</div>'
        + '<div class="course-desc">' + ESC(c.description) + '</div>'
        + '<div class="course-tags">' + tags + '</div>'
        + '<div class="course-meta"><span class="stars">' + renderStars(c.rating) + '</span><span class="students">' + ESC(c.students) + ' 已学</span></div>'
        + '<div class="course-foot"><span class="price">' + fmtPrice(c.price) + '</span><div class="course-actions"><button class="btn-detail" data-id="' + c.id + '">详情</button><button class="btn-buy" data-id="' + c.id + '">购买</button></div></div>'
        + '</div>';
    }).join('');
    bindCourseBtns();
  }
  function bindCourseBtns() {
    $$('.btn-detail').forEach(function (b) { b.onclick = function () { var c = findCourse(+b.dataset.id); if (c) showCourseDetail(c); }; });
    $$('.btn-buy').forEach(function (b) { b.onclick = function () { var c = findCourse(+b.dataset.id); if (c) Pay.pay(c); }; });
  }
  function findCourse(id) { return (D.courses || []).find(function (c) { return c.id === id; }); }

  function showCourseDetail(c) {
    var acc = Auth.canAccess(c.id); var act = acc.ok ? ('<a class="btn-primary" href="' + (c.redirectUrl || '') + '" target="_blank" rel="noopener">开始学习 →</a>') : ('<button class="btn-primary" id="dtl-buy">立即购买 ' + fmtPrice(c.price) + '</button>');
    var html = '<div class="detail"><div class="detail-head"><span class="course-cat">' + ESC(c.category) + '</span><h2>' + ESC(c.title) + '</h2><div class="detail-sub">' + renderStars(c.rating) + ' <span>' + ESC(c.students) + ' 已学</span> · <span>讲师：' + ESC(c.teacher) + '</span> · <span>平台：' + ESC(c.platform) + '</span></div></div>'
      + '<div class="detail-desc">' + ESC(c.description) + '</div>'
      + '<div class="detail-actions">' + act + '<button class="btn-ghost" id="dtl-close">关闭</button></div>'
      + '<div class="detail-links"><a href="' + ESC(c.bilibiliUrl || '#') + '" target="_blank" rel="noopener" class="ext-link">▶ 在B站观看相关教程</a><a href="' + ESC(c.githubUrl || '#') + '" target="_blank" rel="noopener" class="ext-link">🐙 查看GitHub相关仓库</a></div></div>';
    var m = document.createElement('div'); m.className = 'th-modal-mask'; m.style.position='fixed'; m.innerHTML = '<div class="th-modal detail-modal" role="dialog">'+html+'</div>'; document.body.appendChild(m);
    m.onclick = function(e){ if(e.target===m){ m.remove(); } }; document.getElementById('dtl-close').onclick=function(){ m.remove(); };
    var buy=m.querySelector('#dtl-buy'); if(buy) buy.onclick=function(){ m.remove(); Pay.pay(c); };
  }

  // ---------- 分类筛选 ----------
  function initCategoryFilter() {
    var wrap = $('#category-tabs'); if (!wrap || !D.categories) return;
    var tabs = [{name:'全部',key:''}].concat(D.categories.map(function(c){ return {name:c.name,key:c.name,count:c.count}; }));
    wrap.innerHTML = tabs.map(function(t){ return '<button class="cat-tab'+(t.key===''?' active':'')+'" data-cat="'+ESC(t.key)+'">'+ESC(t.name)+(t.count?'<i>'+t.count+'</i>':'')+'</button>'; }).join('');
    var priceWrap=$('#price-tabs'); if(priceWrap) priceWrap.innerHTML='<button class="price-tab active" data-p="all">全部价格</button><button class="price-tab" data-p="low">¥9.9</button><button class="price-tab" data-p="mid">¥10~15</button><button class="price-tab" data-p="high">¥15~19.9</button>';
    var curCat='', curPrice='all';
    function apply(){ var list=D.courses.slice(); if(curCat) list=list.filter(function(c){return c.category===curCat;}); if(curPrice==='low') list=list.filter(function(c){return c.price<=9.9;}); else if(curPrice==='mid') list=list.filter(function(c){return c.price>9.9&&c.price<=15;}); else if(curPrice==='high') list=list.filter(function(c){return c.price>15;}); renderCourses(list); }
    wrap.onclick=function(e){ var b=e.target.closest('.cat-tab'); if(!b) return; wrap.querySelectorAll('.cat-tab').forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); curCat=b.dataset.cat; apply(); };
    if(priceWrap) priceWrap.onclick=function(e){ var b=e.target.closest('.price-tab'); if(!b) return; priceWrap.querySelectorAll('.price-tab').forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); curPrice=b.dataset.p; apply(); };
  }

  // ---------- 资源/排行/GitHub/B站/新闻/路线 渲染 ----------
  function renderResources() { var b=$('#resources-grid'); if(!b||!D.resources) return; b.innerHTML=D.resources.map(function(r){return '<a class="res-card" href="'+ESC(r.url)+'" target="_blank" rel="noopener"><div class="res-icon">'+ESC(r.icon||'📦')+'</div><div class="res-name">'+ESC(r.name)+'</div><div class="res-desc">'+ESC(r.desc)+'</div>'+(r.badge?'<span class="res-badge">'+ESC(r.badge)+'</span>':'')+'</a>'; }).join(''); }
  function renderRankings() { var b=$('#ranking-list'); if(!b||!D.rankings) return; b.innerHTML=D.rankings.map(function(r){return '<div class="rank-item"><span class="rank-no">'+(r.rank<10?'0'+r.rank:r.rank)+'</span><div class="rank-main"><div class="rank-name">'+ESC(r.name)+'<span class="rank-score">'+r.score+'</span></div><div class="rank-desc">'+ESC(r.desc)+'</div><div class="rank-bar"><i style="width:'+r.score+'%"></i></div></div><a class="rank-go" href="'+ESC(r.url||'#')+'" target="_blank" rel="noopener" aria-label="查看">↗</a></div>'; }).join(''); }
  function renderGithub() { var b=$('#github-grid'); if(!b||!D.githubRepos) return; b.innerHTML=D.githubRepos.map(function(g){return '<a class="gh-card" href="'+ESC(g.url)+'" target="_blank" rel="noopener"><div class="gh-top"><span class="gh-name">📦 '+ESC(g.name)+'</span><span class="gh-lang">'+ESC(g.lang)+'</span></div><div class="gh-desc">'+ESC(g.desc)+'</div><div class="gh-meta"><span>⭐ '+ESC(g.stars)+'</span><span class="gh-tag">'+ESC(g.tag)+'</span></div></a>'; }).join(''); }
  function renderBilibili() { var b=$('#bilibili-grid'); if(!b||!D.bilibiliVideos) return; b.innerHTML=D.bilibiliVideos.map(function(v){return '<a class="bili-card" href="'+ESC(v.url)+'" target="_blank" rel="noopener"><div class="bili-icon">📺</div><div class="bili-title">'+ESC(v.title)+'</div><div class="bili-meta"><span>👤 '+ESC(v.teacher)+'</span><span>▶ '+ESC(v.plays)+'</span><span>💬 '+ESC(v.danmaku)+'</span></div></a>'; }).join(''); }
  function renderRoadmaps() { var b=$('#roadmap-grid'); if(!b||!D.roadmaps) return; b.innerHTML=D.roadmaps.map(function(r){return '<div class="road-card"><div class="road-head"><span class="road-icon">'+ESC(r.icon||'🗺️')+'</span><div><div class="road-title">'+ESC(r.title)+'</div><div class="road-months">⏱ '+ESC(r.months)+'</div></div><a class="road-go" href="https://roadmap.sh/" target="_blank" rel="noopener">路线图 ↗</a></div><ol class="road-steps">'+(r.steps||[]).map(function(s,idx){return '<li><b>阶段'+(idx+1)+'</b><span>'+ESC(s.t)+'</span><small>'+ESC(s.d)+'</small></li>';}).join('')+'</ol></div>'; }).join(''); }
  function renderNews() { var b=$('#news-list'); if(!b||!D.techNews) return; b.innerHTML=D.techNews.slice(0,24).map(function(n){return '<a class="news-item" href="'+ESC(n.url||'#news')+'" target="_blank" rel="noopener"><span class="news-cat">'+ESC(n.category)+'</span><span class="news-title">'+ESC(n.title)+'</span><span class="news-date">'+ESC(n.date||'')+'</span></a>'; }).join(''); }

  // ---------- 统计数字动画 ----------
  function animateStats() { var stats=[['stat-courses',D.courses.length],['stat-cats',D.categories.length],['stat-rating',(function(){var s=D.courses.reduce(function(a,c){return a+c.rating;},0)/D.courses.length;return s.toFixed(1);})()],['stat-rate','98%']]; stats.forEach(function(p){var el=document.getElementById(p[0]);if(!el)return;if(p[1]==='98%'){el.textContent='98%';return;}var n=+p[1],cur=0,step=Math.max(1,Math.ceil(n/40));var t=setInterval(function(){cur+=step;if(cur>=n){cur=n;clearInterval(t);}el.textContent=cur;},30);}); }

  // ---------- 用户面板 ----------
  function refreshUserPanel() { var u=Auth.currentUser(); var panel=$('#user-panel'); if(!panel) return; if(!u){ panel.innerHTML='<div class="up-name">游客用户</div><div class="up-sub">未登录</div><button class="btn-primary" id="up-login">登录 / 注册</button>'; document.getElementById('up-login').onclick=function(){ UI.openLogin(); }; } else { var purchased=Auth.getPurchased().length; var vip=Auth.isVIP(); panel.innerHTML='<div class="up-name">'+(vip?'👑 ':'🧑‍💻 ')+ESC(u.username)+'</div><div class="up-sub">'+(vip?'VIP会员 · 畅听全部课程':'普通用户')+'</div><div class="up-stats"><div><b>'+purchased+'</b><span>已购</span></div><div><b>'+(vip?'∞':(C.user.freeQuota-Auth.getUsedFree()))+'</b><span>免费额度</span></div></div><button class="btn-ghost" id="up-logout">退出登录</button>'; document.getElementById('up-logout').onclick=function(){ Auth.logout(); refreshUserPanel(); toast('已退出登录'); }; } }

  // ---------- 登录/注册弹窗 ----------
  var UI = { openLogin: function (msg) { var html='<div class="auth"><div class="auth-tabs"><button class="active" data-tab="login">登录</button><button data-tab="reg">注册</button></div>'
    +'<div class="auth-msg" id="auth-msg">'+(msg||'')+'</div>'
    +'<div class="auth-pane" id="pane-login"><input id="l-id" placeholder="邮箱或用户名" autocomplete="username"><input id="l-pw" type="password" placeholder="密码" autocomplete="current-password"><button class="btn-primary" id="l-sub">登录</button></div>'
    +'<div class="auth-pane hidden" id="pane-reg"><input id="r-mail" placeholder="邮箱" autocomplete="email"><input id="r-name" placeholder="用户名" autocomplete="username"><input id="r-pw" type="password" placeholder="密码（大小写+数字+特殊字符，≥8位）" autocomplete="new-password"><div class="pw-tip" id="pw-tip"></div><button class="btn-primary" id="r-sub">注册</button></div></div>';
    Pay && Pay._open ? 0 : 0; var m=document.createElement('div'); m.id='th-auth-modal'; m.innerHTML='<div class="th-modal-mask"></div><div class="th-modal auth-modal" role="dialog">'+html+'</div>'; document.body.appendChild(m); m.querySelector('.th-modal-mask').onclick=function(){m.remove();}; m.querySelectorAll('.auth-tabs button').forEach(function(b){b.onclick=function(){m.querySelectorAll('.auth-tabs button').forEach(function(x){x.classList.remove('active');});b.classList.add('active');m.querySelector('pane-login').classList.toggle('hidden',b.dataset.tab!=='login');m.querySelector('pane-reg').classList.toggle('hidden',b.dataset.tab!=='reg');};}); m.querySelector('r-pw').addEventListener('input',function(){var t=Auth.passwordStrength(this.value);m.querySelector('pw-tip').textContent=t.msg;m.querySelector('pw-tip').className='pw-tip '+(t.ok?'ok':'bad');}); m.querySelector('l-sub').onclick=function(){var r=Auth.login(m.querySelector('l-id').value.trim(),m.querySelector('r-pw').value);m.querySelector('auth-msg').textContent=r.msg;if(r.ok){m.remove();refreshUserPanel();toast('登录成功','success');}}; m.querySelector('r-sub').onclick=function(){var r=Auth.register(m.querySelector('r-mail').value.trim(),m.querySelector('r-name').value.trim(),m.querySelector('r-pw').value);m.querySelector('auth-msg').textContent=r.msg;if(r.ok){m.querySelector('auth-msg').className='auth-msg ok';m.querySelector('pane-login').classList.remove('hidden');m.querySelector('pane-reg').classList.add('hidden');m.querySelectorAll('.auth-tabs button').forEach(function(x){x.classList.toggle('active',x.dataset.tab==='login');});}}; }, openReg: function(msg){ UI.openLogin(msg); setTimeout(function(){var b=document.querySelector('.auth-tabs button[data-tab="reg"]');if(b)b.click();},0); } };
  global.TechHubUI = UI;

  // ---------- 入场动画 ----------
  function initAnimations() { if (!('IntersectionObserver' in window)) return; var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);}});},{threshold:0.12}); $$('.course-card,.res-card,.rank-item,.gh-card,.bili-card,.road-card,.news-item,.stat-item').forEach(function(el){el.classList.add('anim');io.observe(el);}); }

  // ---------- 数字增长动画（Hero）----------
  function initHeroNumbers() { animateStats(); }

  // ---------- 版权保护 ----------
  function initCopyright() { document.addEventListener('contextmenu',function(e){var t=e.target;if(t&&t.closest&&t.closest('.course-card,.detail'))e.preventDefault();}); console.log('%c⚠ TechHub Pro © 2026 svcliny (方). All Rights Reserved.','color:#07c160;font-size:14px;font-weight:bold;'); console.log('%c未经授权复制/篡改课程内容将被记录。','color:#999;'); }

  // ---------- 初始化 ----------
  function init() {
    if (!D || !D.courses) { console.error('TechHubData 未加载'); return; }
    renderCourses(D.courses); initCategoryFilter(); renderResources(); renderRankings(); renderGithub(); renderBilibili(); renderRoadmaps(); renderNews();
    initNav(); initTheme(); initAnimations(); initHeroNumbers(); initCopyright(); refreshUserPanel();
    var userBtn=$('#user-btn'); if(userBtn) userBtn.onclick=function(){ UI.openLogin(); };
    var loginCta=$('#login-cta'); if(loginCta) loginCta.onclick=function(){ UI.openLogin(); };
    window.addEventListener('scroll',function(){var n=document.querySelector('.navbar');if(n)n.classList.toggle('scrolled',window.scrollY>20);},{passive:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(typeof window !== 'undefined' ? window : globalThis);
