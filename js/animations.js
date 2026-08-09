/**
 * TechHub Pro v4.0 — 动画与视觉效果
 * Canvas粒子 + 数字增长 + 滚动入场 + 3D倾斜 + 鼠标光晕
 */
(function () {
  'use strict';

  // ========== Canvas 粒子背景 ==========
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const DENSITY = 80;

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function init() {
      resize();
      particles = Array.from({ length: DENSITY }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.5 + 0.2,
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const stroke = isDark ? 'rgba(0,200,255,' : 'rgba(0,120,200,';
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = stroke + p.a + ')';
        ctx.fill();
      }
      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 * devicePixelRatio) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = stroke + (0.15 * (1 - d / (120 * devicePixelRatio))) + ')';
            ctx.lineWidth = 0.5 * devicePixelRatio;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener('resize', resize);
    init();
    tick();
  }

  // ========== 数字增长动画 ==========
  function animateNumbers() {
    const targets = document.querySelectorAll('[data-count]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const goal = +el.dataset.count;
        const dur = 1500;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(goal * eased).toLocaleString();
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = goal.toLocaleString();
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    targets.forEach(t => obs.observe(t));
  }

  // ========== 滚动入场 ==========
  function scrollReveal() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
  }

  // ========== 3D 卡片倾斜 ==========
  function tiltCards() {
    document.querySelectorAll('.course-card, .bili-card, .gh-card').forEach(card => {
      let raf = null;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(0)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ========== 鼠标光晕 ==========
  function mouseGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    hero.appendChild(glow);
    let raf = null, tx = 0, ty = 0;
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${tx - 200}px, ${ty - 200}px)`;
      });
    });
    hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    hero.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

  // ========== 滚动进度条 ==========
  function scrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    let raf = null;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;
        bar.style.width = s + '%';
      });
    }, { passive: true });
  }

  // ========== 启动 ==========
  function init() {
    initParticles();
    animateNumbers();
    scrollReveal();
    tiltCards();
    mouseGlow();
    scrollProgress();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
