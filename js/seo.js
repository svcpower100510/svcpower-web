/**
 * TechHub Pro v4.0 — SEO 模块
 * 动态生成 meta / JSON-LD / 结构化数据
 */
(function () {
  'use strict';

  const SITE = {
    name: 'TechHub Pro',
    author: '愿行无止之境 svcliny',
    email: 'vhkex@outlook.com',
    domain: 'https://techhub-svcliny.pages.dev',
    github: 'https://github.com/svcpower100510/svcpower-web',
    bilibili: 'https://b23.tv/Sjdb2WI',
  };

  function setMeta(name, content, attr) {
    attr = attr || 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }

  function setOG(name, content) {
    setMeta(name, content, 'property');
  }

  // ========== 动态更新 SEO ==========
  function updateBasicSEO() {
    setMeta('description', 'TechHub Pro — svcliny 的科技区精品课程平台，120门课程，网络安全为主体，50%免费50%付费，三轮核验安全支付。');
    setMeta('keywords', '网络安全,渗透测试,Web安全,CTF,Python,JavaScript,AI大模型,DevOps,系统架构,svcliny,TechHub Pro');
    setMeta('author', SITE.author);
    setMeta('robots', 'index,follow,max-image-preview:large');
    setOG('og:site_name', SITE.name);
    setOG('og:locale', 'zh_CN');
    setOG('og:type', 'website');
    setOG('og:url', location.href);
    setOG('twitter:card', 'summary_large_image');
    setOG('twitter:creator', '@svcliny');
  }

  // ========== JSON-LD 结构化数据 ==========
  function injectJSONLD() {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.domain,
      description: '愿行无止之境 svcliny 的科技区精品课程付费平台',
      author: { '@type': 'Person', name: SITE.author, email: SITE.email },
      publisher: { '@type': 'Organization', name: SITE.name },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE.domain}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
      about: [
        { '@type': 'Thing', name: '网络安全', description: '渗透测试/Web安全/CTF/逆向工程' },
        { '@type': 'Thing', name: '编程开发', description: 'Python/JavaScript/Java/Go/Rust' },
        { '@type': 'Thing', name: 'AI大模型', description: 'LangChain/RAG/Agent/微调' },
        { '@type': 'Thing', name: 'DevOps', description: 'Docker/K8s/CI-CD/云原生' },
      ],
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  // ========== 课程结构化数据 ==========
  function injectCourseLD(course) {
    if (!course) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: { '@type': 'Person', name: SITE.author },
      instructor: course.instructor || SITE.author,
      courseCode: course.id,
      educationalLevel: course.level,
      timeRequired: course.duration,
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'CNY',
        availability: 'https://schema.org/InStock',
        url: `${SITE.domain}/#courses`,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: course.rating,
        reviewCount: course.students,
      },
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  // ========== 更新规范链接 ==========
  function updateCanonical() {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = location.href.split('#')[0];
  }

  // ========== 预加载关键资源 ==========
  function preloadCritical() {
    const preloads = [
      { href: 'css/style.css', as: 'style' },
      { href: 'js/data.js', as: 'script' },
      { href: 'js/main.js', as: 'script' },
    ];
    for (const p of preloads) {
      const l = document.createElement('link');
      l.rel = 'preload'; l.href = p.href; l.as = p.as;
      document.head.appendChild(l);
    }
  }

  // ========== 暴露 ==========
  window.TechHubSEO = {
    update: updateBasicSEO,
    injectLD: injectJSONLD,
    injectCourse: injectCourseLD,
    updateCanonical,
    preload: preloadCritical,
  };

  // 自动执行
  updateBasicSEO();
  injectJSONLD();
  updateCanonical();
  preloadCritical();

  // 路由变化时更新
  window.addEventListener('hashchange', () => {
    updateBasicSEO();
    updateCanonical();
  });
})();
