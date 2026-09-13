(function () {
  'use strict';
  document.documentElement.classList.add('js-on');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Counters ----
     Markup already holds the real figure. We only animate when JS runs,
     and restore the exact display string at the end. */
  function animateCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.dataset.target);
    if (isNaN(target) || reduceMotion) return;
    var display = el.innerHTML;
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var start = performance.now();
    var dur = 1200;
    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.innerHTML = display;
    }
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-counter]').forEach(function (el) { counterObserver.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Nav state ---- */
  var nav = document.getElementById('main-nav');
  var backToTop = document.getElementById('back-to-top');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('visible', y > 600);

    var current = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 140) current = s.id;
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

  /* ---- Case study accordions ---- */
  document.querySelectorAll('[data-accordion-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var card = trigger.closest('[data-accordion]');
      var content = card.querySelector('.accordion-content');
      var open = content.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
