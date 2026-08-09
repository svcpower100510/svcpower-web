/**
 * TechHub Pro v4.0 — 主逻辑
 * 功能：动态加载课程 / 分类筛选 / 价格筛选 / 主题切换 / 付费跳转 / 版权保护
 */
(function () {
  'use strict';

  const DATA_URLS = [
    'data/courses.json',
    'https://techhub-svcliny.pages.dev/data/courses.json',
    'https://cdn.jsdelivr.net/gh/svcpower100510/svcpower-web@main/data/courses.json',
  ];

  let COURSES = [];
  let state = {
    filterCat: 'all',
    filterPrice: 'all', // all | free | paid | lt30 | 30to60 | gt60
    search: '',
    sortBy: 'default', // default | priceAsc | priceDesc | rating
  };

  // ========== 数据加载 ==========
  async function loadCourses() {
    for (const url of DATA_URLS) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          COURSES = data;
          console.log(`[TechHub] 课程数据已加载 (${data.length}门) 来源: ${url}`);
          return true;
        }
      } catch (e) { /* try next */ }
    }
    // 全部失败 → 兜底
    COURSES = window.TechHubData && TechHubData.fallbackCourses || [];
    console.warn('[TechHub] 使用内嵌兜底数据:', COURSES.length, '门');
    return COURSES.length > 0;
  }

  // ========== 渲染 ==========
  function renderCourses() {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;
    let list = COURSES.slice();

    // 分类
    if (state.filterCat !== 'all') {
      list = list.filter(c => c.category === state.filterCat);
    }
    // 价格
    if (state.filterPrice === 'free') list = list.filter(c => c.isFree);
    else if (state.filterPrice === 'paid') list = list.filter(c => !c.isFree);
    else if (state.filterPrice === 'lt30') list = list.filter(c => !c.isFree && c.price < 30);
    else if (state.filterPrice === '30to60') list = list.filter(c => c.price >= 30 && c.price <= 60);
    else if (state.filterPrice === 'gt60') list = list.filter(c => c.price > 60);
    // 搜索
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.instructor || '').toLowerCase().includes(q)
      );
    }
    // 排序
    if (state.sortBy === 'priceAsc') list.sort((a, b) => a.price - b.price);
    else if (state.sortBy === 'priceDesc') list.sort((a, b) => b.price - a.price);
    else if (state.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

    if (list.length === 0) {
      grid.innerHTML = '<div class="empty-tip">没有找到匹配的课程，换个关键词试试 🔍</div>';
      return;
    }

    const purchased = getPurchased();
    grid.innerHTML = list.map(c => {
      const isPaid = !c.isFree && purchased[c.id];
      const btnLabel = c.isFree ? '🎬 免费开始' : (isPaid ? '✅ 开始学习' : `🔒 购买 ¥${c.price}`);
      const btnClass = c.isFree ? 'btn-free' : (isPaid ? 'btn-paid' : 'btn-buy');
      const priceTag = c.isFree
        ? '<span class="badge badge-free">免费</span>'
        : `<span class="badge badge-price">¥${c.price}</span>`;
      return `
      <article class="course-card" data-id="${c.id}" data-cat="${c.category}" data-price="${c.price}">
        <div class="card-cover" style="background:linear-gradient(135deg, var(--accent), var(--accent2))">
          <span class="card-cat">${c.categoryLabel || c.category}</span>
          ${priceTag}
        </div>
        <div class="card-body">
          <h3>${c.title}</h3>
          <p class="card-desc">${(c.description || '').slice(0, 90)}</p>
          <div class="card-meta">
            <span>⭐ ${c.rating}</span>
            <span>👨‍🏫 ${c.instructor || 'svcliny'}</span>
            <span>⏱ ${c.duration || ''}</span>
          </div>
          <div class="card-actions">
            <button class="${btnClass}" data-action="buy" data-id="${c.id}">${btnLabel}</button>
            <button class="btn-detail" data-action="detail" data-id="${c.id}">详情</button>
          </div>
        </div>
      </article>`;
    }).join('');

    bindCardActions();
    updateCounters(list.length);
  }

  function updateCounters(n) {
    const el = document.getElementById('result-count');
    if (el) el.textContent = `共 ${n} 门课程`;
  }

  // ========== 卡片交互 ==========
  function bindCardActions() {
    document.querySelectorAll('[data-action="buy"]').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const course = COURSES.find(c => c.id === id);
        if (!course) return;
        if (course.isFree) {
          // 免费 → 直接跳转
          window.open(course.redirectUrl || course.bilibiliUrl || 'https://techhub-svcliny.pages.dev', '_blank');
          return;
        }
        // 已购 → 跳转
        const purchased = getPurchased();
        if (purchased[id]) {
          window.open(course.redirectUrl || course.resourceUrl || course.bilibiliUrl, '_blank');
          return;
        }
        // 未购 → 唤起支付
        if (window.TechHubPayment) {
          window.TechHubPayment.startPurchase(course);
        }
      });
    });
    document.querySelectorAll('[data-action="detail"]').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const course = COURSES.find(c => c.id === id);
        if (course && window.TechHubPayment) {
          window.TechHubPayment.showDetail(course);
        }
      });
    });
  }

  // ========== 筛选 UI ==========
  function setupFilters() {
    const cats = ['all', ...new Set(COURSES.map(c => c.category))];
    const catBar = document.getElementById('filter-categories');
    if (catBar) {
      catBar.innerHTML = cats.map(c => {
        const label = c === 'all' ? '全部' : (COURSES.find(x => x.category === c)?.categoryLabel || c);
        return `<button class="chip ${c === 'all' ? 'active' : ''}" data-cat="${c}">${label}</button>`;
      }).join('');
      catBar.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', e => {
          catBar.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          e.target.classList.add('active');
          state.filterCat = e.target.dataset.cat;
          renderCourses();
        });
      });
    }

    const priceBar = document.getElementById('filter-price');
    if (priceBar) {
      const prices = [
        ['all', '全部价格'], ['free', '免费'], ['lt30', '<¥30'],
        ['30to60', '¥30-60'], ['gt60', '>¥60'],
      ];
      priceBar.innerHTML = prices.map(([v, l]) =>
        `<button class="chip ${v === 'all' ? 'active' : ''}" data-price="${v}">${l}</button>`
      ).join('');
      priceBar.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', e => {
          priceBar.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          e.target.classList.add('active');
          state.filterPrice = e.target.dataset.price;
          renderCourses();
        });
      });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let timer;
      searchInput.addEventListener('input', e => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          state.search = e.target.value.trim();
          renderCourses();
        }, 200);
      });
    }

    const sortSel = document.getElementById('sort-select');
    if (sortSel) {
      sortSel.addEventListener('change', e => {
        state.sortBy = e.target.value;
        renderCourses();
      });
    }
  }

  // ========== 主题 ==========
  function setupTheme() {
    const saved = localStorage.getItem('techhub-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = saved === 'dark' ? '☀️' : '🌙';
      btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('techhub-theme', next);
        btn.textContent = next === 'dark' ? '☀️' : '🌙';
      });
    }
  }

  // ========== 导航高亮 ==========
  function setupNav() {
    const links = document.querySelectorAll('.nav a[href^="#"]');
    const sections = [...document.querySelectorAll('section[id]')];
    const onScroll = () => {
      const y = window.scrollY + 120;
      let cur = '';
      sections.forEach(s => { if (s.offsetTop <= y) cur = s.id; });
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ========== 购买记录（localStorage + 校验和） ==========
  function getPurchased() {
    try {
      const raw = localStorage.getItem('techhub-purchased');
      const sum = localStorage.getItem('techhub-purchased-sum');
      if (!raw) return {};
      const data = JSON.parse(raw);
      const calc = simpleChecksum(raw);
      if (calc !== sum) return {}; // 被篡改
      return data;
    } catch { return {}; }
  }

  function setPurchased(map) {
    const raw = JSON.stringify(map);
    localStorage.setItem('techhub-purchased', raw);
    localStorage.setItem('techhub-purchased-sum', simpleChecksum(raw));
  }

  function simpleChecksum(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return 'CK-' + Math.abs(h).toString(16);
  }

  // 暴露给 payment.js
  window.TechHubApp = {
    getCourses: () => COURSES,
    getCourse: (id) => COURSES.find(c => c.id === id),
    getPurchased,
    setPurchased,
    markPurchased: (id) => {
      const m = getPurchased();
      m[id] = { at: Date.now() };
      setPurchased(m);
    },
    redirectTo: (course) => {
      const url = course.redirectUrl || course.resourceUrl || course.bilibiliUrl || 'https://techhub-svcliny.pages.dev';
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    dataReady: () => COURSES.length > 0,
  };

  // ========== 版权保护 ==========
  function setupCopyright() {
    // 禁止右键（课程详情区域）
    document.addEventListener('contextmenu', e => {
      if (e.target.closest('.course-detail, .protected')) e.preventDefault();
    });
    // 禁止复制
    document.addEventListener('copy', e => {
      if (e.target.closest('.protected')) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '© svcliny. 内容受版权保护.');
      }
    });
    // 控制台警告
    console.log('%c⚠️ 警告', 'color:red;font-size:24px;font-weight:bold');
    console.log('%c本网站内容版权归 svcliny 所有，未经授权禁止复制、转载、爬取。', 'color:orange;font-size:14px');
    console.log('%c如有学习需求，请通过正规渠道购买课程。邮箱: vhkex@outlook.com', 'color:#888;font-size:12px');
    // 页脚年份
    const y = document.getElementById('copyright-year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // ========== 渲染其他模块 ==========
  function renderBilibili() {
    const wrap = document.getElementById('bilibili-list');
    if (!wrap || !window.TechHubData) return;
    wrap.innerHTML = (TechHubData.bilibili || []).map(v => `
      <a class="bili-card" href="${v.url}" target="_blank" rel="noopener">
        <div class="bili-cover">▶ ${v.title.slice(0, 2)}</div>
        <div class="bili-body">
          <h4>${v.title}</h4>
          <div class="bili-meta">
            <span>👤 ${v.up}</span>
            <span>👁 ${v.views}</span>
            <span>💬 ${v.danmaku}</span>
          </div>
        </div>
      </a>`).join('');
  }

  function renderGithub() {
    const wrap = document.getElementById('github-list');
    if (!wrap || !window.TechHubData) return;
    wrap.innerHTML = (TechHubData.github || []).map(r => `
      <a class="gh-card" href="${r.url}" target="_blank" rel="noopener">
        <div class="gh-header">
          <span class="gh-name">📦 ${r.name}</span>
          <span class="gh-lang">${r.lang}</span>
        </div>
        <p>${r.desc}</p>
        <div class="gh-meta">
          <span>⭐ ${r.stars}</span>
          <span>🍴 ${r.forks}</span>
          <span class="gh-cat">${r.cat}</span>
        </div>
      </a>`).join('');
  }

  function renderResources() {
    const wrap = document.getElementById('resources-list');
    if (!wrap || !window.TechHubData) return;
    wrap.innerHTML = (TechHubData.resources || []).map(r => `
      <a class="res-card tag-${r.tag === '必看' ? 'must' : r.tag === '免费' ? 'free' : 'pro'}" href="${r.url}" target="_blank" rel="noopener">
        <h4>${r.name}</h4>
        <p>${r.desc}</p>
        <span class="res-tag">${r.tag}</span>
      </a>`).join('');
  }

  function renderRankings() {
    const wrap = document.getElementById('rankings-list');
    if (!wrap || !window.TechHubData) return;
    wrap.innerHTML = (TechHubData.rankings || []).map(r => `
      <div class="rank-card">
        <div class="rank-head">
          <span class="rank-no">#${r.rank}</span>
          <span class="rank-name">${r.name}</span>
          <span class="rank-score">${r.score}分</span>
          <a class="rank-link" href="${r.url}" target="_blank" rel="noopener">↗</a>
        </div>
        <div class="rank-bar"><div style="width:${r.score}%"></div></div>
        <p>${r.reason}</p>
      </div>`).join('');
  }

  function renderPaths() {
    const wrap = document.getElementById('paths-list');
    if (!wrap || !window.TechHubData) return;
    wrap.innerHTML = (TechHubData.paths || []).map(p => `
      <div class="path-card">
        <h4>${p.title}</h4>
        <span class="path-dur">⏱ ${p.duration}</span>
        <ol>${(p.steps || []).map(s => `<li>${s}</li>`).join('')}</ol>
        <a class="path-link" href="${p.url}" target="_blank" rel="noopener">查看完整路线图 →</a>
      </div>`).join('');
  }

  // ========== 启动 ==========
  async function init() {
    setupTheme();
    setupCopyright();
    setupNav();
    renderBilibili();
    renderGithub();
    renderResources();
    renderRankings();
    renderPaths();

    await loadCourses();
    setupFilters();
    renderCourses();

    // 通知 payment 模块数据就绪
    if (window.TechHubPayment && window.TechHubPayment.onDataReady) {
      window.TechHubPayment.onDataReady(COURSES);
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
