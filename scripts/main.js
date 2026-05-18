// ============================================================
// main.js — page interactions
// ============================================================

(function () {
  'use strict';

  // Scroll reveals via IntersectionObserver
  function initReveals() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || !items.length) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Stagger children inside [data-reveal-stagger]
    document.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
      Array.from(parent.children).forEach((child, i) => {
        child.style.setProperty('--i', String(i));
        if (!child.hasAttribute('data-reveal')) {
          child.setAttribute('data-reveal', '');
        }
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  }

  // Hero video soft autoplay handling (in case autoplay is blocked, swap to poster)
  function initHeroVideo() {
    const video = document.querySelector('[data-hero-video]');
    if (!video) return;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.controls = false;
        video.poster && (video.style.background = `center/cover url(${video.poster})`);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
    initHeroVideo();
  });

  // Re-run after partials mount (header/footer reveals)
  document.addEventListener('partials:mounted', initReveals);
})();
