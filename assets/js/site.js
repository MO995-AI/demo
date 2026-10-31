/* site.js — header state, mobile nav, scroll reveal. No dependencies. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var head = doc.getElementById('siteHead');
  var navToggle = doc.getElementById('navToggle');
  var nav = doc.getElementById('siteNav');
  var still = /(?:^|[?&])still=1(?:&|$)/.test(window.location.search);

  if (still) {
    root.classList.add('still');
  }

  var onScroll = function () {
    if (!head) return;
    head.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (head && navToggle && nav) {
    var setOpen = function (open) {
      head.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.textContent = open ? '关闭' : '菜单';
    };

    navToggle.addEventListener('click', function () {
      setOpen(!head.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && head.classList.contains('is-open')) {
        setOpen(false);
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && head.classList.contains('is-open')) setOpen(false);
    });
  }

  var revealItems = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  if (!revealItems.length) return;

  if (still || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) {
      el.classList.add('is-in');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  revealItems.forEach(function (el) {
    observer.observe(el);
  });
})();
