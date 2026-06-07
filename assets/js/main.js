/* ═══════════════════════════════════════════════════════════════
   AARYAN PANCHAL — interactions
   Dependency-free. Respects prefers-reduced-motion.

   Motion strategy:
   • Scroll-position effects (progress, reveal, parallax, drift) run as
     NATIVE CSS scroll-driven animations when supported (html.sd) — see
     main.css §20 + https://scroll-driven-animations.style
   • This file drives the Safari/Firefox FALLBACK for those, plus the
     things CSS can't do: velocity-reactive marquee, custom cursor,
     magnetic buttons, count-ups, theme, scroll-spy, and the word splitter.
═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const SD = root.classList.contains('sd');   // native scroll-driven active?


  /* ── PRELOADER ─────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  const plCount = document.querySelector('.pl-count');

  function dismissPreloader() {
    if (!preloader) return;
    preloader.classList.add('done');
    document.body.style.overflow = '';
    window.setTimeout(() => preloader.remove(), 800);
  }
  if (preloader && !reduced) {
    document.body.style.overflow = 'hidden';
    let n = 0;
    const t = setInterval(() => {
      n = Math.min(100, n + Math.floor(Math.random() * 16) + 6);
      if (plCount) plCount.textContent = String(n).padStart(3, '0') + ' %';
      if (n >= 100) clearInterval(t);
    }, 90);
    window.addEventListener('load', () => setTimeout(dismissPreloader, 1200), { once: true });
    setTimeout(dismissPreloader, 3200); // safety
  } else if (preloader) {
    preloader.remove();
  }


  /* ── CUSTOM CURSOR ─────────────────────────────────── */
  if (fine && !reduced) {
    const dot = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');
    if (dot && ring) {
      document.body.classList.add('has-cursor');
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }, { passive: true });
      (function loop() {
        rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll('a, button, .magnetic').forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cur-link'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cur-link'));
      });
    }
  }


  /* ── MAGNETIC ELEMENTS ─────────────────────────────── */
  if (fine && !reduced) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }


  /* ── NAV ON SCROLL ─────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ── THEME TOGGLE (persisted, no flash) ────────────── */
  const themeBtn = document.getElementById('themeBtn');
  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    if (themeBtn) themeBtn.querySelector('.lbl').textContent = mode === 'dark' ? 'Light' : 'Dark';
    try { localStorage.setItem('theme', mode); } catch (e) {}
  }
  if (themeBtn) {
    const cur = root.getAttribute('data-theme') || 'dark';
    themeBtn.querySelector('.lbl').textContent = cur === 'dark' ? 'Light' : 'Dark';
    themeBtn.addEventListener('click', () =>
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  }


  /* ── WORD SPLITTER: scatter → assemble ─────────────── */
  function splitWords(el) {
    const frag = document.createDocumentFragment();
    let i = 0;
    const makeWord = (content) => {
      const out = document.createElement('span'); out.className = 'w-out';
      const inn = document.createElement('span'); inn.className = 'w-in';
      if (typeof content === 'string') inn.textContent = content;
      else inn.appendChild(content);
      const sign = (i % 2) ? 1 : -1;
      inn.style.setProperty('--dx', (sign * (16 + (i % 3) * 13)) + 'px');
      inn.style.setProperty('--dr', (sign * (2 + (i % 2) * 2)) + 'deg');
      inn.style.setProperty('--d', Math.min(i * 0.045, 0.9) + 's');
      out.appendChild(inn); i++;
      return out;
    };
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (tok === '') return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          frag.appendChild(makeWord(tok));
        });
      } else if (node.nodeName === 'BR') {
        frag.appendChild(document.createElement('br'));
      } else {
        frag.appendChild(makeWord(node.cloneNode(true)));
      }
    });
    el.innerHTML = '';
    el.appendChild(frag);
  }

  const splits = document.querySelectorAll('.split-words');
  if (!reduced) {
    splits.forEach(splitWords);
    const splitObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); splitObs.unobserve(e.target); }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    splits.forEach((el) => splitObs.observe(el));
  }


  /* ── REVEAL (JS fallback only; CSS handles when .sd) ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reduced) {
    reveals.forEach((el) => el.classList.add('in'));
  } else if (!SD) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => obs.observe(el));
  }


  /* ── COUNT-UP STATS ────────────────────────────────── */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || e.target._done) return;
      e.target._done = true;
      const target = parseInt(e.target.dataset.to, 10);
      if (reduced) { e.target.textContent = target; return; }
      const dur = 1500, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        e.target.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count-up').forEach((el) => countObs.observe(el));


  /* ── SECTION INDEX RAIL (scroll-spy) ───────────────── */
  const railLinks = document.querySelectorAll('.rail a');
  const railSections = [...railLinks]
    .map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (railSections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          railLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { threshold: 0.4, rootMargin: '-30% 0px -50% 0px' });
    railSections.forEach((s) => spy.observe(s));
  }


  /* ── MASTER SCROLL LOOP ────────────────────────────── */
  /* Drives: velocity marquee (always), + parallax/drift/progress
     fallback when native scroll-driven isn't available.            */
  const track = document.querySelector('.marquee-track');
  const progBar = document.querySelector('.scroll-prog span');
  const parx = [...document.querySelectorAll('.parx')]
    .map((el) => ({ el, v: parseFloat(getComputedStyle(el).getPropertyValue('--par')) || 1 }));
  const drift = [...document.querySelectorAll('.drift')]
    .map((el) => ({ el, v: parseFloat(getComputedStyle(el).getPropertyValue('--drift')) || 120 }));

  if (!reduced && (track || (!SD && (progBar || parx.length || drift.length)))) {
    let lastY = window.scrollY;
    let vel = 0, velSmooth = 0, mpos = 0;
    let half = track ? track.scrollWidth / 2 : 0;
    if (track) track.style.animation = 'none';
    window.addEventListener('resize', () => { if (track) half = track.scrollWidth / 2; }, { passive: true });

    const tick = () => {
      const y = window.scrollY;
      vel = y - lastY; lastY = y;
      velSmooth += (vel - velSmooth) * 0.12;

      // velocity-reactive marquee
      if (track && half) {
        const speed = 0.55 + Math.min(Math.abs(velSmooth) * 0.06, 7);
        const dir = velSmooth < -0.4 ? -1 : 1;     // scrolling up nudges it back
        mpos -= speed * dir;
        if (mpos <= -half) mpos += half;
        if (mpos > 0) mpos -= half;
        track.style.transform = `translate3d(${mpos}px,0,0)`;
      }

      // fallback scroll-position effects (Safari/FF)
      if (!SD) {
        if (progBar) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          progBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        }
        const vh = window.innerHeight;
        for (const p of parx) {
          const r = p.el.getBoundingClientRect();
          const prog = ((r.top + r.height / 2) - vh / 2) / vh;
          p.el.style.transform = `translate3d(0, ${prog * p.v * 70}px, 0)`;
        }
        for (const d of drift) {
          const r = d.el.getBoundingClientRect();
          const prog = (vh - r.top) / (vh + r.height);
          d.el.style.transform = `translate3d(${(prog * 2 - 1) * d.v}px, 0, 0)`;
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }


  /* ── CURRENT YEAR ──────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
