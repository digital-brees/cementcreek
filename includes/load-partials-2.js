// ============================================================
// load-partials-2.js — v2 variant of the partial loader.
// Fetches includes/header-2.html + includes/footer-2.html so
// the v2 design track stays isolated from v1's header/footer.
// Drop placeholders into v2 pages:
//   <div id="global-header"></div>
//   <div id="global-footer"></div>
// ============================================================

(function () {
  'use strict';

  // Detect path depth so subpages can resolve `../includes/...`
  // For now everything lives at root, but this keeps subpage support open.
  const depth = (location.pathname.match(/\//g) || []).length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  function inject(targetId, partialUrl) {
    const target = document.getElementById(targetId);
    if (!target) return Promise.resolve();
    // cache: 'no-cache' forces the browser to revalidate against the
    // server every load. Without this, partial edits (footer.html /
    // header.html) get served from disk cache and Brees can't see
    // changes without a hard refresh.
    return fetch(prefix + partialUrl, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${partialUrl}`);
        return res.text();
      })
      .then((html) => {
        target.innerHTML = html;

        // Rewrite asset/page paths for subpage depth (currently no-op at root)
        if (depth > 0) {
          target.querySelectorAll('[src], [href]').forEach((el) => {
            ['src', 'href'].forEach((attr) => {
              const val = el.getAttribute(attr);
              if (val && !/^(https?:|tel:|mailto:|sms:|#|\/)/.test(val)) {
                el.setAttribute(attr, prefix + val);
              }
            });
          });
        }
      })
      .catch((err) => console.error('[load-partials]', err));
  }

  function markActiveNav() {
    const current = location.pathname.split('/').pop() || 'homepage-2.html';
    document.querySelectorAll('.site-header__link, .mobile-menu__link').forEach((link) => {
      const href = link.getAttribute('href');
      // v2 "home" is homepage-2.html (not / or index.html, which belong to v1).
      const matchHome = current === '' || current === 'homepage-2.html';
      const isHome = href === 'homepage-2.html';
      if ((matchHome && isHome) || href === current) {
        link.setAttribute('data-nav-current', '');
      } else {
        link.removeAttribute('data-nav-current');
      }
    });
  }

  function bootInteractions() {
    // Sticky header style on scroll
    const header = document.querySelector('[data-header]');
    if (header) {
      const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Mobile menu toggle
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        })
      );
    }

    // Inject current year into copyright
    document.querySelectorAll('[data-current-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  Promise.all([
    inject('global-header', 'includes/header-2.html'),
    inject('global-footer', 'includes/footer-2.html'),
  ]).then(() => {
    markActiveNav();
    bootInteractions();
    // Let page scripts know partials are mounted
    document.dispatchEvent(new CustomEvent('partials:mounted'));
  });
})();
