/**
 * TechHub Pro v4.0 — API 客户端
 * 与 Java 后端通信，带超时/重试/降级
 */
(function () {
  'use strict';
  const TIMEOUT = 8000;
  const RETRY = 2;

  async function request(url, opts = {}, attempt = 0) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT);
    try {
      const res = await fetch(url, { ...opts, signal: ctrl.signal, cache: 'no-cache' });
      clearTimeout(t);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      if (attempt < RETRY) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
        return request(url, opts, attempt + 1);
      }
      throw e;
    }
  }

  const API = {
    base: (window.TechHubData && TechHubData.config && TechHubData.config.apiBase) || '/api',
    courses: () => request('/api/courses'),
    course: (id) => request(`/api/courses/${encodeURIComponent(id)}`),
    resources: () => request('/api/resources'),
    rankings: () => request('/api/rankings'),
    github: () => request('/api/github'),
    bilibili: () => request('/api/bilibili'),
    search: (q) => request(`/api/search?q=${encodeURIComponent(q)}`),
    verifyPayment: (payload) => request('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    stats: () => request('/api/stats'),
    health: () => request('/api/health'),
  };

  window.TechHubAPI = API;
})();
