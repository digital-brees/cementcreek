# Cement Creek Veterinary Hospital — Session Notes

**Client:** Cement Creek Veterinary Hospital
**Location:** 60 Glacier Street, Crested Butte South, CO 81224 (Gunnison Valley)
**Domain:** cementcreekvet.com
**Project started:** 2026-05-18
**Status:** Homepage v3 — continuous-creek watermark, white-card mosaic, real Drive imagery

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
- **"Everything is intentional" layout:** 8-box asymmetric mosaic. White notecards on warm-paper bg. One box (Modern Tools) has the fishbowl image stacked at the top, text below — image and text never overlap.

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
- Photos treated as physical "prints" with white border, soft shadow, slight rotation (`.photo-print` utility)
- White notecards on warm-paper bg for mosaic, with soft card shadows for depth
- Hand-drawn marker underline (creek-cyan SVG stroke) under "intentional" in the section title

**Motion**
- Hero Ken Burns zoom (18s alternating)
- IntersectionObserver scroll reveals (`data-reveal`, `data-reveal-stagger`)
- Sticky transparent-to-cream header
- Hover: tile/card lift, image scale, creek-cyan link underline
- Respects `prefers-reduced-motion`

---

## The Creek — Through-line of the Homepage

**Single continuous SVG creek line** woven through five section fragments, behind content as a watermark. **No animation** (the journey is created by the line being there as you scroll). Each fragment is positioned `absolute; inset: 0;` inside its section with `overflow: hidden` to clip off-frame parts.

**Path narrative** (each viewBox `0 0 100 100`, `preserveAspectRatio="none"`)
1. **Founders** — emerges at top-center, curves gently right → exits x=78% bottom
2. **Intentional** — enters x=78% top, weaves right and **goes off the right edge** (x>100) for the section's middle/bottom
3. **Closer** — enters off-frame from right (x=110), curves back to center-bottom — the "comes back into frame" moment
4. **After-hours** — passes through center
5. **Footer** — continues down center, pools and ends at ~62% (the creek's destination)

**Treatments**
- Light sections: `--creek-deep` stroke, opacity 0.22, stroke-width 2.5
- Dark sections (closer/footer): `--creek` stroke, opacity 0.32 (`.section-creek--on-dark` modifier)

**What it accomplishes** (per Brees' brief):
- Visual orientation — shows you where you are in the page
- Illusion of going down the creek as you scroll
- Subtle, watermark-style — not distracting

---

## Homepage Section Order

1. **Topbar** — Mon–Fri · 8am–5pm · Welcoming new patients · CB South · Independently & women-owned (chips on ink-blue band)
2. **Sticky header** — badge logo · nav · phone-icon · Book CTA · mobile hamburger. Transparent over hero, glassy cream on scroll.
3. **Hero** — full-bleed `creek-dogs-landscape.jpg` with slow Ken Burns. "*This must be the place.*" italic Instrument Serif. Book CTA + ghost link.
4. **Built with Purpose** — founder copy on the left (eyebrow + headline + paragraph + italic mission). Two photo prints stacked on right: `building-exterior.jpg` primary, `creek-dogs-portrait.jpg` secondary overlapping the corner. Creek fragment 1 emerges in this section.
5. **Everything is intentional.** — 8-box asymmetric mosaic on warm paper. White notecards with soft shadows. Numbered indicators (01 · Approach, 02 · Care, …). Hand-drawn marker underline under "intentional." Creek fragment 2 weaves through and off the right edge.
6. **Closer** — deep ink-blue band with soft cyan glow. "*Where pets are neighbors and neighbors are friends.*" Book your visit CTA. Creek fragment 3 enters from off-frame right.
7. **After-hours** — warm cream band, Mountain Legacy callout. Creek fragment 4 passes through.
8. **Footer** — 4-column ink footer (brand · visit · reach · site) + service-area band + legal. Creek fragment 5 pools here.

---

## Drive Assets Inventory

**Client Drive folder:** [Cement Creek Veterinary Hospital (cementcreekvet.com)](https://drive.google.com/drive/folders/1Eum_XXk2LhvZg1bZsF8GD2CEp3S45EL9) — folder ID `1Eum_XXk2LhvZg1bZsF8GD2CEp3S45EL9`

**Pulled and optimized in `assets/images/`** (max 1600px, JPEG 85):
- `creek-dogs-landscape.jpg` — hero (two dogs in shallow creek water, mountains)
- `creek-dogs-portrait.jpg` — founders secondary thumb
- `building-exterior.jpg` — founders primary (placeholder until founder portrait arrives)
- `fishbowl-framing.jpg` — Modern Tools tile (wood framing of the central observation room)
- `interior-buildout-1/2/3.jpg`, `interior-hallway.jpg` — reserve, available for Services/Team pages

**Pulled but not yet used:** `assets/videos/hero-dogs.mp4` (5.6 MB — actually `golden-jumping.mp4` from Drive). Available as hero video if the still doesn't suffice.

**Logo:** Pulled from local assets (`assets/CEMENT CREEK MAIN LOGO.png` + `_BADGE.png`).

---

## TODOs flagged in code (`data-todo` attributes)

- Hero video — currently using still + Ken Burns; can swap to optimized Drive video later
- Founder portrait — Dr. Kara & Shawna in front of clinic (using building exterior as placeholder)
- Phone, text, email, pet portal, online pharmacy URLs
- Mountain Legacy Veterinary Center phone number
- Book-an-appointment scheduling URL
- Ways-to-pay destination
- `services.html#happy-visits` anchor (Services page not built yet)

---

## File Structure

```
Cement Creek/
├── index.html
├── .gitignore
├── robots.txt              (blocking — preview/staging)
├── robots.production.txt   (allow-all — launch swap)
├── session-notes.md
├── styles/
│   └── main.css            (all design tokens + sections)
├── scripts/
│   └── main.js             (scroll reveals + hero video handling)
├── includes/
│   ├── header.html         (topbar + sticky header + mobile menu)
│   ├── footer.html         (4-col footer with creek fragment)
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

- **Local preview:** `py -3 -m http.server 8780 --directory "C:/Users/brees/Claude Projects/Cement Creek"` → http://localhost:8780/
- **GitHub:** `digital-brees/cementcreek` — standalone repo, ignored by home monorepo
- **Vercel:** Not yet connected. Step to do: vercel.com → Add New Project → Import `digital-brees/cementcreek` → Framework: Other → Deploy

---

## Iteration History

**v1 (initial):** Built full homepage scaffold with placeholders. Hero, founders, intentional (with dark/cream tile mosaic), closer, after-hours, footer.

**v2:** Brees flagged "flat / not materialistic" + "everything is intentional" tile colors disliked. Switched to editorial flow (text-only Context, hairline 6-tile grid, Modern Tools with photo-print). Pulled real Drive imagery and put it in. Added paper-grain texture body overlay. Treated photos as physical prints.

**v3 (intentional revisit):** Brees wanted back to 8 boxes, with at least one image. Made all boxes white notecards on warm-paper bg. Modern Tools is a media box with the fishbowl image stacked at top, text below — image never under text.

**v4 (creek attempt 1):** Added 5 animated wave dividers between sections. Brees flagged "poorly executed" + clarified the actual intent: a single continuous creek as a watermark woven through the page. **Ripped out all 5 dividers.**

**v5 (current):** Single continuous creek as 5 SVG fragments inside founders / intentional / closer / after-hours / footer. Static, watermark-style. Curves off the right edge in intentional, re-enters in closer. Functions as scroll orientation cue + downstream illusion.

---

## What's Next

- React to v5 creek treatment (opacity / stroke-width / path shape / color tuning)
- Material refinements (topbar still feels like a hard rectangle; could soften with rounded outer corners or repositioning)
- Subtle paper texture inside the white cards so they don't read as pure flat white
- Possible subtle parallax on hero image
- Once homepage is locked: Team page, Services single-page, Contact page
- Vercel deploy
