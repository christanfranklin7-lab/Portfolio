(function () {
  'use strict';
  document.documentElement.classList.add('js-on');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Hero headline word animation ---- */
  var headline = document.getElementById('hero-headline');
  if (headline && !reduceMotion) {
    var words = (headline.dataset.headline || headline.textContent).trim().split(/\s+/);
    headline.innerHTML = '';
    headline.classList.add('hero-animate');
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'hero-word';
      span.textContent = w;
      span.style.animationDelay = (i * 0.08) + 's';
      headline.appendChild(span);
      headline.appendChild(document.createTextNode(' '));
    });
  }

  /* ---- Counters ----
     The markup already contains the final value, so the real number shows
     even if this script never runs. We only animate when it does. */
  function animateCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    if (reduceMotion) return;
    var start = performance.now();
    var dur = 1400;
    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* ---- Scroll reveal + counter trigger ---- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('[data-counter]').forEach(animateCounter);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(function (el) { counterObserver.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Nav scrolled state + active link ---- */
  var nav = document.getElementById('main-nav');
  var backToTop = document.getElementById('back-to-top');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('visible', y > 500);

    var current = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 120) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---- Mobile menu ---- */
  var overlay = document.getElementById('mobile-menu-overlay');
  var openBtn = document.getElementById('mobile-menu-btn');
  var closeBtn = document.getElementById('mobile-close-btn');
  function closeMenu() { if (overlay) overlay.classList.remove('open'); }
  if (openBtn) openBtn.addEventListener('click', function () { overlay.classList.add('open'); });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-mobile-nav]').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---- Expertise tabs ---- */
  document.querySelectorAll('[data-expertise-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.expertiseTab;
      document.querySelectorAll('[data-expertise-tab]').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      document.querySelectorAll('[data-expertise-panel]').forEach(function (p) {
        p.classList.toggle('active', p.id === 'panel-' + id);
      });
    });
  });

  /* ---- Portfolio accordions ---- */
  document.querySelectorAll('[data-accordion-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var card = trigger.closest('[data-accordion]');
      var content = card.querySelector('.accordion-content');
      var open = content.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---- Toast ---- */
  var toast = document.getElementById('toast-msg');
  window.showToast = function (msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2600);
  };

  /* ---- Particle field ---- */
  var canvas = document.getElementById('particle-canvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var raf;

    function size() {
      var r = canvas.parentElement.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    }
    function seed() {
      var count = Math.min(70, Math.floor(canvas.width / 18));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.4 + 0.1
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(165,180,252,' + p.a + ')';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    size(); seed(); draw();
    window.addEventListener('resize', function () { size(); seed(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  }
})();
