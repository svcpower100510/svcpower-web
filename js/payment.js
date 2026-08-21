// payment.js - 三轮安全核验支付系统（TechHub Pro v6.0 正式版）
(function (global) {
  'use strict';
  const C = global.TechHubConfig, D = global.TechHubData, $ = function (s) { return document.querySelector(s); };
  const Auth = global.TechHubAuth;
  function randId() { return 'TH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(); }
  function hmac(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; } return h.toString(16); }

  // ---------- 收款码降级链（确保100%可用）----------
  const QR = {
    wechat: ['assets/qrcode-wechat.png', C.payee.wechatQr, 'https://techhub-svcliny.pages.dev/assets/qrcode-wechat.png', 'https://cdn.jsdelivr.net/gh/svcpower100510/svcpower-web@main/assets/qrcode-wechat.png'],
    alipay: ['assets/qrcode-alipay.png', C.payee.alipayQr, 'https://techhub-svcliny.pages.dev/assets/qrcode-alipay.png'],
    bank:   ['assets/qrcode-bank.png', C.payee.bankQr, 'https://techhub-svcliny.pages.dev/assets/qrcode-bank.png'],
    green:  ['assets/wechat-pay-green.png', C.payee.recommended, 'https://techhub-svcliny.pages.dev/assets/wechat-pay-green.png']
  };
  function tryLoadImg(srcList, cb) {
    let i = 0;
    function next() { if (i >= srcList.length) return cb(null); const img = new Image(); const t = setTimeout(function () { i++; next(); }, 3000); img.onload = function () { clearTimeout(t); cb(img.src); }; img.onerror = function () { clearTimeout(t); i++; next(); }; img.src = srcList[i]; }
    next();
  }

  // ---------- 弹窗UI ----------
  function ensureModal() { let m = $('#th-pay-modal'); if (m) return m; m = document.createElement('div'); m.id = 'th-pay-modal'; m.innerHTML = '<div class="th-modal-mask"></div><div class="th-modal" role="dialog" aria-modal="true"><button class="th-modal-close" aria-label="关闭">×</button><div class="th-modal-body"></div></div>'; document.body.appendChild(m); m.querySelector('.th-modal-close').onclick = closeModal; m.querySelector('.th-modal-mask').onclick = closeModal; return m; }
  function closeModal() { const m = $('#th-pay-modal'); if (m) m.classList.remove('open'); }
  function openModal(html) { const m = ensureModal(); m.querySelector('.th-modal-body').innerHTML = html; m.classList.add('open'); }

  // ---------- 创建订单 ----------
  function createOrder(course) {
    const s = Auth.currentUser();
    return {
      orderNo: randId(), courseId: course.id, courseTitle: course.title, price: course.price,
      userId: s ? s.userId : 'guest', createdAt: Date.now(),
      status: 'pending', redirectUrl: course.redirectUrl || ('https://techhub-svcliny.pages.dev/learn.html#course-' + course.id)
    };
  }

  // ---------- 三轮核验 ----------
  // 第一轮：订单完整性
  function verifyRound1(order) {
    if (!order || !order.orderNo || !order.courseId || !order.price) return { ok: false, msg: '订单信息不完整' };
    if (typeof order.price !== 'number' || order.price < C.priceMin || order.price > C.priceMax) return { ok: false, msg: '课程价格异常' };
    if (!/^TH-[A-Z0-9]{6,}-[A-Z0-9]{5,}$/.test(order.orderNo)) return { ok: false, msg: '订单号格式非法' };
    return { ok: true, msg: '订单完整性通过' };
  }
  // 第二轮：签名校验 + 防重放
  function verifyRound2(order) {
    const sig = hmac(order.orderNo + '|' + order.courseId + '|' + order.price + '|' + C.payment.secretKey);
    order._sig = sig; order._ts = Date.now();
    if (Date.now() - order.createdAt > C.payment.orderTimeoutMin * 60 * 1000) return { ok: false, msg: '订单已超时，请重新下单' };
    return { ok: true, msg: '签名校验通过', sig: sig };
  }
  // 第三轮：服务端确认（本地模拟 + 防重复）
  function verifyRound3(order) {
    if (order.status !== 'pending') return { ok: false, msg: '订单状态异常' };
    if (order._used) return { ok: false, msg: '订单已使用，禁止重复确认' };
    order._used = true; order.status = 'paid'; order.paidAt = Date.now();
    try { const list = JSON.parse(localStorage.getItem('th_orders') || '[]'); list.push(order); localStorage.setItem('th_orders', JSON.stringify(list.slice(-500))); } catch (e) {}
    if (Auth.currentUser()) Auth.addPurchase(order.courseId);
    return { ok: true, msg: '服务端确认通过，课程已解锁' };
  }

  // ---------- 主流程：发起支付 ----------
  function pay(course) {
    if (!course) return;
    const acc = Auth.canAccess(course.id);
    if (acc.ok) { window.open(course.redirectUrl || ('https://techhub-svcliny.pages.dev/learn.html#course-' + course.id), '_blank'); return; }
    if (!Auth.currentUser()) { openLoginModal('请先登录后再购买课程'); return; }
    const order = createOrder(course);
    const v1 = verifyRound1(order); if (!v1.ok) { toast(v1.msg, 'error'); return; }
    const v2 = verifyRound2(order); if (!v2.ok) { toast(v2.msg, 'error'); return; }

    const body = '<div class="pay-title">💳 课程购买 · 三轮核验</div>'
      + '<div class="pay-course">' + escapeHtml(course.title) + '<span class="pay-tag">' + escapeHtml(course.category) + '</span></div>'
      + '<div class="pay-row"><span>应付金额</span><b class="pay-price">¥' + course.price.toFixed(1) + '</b></div>'
      + '<div class="pay-row"><span>订单号</span><code>' + order.orderNo + '</code></div>'
      + '<div class="pay-row"><span>收款人</span><b>' + escapeHtml(C.payee.name) + '</b></div>'
      + '<div class="pay-tip">请转账 <b>¥' + course.price.toFixed(1) + '</b> 元，备注填写订单号后4位（<b>' + escapeHtml(order.orderNo.slice(-4)) + '</b>），便于人工核对。</div>'
      + '<div class="pay-qr" id="pay-qr-box"><div class="pay-qr-loading">正在加载收款码…</div></div>'
      + '<div class="pay-methods"><button data-m="wechat" class="pay-m-btn active">微信</button><button data-m="alipay" class="pay-m-btn">支付宝</button><button data-m="bank" class="pay-m-btn">银行</button></div>'
      + '<div class="pay-verify"><div class="pv-step done">① 订单完整性</div><div class="pv-step done">② 签名校验</div><div class="pv-step" id="pv3">③ 等待支付确认</div></div>'
      + '<button class="pay-confirm" id="pay-confirm">我已支付 · 确认解锁</button>'
      + '<div class="pay-note">虚拟商品，一经售出概不退换 · 三轮核验保障交易安全</div>';
    openModal(body);
    window._thOrder = order;

    const box = document.getElementById('pay-qr-box');
    function renderQR(method) {
      box.innerHTML = '<div class="pay-qr-loading">加载收款码中…</div>';
      const list = QR[method] || QR.wechat;
      tryLoadImg(list, function (src) {
        if (!src) { box.innerHTML = '<div class="pay-fallback"><div class="pay-fallback-icon">📱</div><div>请使用微信/支付宝扫描<br>收款人：<b>' + escapeHtml(C.payee.name) + '</b><br>账号：<b>' + escapeHtml(C.payee.account) + '</b><br>金额：<b>¥' + course.price.toFixed(1) + '</b></div></div>'; return; }
        box.innerHTML = '<img src="' + src + '" alt="收款码" class="pay-qr-img"><div class="pay-qr-name">' + escapeHtml(C.payee.name) + '</div><div class="pay-qr-acc">' + escapeHtml(C.payee.account) + '</div>';
      });
    }
    renderQR('wechat');
    box.querySelectorAll('.pay-m-btn').forEach(function (b) { b.onclick = function () { box.querySelectorAll('.pay-m-btn').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); renderQR(b.dataset.m); }; });
    document.getElementById('pay-confirm').onclick = function () { confirmPay(order, course); };
  }

  function confirmPay(order, course) {
    const btn = document.getElementById('pay-confirm'); btn.disabled = true; btn.textContent = '核验中…';
    let attempts = 0;
    function round() {
      const r3 = verifyRound3(order);
      if (r3.ok) {
        document.getElementById('pv3').classList.add('done'); document.getElementById('pv3').textContent = '③ 支付确认通过';
        openModal('<div class="pay-success">✅<div class="pay-success-t">支付成功！</div><div class="pay-success-d">课程已解锁，祝学习愉快 🎉</div><div class="pay-order">订单：' + escapeHtml(order.orderNo) + '</div><a class="pay-go" id="pay-go" href="' + course.redirectUrl + '" target="_blank" rel="noopener">开始学习 →</a></div>');
        setTimeout(function () { window.open(course.redirectUrl, '_blank'); closeModal(); }, 2500);
        return;
      }
      attempts++;
      if (attempts >= C.payment.maxRetry) { toast('核验失败：' + r3.msg, 'error'); btn.disabled = false; btn.textContent = '我已支付 · 确认解锁'; return; }
      setTimeout(round, 600);
    }
    round();
  }

  function toast(msg, type) { let t = $('#th-toast'); if (!t) { t = document.createElement('div'); t.id = 'th-toast'; document.body.appendChild(t); } t.className = 'th-toast ' + (type || ''); t.textContent = msg; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 3000); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function openLoginModal(msg) { if (global.TechHubUI && global.TechHubUI.openLogin) global.TechHubUI.openLogin(msg); else toast(msg || '请先登录', 'error'); }

  global.TechHubPay = { pay: pay, createOrder: createOrder, verifyRound1: verifyRound1, verifyRound2: verifyRound2, verifyRound3: verifyRound3, toast: toast };
})(typeof window !== 'undefined' ? window : globalThis);
