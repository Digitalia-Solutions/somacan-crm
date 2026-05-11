# Responsive QA Report

## Pages Tested
- `/` (Home — WheelHero, ProductsShowcase, CategorySection, BlogPreview)
- `/shop` (ShopHero, ShopGrid)
- `/about` (AboutHero, AboutPrinciples, AboutManifeste, AboutMethod, AboutTimeline, AboutEngagement)
- `/blog` (BlogHero, BlogGrid)
- `/contact` (ContactHero, ContactForm, ContactMap, ContactFAQ)
- `/shop/:slug` (ProductRelated, ArticleEditorialNote)
- `/blog/:slug` (BlogArticle, ArticleEditorialNote)
- Navbar (mobile menu)

## Breakpoints Tested (via source audit)
- Mobile: 360px, 390px, 430px
- Tablet: 768px, 820px, 1024px
- Desktop: 1280px+

---

## Issues Found & Fixes Applied

### 1. Typography — Large headings on mobile

| File | Issue | Fix |
|------|-------|-----|
| `ShopHero.jsx` | `text-6xl md:text-9xl` — jumps from 60px to 128px | `text-5xl md:text-7xl lg:text-9xl` |
| `AboutHero.jsx` | `text-5xl md:text-8xl` — 60px mobile | `text-4xl md:text-6xl lg:text-8xl` |
| `AboutEngagement.jsx` | `text-4xl md:text-6xl` — still large | `text-3xl md:text-5xl lg:text-6xl` |
| `AboutMethod.jsx` | `text-4xl md:text-6xl` | `text-3xl md:text-5xl lg:text-6xl` |
| `AboutManifeste.jsx` | `text-4xl md:text-6xl` | `text-3xl md:text-5xl lg:text-6xl` |
| `AboutTimeline.jsx` | `text-4xl md:text-6xl` | `text-3xl md:text-5xl lg:text-6xl` |
| `ContactHero.jsx` | `text-5xl md:text-8xl` — 60px mobile | `text-4xl md:text-6xl lg:text-8xl` |
| `BlogHero.jsx` | `text-5xl md:text-8xl` | `text-4xl md:text-6xl lg:text-8xl` |
| `BlogPreview.jsx` | `text-5xl md:text-8xl` | `text-4xl md:text-6xl lg:text-8xl` |
| `CategorySection.jsx` | `text-5xl md:text-7xl` | `text-4xl md:text-6xl lg:text-7xl` |
| `WheelHero.jsx` | `text-5xl md:text-7xl xl:text-8xl` product name | `text-4xl md:text-6xl xl:text-8xl` |
| `WheelHero.jsx` | `text-7xl md:text-8xl` price | `text-5xl md:text-7xl lg:text-8xl` |

### 2. Layouts — Grids without mobile fallbacks

| File | Issue | Fix |
|------|-------|-----|
| `CategorySection.jsx` (n=2) | `grid grid-cols-2` — 2 cols on 360px | `grid grid-cols-1 sm:grid-cols-2` |
| `CategorySection.jsx` (n=3) | `grid grid-cols-3` — 3 cols on 360px | `grid grid-cols-1 sm:grid-cols-3` with `sm:col-span-2` |
| `AboutPrinciples.jsx` | `grid gap-10 lg:grid-cols-3` — 3 cols on mobile | `grid gap-6 md:gap-10 md:grid-cols-2 lg:grid-cols-3` |
| `AboutTimeline.jsx` | `grid gap-px bg-white/10 lg:grid-cols-3` — 3 cols on mobile | Added `md:grid-cols-2` intermediate step |
| `BlogPreview.jsx` | `grid md:grid-cols-3` — 3 cols from 768px | `grid gap-8 md:grid-cols-2 lg:grid-cols-3` |
| `ContactFAQ.jsx` | `grid gap-5 md:grid-cols-3` | `grid gap-4 md:grid-cols-2 lg:grid-cols-3` |

### 3. Spacing — Oversized padding/gaps on mobile

| File | Issue | Fix |
|------|-------|-----|
| `AboutTimeline.jsx` | `px-8 py-14 … md:px-14 md:py-16` dark card | `px-5 py-10 … md:px-14 md:py-16` |
| `ContactFAQ.jsx` | `px-8 py-10 … md:px-12 md:py-14` dark card | `px-5 py-8 … md:px-12 md:py-14` |
| `ContactForm.jsx` | `p-8 … md:p-10` form card | `p-6 … md:p-10` |
| `BlogHero.jsx` | `mb-20` below header | `mb-12 md:mb-20` |
| `BlogPreview.jsx` | `mb-24` below header | `mb-12 md:mb-24` |
| `WheelHero.jsx` header | `px-10 py-6 md:px-16` | `px-5 py-4 md:px-10 md:py-6 lg:px-16` |
| `WheelHero.jsx` content | `px-10 md:px-16 lg:px-24 pb-12` | `px-5 md:px-10 lg:px-24 pb-6 md:pb-12` |
| `WheelHero.jsx` bottom bar | `px-10 md:px-16 lg:px-24 h-32` | `px-5 md:px-10 lg:px-24 h-24 md:h-32 gap-4` |
| `WheelHero.jsx` button | `px-12 md:px-16 py-6` | `px-6 md:px-12 lg:px-16 py-4 md:py-6` |

### 4. Images — Fixed heights that overflow on mobile

| File | Issue | Fix |
|------|-------|-----|
| `AboutEngagement.jsx` | `h-[520px]` image placeholder | `h-[280px] md:h-[520px]` |
| `AboutMethod.jsx` | `h-[520px]` image placeholder | `h-[280px] md:h-[520px]` |
| `ContactHero.jsx` | `h-[560px]` image placeholder | `h-[320px] md:h-[560px]` |
| `ContactMap.jsx` | `h-[460px]` iframe | `h-[280px] md:h-[400px] lg:h-[460px]` |
| `CategorySection.jsx` | `height: 500px` fixed grid height | `clamp(360px, 60vw, 500px)` |
| `CategorySection.jsx` | `h-[500px]` loading spinner | `h-[360px] md:h-[500px]` |

### 5. Dark card border-radius on mobile

| File | Issue | Fix |
|------|-------|-----|
| `AboutTimeline.jsx` | `rounded-[2.75rem]` — too large on 360px | `rounded-[2rem] md:rounded-[2.75rem]` |
| `ContactFAQ.jsx` | `rounded-[2.8rem]` | `rounded-[2rem] md:rounded-[2.8rem]` |
| `ContactForm.jsx` form card | `rounded-[2.6rem]` | `rounded-[2rem] md:rounded-[2.6rem]` |

### 6. Navbar mobile menu

| Issue | Fix |
|-------|-----|
| `h-screen` doesn't account for browser chrome on iOS | Changed to `h-[100dvh]` |
| Menu content not scrollable with many items | Added `overflow-y-auto flex-1` to nav links container |
| Header area not shrink-proof | Added `shrink-0` to top bar |
| Excessive padding `py-12` on mobile | Reduced to `py-8 gap-6` |

---

## Sections with No Issues Found
- `ShopGrid.jsx` — `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` ✅
- `BlogGrid.jsx` — `md:grid-cols-2 xl:grid-cols-3` ✅
- `ContactForm.jsx` form fields — `md:grid-cols-2` ✅
- `ContactHero.jsx` contact cards — `sm:grid-cols-3` ✅
- `ProductRelated.jsx` — `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` ✅
- `ArticleEditorialNote.jsx` — single column, no grid ✅
- `AboutHero.jsx` two-column — `lg:grid-cols-[…]` ✅ (defaults to 1 col)
- `AboutManifeste.jsx` two-column — `lg:grid-cols-[…]` ✅
- `AboutMethod.jsx` two-column — `lg:grid-cols-[…]` ✅
- `AboutEngagement.jsx` two-column — `lg:grid-cols-[…]` ✅
- `ContactHero.jsx` two-column — `lg:grid-cols-[…]` ✅
- `ContactMap.jsx` two-column — `lg:grid-cols-[…]` ✅
- `ProductsShowcase.jsx` — horizontal scroll with `w-64 md:w-72` fixed cards ✅
- `section-padding` utility — `px-6 md:px-12 lg:px-24 xl:px-40` ✅

---

## Remaining Risks

1. **WheelHero 3D wheel on very small screens (360px)** — The `translateZ(400px)` 3D product wheel is a perspective effect that may clip or overlap text on very narrow viewports. The product info (`order-2`) stacks below the wheel (`order-1`) on mobile which is correct, but the wheel height `h-[300px] md:h-[500px]` could feel cramped. Monitor on actual device.

2. **WheelHero quantity selector** — `flex items-center gap-8 px-6 py-4` may be tight next to the buy button on 360px. Consider hiding quantity on mobile or stacking vertically.

3. **AboutHero stats grid `grid-cols-3`** — 3 stats at 33% width with `text-3xl` values is fine at 360px, but text labels (`text-[10px] tracking-[0.26em]`) may be very tight. Visually acceptable but borderline.

4. **BlogArticle page** — `lg:grid-cols-[1.2fr_0.8fr]` editorial layout is single-column on mobile (correct), but the aside note card appears below all article sections which may be very far down on long articles.

5. **Cart/Checkout** — Not audited via code (build confirms structure). Known responsive classes (`lg:grid-cols-[minmax(0,1fr)_380px]`, `md:grid-cols-2`) follow correct mobile-first patterns. Recommend manual device test.

6. **Large image files (5–8MB PNGs)** — No LCP impact fix applied. This affects perceived performance on mobile more than desktop. Recommend WebP conversion separately.

---

## Build Status
`npx vite build --mode development` → **✓ built in 3.19s** — 0 errors
