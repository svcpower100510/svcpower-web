// auth.js - 用户认证与安全系统（TechHub Pro v6.0 正式版）
(function (global) {
  'use strict';
  const C = global.TechHubConfig, SK = C.storageKeys;
  const $ = function (s) { return document.querySelector(s); };
  function randId() { return 'U-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
  function hash(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; } return h.toString(16); }

  // ---------- 本地用户存储（localStorage 模拟，生产可替换为后端API） ----------
  function getUsers() { try { return JSON.parse(localStorage.getItem(SK.users) || '{}'); } catch (e) { return {}; } }
  function saveUsers(u) { localStorage.setItem(SK.users, JSON.stringify(u)); }
  function getSessions() { try { return JSON.parse(localStorage.getItem(SK.sessions) || '{}'); } catch (e) { return {}; } }
  function saveSessions(s) { localStorage.setItem(SK.sessions, JSON.stringify(s)); }
  function regLog() { try { return JSON.parse(localStorage.getItem(SK.regLog) || '[]'); } catch (e) { return []; } }
  function saveRegLog(a) { localStorage.setItem(SK.regLog, JSON.stringify(a.slice(-200))); }
  function loginFail() { try { return JSON.parse(localStorage.getItem(SK.loginFail) || '{}'); } catch (e) { return {}; } }
  function saveLoginFail(o) { localStorage.setItem(SK.loginFail, JSON.stringify(o)); }

  // ---------- 密码强度 ----------
  function passwordStrength(pw) {
    if (!pw || pw.length < 8) return { ok: false, msg: '密码至少8位' };
    if (!/[A-Z]/.test(pw)) return { ok: false, msg: '需含大写字母' };
    if (!/[a-z]/.test(pw)) return { ok: false, msg: '需含小写字母' };
    if (!/[0-9]/.test(pw)) return { ok: false, msg: '需含数字' };
    if (!/[^A-Za-z0-9]/.test(pw)) return { ok: false, msg: '需含特殊字符' };
    return { ok: true, msg: '强度良好' };
  }

  // ---------- 注册 ----------
  function register(email, username, password) {
    const res = { ok: false, msg: '' };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { res.msg = '邮箱格式不正确'; return res; }
    if (!username || username.length < 2) { res.msg = '用户名至少2位'; return res; }
    const ps = passwordStrength(password); if (!ps.ok) { res.msg = ps.msg; return res; }
    // 防批量注册：每小时限 N 次
    const now = Date.now(), hour = 3600 * 1000;
    let log = regLog().filter(function (t) { return now - t < hour; });
    if (log.length >= C.user.registerPerHour) { res.msg = '注册过于频繁，请1小时后再试'; return res; }
    const users = getUsers();
    if (Object.values(users).some(function (u) { return u.email === email; })) { res.msg = '该邮箱已注册'; return res; }
    if (Object.values(users).some(function (u) { return u.username === username; })) { res.msg = '该用户名已被使用'; return res; }
    const id = randId();
    users[id] = { id: id, email: email, username: username, passwordHash: hash(password), vip: false, vipUntil: null, purchased: [], registeredAt: now, freeUsed: 0 };
    saveUsers(users); log.push(now); saveRegLog(log);
    res.ok = true; res.msg = '注册成功，请登录'; return res;
  }

  // ---------- 登录 ----------
  function login(identifier, password) {
    const res = { ok: false, msg: '' };
    const fail = loginFail(); const key = identifier.toLowerCase();
    if (fail[key] && fail[key].count >= C.user.maxLoginAttempts && Date.now() - fail[key].last < C.user.lockMinutes * 60 * 1000) {
      res.msg = '尝试次数过多，已临时锁定，请' + C.user.lockMinutes + '分钟后再试'; return res;
    }
    const users = getUsers(); const u = Object.values(users).find(function (x) {
      return x.email === identifier || x.username === identifier;
    });
    if (!u || u.passwordHash !== hash(password)) {
      if (!fail[key]) fail[key] = { count: 0, last: 0 }; fail[key].count++; fail[key].last = Date.now(); saveLoginFail(fail);
      res.msg = '账号或密码错误'; return res;
    }
    delete fail[key]; saveLoginFail(fail);
    const sess = { userId: u.id, username: u.username, email: u.email, vip: !!u.vip, loginAt: Date.now() };
    const sessions = getSessions(); sessions[u.id] = sess; saveSessions(sessions);
    localStorage.setItem(SK.user, JSON.stringify(sess));
    res.ok = true; res.msg = '登录成功'; res.user = sess; return res;
  }
  function logout() { const s = currentUser(); if (s) { const sessions = getSessions(); delete sessions[s.userId]; saveSessions(sessions); } localStorage.removeItem(SK.user); }
  function currentUser() { try { return JSON.parse(localStorage.getItem(SK.user) || 'null'); } catch (e) { return null; } }
  function isVIP() { const s = currentUser(); if (!s) return false; if (s.vip) { if (s.vipUntil && s.vipUntil < Date.now()) { s.vip = false; localStorage.setItem(SK.user, JSON.stringify(s)); return false; } return true; } return false; }

  // ---------- 购买/权限 ----------
  function canAccess(courseId) {
    const s = currentUser(); if (isVIP()) return { ok: true, reason: 'vip' };
    const purchased = getPurchased();
    if (purchased.indexOf(courseId) >= 0) return { ok: true, reason: 'purchased' };
    if (!s) return { ok: false, reason: 'login', msg: '请先登录' };
    const used = getUsedFree();
    if (used < C.user.freeQuota) return { ok: true, reason: 'free' };
    return { ok: false, reason: 'upgrade', msg: '免费额度已用完，升级VIP畅听全部课程' };
  }
  function getPurchased() { const s = currentUser(); if (!s) return []; const u = getUsers()[s.userId]; return u ? u.purchased || [] : []; }
  function getUsedFree() { const s = currentUser(); if (!s) return 0; const u = getUsers()[s.userId]; return u ? u.freeUsed || 0 : 0; }
  function addPurchase(courseId) {
    const s = currentUser(); if (!s) return; const users = getUsers(); const u = users[s.userId];
    if (!u) return; if (!u.purchased) u.purchased = []; if (u.purchased.indexOf(courseId) < 0) u.purchased.push(courseId);
    saveUsers(users); const sessions = getSessions(); if (sessions[s.userId]) { sessions[s.userId].purchased = u.purchased; saveSessions(sessions); }
  }
  function useFreeSlot(courseId) { const s = currentUser(); if (!s) return; const users = getUsers(); const u = users[s.userId]; if (!u) return; u.freeUsed = (u.freeUsed || 0) + 1; saveUsers(users); }

  global.TechHubAuth = {
    register: register, login: login, logout: logout, currentUser: currentUser,
    isVIP: isVIP, canAccess: canAccess, addPurchase: addPurchase, useFreeSlot: useFreeSlot,
    getPurchased: getPurchased, getUsedFree: getUsedFree, passwordStrength: passwordStrength
  };
})(typeof window !== 'undefined' ? window : globalThis);
