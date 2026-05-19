# Cement Creek Veterinary Hospital — Session Notes

**Client:** Cement Creek Veterinary Hospital
**Location:** 60 Glacier Street, Crested Butte South, CO 81224 (Gunnison Valley)
**Domain:** cementcreekvet.com
**Project started:** 2026-05-18
**Last update:** 2026-05-19
**Status:** Homepage v6 — tabbed Intentional, services strip, scroll-driven creek, editorial hero. Iterating on a creek-shaped video mask for the hero that bleeds into the founders section.

---

## Summary

Independently and women-owned small-animal vet hospital. Founded by Dr. Kara Erickson (DVM) and Shawna Castillo (business). Now open, accepting new patients, Mon–Fri 8–5. Anti-corporate, anti-templated, smart-first/warm-second voice. Whole homepage is built around the creek as the symbolic anchor — both the practice's namesake and the through-line of the design.

---

## Locked Decisions

- **Sitemap:** Home, Team, Services (single page), Contact. **Homepage first.**
- **Copy mode:** PROVIDED verbatim. PDFs in `assets/copy/` (homepage, services, FAQ). Never reword.
- **Imagery:** Pull from Drive — no stock, no AI. Real photos only.
- **Primary CTA:** "Book an appointment" with placeholder `href="#"` and `data-todo` flags — launch swap.
- **Logo:** `assets/CEMENT CREEK MAIN LOGO.png` (lockup) + `assets/CEMENT CREEK MAIN LOGO_BADGE.png` (circular badge used in header + footer).
- **Heart Dog & Cat Fund CTAs:** placeholder `#` with TODO note, designed for future swap.
- **Hero shape:** Editorial split, ~70vh max. NOT a huge top banner (Shawna's note — "I don't like landing and seeing that huge top banner"). Quickly establishes personality + bleeds smoothly into the next section.
- **Services strip:** Max 50vh. NO polaroids (client likes border-radius). Direction: **Tall pill cards** (very rounded, photo-fill, overlay text) — pending build.
- **Intentional section:** Tabbed pills + single focus panel (compact, ~50-60vh).

---

## Design System

**Palette** (derived from logo, with warm counter-surfaces — no gradients per Brees' rule)
- `--paper` `#F4EBDA` — primary page bg, warm cream
- `--paper-warm` `#ECDFC8` — alt section bg
- `--ink` `#163B6C` — primary headings, CTAs, dark sections
- `--ink-deep` `#0D2548` — closer / footer / hero bg
- `--creek` `#9DD7E5` — creek-cyan accent
- `--creek-deep` `#5BA8C0` — used for the creek line itself
- `--stone` `#8A8275` — secondary text
- `--charcoal` `#1F2530` — body text

**Type**
- **Heading:** Instrument Serif (Google Fonts), italic in heroes/closers
- **Body:** Manrope (Google Fonts), 400/500/600/700/800

**Material treatments**
- Subtle paper-grain SVG noise overlay on body (multiply blend, ~42% opacity)
- Photos in founders section treated as "prints" with white border, soft shadow, slight rotation (`.photo-print` utility)
- Hand-drawn marker underline (creek-cyan SVG stroke) under "intentional" in the section title (currently unused after Intentional rebuild — may resurface)

**Motion**
- Slow Ken Burns zoom on hero media (22s alternating)
- IntersectionObserver scroll reveals (`data-reveal`, `data-reveal-stagger`)
- Sticky transparent-to-cream header
- Auto-scrolling services marquee (70s linear, hover/focus pauses) — TO BE REPLACED with tall pill cards (clean strip, no wave mask)
- **Scroll-driven creek draw** — `stroke-dashoffset` is mapped to scroll progress so the creek "flows" downward as the user scrolls
- Respects `prefers-reduced-motion`

---

## The Creek — Through-line of the Homepage

**Single continuous SVG path** spanning all of `<main>`, behind content as a watermark. Path is built dynamically in `scripts/main.js` (`buildPageCreek`) from each section's real pixel position, so the line truly flows as ONE creek regardless of section heights or viewport size. Two stacked paths blend via `mix-blend-mode` (multiply on light, screen on dark) so the line reads on cream AND on dark ink.

**Width:** 11px (5x the original 2.2px — client wanted thicker)

**Footer creek:** Removed. The main page-creek terminates at the bottom of `<main>`; the footer's dark band sits on top of where the line ends, giving the impression the creek slips behind the footer.

**Scroll animation:** `stroke-dasharray` set to total path length, `stroke-dashoffset` driven by `scroll + viewport * 0.65` against `creekStartY → creekEndY`. Result: creek "draws" downward as you scroll. `prefers-reduced-motion` skips the animation and shows full path.

**Hero loop (DEPRECATED / being reverted):** Briefly tried a `data-creek-pattern="hero-loop"` on the hero that emerged from the left edge, looped around the headline, then descended into founders. Per Brees, **revert this** — animated creek should start at founders again (the old narrative).

**x-positions (creek narrative through main):**
- Founders: x 50 → 70
- Intentional: x 70 → 88
- Services: x 88 → 105 (off-frame right at bottom)
- Closer: x 105 → 50 (re-enters from right, sweeps back to center)
- After-hours: x 50 → 50

---

## Homepage Section Order

1. **Topbar** — Mon–Fri · 8am–5pm · Welcoming new patients · CB South · Independently & women-owned (chips on ink-blue band)
2. **Sticky header** — badge logo · nav · phone-icon · Book CTA · mobile hamburger. Transparent over hero, glassy cream on scroll.
3. **Hero** — editorial split. Left column: tagline + intro paragraph + 2 CTAs (paper bg, ink text). Right column: video/photo. ~70vh max. **Next:** wrap the video in a creek-shaped clip-path and have it bleed into the founders section.
4. **Founders — Built with Purpose** — founder copy left, two photo prints stacked on right (building exterior + creek-dogs portrait). Creek path emerges here and weaves right.
5. **Everything is intentional** — 8 numbered tab-pills at the top, one detail panel below. Click a pill (or arrow-key navigate) to swap. ~one viewport.
6. **Services strip** — max 50vh. CURRENT: auto-scrolling polaroid marquee. PENDING: tall pill cards (very rounded, photo-fill, overlay text), clean strip with no wave mask.
7. **Closer** — deep ink-blue band with soft cyan glow. "*Where pets are neighbors and neighbors are friends.*" Book your visit CTA. Creek fragment 3 enters from off-frame right.
8. **After-hours** — warm cream band, Mountain Legacy callout. Creek passes through center.
9. **Footer** — 4-column ink footer (brand · visit · reach · site) + service-area band + legal. No creek inside (creek terminates at top of footer).

---

## Drive Assets Inventory

**Client Drive folder:** [Cement Creek Veterinary Hospital (cementcreekvet.com)](https://drive.google.com/drive/folders/1Eum_XXk2LhvZg1bZsF8GD2CEp3S45EL9) — folder ID `1Eum_XXk2LhvZg1bZsF8GD2CEp3S45EL9`

**Pulled and optimized in `assets/images/`** (max 1600px, JPEG 85):
- `creek-dogs-landscape.jpg` — hero (two dogs in shallow creek water, mountains)
- `creek-dogs-portrait.jpg` — founders secondary thumb
- `building-exterior.jpg` — founders primary (placeholder until founder portrait arrives)
- `fishbowl-framing.jpg` — Tools panel inside Intentional tabs (wood framing of the central observation room)
- `interior-buildout-1/2/3.jpg`, `interior-hallway.jpg` — reserve, available for Services/Team pages

**Pulled but not yet used:** `assets/videos/hero-dogs.mp4` (5.6 MB — actually `golden-jumping.mp4` from Drive). Likely candidate for the new clipped-mask hero video.

---

## TODOs flagged in code (`data-todo` attributes)

- Hero video — currently using still + Ken Burns; **next** is to swap to optimized Drive video and apply a creek-shaped clip-path so it bleeds into founders
- Founder portrait — Dr. Kara & Shawna in front of clinic (using building exterior as placeholder)
- Phone, text, email, pet portal, online pharmacy URLs
- Mountain Legacy Veterinary Center phone number
- Book-an-appointment scheduling URL
- Ways-to-pay destination
- Per-service real photos for the services strip — currently placehold.co warm placeholders for all 10 services

---

## File Structure

```
Cement Creek/
├── index.html
├── hero-preview.html              ← internal mockup: 4 hero options stacked (Brees picked #4 = editorial)
├── services-wave-mockup.html      ← internal mockup: wave-shaped mask carousel (rejected; polaroids out, going to tall pill cards instead)
├── .gitignore
├── robots.txt              (blocking — preview/staging)
├── robots.production.txt   (allow-all — launch swap)
├── session-notes.md
├── styles/
│   └── main.css            (all design tokens + sections)
├── scripts/
│   └── main.js             (scroll reveals + hero video handling + creek builder + tabs + marquee)
├── includes/
│   ├── header.html         (topbar + sticky header + mobile menu)
│   ├── footer.html         (4-col footer, no creek inside)
│   └── load-partials.js
└── assets/
    ├── CEMENT CREEK MAIN LOGO.png
    ├── CEMENT CREEK MAIN LOGO_BADGE.png
    ├── brief/              (Cement Creek Brief.pdf)
    ├── copy/               (homepage, services, FAQ PDFs)
    ├── images/             (real Drive photos, optimized)
    └── videos/             (hero-dogs.mp4, available)
```

---

## Preview & Deploy

- **Local preview:** `py -3 -m http.server 4322 --directory "C:/Users/brees/Claude Projects/Cement Creek"` → http://localhost:4322/
- **GitHub:** `digital-brees/cementcreek` — standalone repo, ignored by home monorepo
- **Vercel:** Not yet connected. Step to do: vercel.com → Add New Project → Import `digital-brees/cementcreek` → Framework: Other → Deploy

---

## Iteration History

**v1 (initial):** Built full homepage scaffold with placeholders. Hero, founders, intentional (with dark/cream tile mosaic), closer, after-hours, footer.

**v2:** Editorial flow with hairline 6-tile grid, Modern Tools photo-print. Pulled real Drive imagery. Paper-grain texture body overlay.

**v3 (intentional revisit):** 8 white notecards on warm-paper bg. Modern Tools is a media box with the fishbowl image stacked at top, text below.

**v4 (creek attempt 1):** Added 5 animated wave dividers between sections. Brees flagged "poorly executed" + clarified the actual intent. **Ripped out all 5 dividers.**

**v5:** Single continuous creek as 5 SVG fragments inside founders / intentional / closer / after-hours / footer. Static, watermark-style.

**v6 (current — 2026-05-19):** Major iteration day:
- Replaced the per-section creek fragments with ONE continuous SVG path spanning all of `<main>` (dynamic from real section positions). True visual continuity.
- Bumped creek width 2.2 → 11px (client wanted thicker)
- Removed footer creek (creek slips behind footer)
- Added scroll-driven `stroke-dashoffset` animation — creek flows downward as you scroll
- Replaced Intentional 8-box mosaic with **tabbed pills + single focus panel** (compact, ~50-60vh)
- Added **Services strip** with auto-marquee + polaroid placeholders (TO BE REPLACED with tall pill rounded cards)
- Replaced 92vh full-bleed photo hero with **editorial split** (~70vh, text left, photo/video right) — Shawna disliked the giant top banner
- Briefly tried `hero-loop` creek pattern (creek emerged from left of hero and looped around the headline) — **being reverted** so the animated creek starts at founders as before
- Internal mockup pages: `hero-preview.html` (4 hero options), `services-wave-mockup.html` (wave-mask carousel — rejected)

---

## What's Next

1. **Revert hero-loop creek** — remove `data-creek-pattern="hero-loop"` from the hero. Animated creek starts at founders again.
2. **Creek-shaped video mask** — wrap the hero video in an SVG clip-path that gives it an organic creek-bank silhouette on the left edge, and extend it visually down into the founders section so it bleeds across the boundary.
3. **Services strip rebuild** — replace polaroid auto-marquee with tall pill cards (very rounded, photo-fill, overlay text), clean strip with no wave mask.
4. **Continue tightening overall page length** — Intentional and Founders sections still ~85-88vh each; could go tighter.
5. Once homepage is locked: Team page, Services single-page, Contact page.
6. Vercel deploy.
