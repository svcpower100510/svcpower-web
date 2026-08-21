// ============================================================
//  TechHub Pro v6.0 — 支付系统（三轮核验 + VIP）
// ============================================================

(function (global) {
  'use strict';

  const PAYMENT_TIMEOUT = 15 * 60 * 1000; // 15分钟
  const MAX_RETRY = 5;
  const HMAC_SECRET = 'TechHub-Pro-v6-2026-svcliny-secret-key';

  // ---------- HMAC-SHA256 ----------
  async function hmacSign(data) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(HMAC_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ---------- 订单生成 ----------
  function generateOrderId() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `TH6-${ts}-${rand}`;
  }

  // ---------- 三轮核验 ----------
  async function verifyPayment(transaction) {
    const errors = [];
    const warnings = [];

    // === 第一轮：订单完整性 ===
    if (!transaction.orderId || !/^TH6-[A-Z0-9]+$/.test(transaction.orderId)) {
      errors.push('订单号格式非法');
    }
    if (!transaction.courseId || !transaction.amount || !transaction.timestamp) {
      errors.push('订单信息不完整');
    }
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount) || amount < 9.9 || amount > 499) {
      errors.push('金额异常：超出允许范围');
    }
    if (Date.now() - transaction.timestamp > PAYMENT_TIMEOUT) {
      errors.push('订单已超时（15分钟）');
    }
    // 防重放：检查localStorage中是否已有此订单
    const usedOrders = JSON.parse(localStorage.getItem('techhub_used_orders_v6') || '[]');
    if (usedOrders.includes(transaction.orderId)) {
      errors.push('订单号已使用，禁止重放');
    }

    if (errors.length) return { passed: false, round: 1, errors };

    // === 第二轮：签名校验 ===
    const signData = `${transaction.orderId}|${transaction.courseId}|${transaction.amount}|${transaction.timestamp}`;
    const expectedSig = await hmacSign(signData);
    if (transaction.signature !== expectedSig) {
      // 尝试备用签名算法
      const altSig = await sha256Fallback(signData + HMAC_SECRET);
      if (transaction.signature !== altSig) {
        return { passed: false, round: 2, errors: ['签名校验失败，订单可能被篡改'] };
      }
      warnings.push('使用了备用签名算法');
    }
    // 时间戳窗口（±5分钟）
    if (Math.abs(Date.now() - transaction.timestamp) > 5 * 60 * 1000) {
      warnings.push('订单时间戳偏差较大，请注意核对');
    }

    // === 第三轮：服务端确认（模拟） ===
    const serverCheck = await simulateServerConfirm(transaction);
    if (!serverCheck.ok) {
      return { passed: false, round: 3, errors: [serverCheck.message] };
    }

    // 全部通过 → 标记订单已使用
    usedOrders.push(transaction.orderId);
    localStorage.setItem('techhub_used_orders_v6', JSON.stringify(usedOrders));

    return { passed: true, round: 3, warnings, message: '支付核验全部通过' };
  }

  // 备用签名（无Web Crypto时）
  async function sha256Fallback(str) {
    if (global.crypto && global.crypto.subtle) {
      const buf = await global.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return ('00000000' + (h >>> 0).toString(16)).slice(-8);
  }

  // 模拟服务端确认
  async function simulateServerConfirm(tx) {
    // 模拟网络延迟
    await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
    // 模拟服务端校验
    if (!tx.orderId || !tx.courseId) return { ok: false, message: '服务端：订单信息缺失' };
    if (tx.retryCount > MAX_RETRY) return { ok: false, message: '重试次数超限，订单已锁定' };
    return { ok: true };
  }

  // ---------- 创建订单 ----------
  async function createOrder(courseId, amount, isVIP) {
    const orderId = generateOrderId();
    const timestamp = Date.now();
    const signData = `${orderId}|${courseId}|${amount}|${timestamp}`;
    const signature = await hmacSign(signData);

    const order = {
      orderId, courseId, amount, timestamp, signature,
      status: 'pending', retryCount: 0, isVIP: !!isVIP,
    };

    // 保存待确认订单
    const pending = JSON.parse(localStorage.getItem('techhub_pending_orders_v6') || '{}');
    pending[orderId] = order;
    localStorage.setItem('techhub_pending_orders_v6', JSON.stringify(pending));

    return order;
  }

  // ---------- 确认支付（用户点"我已完成支付"） ----------
  async function confirmPayment(orderId) {
    const pending = JSON.parse(localStorage.getItem('techhub_pending_orders_v6') || '{}');
    const order = pending[orderId];
    if (!order) return { success: false, message: '订单不存在' };

    order.retryCount++;
    const result = await verifyPayment(order);

    if (result.passed) {
      // 标记完成
      order.status = 'confirmed';
      pending[orderId] = order;
      localStorage.setItem('techhub_pending_orders_v6', JSON.stringify(pending));

      // VIP升级 or 课程解锁
      if (order.isVIP) {
        const months = order.amount >= 499 ? 12 : 1;
        TechHubAuth.upgradeVIP(months);
      } else {
        await TechHubAuth.purchaseCourse(order.courseId);
      }

      return { success: true, message: '支付确认成功！', isVIP: !!order.isVIP };
    } else {
      order.status = 'failed';
      pending[orderId] = order;
      localStorage.setItem('techhub_pending_orders_v6', JSON.stringify(pending));
      return { success: false, message: result.errors.join('; '), round: result.round };
    }
  }

  // ---------- 获取收款信息 ----------
  function getPaymentInfo() {
    return {
      name: '愿行无止之境svcliny',
      note: 'rosvcliny.odm.dsl(*方)',
      qrCodes: {
        wechat: 'assets/wechat-pay-green.png',
        wechatFallback: 'assets/qrcode-wechat.png',
        alipay: 'assets/qrcode-alipay.png',
        bank: 'assets/qrcode-bank.png',
      },
      vipMonthly: 99,
      vipYearly: 499,
    };
  }

  // ---------- 导出 ----------
  global.TechHubPayment = {
    createOrder, confirmPayment, verifyPayment,
    getPaymentInfo, generateOrderId,
    HMAC_SECRET: undefined, // 不暴露
  };

})(window);
