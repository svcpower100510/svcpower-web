// ============================================================
//  TechHub Pro v6.0 — 动画与视觉效果
// ============================================================

(function () {
  'use strict';

  // ========== Hero Canvas 粒子背景 ==========
  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let rafId;

    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * devicePixelRatio;
      mouseY = (e.clientY - rect.top) * devicePixelRatio;
    });

    const PARTICLE_COUNT = 80;
    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
          vy: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
          r: (Math.random() * 2 + 1) * devicePixelRatio,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    }
    initParticles();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const linkColor = isDark ? '0,180,216' : '0,100,180';

      // 画连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 * devicePixelRatio) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${linkColor},${0.15 * (1 - dist / (150 * devicePixelRatio))})`;
            ctx.lineWidth = 0.5 * devicePixelRatio;
            ctx.stroke();
          }
        }
      }

      // 画粒子
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 鼠标吸引
        const mx = mouseX - p.x, my = mouseY - p.y;
        const mDist = Math.sqrt(mx * mx + my * my);
        if (mDist < 100 * devicePixelRatio) {
          p.x += mx * 0.01; p.y += my * 0.01;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${linkColor},${p.alpha})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    }
    draw();

    // 主题切换时重绘
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      setTimeout(() => { ctx.clearRect(0, 0, canvas.width, canvas.height); }, 50);
    });
  }

  // ========== 数字增长动画 ==========
  function animateNumbers() {
    document.querySelectorAll('.stat-value').forEach(el => {
      const target = parseFloat(el.textContent);
      if (isNaN(target)) return;
      const suffix = el.textContent.replace(/[\d.]/g, '');
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = (target >= 100 ? Math.floor(current) : current.toFixed(1)) + suffix;
      }, 16);
    });
  }

  // ========== IntersectionObserver 入场 ==========
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.course-card, .resource-card, .github-card, .bili-card, .roadmap-card, .rank-item, .news-item')
        .forEach(el => el.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 50);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.course-card, .resource-card, .github-card, .bili-card, .roadmap-card, .rank-item, .news-item, .vip-card')
      .forEach(el => obs.observe(el));
  }

  // ========== 导航栏滚动效果 ==========
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      if (cur > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
      lastScroll = cur;
    }, { passive: true });
  }

  // ========== 3D卡片倾斜 ==========
  function init3DTilt() {
    document.querySelectorAll('.course-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ========== 鼠标光晕 ==========
  function initCursorGlow() {
    if (matchMedia('(pointer: coarse)').matches) return; // 移动端跳过
    const glow = document.createElement('div');
    glow.style.cssText = `position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:9998;mix-blend-mode:screen;opacity:0;transition:opacity 0.3s;background:radial-gradient(circle,rgba(0,180,216,0.08) 0%,transparent 70%);`;
    document.body.appendChild(glow);
    let visible = false;
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX - 150 + 'px';
      glow.style.top = e.clientY - 150 + 'px';
      if (!visible) { glow.style.opacity = '1'; visible = true; }
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; visible = false; });
  }

  // ========== 排行条动画 ==========
  function animateRankBars() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.rank-fill');
          if (bar) {
            const w = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => bar.style.width = w, 100);
          }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.rank-item').forEach(el => obs.observe(el));
  }

  // ========== 初始化 ==========
  document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initScrollAnimations();
    initNavbarScroll();
    initCursorGlow();
    animateRankBars();

    // 延迟初始化3D（等卡片渲染完）
    setTimeout(init3DTilt, 500);
    setTimeout(animateNumbers, 300);
  });

  // 暴露重绘方法供外部调用
  window.TechHubAnim = {
    reinit: () => { initScrollAnimations(); setTimeout(init3DTilt, 200); },
    animateNumbers, animateRankBars,
  };

})();
