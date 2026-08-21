// config.js - 全局配置（TechHub Pro v6.0 正式版）
(function (global) {
  'use strict';
  const C = {
    version: '6.0.0',
    siteName: 'TechHub Pro',
    siteDesc: '科技区精品课程付费平台',
    author: '愿行无止之境 svcliny',
    github: 'https://github.com/svcpower100510/svcpower-web',
    bilibili: 'https://b23.tv/Sjdb2WI',
    email: 'vhkex@outlook.com',
    domain: 'https://techhub-svcliny.pages.dev',
    // 数据加载：优先后端API，失败降级内嵌
    apiBase: '',
    useEmbedded: true,
    // 价格体系（v6.0统一）
    priceMin: 9.9,
    priceMax: 19.9,
    // 用户系统
    user: {
      freeQuota: 100,        // 普通用户免费畅听100门
      vipQuota: 'unlimited', // VIP畅听全部200门
      vipPriceMonth: 99,
      vipPriceYear: 499,
      maxLoginAttempts: 5,   // 密码错误5次锁定
      lockMinutes: 30,
      registerPerHour: 3     // 每小时最多注册3次
    },
    // 支付
    payment: {
      verifyRounds: 3,
      orderTimeoutMin: 15,
      maxRetry: 5,
      secretKey: 'TECHHUB_SVCLINY_V6_SECRET'
    },
    // 收款信息（唯一有效收款码）
    payee: {
      name: '愿行无止之境svcliny',
      account: 'rosvcliny.odm.dsl(*方)',
      wechatQr: 'assets/qrcode-wechat.png',
      alipayQr: 'assets/qrcode-alipay.png',
      bankQr: 'assets/qrcode-bank.png',
      recommended: 'assets/wechat-pay-green.png'
    },
    storageKeys: {
      user: 'th_user', purchased: 'th_purchased', users: 'th_users',
      sessions: 'th_sessions', loginFail: 'th_login_fail', regLog: 'th_reg_log'
    }
  };
  global.TechHubConfig = C;
})(typeof window !== 'undefined' ? window : globalThis);
