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

  // ----------------------------------------------------------
  // Page creek — one continuous SVG line woven through <main>,
  // animated to "flow" downward as the user scrolls.
  //
  // The path is built from each section's real pixel position so
  // the curve reads as one creek regardless of section heights.
  // We use a pixel-space viewBox (not normalized 0-100) so that
  // getTotalLength() returns true CSS pixels, which lets stroke-
  // dasharray / stroke-dashoffset cleanly drive the scroll-tied
  // draw animation without surprise scaling.
  // ----------------------------------------------------------
  const reducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let creekStates = [];

  // The hero's creek narrative: emerges from just past the left edge
  // at vertical center, waves toward the headline, loops up and over
  // it, comes down its right side, dips back below, then descends to
  // bottom-center where it hands off to the founders' cubic segment.
  // Coordinates are in scope pixel space (top + height = hero), so the
  // returned path slots straight into the larger creek path.
  function buildHeroLoopPath(width, height, top) {
    const X = (p) => (p * width) / 100;
    const Y = (p) => top + (p * height) / 100;
    const f = (n) => n.toFixed(1);

    return [
      // Enter just past the left edge so the line appears to come from off-screen.
      `M ${f(X(-2))} ${f(Y(50))}`,
      // Wavy entry — rises slightly, then dips, threading into the text area.
      `C ${f(X(6))}  ${f(Y(40))}, ${f(X(15))} ${f(Y(60))}, ${f(X(22))} ${f(Y(48))}`,
      // Climb up the left side of the headline.
      `C ${f(X(30))} ${f(Y(34))}, ${f(X(18))} ${f(Y(18))}, ${f(X(28))} ${f(Y(8))}`,
      // Arc up and over the top of the headline.
      `C ${f(X(40))} ${f(Y(-3))}, ${f(X(58))} ${f(Y(0))},  ${f(X(62))} ${f(Y(14))}`,
      // Come down the right side of the headline.
      `C ${f(X(66))} ${f(Y(30))}, ${f(X(56))} ${f(Y(48))}, ${f(X(46))} ${f(Y(48))}`,
      // Dip back left and below the headline.
      `C ${f(X(36))} ${f(Y(48))}, ${f(X(32))} ${f(Y(60))}, ${f(X(38))} ${f(Y(72))}`,
      // Descend wavy to bottom-center exit (matches founders' xTop=50).
      `C ${f(X(44))} ${f(Y(84))}, ${f(X(50))} ${f(Y(94))}, ${f(X(50))} ${f(Y(100))}`,
    ].join(' ');
  }

  function buildPageCreek() {
    creekStates = [];

    document.querySelectorAll('.page-creek').forEach((wrap) => {
      const svg = wrap.querySelector('svg');
      const paths = wrap.querySelectorAll('.page-creek__path');
      if (!svg || !paths.length) return;

      const scope = wrap.parentElement;
      if (!scope) return;

      const scopeRect = scope.getBoundingClientRect();
      const scopeHeight = scope.offsetHeight;
      const scopeWidth = scope.offsetWidth;
      if (!scopeHeight || !scopeWidth) return;

      // Gather segments from elements inside this scope that opted in.
      const segments = Array.from(scope.querySelectorAll('[data-creek-x-top]'))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            xTop: parseFloat(el.getAttribute('data-creek-x-top')),
            xBot: parseFloat(el.getAttribute('data-creek-x-bot')),
            pattern: el.getAttribute('data-creek-pattern') || null,
            top: r.top - scopeRect.top,
            height: r.height,
          };
        })
        .filter((s) => isFinite(s.xTop) && isFinite(s.xBot) && s.height > 0)
        .sort((a, b) => a.top - b.top);

      if (!segments.length) return;

      // viewBox in CSS pixels for both axes — so the rendered SVG is
      // 1:1 with the path's user units, which means getTotalLength()
      // returns honest CSS pixels and stroke widths render at 11 CSS px
      // without needing vector-effect: non-scaling-stroke.
      svg.setAttribute('viewBox', `0 0 ${scopeWidth} ${scopeHeight}`);

      // x in data attrs is a 0-100 percentage; convert to scope pixels.
      const xPx = (xPct) => (xPct * scopeWidth) / 100;

      // Compose path. Each segment either:
      //  - has a known pattern (hero-loop, ...): use its custom path
      //    generator, which provides its own M when first.
      //  - is the default: a cubic Bezier from (xTop, top) to (xBot, bot)
      //    with control points giving vertical tangents at the y-boundaries,
      //    so adjacent segments meet without a kink.
      let d = '';
      segments.forEach((s, i) => {
        if (s.pattern === 'hero-loop') {
          d += (d ? ' ' : '') + buildHeroLoopPath(scopeWidth, s.height, s.top);
          return;
        }
        const cp1y = s.top + s.height * 0.35;
        const cp2y = s.top + s.height * 0.65;
        const endY = s.top + s.height;
        if (i === 0) {
          d = `M ${xPx(s.xTop).toFixed(2)} ${s.top.toFixed(2)}`;
        }
        d +=
          ` C ${xPx(s.xTop).toFixed(2)} ${cp1y.toFixed(2)}, ` +
          `${xPx(s.xBot).toFixed(2)} ${cp2y.toFixed(2)}, ` +
          `${xPx(s.xBot).toFixed(2)} ${endY.toFixed(2)}`;
      });

      paths.forEach((p) => p.setAttribute('d', d));

      // Cache total length per path so the scroll handler doesn't have
      // to recompute it (getTotalLength is not super cheap).
      const pathInfo = Array.from(paths).map((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        // Start hidden if motion allowed; full draw if reduced motion.
        p.style.strokeDashoffset = reducedMotion ? '0' : String(len);
        return { el: p, length: len };
      });

      // Document-space y-range of the actual creek (first segment's
      // top → last segment's bottom). Used to map scroll → draw progress.
      const firstSeg = segments[0];
      const lastSeg = segments[segments.length - 1];
      const scopeDocTop = scopeRect.top + window.scrollY;
      const creekStartY = scopeDocTop + firstSeg.top;
      const creekEndY = scopeDocTop + lastSeg.top + lastSeg.height;

      creekStates.push({ paths: pathInfo, creekStartY, creekEndY });
    });

    applyCreekProgress();
  }

  // Map current scroll position to stroke-dashoffset on each cached path.
  // Anchor at 0.65 of the viewport height — the creek leads the eye
  // gently rather than lagging behind. Tweak the anchor constant to
  // make the draw feel more "ahead of" or "behind" the user's scroll.
  function applyCreekProgress() {
    if (!creekStates.length) return;
    const viewport = window.innerHeight;
    const scroll = window.scrollY;
    const anchor = scroll + viewport * 0.65;

    for (const state of creekStates) {
      const { creekStartY, creekEndY, paths } = state;
      const range = creekEndY - creekStartY;
      if (range <= 0) continue;
      let progress;
      if (reducedMotion) {
        progress = 1;
      } else {
        progress = (anchor - creekStartY) / range;
        if (progress < 0) progress = 0;
        else if (progress > 1) progress = 1;
      }
      for (const { el, length } of paths) {
        el.style.strokeDashoffset = String(length * (1 - progress));
      }
    }
  }

  let creekFrameRequested = false;
  function onCreekScroll() {
    if (creekFrameRequested) return;
    creekFrameRequested = true;
    requestAnimationFrame(() => {
      applyCreekProgress();
      creekFrameRequested = false;
    });
  }

  function initPageCreek() {
    buildPageCreek();

    // Rebuild on resize (debounced) and when images settle.
    let resizeTimer;
    const scheduleRebuild = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildPageCreek, 120);
    };
    window.addEventListener('resize', scheduleRebuild);
    window.addEventListener('load', buildPageCreek);

    // ResizeObserver catches lazy-loaded media or any layout shift that
    // changes the document height.
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(scheduleRebuild);
      const main = document.querySelector('main');
      main && ro.observe(main);
    }

    // Scroll-driven draw animation.
    window.addEventListener('scroll', onCreekScroll, { passive: true });
  }

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

  function boot() {
    initReveals();
    initHeroVideo();
    initIntentionalTabs();
    initServicesMarquee();
    initServicesRail();
    initPageCreek();
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
    buildPageCreek();
  });
})();
