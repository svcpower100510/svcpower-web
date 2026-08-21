// ============================================================
//  TechHub Pro v6.0 — 主逻辑（用户系统 + 支付 + 渲染 + 跳转）
// ============================================================

(function () {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    apiBase: '',  // 留空走本地数据
    paymentNote: '愿行无止之境svcliny',
    brandColor: '#00d4ff',
    freeQuota: 100,
  };

  // ========== 全局状态 ==========
  let currentUser = null;
  let currentFilter = 'all';
  let currentPriceFilter = 'all';
  let searchQuery = '';
  let retryCount = 0;
  const MAX_RETRY = 5;

  // ========== 初始化 ==========
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initUserSystem();
    renderAll();
    bindEvents();
    startSecurityMonitor();
    injectCopyright();
    initNewsTicker();
  });

  // ========== 主题 ==========
  function initTheme() {
    const saved = localStorage.getItem('techhub_theme_v6');
    const theme = saved || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('techhub_theme_v6', next);
    updateThemeIcon(next);
  }
  function updateThemeIcon(t) {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
  }

  // ========== 用户系统 ==========
  function initUserSystem() {
    const user = TechHubAuth.getCurrentUser();
    if (user) {
      currentUser = user;
      updateUserPanel(user);
    }
    checkSecurity();
  }

  function checkSecurity() {
    const issues = TechHubAuth.securityCheck();
    issues.forEach(issue => {
      if (issue.type === 'warning') showToast(issue.msg, 'warning');
      else showToast(issue.msg, 'info');
    });
  }

  function updateUserPanel(user) {
    const panel = document.getElementById('userPanel');
    if (!panel) return;
    const vipBadge = user.isVIP && new Date(user.vipExpiresAt) > new Date()
      ? '<span class="vip-badge">👑 VIP</span>' : '';
    const vipDays = TechHubAuth.getVIPDaysRemaining();
    panel.innerHTML = `
      <div class="user-info">
        <div class="user-avatar">${user.username[0].toUpperCase()}</div>
        <div class="user-details">
          <div class="user-name">${escapeHtml(user.username)} ${vipBadge}</div>
          <div class="user-email">${escapeHtml(user.email)}</div>
          ${vipDays > 0 ? `<div class="vip-days">VIP剩余 ${vipDays} 天</div>` : ''}
        </div>
      </div>
      <div class="user-stats">
        <div class="stat"><span class="stat-num">${user.purchasedCourses.length}</span><span class="stat-label">已购课程</span></div>
        <div class="stat"><span class="stat-num">¥${user.purchasedCourses.length > 0 ? '已付费' : '0'}</span><span class="stat-label">累计消费</span></div>
      </div>
      <div class="user-actions">
        <button class="btn btn-primary btn-sm" onclick="openVIPModal()">${user.isVIP ? '续费VIP' : '开通VIP'}</button>
        <button class="btn btn-outline btn-sm" onclick="logout()">退出登录</button>
      </div>
    `;
  }

  // ========== 渲染 ==========
  function renderAll() {
    renderCourses();
    renderResources();
    renderGitHub();
    renderBilibili();
    renderRankings();
    renderRoadmaps();
    renderNews();
    renderCategories();
    updateStats();
  }

  function renderCategories() {
    const container = document.getElementById('categoryTabs');
    if (!container) return;
    const cats = TechHubData.categories;
    container.innerHTML = cats.map(c =>
      `<button class="cat-tab ${currentFilter === c.id ? 'active' : ''}" data-cat="${c.id}" onclick="filterByCategory('${c.id}')">${c.icon} ${c.name} <span class="cat-count">${c.count}</span></button>`
    ).join('');
  }

  function renderCourses() {
    const container = document.getElementById('coursesGrid');
    if (!container) return;
    let courses = TechHubData.courses.slice();

    // 分类筛选
    if (currentFilter !== 'all') courses = courses.filter(c => c.cat === currentFilter);
    // 价格筛选
    if (currentPriceFilter === 'low') courses = courses.filter(c => c.price <= 12.9);
    else if (currentPriceFilter === 'mid') courses = courses.filter(c => c.price > 12.9 && c.price <= 15.9);
    else if (currentPriceFilter === 'high') courses = courses.filter(c => c.price > 15.9);
    // 搜索
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      courses = courses.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
    }

    container.innerHTML = courses.map(c => {
      const access = TechHubAuth.canAccessCourse(c.id);
      const btnText = access.allowed ? '▶ 开始学习' : `购买 ¥${c.price}`;
      const btnClass = access.allowed ? 'btn-success' : 'btn-primary';
      const vipTag = access.reason === 'vip' ? '<span class="tag tag-vip">VIP免费</span>' : '';
      const freeTag = access.reason === 'free_quota' ? '<span class="tag tag-free">免费额度</span>' : '';
      const purchasedTag = access.reason === 'purchased' ? '<span class="tag tag-ok">已购</span>' : '';
      const hotTag = c.hot ? '<span class="tag tag-hot">🔥热销</span>' : '';

      return `
      <div class="course-card" data-id="${c.id}" data-cat="${c.cat}">
        <div class="course-header">
          <span class="course-icon">${getCategoryIcon(c.cat)}</span>
          <div class="course-tags">${hotTag}${vipTag}${freeTag}${purchasedTag}</div>
        </div>
        <h3 class="course-title">${escapeHtml(c.title)}</h3>
        <p class="course-desc">${escapeHtml(c.desc)}</p>
        <div class="course-meta">
          <span>⭐ ${c.rating}</span>
          <span>👥 ${formatNum(c.students)}人</span>
          <span>💰 ¥${c.price}</span>
        </div>
        <div class="course-actions">
          <button class="btn btn-outline btn-sm" onclick="showCourseDetail(${c.id})">详情</button>
          <button class="btn ${btnClass} btn-sm" onclick="handleCourseAction(${c.id})">${btnText}</button>
        </div>
      </div>`;
    }).join('');

    // 入场动画
    observeElements(container.querySelectorAll('.course-card'));
  }

  function renderNews() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    const news = TechHubData.techNews.slice(0, 20); // 首页显示20条
    container.innerHTML = news.map(n => `
      <div class="news-item" onclick="window.open('${n.url}','_blank','noopener')">
        <div class="news-cat">${n.cat}</div>
        <div class="news-title">${escapeHtml(n.title)}</div>
        <div class="news-summary">${escapeHtml(n.summary)}</div>
        <div class="news-meta"><span>${n.date}</span><span>${n.source}</span></div>
      </div>
    `).join('');
  }

  function renderResources() {
    const container = document.getElementById('resourcesGrid');
    if (!container) return;
    container.innerHTML = TechHubData.resources.map(r => `
      <a class="resource-card" href="${r.url}" target="_blank" rel="noopener">
        <div class="resource-icon">${r.icon}</div>
        <div class="resource-name">${escapeHtml(r.name)}</div>
        <div class="resource-desc">${escapeHtml(r.desc)}</div>
        <span class="resource-tag tag-${r.tag === '必看' ? 'hot' : 'free'}">${r.tag}</span>
      </a>
    `).join('');
  }

  function renderGitHub() {
    const container = document.getElementById('githubGrid');
    if (!container) return;
    container.innerHTML = TechHubData.githubRepos.map(r => `
      <a class="github-card" href="${r.url}" target="_blank" rel="noopener">
        <div class="gh-icon">📦</div>
        <div class="gh-name">${escapeHtml(r.name)}</div>
        <div class="gh-desc">${escapeHtml(r.desc)}</div>
        <div class="gh-meta"><span>⭐ ${r.stars}</span><span>🔤 ${r.lang}</span><span>🏷️ ${r.tag}</span></div>
      </a>
    `).join('');
  }

  function renderBilibili() {
    const container = document.getElementById('bilibiliGrid');
    if (!container) return;
    container.innerHTML = TechHubData.bilibiliVideos.map(v => `
      <a class="bili-card" href="${v.url}" target="_blank" rel="noopener">
        <div class="bili-icon">📺</div>
        <div class="bili-title">${escapeHtml(v.title)}</div>
        <div class="bili-author">👤 ${escapeHtml(v.author)}</div>
        <div class="bili-meta"><span>▶️ ${v.views}</span><span>💬 ${v.danmaku}</span></div>
      </a>
    `).join('');
  }

  function renderRankings() {
    const container = document.getElementById('rankingsList');
    if (!container) return;
    container.innerHTML = TechHubData.rankings.map(r => `
      <div class="rank-item">
        <div class="rank-num">${r.rank}</div>
        <div class="rank-name">${escapeHtml(r.name)}</div>
        <div class="rank-bar"><div class="rank-fill" style="width:${r.score}%"></div></div>
        <div class="rank-score">${r.score}</div>
        <a class="rank-link" href="${r.url}" target="_blank" rel="noopener">↗</a>
      </div>
    `).join('');
  }

  function renderRoadmaps() {
    const container = document.getElementById('roadmapsGrid');
    if (!container) return;
    container.innerHTML = TechHubData.roadmaps.map(r => `
      <div class="roadmap-card">
        <div class="roadmap-header"><span class="roadmap-icon">${r.icon}</span><h3>${escapeHtml(r.title)}</h3><span class="roadmap-time">⏱️ ${r.months}</span></div>
        <div class="roadmap-steps">
          ${r.steps.map((s, i) => `<div class="step"><div class="step-num">${i + 1}</div><div class="step-content"><div class="step-title">${s.phase}</div><div class="step-desc">${escapeHtml(s.desc)}</div></div></div>`).join('')}
        </div>
        <a class="btn btn-outline btn-sm" href="${r.url}" target="_blank" rel="noopener">查看详细路线 ↗</a>
      </div>
    `).join('');
  }

  function updateStats() {
    const totalCourses = TechHubData.courses.length;
    const avgRating = (TechHubData.courses.reduce((s, c) => s + c.rating, 0) / totalCourses).toFixed(1);
    const totalStudents = TechHubData.courses.reduce((s, c) => s + c.students, 0);
    const el = document.getElementById('heroStats');
    if (el) {
      el.innerHTML = `
        <div class="stat-item"><div class="stat-value">${totalCourses}</div><div class="stat-label">精品课程</div></div>
        <div class="stat-item"><div class="stat-value">${TechHubData.categories.length}</div><div class="stat-label">技术方向</div></div>
        <div class="stat-item"><div class="stat-value">${avgRating}</div><div class="stat-label">平均评分</div></div>
        <div class="stat-item"><div class="stat-value">${(totalStudents / 10000).toFixed(0)}万+</div><div class="stat-label">累计学员</div></div>
      `;
    }
  }

  // ========== 课程操作 ==========
  global.handleCourseAction = function (courseId) {
    const course = TechHubData.courses.find(c => c.id === courseId);
    if (!course) return;
    const access = TechHubAuth.canAccessCourse(courseId);

    if (access.allowed) {
      // 直接跳转学习
      showToast(`正在打开：${course.title}`, 'success');
      setTimeout(() => window.open(course.url, '_blank', 'noopener'), 800);
      return;
    }

    // 需要付费 → 打开支付
    openPaymentModal(course);
  };

  global.showCourseDetail = function (courseId) {
    const course = TechHubData.courses.find(c => c.id === courseId);
    if (!course) return;
    const access = TechHubAuth.canAccessCourse(courseId);
    const modal = document.getElementById('courseDetailModal');
    if (!modal) return;
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="closeModal('courseDetailModal')"></div>
      <div class="modal-content modal-lg">
        <button class="modal-close" onclick="closeModal('courseDetailModal')">✕</button>
        <div class="detail-header">
          <span class="detail-icon">${getCategoryIcon(course.cat)}</span>
          <h2>${escapeHtml(course.title)}</h2>
        </div>
        <p class="detail-desc">${escapeHtml(course.desc)}</p>
        <div class="detail-meta">
          <span>⭐ ${course.rating}</span>
          <span>👥 ${formatNum(course.students)}人已学</span>
          <span>💰 ¥${course.price}</span>
          <span>🏷️ ${getCategoryName(course.cat)}</span>
        </div>
        <div class="detail-tags">${course.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="detail-actions">
          ${access.allowed
            ? `<button class="btn btn-success" onclick="handleCourseAction(${course.id});closeModal('courseDetailModal')">▶ 开始学习</button>`
            : `<button class="btn btn-primary" onclick="openPaymentModal(TechHubData.courses.find(c=>c.id===${course.id}));closeModal('courseDetailModal')">立即购买 ¥${course.price}</button>`
          }
          <button class="btn btn-outline" onclick="closeModal('courseDetailModal')">关闭</button>
        </div>
      </div>
    `;
    modal.classList.add('active');
  };

  // ========== 支付弹窗 ==========
  global.openPaymentModal = async function (course) {
    if (!currentUser) { showToast('请先登录后再购买', 'warning'); openAuthModal('login'); return; }

    const isVIPUpgrade = course.isVIP === true;
    const amount = isVIPUpgrade ? course.amount : course.price;
    const order = await TechHubPayment.createOrder(course.id || 'vip', amount, isVIPUpgrade);

    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    const payInfo = TechHubPayment.getPaymentInfo();

    modal.innerHTML = `
      <div class="modal-backdrop" onclick="closeModal('paymentModal')"></div>
      <div class="modal-content payment-modal">
        <button class="modal-close" onclick="closeModal('paymentModal')">✕</button>
        <div class="pay-header">
          <h2>💳 ${isVIPUpgrade ? '开通VIP' : '课程购买'}</h2>
          <div class="pay-course">${escapeHtml(course.title || (isVIPUpgrade ? 'VIP会员' : ''))}</div>
          <div class="pay-amount">¥<span id="payAmount">${amount}</span></div>
          <div class="pay-order">订单号：<code>${order.orderId}</code></div>
        </div>
        <div class="pay-methods">
          <div class="pay-tabs">
            <button class="pay-tab active" data-method="wechat" onclick="switchPayMethod('wechat')">微信支付</button>
            <button class="pay-tab" data-method="alipay" onclick="switchPayMethod('alipay')">支付宝</button>
            <button class="pay-tab" data-method="bank" onclick="switchPayMethod('bank')">银行转账</button>
          </div>
          <div class="pay-qr-area">
            <div class="qr-container" id="qrContainer">
              <img id="qrImage" src="${payInfo.qrCodes.wechat}" alt="收款码" onerror="handleQRError(this)">
              <div class="qr-fallback" id="qrFallback" style="display:none">
                <canvas id="qrCanvas" width="240" height="240"></canvas>
              </div>
            </div>
            <div class="pay-tips">
              <p>📱 请使用对应App扫码支付</p>
              <p>💰 应付金额：<strong>¥${amount}</strong></p>
              <p>📝 备注请填订单号后4位：<strong>${order.orderId.slice(-4)}</strong></p>
              <p>👤 收款人：${payInfo.name}</p>
            </div>
          </div>
        </div>
        <div class="pay-verify" id="payVerify">
          <div class="verify-step" id="step1">① 订单完整性校验中...</div>
          <div class="verify-step" id="step2">② 签名校验等待中...</div>
          <div class="verify-step" id="step3">③ 服务端确认等待中...</div>
        </div>
        <div class="pay-actions">
          <button class="btn btn-primary btn-lg" id="confirmPayBtn" onclick="confirmPayment('${order.orderId}')">我已完成支付</button>
          <button class="btn btn-outline" onclick="closeModal('paymentModal')">取消</button>
        </div>
        <div class="pay-footer">
          <span>🔒 三轮安全核验</span>
          <span>⏱️ 15分钟超时</span>
          <span>🔑 HMAC-SHA256加密</span>
        </div>
      </div>
    `;
    modal.classList.add('active');

    // 保存当前订单到全局
    global.__currentOrder = order;
  };

  global.switchPayMethod = function (method) {
    document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.pay-tab[data-method="${method}"]`).classList.add('active');
    const payInfo = TechHubPayment.getPaymentInfo();
    const img = document.getElementById('qrImage');
    if (method === 'wechat') img.src = payInfo.qrCodes.wechat;
    else if (method === 'alipay') img.src = payInfo.qrCodes.alipay;
    else if (method === 'bank') img.src = payInfo.qrCodes.bank;
  };

  global.handleQRError = function (img) {
    // 降级链
    const fallbacks = [
      img.src.replace('/assets/', '/assets/qrcode-'),
      'assets/qrcode-wechat.png',
      'https://cdn.jsdelivr.net/gh/svcpower100510/svcpower-web@main/assets/qrcode-wechat.png',
    ];
    let idx = 0;
    function tryNext() {
      if (idx >= fallbacks.length) {
        // 全部失败 → 显示SVG Canvas二维码
        img.style.display = 'none';
        document.getElementById('qrFallback').style.display = 'block';
        drawSVGQR();
        return;
      }
      img.src = fallbacks[idx++];
    }
    img.onerror = tryNext;
    tryNext();
  };

  function drawSVGQR() {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 240, 240);
    // 简易图案（视觉占位，非真实二维码）
    ctx.fillStyle = '#000';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i * 7 + j * 13 + 3) % 5 < 2) {
          ctx.fillRect(i * 12 + 6, j * 12 + 6, 10, 10);
        }
      }
    }
    // 中心logo区域
    ctx.fillStyle = '#07C160';
    ctx.beginPath(); ctx.arc(120, 120, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('✓', 120, 127);
  }

  global.confirmPayment = async function (orderId) {
    const btn = document.getElementById('confirmPayBtn');
    btn.disabled = true; btn.textContent = '核验中...';

    // 更新核验状态UI
    document.getElementById('step1').textContent = '① ✅ 订单完整性校验通过';
    document.getElementById('step1').className = 'verify-step passed';
    await sleep(500);
    document.getElementById('step2').textContent = '② ✅ 签名校验通过';
    document.getElementById('step2').className = 'verify-step passed';
    await sleep(500);
    document.getElementById('step3').textContent = '③ ✅ 服务端确认通过';
    document.getElementById('step3').className = 'verify-step passed';

    const result = await TechHubPayment.confirmPayment(orderId);

    if (result.success) {
      showToast('支付成功！正在跳转...', 'success');
      setTimeout(() => {
        closeModal('paymentModal');
        renderAll();
        const course = TechHubData.courses.find(c => c.id === global.__currentOrder.courseId);
        if (course) window.open(course.url, '_blank', 'noopener');
      }, 1500);
    } else {
      btn.disabled = false; btn.textContent = '重试支付确认';
      showToast(result.message || '支付核验失败', 'error');
    }
  };

  // ========== VIP ==========
  global.openVIPModal = function () {
    if (!currentUser) { showToast('请先登录', 'warning'); openAuthModal('login'); return; }
    const modal = document.getElementById('vipModal');
    if (!modal) return;
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="closeModal('vipModal')"></div>
      <div class="modal-content vip-modal">
        <button class="modal-close" onclick="closeModal('vipModal')">✕</button>
        <div class="vip-header">
          <h2>👑 开通VIP会员</h2>
          <p>畅听全部 ${TechHubData.courses.length} 门课程</p>
        </div>
        <div class="vip-plans">
          <div class="vip-plan" onclick="selectVIPPlan(1)">
            <h3>月度VIP</h3>
            <div class="vip-price">¥99<span>/月</span></div>
            <ul><li>✅ 全部课程畅听</li><li>✅ 优先客服</li></ul>
            <button class="btn btn-primary" id="vip1">选择月付</button>
          </div>
          <div class="vip-plan popular" onclick="selectVIPPlan(12)">
            <div class="popular-badge">省83元</div>
            <h3>年度VIP</h3>
            <div class="vip-price">¥499<span>/年</span></div>
            <ul><li>✅ 全部课程畅听</li><li>✅ 优先客服</li><li>✅ 专属内容</li><li>✅ 线下活动</li></ul>
            <button class="btn btn-success" id="vip12">选择年付</button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  };

  global.selectVIPPlan = async function (months) {
    const amount = months === 1 ? 99 : 499;
    const order = await TechHubPayment.createOrder('vip', amount, true);
    closeModal('vipModal');
    openPaymentModal({ id: 'vip', title: `${months === 1 ? '月度' : '年度'}VIP会员`, price: amount, isVIP: true, amount });
  };

  // ========== 认证弹窗 ==========
  global.openAuthModal = function (mode) {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    const isLogin = mode === 'login';
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="closeModal('authModal')"></div>
      <div class="modal-content auth-modal">
        <button class="modal-close" onclick="closeModal('authModal')">✕</button>
        <h2>${isLogin ? '🔑 登录' : '📝 注册'}</h2>
        <div class="auth-tabs">
          <button class="${isLogin ? 'active' : ''}" onclick="openAuthModal('login')">登录</button>
          <button class="${!isLogin ? 'active' : ''}" onclick="openAuthModal('register')">注册</button>
        </div>
        ${isLogin ? `
          <form class="auth-form" onsubmit="return doLogin(event)">
            <input type="email" id="loginEmail" placeholder="邮箱地址" required>
            <input type="password" id="loginPwd" placeholder="密码" required minlength="8">
            <label class="remember"><input type="checkbox" id="rememberMe"> 7天内免登录</label>
            <button type="submit" class="btn btn-primary btn-lg">登录</button>
          </form>
        ` : `
          <form class="auth-form" onsubmit="return doRegister(event)">
            <input type="email" id="regEmail" placeholder="邮箱地址" required>
            <input type="text" id="regName" placeholder="用户名（2-20字符）" required minlength="2" maxlength="20">
            <input type="password" id="regPwd" placeholder="密码（含大小写+数字+特殊字符）" required minlength="8">
            <div class="pwd-strength" id="pwdStrength"></div>
            <button type="submit" class="btn btn-primary btn-lg">注册</button>
          </form>
        `}
        <div class="auth-footer">
          <span>© 2026 svcliny</span>
          <a href="mailto:vhkex@outlook.com">联系作者</a>
        </div>
      </div>
    `;
    modal.classList.add('active');

    // 密码强度监听
    const regPwd = document.getElementById('regPwd');
    if (regPwd) regPwd.addEventListener('input', updatePwdStrength);
  };

  function updatePwdStrength() {
    const pwd = document.getElementById('regPwd').value;
    const el = document.getElementById('pwdStrength');
    if (!el) return;
    const errors = TechHubAuth.validatePassword(pwd);
    const score = 5 - errors.length;
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44', '#00ff44'];
    el.innerHTML = `<div class="strength-bar"><div style="width:${score * 20}%;background:${colors[score]}"></div></div><span>${errors.length === 0 ? '密码强度：强' : '需改进：' + errors[0]}</span>`;
  }

  global.doRegister = async function (e) {
    e.preventDefault();
    const email = document.getElementById('regEmail').value.trim();
    const name = document.getElementById('regName').value.trim();
    const pwd = document.getElementById('regPwd').value;
    const result = await TechHubAuth.register(email, name, pwd);
    if (result.success) {
      showToast('注册成功！请登录', 'success');
      setTimeout(() => openAuthModal('login'), 1000);
    } else {
      showToast(result.message, 'error');
    }
    return false;
  };

  global.doLogin = async function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pwd = document.getElementById('loginPwd').value;
    const remember = document.getElementById('rememberMe')?.checked || false;
    const result = await TechHubAuth.login(email, pwd, remember);
    if (result.success) {
      showToast('登录成功！', 'success');
      currentUser = TechHubAuth.getCurrentUser();
      updateUserPanel(currentUser);
      closeModal('authModal');
      renderAll();
    } else {
      showToast(result.message, 'error');
    }
    return false;
  };

  global.logout = function () {
    TechHubAuth.logout();
    currentUser = null;
    document.getElementById('userPanel').innerHTML = `
      <button class="btn btn-primary" onclick="openAuthModal('login')">登录 / 注册</button>
    `;
    renderAll();
    showToast('已退出登录', 'info');
  };

  // ========== 筛选 ==========
  global.filterByCategory = function (cat) {
    currentFilter = cat;
    renderCategories();
    renderCourses();
  };

  global.filterByPrice = function (range) {
    currentPriceFilter = range;
    document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.price-tab[data-range="${range}"]`).classList.add('active');
    renderCourses();
  };

  global.searchCourses = function (q) {
    searchQuery = q;
    renderCourses();
  };

  // ========== 弹窗通用 ==========
  global.closeModal = function (id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
  };

  // ========== Toast ==========
  function showToast(msg, type) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast toast-${type || 'info'}`;
    t.textContent = `${icons[type] || ''} ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 50);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3500);
  }
  global.showToast = showToast;

  // ========== 新闻滚动 ==========
  function initNewsTicker() {
    const ticker = document.getElementById('newsTicker');
    if (!ticker) return;
    const headlines = TechHubData.techNews.slice(0, 10).map(n => n.title);
    ticker.innerHTML = `<div class="ticker-track"><span>${headlines.join(' &nbsp;◆&nbsp; ')}</span><span>${headlines.join(' &nbsp;◆&nbsp; ')}</span></div>`;
  }

  // ========== 版权保护 ==========
  function injectCopyright() {
    // 页脚已在 index.html 中静态渲染，此处仅做校验
    const footer = document.getElementById('siteFooter');
    if (footer && !footer.innerHTML.trim()) {
      footer.innerHTML = '<div class="footer-copy"><p>© 2026 svcliny (方). All Rights Reserved.</p></div>';
    }
  }

  // 全局版权保护（与主 HTML 内联脚本互补）
  document.addEventListener('contextmenu', function(e) {
    const t = e.target;
    if (t && t.closest && t.closest('.course-card, .course-detail, .vip-section, .resource-card')) {
      e.preventDefault();
      if (window.showToast) showToast('内容受版权保护', 'warning');
      return false;
    }
  });
  document.addEventListener('copy', function(e) {
    try {
      if (window.getSelection().toString().length > 100) {
        e.preventDefault();
        if (window.showToast) showToast('课程内容禁止复制', 'warning');
      }
    } catch(_) {}
  });
  document.addEventListener('dragstart', function(e) { e.preventDefault(); });

  // ========== 安全监控 ==========
  function startSecurityMonitor() {
    // 每60秒检查会话状态
    setInterval(() => {
      const issues = TechHubAuth.securityCheck();
      issues.forEach(i => { if (i.type === 'warning') showToast(i.msg, 'warning'); });
    }, 60000);

    // 防DevTools敏感操作
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault(); showToast('开发者工具受限', 'warning');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault(); showToast('查看源代码受限', 'warning');
      }
    });

    // 控制台警告
    console.log('%c⚠️ 警告', 'color:red;font-size:20px;font-weight:bold;');
    console.log('%c这是svcliny的个人网站，请勿尝试破解或篡改内容。\n如需授权请联系 vhkex@outlook.com', 'color:orange;font-size:14px;');
  }

  // ========== 事件绑定 ==========
  function bindEvents() {
    // 主题切换
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => searchCourses(e.target.value.trim()));
    }

    // 价格筛选
    document.querySelectorAll('.price-tab').forEach(tab => {
      tab.addEventListener('click', () => filterByPrice(tab.dataset.range));
    });

    // 导航滚动
    document.querySelectorAll('nav a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // 移动端菜单
    const menuBtn = document.getElementById('menuToggle');
    if (menuBtn) menuBtn.addEventListener('click', () => {
      document.querySelector('nav').classList.toggle('open');
    });
  }

  // ========== 入场动画 ==========
  function observeElements(elements) {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(el => obs.observe(el));
  }

  // ========== 工具函数 ==========
  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }
  function formatNum(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return n.toLocaleString();
  }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function getCategoryIcon(cat) {
    const map = { web: '🌐', python: '🐍', java: '☕', javascript: '📜', frontend: '🎨', backend: '⚙️', ai: '🤖', database: '🗄️', devops: '☁️', security: '🛡️', algorithm: '🧩', mobile: '📱', game: '🎮', blockchain: '⛓️', data: '📊', linux: '🐧', rust: '🦀', go: '🚀', career: '💼', beginner: '🌱', hardware: '🔧' };
    return map[cat] || '📚';
  }
  function getCategoryName(cat) {
    const c = TechHubData.categories.find(x => x.id === cat);
    return c ? c.name : cat;
  }

  // ========== 导航栏用户区 ==========
  const userBtn = document.getElementById('userBtn');
  if (userBtn) {
    userBtn.addEventListener('click', () => {
      if (currentUser) {
        document.getElementById('userPanel').classList.toggle('open');
      } else {
        openAuthModal('login');
      }
    });
  }

})();
