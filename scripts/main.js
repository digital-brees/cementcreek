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

      // Gather segments. Each section with [data-creek-x-top] contributes
      // one segment. If the section also has [data-creek-points], the
      // creek BENDS through those extra x% waypoints (evenly spaced
      // along the section's height) between top and bottom — letting
      // the creek wiggle within a single section instead of being a
      // simple straight diagonal sweep.
      const segments = Array.from(scope.querySelectorAll('[data-creek-x-top]'))
        .map((el) => {
          const r = el.getBoundingClientRect();
          const pointsAttr = el.getAttribute('data-creek-points');
          const points = pointsAttr
            ? pointsAttr.split(/[,\s]+/).map((s) => parseFloat(s)).filter((n) => isFinite(n))
            : null;
          return {
            xTop: parseFloat(el.getAttribute('data-creek-x-top')),
            xBot: parseFloat(el.getAttribute('data-creek-x-bot')),
            points: points && points.length ? points : null,
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

      // Build a smooth cubic-bezier path through a sequence of (x,y)
      // points using catmull-rom-style tangents (1/6 of the chord length
      // to neighbors). The path starts at the first point and threads
      // smoothly through the rest. First/last points use mirrored
      // tangents so the curve is well-defined at the ends.
      const smoothThrough = (pts) => {
        if (pts.length < 2) return '';
        let out = '';
        const get = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = get(i - 1);
          const p1 = get(i);
          const p2 = get(i + 1);
          const p3 = get(i + 2);
          const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
          const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
          const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
          const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
          out +=
            ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ` +
            `${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ` +
            `${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
        }
        return out;
      };

      // Compose path. Collect ALL waypoints from ALL sections into a
      // single point list, then run smoothThrough once. This guarantees
      // C1 (tangent) continuity across section boundaries — no more
      // visible kinks where one section's curve meets the next's.
      //
      // Sections with a `pattern` (hero-loop, etc.) are handled separately
      // and concatenated as raw path strings; they own their own M.
      let d = '';
      let allPts = [];

      const flushPoints = () => {
        if (allPts.length < 2) {
          allPts = [];
          return;
        }
        if (!d) {
          d = `M ${allPts[0][0].toFixed(2)} ${allPts[0][1].toFixed(2)}`;
        } else {
          d += ` L ${allPts[0][0].toFixed(2)} ${allPts[0][1].toFixed(2)}`;
        }
        d += smoothThrough(allPts);
        allPts = [];
      };

      segments.forEach((s) => {
        if (s.pattern === 'hero-loop') {
          flushPoints();
          d += (d ? ' ' : '') + buildHeroLoopPath(scopeWidth, s.height, s.top);
          return;
        }
        // Build this section's points: xTop at section top, optional
        // interior waypoints at evenly-spaced y, xBot at section bottom.
        const allX = s.points ? [s.xTop, ...s.points, s.xBot] : [s.xTop, s.xBot];
        allX.forEach((xPct, idx) => {
          const t = idx / (allX.length - 1);
          const pt = [xPx(xPct), s.top + s.height * t];
          // Skip the first point of subsequent sections — it duplicates
          // the previous section's last point (they share a boundary).
          if (idx === 0 && allPts.length > 0) return;
          allPts.push(pt);
        });
      });

      flushPoints();

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
    initPageCreek();
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
    buildPageCreek();
  });
})();
