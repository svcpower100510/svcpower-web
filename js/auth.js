// ============================================================
//  TechHub Pro v6.0 — 用户认证与安全系统
//  注册/登录/会话管理/防暴力破解/防批量注册
// ============================================================

(function (global) {
  'use strict';

  const STORAGE_KEY = 'techhub_users_v6';
  const SESSION_KEY = 'techhub_session_v6';
  const ATTEMPT_KEY = 'techhub_login_attempts_v6';
  const REGISTER_KEY = 'techhub_register_attempts_v6';

  // ---------- 工具函数 ----------
  function sha256(str) {
    // 使用Web Crypto API（现代浏览器）
    if (global.crypto && global.crypto.subtle) {
      return global.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
        .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
    }
    // 降级：简单hash（仅用于无subtle环境）
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return Promise.resolve(('00000000' + (h >>> 0).toString(16)).slice(-8));
  }

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function setUsers(u) { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  }
  function setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  function clearSession() { localStorage.removeItem(SESSION_KEY); }

  // ---------- 防暴力破解 ----------
  function getAttempts(key) { return JSON.parse(localStorage.getItem(key)) || { count: 0, firstTry: 0, lockedUntil: 0 }; }
  function setAttempts(key, a) { localStorage.setItem(key, JSON.stringify(a)); }
  function clearAttempts(key) { localStorage.removeItem(key); }

  function checkRateLimit(key, maxAttempts, lockoutMs) {
    const a = getAttempts(key);
    const now = Date.now();
    if (a.lockedUntil > now) {
      const remain = Math.ceil((a.lockedUntil - now) / 60000);
      return { allowed: false, message: `尝试次数过多，请${remain}分钟后再试` };
    }
    if (now - a.firstTry > lockoutMs) { return { allowed: true, reset: true }; }
    return { allowed: true };
  }

  function recordFailedAttempt(key, maxAttempts, lockoutMs) {
    const a = getAttempts(key);
    const now = Date.now();
    if (now - a.firstTry > lockoutMs) { a.count = 1; a.firstTry = now; }
    else { a.count++; }
    if (a.count >= maxAttempts) { a.lockedUntil = now + lockoutMs; }
    setAttempts(key, a);
  }

  // ---------- 密码策略 ----------
  function validatePassword(pwd) {
    const errors = [];
    if (pwd.length < 8) errors.push('密码至少8位');
    if (!/[A-Z]/.test(pwd)) errors.push('需包含大写字母');
    if (!/[a-z]/.test(pwd)) errors.push('需包含小写字母');
    if (!/[0-9]/.test(pwd)) errors.push('需包含数字');
    if (!/[^A-Za-z0-9]/.test(pwd)) errors.push('需包含特殊字符');
    return errors;
  }

  // ---------- 注册 ----------
  async function register(email, username, password) {
    // 速率限制：每个IP/浏览器每小时最多注册3次
    const regCheck = checkRateLimit(REGISTER_KEY, 3, 3600000);
    if (regCheck.reset) clearAttempts(REGISTER_KEY);
    if (!regCheck.allowed) return { success: false, message: regCheck.message };

    // 邮箱格式
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return { success: false, message: '邮箱格式不正确' };

    // 用户名
    if (username.length < 2 || username.length > 20) return { success: false, message: '用户名2-20个字符' };

    // 密码强度
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length) return { success: false, message: pwdErrors[0] };

    // 检查重复
    const users = getUsers();
    if (users[email]) return { success: false, message: '该邮箱已注册' };

    // 防批量：邮箱域名黑名单（临时邮箱）
    const disposableDomains = ['10minutemail.com', 'tempmail.io', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) return { success: false, message: '不支持临时邮箱注册' };

    // 创建用户
    const pwdHash = await sha256(password + '_techhub_salt_v6');
    const userId = 'U' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    users[email] = {
      id: userId,
      email: email,
      username: username,
      passwordHash: pwdHash,
      createdAt: new Date().toISOString(),
      isVIP: false,
      vipExpiresAt: null,
      purchasedCourses: [],
      freeQuotaUsed: 0,
      lastLoginAt: null,
      loginCount: 0,
      ipHistory: [],
    };
    setUsers(users);

    // 记录注册成功（清除失败计数）
    clearAttempts(REGISTER_KEY);

    return { success: true, message: '注册成功！请登录', userId: userId };
  }

  // ---------- 登录 ----------
  async function login(email, password, remember) {
    const loginCheck = checkRateLimit(ATTEMPT_KEY, 5, 30 * 60000); // 5次/30分钟
    if (!loginCheck.allowed) return { success: false, message: loginCheck.message };

    const users = getUsers();
    const user = users[email];

    if (!user) {
      recordFailedAttempt(ATTEMPT_KEY, 5, 30 * 60000);
      return { success: false, message: '邮箱或密码错误' };
    }

    const pwdHash = await sha256(password + '_techhub_salt_v6');
    if (pwdHash !== user.passwordHash) {
      recordFailedAttempt(ATTEMPT_KEY, 5, 30 * 60000);
      return { success: false, message: '邮箱或Password错误' };
    }

    // 登录成功
    clearAttempts(ATTEMPT_KEY);
    user.lastLoginAt = new Date().toISOString();
    user.loginCount++;
    setUsers(users);

    const session = {
      email: email,
      username: user.username,
      userId: user.id,
      isVIP: user.isVIP,
      vipExpiresAt: user.vipExpiresAt,
      loginTime: Date.now(),
      expiresAt: remember ? Date.now() + 7 * 86400000 : Date.now() + 86400000, // 7天 or 1天
      token: await sha256(user.id + Date.now() + '_session_salt'),
    };
    setSession(session);

    return { success: true, message: '登录成功！', session: session };
  }

  // ---------- 登出 ----------
  function logout() {
    clearSession();
    return { success: true };
  }

  // ---------- VIP 管理 ----------
  function isVIP() {
    const s = getSession();
    if (!s || !s.isVIP) return false;
    if (s.vipExpiresAt && new Date(s.vipExpiresAt) < new Date()) return false;
    return true;
  }

  function getVIPDaysRemaining() {
    const s = getSession();
    if (!s || !s.vipExpiresAt) return 0;
    const days = Math.ceil((new Date(s.vipExpiresAt) - new Date()) / 86400000);
    return Math.max(0, days);
  }

  // ---------- 课程访问权限 ----------
  function canAccessCourse(courseId) {
    const s = getSession();
    const users = getUsers();

    // VIP 畅听所有
    if (s && s.isVIP) {
      if (!s.vipExpiresAt || new Date(s.vipExpiresAt) > new Date()) return { allowed: true, reason: 'vip' };
    }

    // 已购买
    if (s) {
      const user = users[s.email];
      if (user && user.purchasedCourses.includes(courseId)) return { allowed: true, reason: 'purchased' };
    }

    // 普通用户免费额度（前100门按ID排序）
    if (s) {
      const user = users[s.email];
      if (user) {
        const freeCourses = TechHubData.courses
          .slice()
          .sort((a, b) => a.id - b.id)
          .slice(0, 100)
          .map(c => c.id);
        if (freeCourses.includes(courseId) && user.purchasedCourses.length < 100) {
          return { allowed: true, reason: 'free_quota' };
        }
      }
    }

    return { allowed: false, reason: 'need_purchase' };
  }

  // ---------- 购买课程 ----------
  async function purchaseCourse(courseId) {
    const s = getSession();
    if (!s) return { success: false, message: '请先登录' };

    const users = getUsers();
    const user = users[s.email];
    if (!user) return { success: false, message: '用户不存在' };

    if (user.purchasedCourses.includes(courseId)) return { success: false, message: '已购买该课程' };

    // VIP不需要单独购买
    if (isVIP()) {
      user.purchasedCourses.push(courseId);
      setUsers(users);
      return { success: true, message: 'VIP自动解锁！', vip: true };
    }

    user.purchasedCourses.push(courseId);
    setUsers(users);
    return { success: true, message: '购买成功！' };
  }

  // ---------- 升级VIP ----------
  function upgradeVIP(months) {
    const s = getSession();
    if (!s) return { success: false, message: '请先登录' };

    const users = getUsers();
    const user = users[s.email];
    if (!user) return { success: false, message: '用户不存在' };

    const now = new Date();
    let baseDate = (user.vipExpiresAt && new Date(user.vipExpiresAt) > now) ? new Date(user.vipExpiresAt) : now;
    baseDate.setMonth(baseDate.getMonth() + months);

    user.isVIP = true;
    user.vipExpiresAt = baseDate.toISOString();
    setUsers(users);

    s.isVIP = true;
    s.vipExpiresAt = user.vipExpiresAt;
    setSession(s);

    return { success: true, message: `VIP已激活，${months}个月后到期`, expiresAt: user.vipExpiresAt };
  }

  // ---------- 当前用户信息 ----------
  function getCurrentUser() {
    const s = getSession();
    if (!s) return null;
    if (s.expiresAt < Date.now()) { clearSession(); return null; }
    const users = getUsers();
    return users[s.email] || null;
  }

  // ---------- 安全检查 ----------
  function securityCheck() {
    const issues = [];
    const s = getSession();
    if (!s) return issues;

    // 会话即将过期
    const remainMs = s.expiresAt - Date.now();
    if (remainMs < 3600000) issues.push({ type: 'warning', msg: '会话即将过期，请重新登录' });

    // VIP即将到期
    if (s.isVIP && s.vipExpiresAt) {
      const vipRemain = new Date(s.vipExpiresAt) - new Date();
      if (vipRemain < 3 * 86400000) issues.push({ type: 'info', msg: 'VIP即将到期，请及时续费' });
    }

    return issues;
  }

  // ---------- 导出 ----------
  global.TechHubAuth = {
    register, login, logout,
    isVIP, getVIPDaysRemaining,
    canAccessCourse, purchaseCourse, upgradeVIP,
    getCurrentUser, getSession, securityCheck,
    validatePassword,
  };

})(window);
