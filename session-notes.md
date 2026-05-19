# Cement Creek Veterinary Hospital — Session Notes

**Client:** Cement Creek Veterinary Hospital
**Location:** 60 Glacier Street, Crested Butte South, CO 81224 (Gunnison Valley)
**Domain:** cementcreekvet.com
**Project started:** 2026-05-18
**Last update:** 2026-05-19
**Status:** Homepage v7.1 — creek-shaped video mask retuned. Replaced 8 tight zigzag bumps with 3 broad meanders on the left edge (smooth organic creek-bank), pushed bottom-left of the path from y=0.77 → y=0.87 so the photo bleeds ~80px deeper into founders, and bumped founders grid `padding-top` from 9vh → 12vh to keep the image column clear of the deeper bleed. Brees confirmed "much better" — locked.

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
- **Hero:** Editorial split, text LEFT (pulled inward via larger `margin-left`), video on RIGHT clipped to creek-shaped silhouette. Video bleeds across the hero/founders boundary so the two sections feel like one block.
- **Founders layout:** Image LEFT (single rounded photo, no polaroid styling), text RIGHT — swapped per Brees' annotation.
- **Services strip:** Max 50vh. PENDING: tall pill cards (rounded, photo-fill, overlay text). Currently still the polaroid auto-marquee from v6 — needs rebuild.
- **Intentional section:** Tabbed pills + single focus panel (compact, ~50-60vh).
- **No black border between sections** — confirmed by Brees. The video's bleed unifies hero + founders.
- **Animated creek line is BEHIND the video** — z-index ordered so the photo paints on top wherever they overlap.
- **Wavy eyebrow dash** — `.eyebrow::before` is an inline SVG sine wave (32×8px, 2.5 humps) instead of a straight 28×1px dash. Echoes the creek motif.

---

## Design System

**Palette** (derived from logo, no gradients per Brees' rule)
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
- Founders single image: rounded corners (radius 20px), soft drop shadow, no tilt, no border — replaces the previous polaroid stack
- Eyebrow dash is now wavy (SVG sine wave) instead of a straight line

**Motion**
- Slow Ken Burns zoom on hero media (22s alternating)
- IntersectionObserver scroll reveals (`data-reveal`, `data-reveal-stagger`)
- Sticky transparent-to-cream header
- Auto-scrolling services marquee (will be replaced with tall pill cards)
- **Scroll-driven creek draw** — `stroke-dashoffset` mapped to scroll progress so the creek "flows" downward as the user scrolls
- Respects `prefers-reduced-motion`

---

## The Hero Video Mask — Creek Silhouette

**Architecture:**
- `<aside class="hero-media-mask">` sits between `<section class="hero">` and `<section class="founders">` in the DOM.
- On desktop, the aside is `position: absolute; top: 0; right: 0;` with `width: 68%` (mask left edge at ~32% from page left) and `height: 92vh`. This makes it overlap the hero AND slightly into the founders section.
- A `<clipPath id="creek-mask" clipPathUnits="objectBoundingBox">` defined in inline SVG at the top of `<body>` shapes the visible region of the photo. The path uses 0-1 coordinates so the mask scales with the element.
- The video itself is currently a still image (`assets/images/creek-dogs-landscape.jpg`) with a `data-todo` flag to swap to a looping muted video later.
- On mobile (`max-width: 800px`), the mask drops to `position: static; width: 100%; height: 36vh; clip-path: none;` — becomes a normal in-flow strip between hero text and founders, with the clip disabled.

**Current clip-path** (matches Brees' image #7 annotated screenshot):
```
M 0.16 0
C 0.21 0.04, 0.13 0.09, 0.18 0.13
C 0.23 0.17, 0.12 0.21, 0.17 0.25
C 0.22 0.29, 0.10 0.32, 0.16 0.36
C 0.21 0.40, 0.13 0.44, 0.17 0.48
C 0.24 0.52, 0.12 0.55, 0.18 0.58
C 0.21 0.62, 0.15 0.65, 0.20 0.68
C 0.28 0.71, 0.40 0.73, 0.54 0.74
C 0.72 0.75, 0.88 0.76, 1.00 0.77
L 1.00 0
Z
```

7 organic creek-bank bumps in the upper portion (amplitudes ±0.04-0.07), then a quick sweep right at the bottom (y=0.71-0.77 of element). The right edge exit is at element-y 0.77, which is just past the section seam (modest bleed into founders).

**Z-index hierarchy** (within main's stacking context):
- `.hero-media-mask`: z-index 2 (above founders bg)
- `.page-creek`: z-index 1 (below the mask, so the creek line goes BEHIND the photo)
- Section content containers (`.container`, etc.): z-index 3 (above mask + creek)
- `.hero__copy`: z-index 4 (above everything)

This solved a critical bug where founders' background was painting OVER the mask because positioned z-index auto and z-index 0 are treated the same in CSS and founders came later in DOM. Bumping mask to z-index 2 ensured the photo paints on top of founders' background while staying behind text content.

---

## The Animated Creek — Through-line of the Homepage

**Single continuous SVG path** spanning all of `<main>`, behind content as a watermark. Path is built dynamically in `scripts/main.js` (`buildPageCreek`) from each section's real pixel position, so the line truly flows as ONE creek regardless of section heights or viewport size. Two stacked paths blend via `mix-blend-mode` (multiply on light, screen on dark) so the line reads on cream AND on dark ink.

**Width:** 11px (5x the original 2.2px — client wanted thicker)

**Hero treatment:** Animated creek does NOT start in the hero. Starts at the top of the founders section (first section with `data-creek-x-top` attributes). The hero has no `data-creek-*` attrs.

**Footer creek:** Removed. The main page-creek terminates at the bottom of `<main>`; the footer's dark band sits on top of where the line ends.

**Z-index:** The page-creek SVG is at z-index 1, BELOW the hero video mask (z-index 2), so the creek line goes behind the photo where they overlap. The line is fully visible elsewhere on the page.

**Scroll animation:** `stroke-dasharray` set to total path length, `stroke-dashoffset` driven by `scroll + viewport * 0.65` against `creekStartY → creekEndY`. Creek "draws" downward as you scroll. `prefers-reduced-motion` skips the animation and shows full path.

**x-positions (creek narrative through main):**
- Founders: x 50 → 70
- Intentional: x 70 → 88
- Services: x 88 → 105 (off-frame right at bottom)
- Closer: x 105 → 50 (re-enters from right, sweeps back to center)
- After-hours: x 50 → 50

---

## Homepage Section Order

1. **Topbar** — Mon–Fri · 8am–5pm · Welcoming new patients · CB South · Independently & women-owned (chips on ink-blue band)
2. **Sticky header** — badge logo · nav · phone-icon · Book CTA · mobile hamburger
3. **Hero** — text LEFT (pulled inward via margin-left: clamp(4rem, 9vw, 9rem), max-width 36%), creek-clipped video on RIGHT (~68% width, 92vh tall). Video bleeds across the section seam into the founders area.
4. **Founders — Built with Purpose** — single rounded image on LEFT, text on RIGHT (eyebrow with wavy dash + headline + body + mission). Padding-top clears the modest founders-side bleed of the hero video.
5. **Everything is intentional** — 8 numbered tab-pills, one detail panel below
6. **Services strip** — max 50vh. CURRENT: auto-scrolling polaroid marquee. PENDING: tall pill cards rebuild
7. **Closer** — deep ink-blue band. "*Where pets are neighbors and neighbors are friends.*"
8. **After-hours** — warm cream band, Mountain Legacy callout
9. **Footer** — 4-column ink footer + service-area band + legal. No creek inside.

---

## Drive Assets Inventory

**Client Drive folder:** [Cement Creek Veterinary Hospital (cementcreekvet.com)](https://drive.google.com/drive/folders/1Eum_XXk2LhvZg1bZsF8GD2CEp3S45EL9) — folder ID `1Eum_XXk2LhvZg1bZsF8GD2CEp3S45EL9`

**Pulled and optimized in `assets/images/`** (max 1600px, JPEG 85):
- `creek-dogs-landscape.jpg` — hero photo (clipped via creek mask)
- `creek-dogs-portrait.jpg` — no longer used (was secondary polaroid; now replaced by single image)
- `building-exterior.jpg` — founders single image (LEFT column)
- `fishbowl-framing.jpg` — Tools panel inside Intentional tabs
- `interior-buildout-1/2/3.jpg`, `interior-hallway.jpg` — reserve

**Pulled but not yet used:** `assets/videos/hero-dogs.mp4` (5.6 MB). Likely candidate for the looping hero video when ready.

---

## TODOs flagged in code (`data-todo` attributes)

- Hero video — currently using still + clip-path; next is to swap to optimized Drive video
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
├── index.html                      ← contains the inline <clipPath id="creek-mask"> SVG defs
├── hero-preview.html               ← internal mockup: 4 hero options (Brees picked editorial split)
├── services-wave-mockup.html       ← internal mockup: wave-mask carousel (rejected)
├── .gitignore
├── robots.txt
├── robots.production.txt
├── session-notes.md
├── styles/
│   └── main.css
├── scripts/
│   └── main.js
├── includes/
│   ├── header.html
│   ├── footer.html
│   └── load-partials.js
└── assets/
    ├── CEMENT CREEK MAIN LOGO.png
    ├── CEMENT CREEK MAIN LOGO_BADGE.png
    ├── brief/
    ├── copy/
    ├── images/
    └── videos/
```

---

## Preview & Deploy

- **Local preview:** `py -3 -m http.server 4322 --directory "C:/Users/brees/Claude Projects/Cement Creek"` → http://localhost:4322/
- **GitHub:** `digital-brees/cementcreek`
- **Vercel:** Not yet connected.

---

## Iteration History

**v1–v5:** See git history. Foundational scaffolding, mosaic intentional, real Drive imagery, creek watermark fragments.

**v6 (2026-05-18):** Tabbed Intentional, services strip with auto-marquee polaroids, scroll-driven creek (11px stroke, dashoffset animated), editorial-split hero (Option 4 from preview).

**v7 (2026-05-19, this session):** Multiple iterations on a creek-shaped video mask:
- Started with `data-creek-pattern="hero-loop"` (creek emerged from left of hero and looped around the headline) — reverted
- Built `<aside class="hero-media-mask">` with `clip-path: url(#creek-mask)` and inline `<clipPath>` SVG defs
- Iterated path many times trying to match Brees' annotated screenshots:
  - Sawtooth zigzag (too geometric) → rejected
  - Smooth waves (too soft) → rejected
  - Mixed C + L commands (organic curves with occasional sharp jut) → closer
  - Multiple passes adjusting mask height, bleed depth, bump amplitude, sweep angle
- **Critical fix mid-session:** Discovered the founders section background was painting OVER the mask because of CSS stacking quirks (positioned z-index auto behaves like z-index 0 in painting order, and founders came later in DOM). Re-ordered z-indexes: mask 2, page-creek 1, section content 3, hero__copy 4.
- Hero text moved inward (`max-width: 36%`, `margin-left: clamp(4rem, 9vw, 9rem)`)
- Founders layout swapped: single rounded image LEFT, text RIGHT (was text LEFT, polaroid stack RIGHT)
- Eyebrow dash replaced with wavy SVG sine wave
- Removed black section divider border
- Final v7 path matched Brees' image #7 — organic creek-bank with 7 bumps descending through the hero, then sweeping right to exit just past the section seam

**v7.1 (2026-05-19, this session, locked):** Retuned the mask outline per Brees' red-line annotation:
- Replaced the toothy 8-bump zigzag with a clean **3-broad-meander** path that reads as one continuous creek bank instead of multiple sharp juts
- Subtle dip-right-then-back near the top (matching the bulge in Brees' drawing), two gentle S-curves in the middle, then a bottom curve out at y=0.87 sweeping up to y=0.74 at the right edge
- Bottom-left of the path pushed from y=0.77 → y=0.87, putting the photo's bottom ~80px deeper into the founders section (was only ~10px in). The mask now visibly "goes into the founder section"
- Founders grid `padding-top` increased from `clamp(4rem, 9vh, 7rem)` → `clamp(6rem, 12vh, 9rem)` to keep the building-exterior image clear of the deeper bleed
- Brees confirmed "much better" — mask shape now locked

---

## What's Next

1. **Services strip rebuild** — replace polaroid auto-marquee with tall pill cards (very rounded, photo-fill, overlay text). Clean strip, no wave mask. Direction was locked in but not yet built.
2. **Hero video** — swap the still image for an optimized looping muted video
3. **Founder portrait** — swap building exterior for an actual photo of Dr. Kara + Shawna
4. **Page length pass** — Intentional, closer still ~85-88vh each. May want to tighten.
5. Once homepage is locked: Team page, Services single-page, Contact page
6. Vercel deploy
