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

  // Page creek animation REMOVED — the scroll-driven SVG that wove
  // through <main> as a watermark has been retired. The CSS and the
  // <div class="page-creek"> markup are also removed elsewhere.

  // (creek helpers + initializer all removed — block continues
  // below with the next feature, initIntentionalTabs, etc.)

  // ----------------------------------------------------------
  // Intentional section — tabs (8 pills → single focus panel)
  // Click a pill, or use ←/→ to navigate. Updates aria-selected
  // on tabs and hidden / .is-active on panels.
  // ----------------------------------------------------------
  function initIntentionalTabs() {
    const strip = document.querySelector('.intentional .tab-strip[role="tablist"]');
    if (!strip) return;
    const tabs = Array.from(strip.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    const panels = tabs
      .map((t) => document.getElementById(t.getAttribute('aria-controls')))
      .filter(Boolean);

    function activate(tab, { focus = false } = {}) {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
      });
      const panelId = tab.getAttribute('aria-controls');
      panels.forEach((p) => {
        const isActive = p.id === panelId;
        p.classList.toggle('is-active', isActive);
        if (isActive) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
      if (focus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const dir = e.key === 'ArrowRight' ? 1 : -1;
          const next = (i + dir + tabs.length) % tabs.length;
          activate(tabs[next], { focus: true });
        } else if (e.key === 'Home') {
          e.preventDefault();
          activate(tabs[0], { focus: true });
        } else if (e.key === 'End') {
          e.preventDefault();
          activate(tabs[tabs.length - 1], { focus: true });
        }
      });
    });
  }

  // ----------------------------------------------------------
  // Services rail — manual horizontal scroll (no auto-motion).
  // The old auto-marquee was retired in the polaroid-removal pass.
  // Native drag/swipe + scroll-snap handle pan. Header arrow
  // buttons scroll the rail by one card's width and update their
  // own disabled state at each end.
  // ----------------------------------------------------------
  function initServicesMarquee() { /* legacy no-op */ }

  function initServicesRail() {
    const rail = document.querySelector('.services-rail');
    const prev = document.querySelector('[data-rail-prev]');
    const next = document.querySelector('[data-rail-next]');
    if (!rail || !prev || !next) return;

    // Step = one card's width + the rail's gap, so each click
    // advances by exactly one card (snap-aligned).
    const step = () => {
      const card = rail.querySelector('.service-card');
      if (!card) return rail.clientWidth * 0.8;
      const gap = parseFloat(getComputedStyle(rail).columnGap || '0') || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const updateButtons = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      // 2px tolerance to handle subpixel rounding
      prev.disabled = rail.scrollLeft <= 1;
      next.disabled = rail.scrollLeft >= max - 1;
    };

    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left:  step(), behavior: 'smooth' }));
    rail.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();

    // ----- Click-and-drag scrolling -----
    // Lets the user grab the rail with the mouse and pan it.
    // We disable scroll-snap + smooth-scroll for the duration of
    // the drag (otherwise snap fights the manual motion), then
    // restore them on release. Drag distance is also tracked so we
    // can suppress the trailing click event after a meaningful drag
    // — without this, a quick swipe-to-scroll would also count as
    // a click on whatever card was under the cursor.
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let dragDistance = 0;
    const DRAG_THRESHOLD = 6; // px — below this, treat as a click

    rail.style.cursor = 'grab';
    rail.style.userSelect = 'none';

    const onPointerDown = (e) => {
      // Only primary mouse button (or any touch/pen)
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isDragging = true;
      dragDistance = 0;
      startX = e.pageX;
      startScrollLeft = rail.scrollLeft;
      rail.style.cursor = 'grabbing';
      rail.style.scrollSnapType = 'none';
      rail.style.scrollBehavior = 'auto';
      // Capture pointer so we keep getting moves even if the cursor
      // leaves the rail. Pointer is released on pointerup/cancel.
      rail.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.pageX - startX;
      dragDistance = Math.max(dragDistance, Math.abs(dx));
      rail.scrollLeft = startScrollLeft - dx;
    };

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      rail.style.cursor = 'grab';
      // Restore snap + smooth on next frame so the release doesn't
      // jolt the rail mid-momentum.
      requestAnimationFrame(() => {
        rail.style.scrollSnapType = '';
        rail.style.scrollBehavior = '';
      });
      if (e && rail.hasPointerCapture && rail.hasPointerCapture(e.pointerId)) {
        rail.releasePointerCapture(e.pointerId);
      }
    };

    rail.addEventListener('pointerdown', onPointerDown);
    rail.addEventListener('pointermove', onPointerMove);
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('lostpointercapture', endDrag);

    // Suppress the trailing click after a real drag so swiping
    // doesn't accidentally navigate.
    rail.addEventListener('click', (e) => {
      if (dragDistance > DRAG_THRESHOLD) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Prevent native image drag (otherwise the browser tries to
    // drag the photo out of the card during a rail drag).
    rail.querySelectorAll('img').forEach((img) => {
      img.setAttribute('draggable', 'false');
    });
  }

  // ----------------------------------------------------------
  // Founder cards equal-height (closed state only)
  // ----------------------------------------------------------
  // Sets `min-height` on every .founder-card to the tallest card
  // on load + resize, so that in their default (bio-collapsed)
  // state both cards line up at the same height. When a bio
  // opens, that card grows past its min-height — the other card
  // stays put (we don't re-equalize on toggle).
  function initFounderCardHeights() {
    const cards = Array.from(document.querySelectorAll('.founder-card'));
    if (cards.length < 2) return;

    const equalize = () => {
      cards.forEach((c) => (c.style.minHeight = ''));
      // Wait a frame so the browser settles natural heights first.
      requestAnimationFrame(() => {
        const max = Math.max(...cards.map((c) => c.offsetHeight));
        cards.forEach((c) => (c.style.minHeight = max + 'px'));
      });
    };

    equalize();
    // Re-equalize after images/fonts finish loading (heights shift).
    window.addEventListener('load', equalize);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(equalize, 200);
    });
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

  // ----------------------------------------------------------
  // Services page — sticky menu + focus pane.
  // Click a menu item (button[data-service]) to swap which
  // <article data-service-panel> is visible. Page itself
  // never scrolls between services.
  //
  // Also: opens a service from #hash on load, updates the
  // hash on click for shareable URLs, and supports arrow-key
  // navigation between tabs.
  // ----------------------------------------------------------
  function initServicesPage() {
    const buttons = Array.from(document.querySelectorAll('[data-service]'));
    const panels = Array.from(document.querySelectorAll('[data-service-panel]'));
    if (!buttons.length || !panels.length) return;

    const activate = (id, { focus = false, updateHash = false } = {}) => {
      let matched = false;
      buttons.forEach((b) => {
        const isMatch = b.dataset.service === id;
        if (isMatch) matched = true;
        b.classList.toggle('is-active', isMatch);
        b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        b.tabIndex = isMatch ? 0 : -1;
      });
      panels.forEach((p) => {
        const isMatch = p.dataset.servicePanel === id;
        p.classList.toggle('is-active', isMatch);
        if (isMatch) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
      if (!matched) return;
      if (focus) {
        const btn = buttons.find((b) => b.dataset.service === id);
        btn && btn.focus();
      }
      if (updateHash && history && typeof history.replaceState === 'function') {
        history.replaceState(null, '', `#${id}`);
      }
    };

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        activate(btn.dataset.service, { updateHash: true });
      });
      // Arrow-key navigation (Up/Down and Left/Right) between tabs
      btn.addEventListener('keydown', (e) => {
        let nextIndex = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIndex = (i + 1) % buttons.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nextIndex = (i - 1 + buttons.length) % buttons.length;
        else if (e.key === 'Home') nextIndex = 0;
        else if (e.key === 'End') nextIndex = buttons.length - 1;
        if (nextIndex !== -1) {
          e.preventDefault();
          activate(buttons[nextIndex].dataset.service, { focus: true, updateHash: true });
        }
      });
    });

    // Deep-link: if URL has #service-slug, open that service on load
    const hash = window.location.hash.replace('#', '');
    if (hash && panels.some((p) => p.dataset.servicePanel === hash)) {
      activate(hash);
    }
  }

  function boot() {
    initReveals();
    initHeroVideo();
    initIntentionalTabs();
    initServicesMarquee();
    initServicesRail();
    initFounderCardHeights();
    initServicesPage();
  }
  // Run now if DOM is already parsed (script at end of body); otherwise wait.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Re-run after partials mount — header/footer reveals + creek
  // rebuild now that footer has injected and the document height has
  // settled.
  document.addEventListener('partials:mounted', () => {
    initReveals();
  });
})();
