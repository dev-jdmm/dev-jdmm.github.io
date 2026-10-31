/* Jonathan Monroy Mancera · Portfolio interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state, progress bar, mobile menu ---------- */
  const nav = $('#nav');
  const bar = $('#progress');
  const toggle = $('#navToggle');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('is-scrolled', y > 24);
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); };
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll spy ---------- */
  const links = new Map($$('#navLinks a').map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      links.get(en.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['top', ...links.keys()].forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-visible');
      setTimeout(() => el.classList.add('is-done'), 1400);
      reveal.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .timeline').forEach((el) => reveal.observe(el));

  /* ---------- Count-up stats ---------- */
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const end = Number(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      counter.unobserve(el);
      if (reduced) { el.textContent = end + suffix; return; }
      const t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => counter.observe(el));

  /* ---------- Rotating role ---------- */
  const roles = ['Front-end developer', 'Back-end developer', 'AI integrator', 'Problem solver'];
  const rot = $('#rotator');
  let ri = 0;
  if (!reduced) {
    setInterval(() => {
      rot.classList.add('is-out');
      setTimeout(() => { ri = (ri + 1) % roles.length; rot.textContent = roles[ri]; rot.classList.remove('is-out'); }, 380);
    }, 2800);
  }

  /* ---------- Typed code card ---------- */
  const code = [
    ['c', '// Hello, world. Nice to meet you.\n'],
    ['k', 'const '], ['p', 'jonathan'], ['', ' = {\n'],
    ['', '  role: '], ['s', "'Junior Software Engineer'"], ['', ',\n'],
    ['', '  based: '], ['s', "'Bogotá, Colombia'"], ['', ',\n'],
    ['', '  frontend: ['], ['s', "'HTML'"], ['', ', '], ['s', "'CSS'"], ['', ', '], ['s', "'JavaScript'"], ['', '],\n'],
    ['', '  backend: ['], ['s', "'Node.js'"], ['', ', '], ['s', "'PostgreSQL'"], ['', ', '], ['s', "'MongoDB'"], ['', '],\n'],
    ['', '  superpower: '], ['s', "'AI implementation'"], ['', ',\n'],
    ['', '  available: '], ['b', 'true'], ['', '\n'],
    ['', '};\n'],
  ];
  const typed = $('#typed');
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const render = (n) => {
    let left = n, html = '';
    for (const [cls, txt] of code) {
      if (left <= 0) break;
      const part = esc(txt.slice(0, left));
      html += cls ? `<span class="${cls}">${part}</span>` : part;
      left -= txt.length;
    }
    typed.innerHTML = html;
  };
  const total = code.reduce((a, [, t]) => a + t.length, 0);
  if (reduced) render(total);
  else {
    let n = 0;
    setTimeout(function type() {
      n += 2 + (Math.random() < 0.4 ? 1 : 0);
      render(n);
      if (n < total) setTimeout(type, 14 + Math.random() * 22);
    }, 900);
  }

  /* subtle 3D tilt on the code card */
  const card = $('#codeCard');
  if (!reduced && window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) {
    const hero = $('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${-8 + x * 10}deg) rotateX(${4 - y * 8}deg)`;
    });
    hero.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }

  /* ---------- Hero network canvas ---------- */
  const canvas = $('#heroCanvas');
  const ctx = canvas.getContext('2d');
  let pts = [], w = 0, h = 0, raf = 0, visible = true;
  const mouse = { x: -9999, y: -9999 };
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(90, (w * h) / 16000));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 14400) { p.x += dx * 0.012; p.y += dy * 0.012; }
    }
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 16900) {
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.16 * (1 - d / 16900)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(186, 230, 253, .7)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = visible ? requestAnimationFrame(draw) : 0;
  };
  size();
  if (reduced) draw();
  else {
    draw();
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    }).observe(canvas);
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
    canvas.parentElement.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  }

  /* ---------- Project cards: tilt + spotlight ---------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    $$('.project__media').forEach((m) => {
      m.addEventListener('pointermove', (e) => {
        const r = m.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        m.style.setProperty('--mx', `${x * 100}%`);
        m.style.setProperty('--my', `${y * 100}%`);
        m.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
        m.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
      });
      m.addEventListener('pointerleave', () => { m.style.setProperty('--rx', '0deg'); m.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- Project filters ---------- */
  const filters = $$('.filter');
  const pill = $('.filter__pill');
  const projects = $$('.project');
  const movePill = (btn) => {
    if (!pill) return;
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.transform = `translateX(${btn.offsetLeft}px)`;
  };
  const active = () => filters.find((f) => f.classList.contains('is-active'));
  requestAnimationFrame(() => movePill(active()));
  window.addEventListener('resize', () => movePill(active()));
  document.fonts?.ready.then(() => movePill(active()));

  filters.forEach((btn) => btn.addEventListener('click', () => {
    if (btn.classList.contains('is-active')) return;
    filters.forEach((f) => { f.classList.toggle('is-active', f === btn); f.setAttribute('aria-selected', String(f === btn)); });
    movePill(btn);
    const f = btn.dataset.filter;
    projects.forEach((p) => p.classList.add('is-filtering'));
    setTimeout(() => {
      projects.forEach((p) => {
        const show = f === 'all' || p.dataset.status === f;
        p.classList.toggle('is-hidden', !show);
        p.classList.add('is-visible', 'is-done');
      });
      requestAnimationFrame(() => requestAnimationFrame(() => projects.forEach((p) => p.classList.remove('is-filtering'))));
    }, reduced ? 0 : 280);
  }));

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox'), lbImg = $('#lightboxImg'), lbCap = $('#lightboxCap'), lbClose = $('#lightboxClose');
  let lastFocus = null;
  const openLb = (src, cap, alt) => {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || cap; lbCap.textContent = cap;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lb.classList.add('is-open'));
    lbClose.focus();
  };
  const closeLb = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; lbImg.src = ''; }, 300);
    lastFocus?.focus();
  };
  $$('.project__media').forEach((m) => m.addEventListener('click', () => openLb(m.dataset.full, m.dataset.caption, m.querySelector('img')?.alt)));
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ---------- Copy buttons ---------- */
  const toast = $('#toast');
  let tt;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('is-show'), 2200);
  };
  $$('.copy').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); say('Copied to clipboard'); }
    catch { say(b.dataset.copy); }
  }));
})();
