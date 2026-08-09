/**
 * TechHub Pro v4.0 — Analytics 模块
 * 用户行为分析 / 性能监控 / 错误上报 / A/B 测试
 * 全部本地处理，不上传任何隐私数据
 */
(function () {
  'use strict';
  const KEY = 'techhub-analytics';
  const MAX_EVENTS = 500;

  // ========== 事件存储 ==========
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{"events":[],"session":{}}'); }
    catch { return { events: [], session: {} }; }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }

  const state = load();
  if (!state.session.id) {
    state.session = {
      id: 'S-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      start: Date.now(),
      referrer: document.referrer || 'direct',
      landing: location.pathname + location.hash,
      userAgent: navigator.userAgent,
    };
    save(state);
  }

  function track(event, props) {
    const ev = { t: Date.now(), e: event, p: props || {} };
    state.events.push(ev);
    if (state.events.length > MAX_EVENTS) state.events.splice(0, state.events.length - MAX_EVENTS);
    save(state);
    // 控制台（开发模式）
    if (location.hostname === 'localhost' || location.search.includes('debug=1')) {
      console.log('%c📊 Analytics', 'color:#00d4ff', event, props || '');
    }
  }

  // ========== 自动采集 ==========
  // 页面访问
  track('page_view', { path: location.pathname, hash: location.hash, title: document.title });

  // 滚动深度
  let maxDepth = 0;
  window.addEventListener('scroll', () => {
    const depth = Math.round((window.scrollY / (document.body.scrollHeight - innerHeight)) * 100);
    if (depth > maxDepth) { maxDepth = depth; }
  }, { passive: true });
  window.addEventListener('beforeunload', () => {
    track('scroll_depth', { max: maxDepth });
    track('session_end', { duration: Date.now() - state.session.start });
  });

  // 课程卡片点击
  document.addEventListener('click', e => {
    const card = e.target.closest('.course-card');
    if (card) {
      track('course_click', { id: card.dataset.id, cat: card.dataset.cat });
    }
    const buyBtn = e.target.closest('[data-action="buy"]');
    if (buyBtn) {
      track('purchase_intent', { id: buyBtn.dataset.id });
    }
    const detailBtn = e.target.closest('[data-action="detail"]');
    if (detailBtn) {
      track('detail_open', { id: detailBtn.dataset.id });
    }
    const bili = e.target.closest('.bili-card');
    if (bili) track('bilibili_click', {});
    const gh = e.target.closest('.gh-card');
    if (gh) track('github_click', {});
  });

  // 搜索
  let searchTimer;
  document.addEventListener('input', e => {
    if (e.target.id !== 'search-input') return;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      track('search', { q: e.target.value, len: e.target.value.length });
    }, 500);
  });

  // 筛选
  document.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) {
      track('filter', { type: chip.dataset.cat ? 'category' : 'price', value: chip.dataset.cat || chip.dataset.price });
    }
  });

  // 主题切换
  document.addEventListener('click', e => {
    if (e.target.id === 'theme-toggle') {
      track('theme_toggle', { to: document.documentElement.getAttribute('data-theme') });
    }
  });

  // ========== 性能监控 ==========
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perf = performance.timing;
      const nav = performance.getEntriesByType('navigation')[0];
      const metrics = {
        dns: perf.domainLookupEnd - perf.domainLookupStart,
        tcp: perf.connectEnd - perf.connectStart,
        ttfb: perf.responseStart - perf.requestStart,
        domReady: perf.domContentLoadedEventEnd - perf.navigationStart,
        loadComplete: perf.loadEventEnd - perf.navigationStart,
        domElements: document.getElementsByTagName('*').length,
      };
      if (nav) {
        metrics.transferSize = nav.transferSize;
        metrics.encodedBodySize = nav.encodedBodySize;
      }
      track('performance', metrics);
      // Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          new PerformanceObserver(list => {
            for (const e of list.getEntries()) {
              if (e.entryType === 'largest-contentful-paint') {
                track('lcp', { value: Math.round(e.renderTime || e.loadTime) });
              } else if (e.entryType === 'first-input') {
                track('fid', { value: Math.round(e.processingStart - e.startTime) });
              } else if (e.entryType === 'layout-shift' && !e.hadRecentInput) {
                track('cls', { value: e.value.toFixed(4) });
              }
            }
          }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        } catch {}
      }
    }, 0);
  });

  // ========== 错误捕获 ==========
  window.addEventListener('error', e => {
    track('js_error', {
      msg: e.message, file: e.filename, line: e.lineno, col: e.colno,
    });
  });
  window.addEventListener('unhandledrejection', e => {
    track('promise_rejection', { reason: String(e.reason) });
  });

  // ========== A/B 测试 ==========
  const AB_TESTS = {
    'hero_cta_color': { a: '#00d4ff', b: '#7c3aed' },
    'card_hover_3d': { a: 'true', b: 'false' },
    'payment_modal_size': { a: 'normal', b: 'large' },
  };
  function getABVariant(testName) {
    const key = 'ab_' + testName;
    let v = localStorage.getItem(key);
    if (!v) { v = Math.random() < 0.5 ? 'a' : 'b'; localStorage.setItem(key, v); }
    return v;
  }
  // 应用变体
  const ctaColor = getABVariant('hero_cta_color');
  if (ctaColor === 'b') {
    document.documentElement.style.setProperty('--accent', '#7c3aed');
    track('ab_assign', { test: 'hero_cta_color', variant: 'b' });
  } else {
    track('ab_assign', { test: 'hero_cta_color', variant: 'a' });
  }

  // ========== 公开 API ==========
  window.TechHubAnalytics = {
    track,
    getEvents: () => state.events.slice(),
    getSession: () => ({ ...state.session }),
    getStats: () => {
      const evs = state.events;
      const counts = {};
      for (const e of evs) counts[e.e] = (counts[e.e] || 0) + 1;
      return {
        totalEvents: evs.length,
        sessionDuration: Date.now() - state.session.start,
        eventCounts: counts,
        scrollDepth: maxDepth,
      };
    },
    clear: () => { state.events = []; save(state); },
    exportJSON: () => JSON.stringify(state, null, 2),
    exportCSV: () => {
      const lines = ['timestamp,event,props'];
      for (const e of state.events) {
        lines.push(`${new Date(e.t).toISOString()},${e.e},"${JSON.stringify(e.p).replace(/"/g, '""')}"`);
      }
      return lines.join('\n');
    },
  };

  // 开发模式：暴露到控制台
  if (location.hostname === 'localhost' || location.search.includes('debug=1')) {
    console.log('%c📊 Analytics ready', 'color:#00d4ff;font-weight:bold',
      '\n  调用 TechHubAnalytics.getStats() 查看统计');
  }
})();
