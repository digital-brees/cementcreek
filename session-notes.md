# Cement Creek Veterinary Hospital — Session Notes

**Client:** Cement Creek Veterinary Hospital
**Location:** 60 Glacier Street, Crested Butte South, CO 81224 (Gunnison Valley)
**Domain:** cementcreekvet.com
**Project started:** 2026-05-18
**Last update:** 2026-05-20
**Status:** Homepage v10.1 — follow-on polish pass:
  - Header bg now solid `--paper` always (removed translucent `.is-scrolled` state that let colored sections bleed through on scroll)
  - Nav restructured with dropdowns: **About** (Team, Gallery) and **Pet Corner** (How to Pay, Heart Dog & Cat Fund, Resources & Links). Dropdowns are hover/focus-within with chevron rotation, rounded card, soft shadow
  - Social icons **moved** from main header to **topbar right side** — paper-colored 28px circles, hover fills creek-cyan. Topbar restructured as 3-col grid (spacer | centered chips | social) so chips stay visually centered
  - Mobile menu updated with all nav items including sub-link variant
  - **Wave divider on top of CTA/closer section** (same SVG pattern as founders→intentional, filled `--ink-deep`)
  - **All 16 placeholder images replaced with real Pexels photos** — 6 tab panels (square 1:1, 1200px) + 10 service cards (3:4 portrait, 900px). Respects no-vet-faces / no-gloves rules by leaning into lifestyle pet portraits and equipment-only shots. Utility: `fetch-pexels-images.py`

**Homepage v10 base:** heavy wide pass across the hero, header, intentional, services, closer, and footer.
  1. **Header right-aligned + sticky stack**: logo left, nav + actions (phone, IG, FB, Book CTA) pushed right via `margin-left:auto`. Topbar + main header wrapped in `.site-header-stack` (`position: sticky; top:0`) so both pin to the viewport on scroll. Logo +30% (58→76px). Body `overflow-x: hidden → clip` so sticky works.
  2. **Social icons**: Instagram + Facebook added to header (circular icon-links matching phone style) and to footer brand column (`.site-footer__social`, 38px outlined → fills creek-cyan on hover). Footer email wired to `ccvh@cementcreekvet.com`.
  3. **Hero rebuild**: New H1 = "Cement Creek Veterinary Hospital: Rooted in the Gunnison Valley. Built for Crested Butte pets." rendered as a two-tier hierarchy via inner spans — brand lockup (uppercase, 0.7-0.8rem, weight 600, prefixed with the wavy creek-mark dash) above an italic display tagline (clamp 2.25rem → 73px). Marker underline still under "Gunnison Valley." Lede paragraph removed. Founder signature row ("Founded by Dr. Kara Erickson & Shawna Castillo") sits below the buttons. Hairline rule trimmed to span buttons only via `align-self: flex-start` + `border-bottom` on `.hero__actions`. Hero shortened ~10% (min-height clamp 486px / 63vh / 648px; mask 738px / 83vh / 990px). Mask width back to clamp(54%, 58%, 64%). Column inset margin restored to clamp(5rem, 11vw, 11rem). Creek-mask clip-path bottom edge replaced with 4 small wave ripples.
  4. **Founders rebuild**: Real founders portrait swapped in (`assets/images/founders-portrait.jpg` from Drive). Mission redesigned as a structured callout — eyebrow "OUR MISSION" + italic pledge ("To leave every patient, client, and interaction *better than we found it.*") + three pillars trio underneath (HONEST MEDICINE · EMPATHY · REAL CONVERSATIONS) with creek-cyan dot separators.
  5. **Wave divider** between founders and intentional — `.founders::after` SVG path with 4 gentle wave humps, filled paper-warm.
  6. **Intentional update**: Tab pills now text-only (images removed from pills, retained inside the panels at 600x600). Tab order locked: Approach → Team → Care → Handling → Cats → Visits → Goodbyes → Tools. Copy fully replaced 1:1 with Brees' 2026-05-20 paste (en-dashes + curly apostrophes preserved). Team panel now uses real `assets/images/team-photo.jpg`. Title margin-bottom added so it breathes against intro paragraph.
  7. **Services**: Background unified with intentional (`--paper-warm`) so no off-gray → white seam.
  8. **Closer rebuilt**: Wide cinematic photo background (`assets/images/closer-bg.jpg`, ~1536x656 center-crop from Drive). Dark scrim = linear gradient (darker at top + bottom edges) + radial vignette so the headline + pills + CTA still read. `margin-top: -1px` overlap to defeat subpixel seam.
  9. **Creek opacity**: Reduced 0.75 → 0.32 (light) / 0.38 (dark) so it reads as a quiet watermark instead of competing.

Two one-shot Python utilities committed: `decode-and-optimize.py` (decode Drive MCP base64 → optimized JPEG), `download-closer-bg.py` (download a sites.google asset → cinematic crop).

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
- **Services strip:** REBUILT in v8. Tall pill cards (3:4 portrait, 32px radius, photo-fill, solid ink scrim caption overlay). Horizontal scroll with **prev/next arrow buttons** in the section header (next to "See all services →"). Scrollbar hidden. Drag/swipe + scroll-snap also work. Arrows auto-disable at start/end. Card width clamped 260-340px so ~4-5 fit on a wide desktop.
- **Polaroid retired sitewide.** `.photo-print` was the polaroid treatment (rotation, white border, asymmetric padding) — now reworked as a clean rounded photo card (32px corners, soft shadow, photo fills edge-to-edge). Captions overlay the bottom with a SOLID ink scrim (no gradient — per Brees' rule). Affects services + tab-panel "Tools" photo + any future use.
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

**v7.1 (2026-05-19):** Retuned the mask outline per Brees' red-line annotation:
- Replaced the toothy 8-bump zigzag with a clean **3-broad-meander** path that reads as one continuous creek bank instead of multiple sharp juts
- Subtle dip-right-then-back near the top, two gentle S-curves in the middle, then a bottom curve out at y=0.87 sweeping up to y=0.74 at the right edge
- Bottom-left of the path pushed from y=0.77 → y=0.87
- Founders grid `padding-top` increased to clear the deeper bleed
- Brees confirmed "much better"

**v7.2 – v7.12 (2026-05-19, scratchwork):** Many iterations attempting to match further annotations from Brees (image #3 through image #7). Tried: uniform horizontal bottom, slope-to-point at (1.0, 1.0), valley shape, drop-then-flat, increasingly tall masks (110vh → 150vh) with bigger founders padding. None landed. Reverted to v7.1 before v8 took over from a new mockup.

**v9 (2026-05-20, locked / committed):** Wide pass — footer rebuild, closer tighten, intentional images, all-Poppins, creek engine upgrade.

- **Footer rewrite** (in `includes/footer.html`):
  - Tagline → mission copy: "Our mission is to leave every patient, client, and interaction better than we found it."
  - "Book your visit" button: now CREAM fill on dark ink (was ink-on-ink, invisible)
  - After-hours emergency moved INTO Visit column under hours (standalone aside on homepage deleted)
  - Wavy SVG mark above credit + "Designed by Digital Empathy" with "Digital Empathy" linked to https://digitalempathyinc.com/
  - Copyright shrunk to 0.6875rem + opacity 0.38 + dropped onto its own line
  - Footer padding-bottom reduced from 2rem → 1.25rem; legal block tightened (wave 36×6, gap 0.15rem)
- **Closer tightened**:
  - Headline scaled from `var(--fs-display)` (peaks 7rem) → custom `clamp(2rem, 1.5rem+2.4vw, 3.5rem)` (peaks 3.5rem)
  - Padding-block: 5–8rem → 3.5–5.5rem
  - Headline constrained to max-width 22ch so it wraps cleanly to 2 lines
  - Blurred creek halo shrunk + softened
  - Service-area pills replacing the redundant "Proudly serving" paragraph (6 outlined chips, last one — "+ the rest of the Valley" — italic + no border as a continuation)
- **Intentional tab refactor**:
  - Tab pills: numeric `<span class="tab__index">01</span>` → `<img class="tab__image">` 28px rounded thumbnail. Pill padding adjusted to seat the image cleanly.
  - Tab-panel decorative "01" oversized italic number → `<img class="tab-panel__display">` 360px rounded square (`--radius-lg`) with shadow
  - Index labels: "01 · Approach" → just "Approach"
  - Placeholder color blocks per category (creek-blue / paper-warm / light-creek / stone / ink / etc.) — swap with real photos later
- **Typography → all Poppins**:
  - `--font-display` (was Instrument Serif) → Poppins
  - Google Fonts link replaced to load Poppins with both regular AND italic (so the italic accents still work, now as modern sans italic)
  - Headings (h1-h4): weight 400 → **500**
  - Italic `<em>` accents in headings: weight 400 → **300** (light italic, creates editorial contrast)
  - `.hero__title` weight bumped to 500, `.closer__title em` bumped to 300
- **Creek engine upgrade** (`scripts/main.js`):
  - New `data-creek-points` attribute — comma-separated x% waypoints at evenly-spaced y positions within a section. Lets the creek BEND multiple times within one section instead of just sweeping diagonally.
  - smoothThrough() helper: builds a cubic-bezier path through N points with Catmull-Rom-style tangents (1/6 chord length).
  - All sections now collected into ONE unified waypoint list, then smoothed in a single pass — guarantees C1 (tangent) continuity at section boundaries. **No more visible kinks where one section's curve meets the next's.**
  - Closer can exit off-screen via xBot > 100 (currently 115 — matches Brees' annotation where the line exits past the right edge).
- **Creek route** (per `data-creek-points` + xTop/xBot):
  - Founders: 85 → 92, 90, 80, 55 → 15 (enters right, bulges right, sweeps to left)
  - Intentional: 15 → 13, 15, 14, 14 → 15 (stays left with subtle wiggle)
  - Services: 15 → 20, 38, 60 → 85 (smooth left-to-right diagonal)
  - Closer: 85 → 95, 105 → 115 (exits off-screen right)
- **Cache fix** (`includes/load-partials.js`): partials now fetched with `cache: 'no-cache'` so future edits to footer.html / header.html show up without hard refresh.

**v8.1 (2026-05-19):** Hero gets the real video, v8 mask gets reverted, typography swap, creek visibility bump:
- **Hero video shipped.** `<img>` swapped for `<video data-hero-video autoplay muted loop playsinline preload="metadata" poster="...">` pointing at `assets/videos/hero-video.mp4`. Source was `2-dogs.mp4` from Drive (78 MB at 1920×1080, 21 Mbps), compressed via ffmpeg to **8.3 MB at 1280×720, CRF 26, H.264 main, audio stripped, +faststart**. Poster frame extracted at 1s mark → `assets/videos/hero-video-poster.jpg` (268 KB). Original source deleted from the repo. Existing `initHeroVideo()` JS handles autoplay-blocked fallback (paints poster as background).
- **v8 mask REVERTED to v7.1.** Brees decided the 150vh tall mask + multi-wave descending bottom was too much. Both `clipPath` path and `.hero-media-mask` height restored to v7.1 (smooth meander + gentle horizontal-ish bottom at y=0.84-0.89, 92vh height). Founders padding-top stays at v7.1's 12vh.
- **Typography: Manrope → Poppins.** Updated `--font-body` token and the Google Fonts link (same weight range: 300-800).
- **Creek animation opacity 0.45 → 0.75.** Both `.page-creek__path--light` and `--dark` more visible. Still uses mix-blend-mode multiply/screen for light/dark sections.

**v8 (2026-05-19, superseded by v8.1):** Two changes shipped together — Brees confirmed "closest we've gotten":
- **Hero mask v8 — match for image #8 mockup.** Path: left meander wave preserved (0.15,0 → 0.12,0.46), then bottom descends with multi-wave organic curves through (0.20, 0.54) → (0.42, 0.62) → (0.62, 0.72) → (0.82, 0.86) → (1.00, 0.97). Right edge straight up. Mask height: 92vh → **150vh**, so the descending bottom runs deep past the founders content on the right side; the photo's right edge extends down off the bottom of typical viewports. Founders content is positioned to clear the photo on the left side; on the right side the photo overlaps the text column with z-index keeping text legible on top.
- **Services strip rebuild + polaroid retired sitewide.**
  - `.photo-print` was the polaroid treatment (rotation, white border, asymmetric padding). Now reworked as a CLEAN ROUNDED CARD: 32px corners, soft shadow, photo fills edge-to-edge, no rotation, no border. Captions overlay the bottom with a SOLID ink scrim (rgba(13,37,72,0.72)) — no gradient per Brees' rule.
  - Services strip: tall pill cards (3:4 portrait), width clamp(260px, 23vw, 340px) so ~4-5 fit on wide desktop. Horizontal scroll, **scrollbar HIDDEN**. Prev/next arrow buttons in the section header (next to "See all services →") — 44px circular outlined buttons with chevron icons, auto-disabled at start/end. Drag/swipe also works natively.
  - Tab-panel "Tools" photo inherits the new clean rounded treatment automatically.
  - Legacy `initServicesMarquee` retired; new `initServicesRail` wires arrow clicks to `scrollBy({ left: cardWidth + gap, behavior: 'smooth' })` and listens for scroll/resize to update disabled state.
- **JS reliability fix:** `boot()` now runs immediately if `document.readyState` is past 'loading', falling back to `DOMContentLoaded` listener. Fixes case where the script ran after DOMContentLoaded had already fired (which silently lost the listener attachment).

---

## What's Next

1. **Hero mask polish** — fine-tune the multi-wave bottom curve character; address dog-on-right cropping (object-position) now that mask is much taller.
2. **Hero video** — swap the still image for an optimized looping muted video
3. **Founder portrait** — swap building exterior for an actual photo of Dr. Kara + Shawna
4. **Page length pass** — Intentional, closer still ~85-88vh each. May want to tighten.
5. Once homepage is locked: Team page, Services single-page, Contact page
6. Vercel deploy
