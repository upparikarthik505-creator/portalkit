# PortalKit Design System

> **Source of truth.** Every marketing and product UI page must reuse these tokens, components, and motion values.  
> Do **not** invent new colors, fonts, spacing, radii, shadows, or animation timings.  
> If a new pattern seems needed, flag it — do not invent it silently.  
> Craft bar: HoneyBook warmth + Apple hierarchy + Vercel precision — **not** literal HoneyBook cloning.

---

## Brand

| Token | Value |
| --- | --- |
| Product | PortalKit |
| Positioning | Client HQ for Shopify freelancers |
| Personality | Warm, calm, editorial, precise |
| Primary accent | Coral `#FF5A5F` |
| Display font | **Syne** (headings, brand, metrics) |
| Body font | **Figtree** (UI, paragraphs, labels) |

**Logo motion (one signature, reuse everywhere):** Brand mark soft-lifts `translateY(-1px)` + `scale(1.02)` on hover, `150ms ease-out`. No page-specific logo variants.

---

## 1. Color palette

### Core

| Token | Hex | CSS var | Usage |
| --- | --- | --- | --- |
| `ink` | `#1F1F23` | `--ink` | Primary text, dark surfaces |
| `ink-2` | `#3A3A42` | `--ink-2` | Secondary text |
| `paper` | `#FFF7F5` | `--paper` | Soft section backgrounds |
| `paper-2` | `#FFFFFF` | `--paper-2` | Default page / cards |
| `hero` | `#FFF1EE` | `--hero` | Hero wash |
| `muted` | `#6D6A73` | `--muted` | Body secondary, meta |
| `line` | `#EFE7E4` | `--line` | Borders, dividers |
| `accent` | `#FF5A5F` | `--accent` | Primary CTA, links, focus |
| `accent-deep` | `#E8464C` | `--accent-deep` | CTA hover / pressed |
| `accent-soft` | `#FFE5E6` | `--accent-soft` | Soft fills, chips |

### Semantic

| Token | Hex | Usage |
| --- | --- | --- |
| `success` / `success-soft` | `#1F8A5B` / `#EAF8F2` | Paid, on-track |
| `warn` / `warn-soft` | `#B7791F` / `#FFF3D9` | Attention |
| `danger` / `danger-soft` | `#E8464C` / `#FFE5E6` | Errors |
| `info` / `info-soft` | `#3B5BDB` / `#E8EEFC` | Informational only |

### Deprecations (do not expand use)

| Token | Status |
| --- | --- |
| `lavender` / `lavender-ink` | Legacy — avoid on new marketing sections (no purple-led themes) |
| `muted-2` | Alias of `muted` — prefer `muted` only |

### Surface rules

- Default page background: `paper-2`
- Alternating marketing bands: `paper-2` ↔ `paper` (never invent a third wash)
- Dark CTA / footer: `ink` with text `white` / `white/65` / `white/40`
- Contrast: body text on paper ≥ WCAG AA

---

## 2. Typography

### Families

| Role | Family | Weights |
| --- | --- | --- |
| Display | Syne | 600, 700, 800 (prefer **700**) |
| Body / UI | Figtree | 400, 500, 600, 700 |

### Locked type classes (marketing)

Use these utilities from `globals.css` — **do not** invent ad-hoc `text-[Npx]` on marketing pages:

| Class | Role | Size |
| --- | --- | --- |
| `.mkt-brand` | Giant wordmark | `clamp(2.5rem, 8vw, 5rem)` |
| `.mkt-brand-sm` | Compact wordmark (CTA) | `clamp(2rem, 5vw, 2.75rem)` |
| `.mkt-h1` | Hero supporting line | `clamp(1.375rem, 3.2vw, 2rem)` |
| `.mkt-h2` | Section headline | `clamp(1.75rem, 4vw, 2.5rem)` |
| `.mkt-h2-sm` | Compact section / dark CTA | `1.5rem` → `1.875rem` |
| `.mkt-feature` | Featured story title | `1.5rem` → `1.75rem` |
| `.mkt-h3` | Card / beat title | `1.25rem` |
| `.mkt-row` | Compact Syne row title | `0.9375rem` |
| `.mkt-lede` | Section intro | `1rem` / weight 500 |
| `.mkt-body` | Card / detail body | `0.9375rem` / weight 500 |
| `.mkt-quote` | Testimonials | `1rem` / weight 500 |
| `.mkt-meta` | Helper / plan name | `0.8125rem` / weight 600 |
| `.mkt-eyebrow` | Section eyebrow (accent) | `0.75rem` / tracking `0.12em` / uppercase |
| `.mkt-label` | UI chrome label | `0.6875rem` / tracking `0.12em` / uppercase |
| `.mkt-link` | Inline text link | `0.8125rem` / weight 700 / accent |
| `.mkt-chip` | Chips / pills text | `0.75rem` / weight 700 |
| `.mkt-metric` | Big numbers | `2.125rem` Syne 700 |
| `.mkt-nav` | Nav items (no baked color) | `0.8125rem` / weight 600 |

### Headline animation (ONE pattern — reuse everywhere)

**Name:** `SplitRise`  
**Implementation:** `KineticHeadline` (heroes) / `SplitHeadline` (section H2s)  
**Behavior:** Words rise from a clip mask (`yPercent 115 → 0`), transform-only (never opacity on copy).  
**Timing:** duration `900ms` hero / `850ms` sections · stagger `50–60ms` · ease `power3.out`  
**Reduced motion:** skip transform; show final state immediately.

---

## 3. Spacing & grid

| Token | Value |
| --- | --- |
| Base unit | **4px** |
| Rhythm | Multiples of **8px** preferred |
| Section pad (mobile) | `64px` vertical (`mkt-section` ≈ `4rem`) |
| Section pad (desktop) | `88px` vertical (`5.5rem`) |
| Section horizontal | `20px` (`px-5`) |
| Container | **`max-w-6xl` (1152px)** — marketing default |
| Hero container | same `max-w-6xl` |
| Card gap | `16–24px` |
| Stack gap (copy → CTA) | `24–32px` |

### Breakpoints

| Name | Min width | Behavior |
| --- | --- | --- |
| mobile | `375px` | Single column, stacked hero |
| tablet | `768px` | 2-col grids, journey tabs |
| desktop | `1024px` | Full nav, 2-col hero |
| large | `1280px` | Optional 3D hero frame tilt |
| xl | `1536px` | Same tokens; no new scale |

### Nav collapse

- Full nav: `≥ 1024px` (`lg`)
- Hamburger: `< 1024px`

---

## 4. Radii, shadows, elevation

| Token | Value | Usage |
| --- | --- | --- |
| `--radius` | `16px` | Default cards / surfaces |
| Control radius | `14px` | Buttons (`.btn`) |
| Frame radius | `16–18px` | Product frames |
| Soft shadow | `0 12px 40px rgba(31,31,35,0.06)` | Cards |
| Lift shadow | `0 20px 50px rgba(31,31,35,0.10)` | Hero frame / featured |

Avoid: multi-layer glow stacks, purple glows, `rounded-full` on primary CTAs (pills OK for chips/nav only).

---

## 5. Component library

### Button (`.btn`)

| Variant | Default | Hover | Active |
| --- | --- | --- | --- |
| `btn-primary` | fill `accent`, text white | fill `accent-deep`, `translateY(-1px)` | press scale `0.98` |
| `btn-secondary` | white + `line` border | bg `paper` | same |
| `btn-dark` | fill `ink` | near-black | — |
| `btn-ghost` | transparent, muted text | bg `paper` | — |
| `btn-compact` | smaller pad, `13px` type | same rules | — |

**Transition:** color/bg/border `200ms ease-out`; lift `150ms ease-out`.  
**Focus:** `2px` outline `accent` offset `2px`.  
**Disabled:** opacity `0.45`, no hover lift.

Reuse `MagneticLink` + `.btn` for marketing CTAs — no page-specific button skins.

### Card / surface

- Border `line`, radius `--radius`, bg `paper-2` or `paper/60`
- Hover (interactive only): border tint toward accent, soft lift — duration `200ms ease-out`
- **Hero: no cards** — product frame is the single visual plane

### Input

- Border `line`, radius `14px`, bg white
- Focus: ring `2px accent`
- Error: border `danger`, helper `danger`

### Nav (`MarketingHeader`)

- Floating glass pill: `bg-white/80`, `backdrop-blur`, border `white/70`
- Active item: `bg-ink` + white text
- Mega menus expand inside shell (no `overflow-hidden` clipping)

### Footer (`MarketingFooter`)

- bg `ink`, columns Tools / Studio / Company
- Labels: `.mkt-label` on dark via `.mkt-on-dark`
- Links: `white/75` → `white` on hover

### Logo (`BrandMark`)

- Mark gradient `accent → accent-deep`
- Wordmark Syne bold
- Hover: signature logo motion only (see Brand)

---

## 6. Motion system

### Principles

1. **One language** site-wide — same easing families and duration bands.
2. **Transform-only on readable copy** — never tween opacity of headlines/body (washout bug).
3. **`prefers-reduced-motion: reduce`** — disable entrance/loop animations; show final layout.
4. **Implementation today:** GSAP + `@gsap/react` (already in repo). Match timings below.  
   Do **not** add Framer Motion / Lottie until an explicit migration pass — a second library causes drift.

### Timing tokens (CSS + JS)

| Token | Value | Use |
| --- | --- | --- |
| `--motion-micro` | `180ms` | Hover, focus, click |
| `--motion-ui` | `220ms` | Panels, menus |
| `--motion-enter` | `500ms` | Section reveal |
| `--motion-hero` | `850–1000ms` | Hero entrance |
| `--motion-stagger` | `70–90ms` | Children stagger |
| Ease micro | `ease-out` / `power2.out` | Interactions |
| Ease enter | `power2.out` / `power3.out` | Entrances |
| Ease loop | `sine.inOut` | Ambient float |

### Patterns (reuse only)

| Pattern | Where | Spec |
| --- | --- | --- |
| `HeroEnter` | Landing hero | `.hero-anim` y `42→0`, scale `0.97→1`, stagger `90ms`, `850ms` |
| `SplitRise` | All major headlines | See typography |
| `SectionReveal` | `.reveal-section .reveal-item` | y `36→0`, `500–700ms`, stagger `70ms`, once on scroll |
| `FloatLoop` | Hero product frame | y `±10px`, `3.4s` yoyo |
| `OrbDrift` | `AmbientOrbs` | soft x/y/scale loops |
| `MagneticCTA` | `MagneticLink` | cursor pull `0.2`, spring out |
| `TiltCard` | Interactive cards only | rotateX/Y on pointer — not in hero |

Heroes may use enhanced `HeroEnter` + `SplitRise`. All other sections use `SectionReveal` only.

---

## 7. Layout composition rules (marketing)

1. **Brand-first hero** — `PortalKit` is the hero signal; one supporting headline; one lede; one CTA group; one dominant product visual.
2. **No cards in hero.** No floating badges/chips overlaid on hero media.
3. **One job per section** — one eyebrow, one H2, one lede.
4. **Container** — always `max-w-6xl` + `px-5` unless documented exception.
5. **Proof strip** — open metrics (`.count-metric-flat`), not boxed KPI cards on home.
6. Avoid: purple-on-white themes, cream+serif clichés, dense pill clusters, stat strips in hero.

---

## 8. Sitemap & shared chrome

### Marketing routes

| Route | Purpose |
| --- | --- |
| `/` | Landing |
| `/why` | Why PortalKit |
| `/pricing` | Pricing |
| `/templates` | Packs / templates |
| `/reviews` | Testimonials |
| `/resources` | Guides / resources |
| `/product/[slug]` | Tool detail |
| `/business-type/[slug]` | Studio / niche pages |
| `/sign-in`, `/sign-up` | Auth (Clerk) |
| `/dashboard` | App (and demo entry) |
| `/p/[token]` | Client portal |

### Shared

- `MarketingShell` → `MarketingHeader` + `MarketingFooter`
- Motion wrapper: `LandingMotion` on home; `reveal-section` / `reveal-item` elsewhere

---

## 9. Accessibility

- Focus visible on all interactive controls (`accent` ring)
- Text contrast AA on paper and ink surfaces
- Decorative orbs/grids: `aria-hidden`
- Split headlines: include accessible text (`sr-only` or `aria-label`)
- Honor `prefers-reduced-motion`
- Hit targets ≥ `44px` on mobile primary CTAs where practical

---

## 10. Agent / Cursor standing rules

When building or editing any page:

1. Restate: “Reusing tokens/components from `design-system.md`.”
2. Pull colors only from §1, type only from §2, spacing from §3, motion from §6.
3. Reuse `Button` (`.btn`), header, footer, `SplitHeadline` / `KineticHeadline`, `MagneticLink`, `CountMetric` — no one-off variants.
4. Do not introduce new hex values, font families, or animation durations.
5. Before inventing a pattern, open an issue note in the PR/chat instead of shipping a one-page snowflake.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-08-09 | Initial lock — PortalKit coral system, Syne/Figtree, GSAP motion tokens, marketing type ladder |
