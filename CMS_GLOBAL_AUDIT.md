# CMS Global Audit — Somacan
**Date:** 2026-05-08  
**Auditor:** Claude Sonnet (architect review)  
**Scope:** Full codebase — frontend, backend, shared, admin, public

---

## Executive Summary

The Somacan CMS is a **moderately mature, multi-tier page building system** built from scratch on React + Node/Sequelize. It has a functioning V2 architecture with widget-based rendering, template system, responsive engine, animation engine, and a capable page builder. The foundation is solid. However, several critical gaps prevent it from reaching WordPress/Elementor-level quality:

1. No visual drag-and-drop builder (Elementor-like canvas)
2. No nested container / column system
3. Two parallel CMS architectures (V1/V2) creating confusion
4. Security issues (API key in localStorage)
5. Missing error boundaries throughout
6. No section/widget template library
7. No content scheduling, no RBAC, no collaboration tools

**Verdict:** Production-ready for basic content editing. NOT ready for non-developer CMS users. Needs a visual builder layer to reach Elementor-equivalent UX.

---

## 1. Front Office Audit

### 1.1 CMS Page Rendering

| Feature | Status | Notes |
|---------|--------|-------|
| Dynamic page rendering via slug | ✅ Done | `DynamicPage.jsx` → `getPageBySlug()` |
| Template-aware section rendering | ✅ Done | `PageRenderer.jsx` + `TemplateEngine.js` |
| V2 widget section rendering | ✅ Done | `WidgetSectionRenderer.jsx` + `WidgetRegistry.jsx` |
| V1 legacy section rendering | ✅ Done | `SectionRenderer.jsx` maps 25+ component types |
| Error boundary on sections | ❌ Missing | A broken section crashes the whole page |
| Loading skeletons for async sections | ❌ Missing | ProductShowcase/CategoryGrid show blank while fetching |
| 404 handling on missing pages | ⚠️ Partial | Falls back to hardcoded component, no proper 404 page |

### 1.2 Mobile/Tablet Responsiveness

| Feature | Status | Notes |
|---------|--------|-------|
| Global overflow-x hidden | ✅ Fixed | `html { overflow-x: hidden }` added |
| Mobile-first breakpoints (sm/md/lg) | ✅ Done | Tailwind utilities throughout |
| Responsive engine (CSS variable injection) | ✅ Done | `ResponsiveEngine.js` per section/widget |
| Navbar mobile menu (premium animation) | ✅ Done | Framer Motion drawer, stagger, backdrop |
| Hero sections mobile scaling | ✅ Fixed | `clamp()` fluid typography applied |
| Cart / Checkout mobile | ✅ Fixed | Order summary reordered, fluid headings |
| ShopGrid 2-col on mobile | ✅ Fixed | `grid-cols-2` on mobile |
| WheelHero mobile bottom bar | ✅ Fixed | Quantity hidden, fluid price |
| Touch targets (44px minimum) | ⚠️ Partial | Nav icons fixed, form buttons need audit |
| Safe-area inset (iPhone notch) | ✅ Done | `env(safe-area-inset-top)` on navbar |

### 1.3 SEO Metadata

| Feature | Status | Notes |
|---------|--------|-------|
| Page metaTitle / metaDescription | ✅ Done | Set via `DynamicPage.jsx` `document.title` |
| Open Graph tags (og:title, og:image, etc.) | ✅ Done | Full OG tag set injected |
| Twitter card tags | ✅ Done | twitter:card, title, description, image |
| Canonical URL | ✅ Done | `<link rel="canonical">` injected |
| noIndex robots meta | ✅ Done | `noindex, nofollow` when `page.noIndex === true` |
| Structured data / JSON-LD | ❌ Missing | No schema.org markup |
| Dynamic OG image generation | ❌ Missing | ogImage is a static URL, not generated |
| Sitemap.xml | ❌ Missing | No route or generator |
| robots.txt | ❌ Missing | Not present |
| SEO for blog articles | ⚠️ Partial | BlogArticle.jsx injects some meta, not full |
| SEO for product pages | ⚠️ Partial | ProductDetail has no custom meta injection |

### 1.4 Animations

| Feature | Status | Notes |
|---------|--------|-------|
| Framer Motion scroll-reveal per section | ✅ Done | `AnimatedSection.jsx` + `useScrollAnimation.js` |
| GSAP presets (parallax, scroll-velocity) | ✅ Done | `AnimationEngine.js` 4 GSAP presets |
| Widget-level stagger animation | ✅ Done | `useGSAPStaggerReveal()` in WidgetSectionRenderer |
| Widget individual animation | ✅ Done | `WidgetShell` applies FM variants per widget |
| GSAP ScrollTrigger cleanup on unmount | ⚠️ Partial | Hook may have cleanup bugs |
| Preview mode disables animations | ⚠️ Partial | `previewMode` prop exists but not fully honored |
| Replay animation button in editor | ❌ Missing | No way to preview animation in builder |

### 1.5 Dynamic Products / Categories / Blog

| Feature | Status | Notes |
|---------|--------|-------|
| Products list page (`/shop`) | ✅ Done | ShopGrid with filter/sort/category |
| Product detail page (`/shop/:slug`) | ✅ Done | ProductDetail with add-to-cart |
| Related products | ✅ Done | ProductRelated section |
| Categories section | ✅ Done | CategorySection with image grids |
| Blog list (`/blog`) | ✅ Done | BlogGrid + BlogHero |
| Blog article (`/blog/:slug`) | ✅ Done | BlogArticle with editorial layout |
| Dynamic product widgets in CMS | ✅ Done | ProductShowcaseWidget, ProductCardWidget |
| Dynamic category widgets in CMS | ✅ Done | CategoryCardWidget, CategoryGridWidget |
| Blog widgets in CMS | ⚠️ Partial | BlogGrid section exists but no BlogWidget |

### 1.6 Header / Footer / Menu

| Feature | Status | Notes |
|---------|--------|-------|
| CMS-driven header | ✅ Done | `useHeaderSettings.js` + `HeaderSettings` model |
| Nav links from CMS menu | ✅ Done | Menu `main` loaded and converted to navLinks |
| Sticky header behavior | ✅ Done | Configurable via header settings |
| CMS-driven footer | ⚠️ Partial | AdminFooter exists but footer component may be hardcoded |
| Menu builder admin | ✅ Done | `MenuBuilder.jsx` with drag-drop nesting |
| Multi-level menu support | ⚠️ Partial | Data model supports nesting, UI rendering uncertain |
| Mobile menu premium UX | ✅ Done | Full Framer Motion drawer with stagger |

### 1.7 Cart / Checkout

| Feature | Status | Notes |
|---------|--------|-------|
| Cart page (items, quantities, total) | ✅ Done | Cart.jsx with mobile-responsive layout |
| Checkout form (address, payment) | ✅ Done | Checkout.jsx full form |
| Guest checkout | ✅ Done | checkoutMode state, guestAccountInvite |
| Coupon / discount code | ✅ Done | getCheckoutQuote with coupon validation |
| Server-side quote (shipping, discounts) | ✅ Done | `/api/checkout/quote` endpoint |
| Order creation + confirmation | ✅ Done | createOrder + success state |
| Cart mobile responsive | ✅ Fixed | Heading, aside padding, summary |
| Checkout mobile responsive | ✅ Fixed | Fluid heading, aside order-1 on mobile, CTA visible |
| Payment gateway (Stripe/PayPal) | ❌ Missing | Cash on delivery + bank transfer only |

---

## 2. Admin CMS Audit

### 2.1 Page Builder (PageBuilder2.jsx)

| Feature | Status | Notes |
|---------|--------|-------|
| Page list sidebar | ✅ Done | With publish/unpublish toggle |
| Section list with search/filter | ✅ Done | Case-insensitive name+type search |
| Add section modal (template-aware) | ✅ Done | Filters section types by template |
| Edit section drawer (full editor) | ✅ Done | 5-tab: Content/Style/Animation/Responsive/Advanced |
| Drag-and-drop section reorder | ✅ Done | `@dnd-kit/sortable` integration |
| Up/down reorder buttons | ✅ Done | Fallback for keyboard users |
| Duplicate section | ✅ Done | `duplicatePageSection()` API call |
| Delete section (with confirm) | ✅ Done | Destructive action guarded |
| Live preview pane | ✅ Done | Device switcher (desktop/tablet/mobile) + zoom |
| SEO editor per page | ✅ Done | metaTitle, metaDescription, ogImage, canonicalUrl, noIndex |
| Undo/Redo (50-item history) | ✅ Done | Keyboard shortcuts Cmd+Z / Cmd+Shift+Z |
| Draft autosave to localStorage | ✅ Done | 10s debounce, recovery UI on next visit |
| Version snapshots (last 10) | ✅ Done | localStorage, but NO restore UI |
| Keyboard shortcuts | ✅ Done | Escape, Cmd+Z/Y, Delete, Cmd+D, arrows |
| Dirty state warning on page switch | ✅ Done | Confirmation dialog |
| Section visibility toggle | ✅ Done | Active/inactive toggle per section |
| Template locking | ⚠️ Partial | templateLock field exists but UI enforcement unclear |
| Revision history restore UI | ❌ Missing | Snapshots saved but no restore interface |
| Bulk section operations | ❌ Missing | No multi-select |
| Section copy-paste across pages | ❌ Missing |  |
| Section template library | ❌ Missing | Can't save/load section configurations as templates |
| Auto-save to server (not localStorage) | ❌ Missing | Only localStorage, risk of data loss on browser clear |

**Known Bugs in PageBuilder2.jsx:**
1. **Line 505** — `filteredSections` used in DnD but reorder uses full `sections` — reorder mismatch when filter active
2. **Line 929** — History push debounced 300ms, not flushed on save — stale undo state possible
3. **Line 987/1024** — localStorage silently fails on quota exceeded — no user warning
4. **Line 1059** — `previewSections` map rebuilt every render — performance issue on large pages

### 2.2 Section Builder / Form Renderer

| Feature | Status | Notes |
|---------|--------|-------|
| Content fields tab | ✅ Done | Full field set via FieldRenderer.jsx |
| Style tab (presets + overrides) | ✅ Done | StylePresetField + custom JSON |
| Animation tab | ✅ Done | AnimationControlsField |
| Responsive tab (visibility + spacing) | ✅ Done | Per-device hide/show, padding, margin |
| Advanced tab (ID, classes, z-index) | ✅ Done | Custom CSS class + ID fields |
| Widget tree editor (widget sections) | ✅ Done | WidgetTreeEditor.jsx (590 LOC) |
| Field validation messages | ❌ Missing | No validation errors shown in form |
| Live canvas highlight on field focus | ❌ Missing | Editing in drawer, not on canvas |

### 2.3 Widget Builder (WidgetTreeEditor.jsx)

| Feature | Status | Notes |
|---------|--------|-------|
| Widget list with drag-drop reorder | ✅ Done | Native HTML5 DnD within widget tree |
| Add widget from picker | ✅ Done | Modal with icon previews |
| Duplicate widget | ✅ Done | Keyboard Cmd+D |
| Delete widget | ✅ Done | Keyboard Cmd+Backspace |
| Navigate with keyboard (↑↓) | ✅ Done | Arrow key navigation |
| Widget 5-tab editor | ✅ Done | Content/Style/Animation/Responsive/Advanced |
| Widget responsive (hide/show per device) | ✅ Done | ResponsiveField integration |
| Widget animation controls | ✅ Done | AnimationControlsField per widget |
| Nested containers / columns | ❌ Missing | Flat list only, no nesting |
| Drag widget from sidebar to canvas | ❌ Missing | Picker only, no drag-from-panel |
| Widget-level copy/paste styles | ❌ Missing |  |
| Hover/active state controls | ❌ Missing |  |
| Inline editing on canvas | ❌ Missing | All editing in side panel |

### 2.4 Media Library

| Feature | Status | Notes |
|---------|--------|-------|
| Media upload UI | ✅ Done | AdminMedia page exists |
| Media browse grid | ⚠️ Partial | Exists but feature depth unknown |
| Image picker in fields | ✅ Done | ImagePickerField.jsx |
| Media from CMS section fields | ✅ Done | Resolves via `resolveCmsAssetUrl()` |
| Image optimization (WebP conversion) | ❌ Missing | PNG files 5-8MB unoptimized |
| Media folders / organization | ❌ Missing |  |
| Drag-drop upload | ❌ Unknown | Not confirmed |
| Alt text editing | ❌ Unknown |  |
| CDN integration | ❌ Missing |  |

### 2.5 Menus

| Feature | Status | Notes |
|---------|--------|-------|
| Create / edit / delete menus | ✅ Done | Full CRUD in MenuBuilder.jsx |
| Drag-drop menu item reorder | ✅ Done | Native HTML5 drag (brittle, no touch) |
| Nested menu items | ✅ Done | Parent-child structure supported |
| External link support | ✅ Done | isExternal flag on menu items |
| Assign menu to location (main, footer) | ⚠️ Partial | Menu name implies location; not explicit location slots |
| Mega menu / dropdown builder | ❌ Missing |  |
| Touch-friendly drag-drop | ❌ Missing | Native drag has no touch support |

### 2.6 Theme Settings

| Feature | Status | Notes |
|---------|--------|-------|
| Global style presets | ✅ Done | BUILTIN_STYLE_PRESETS + API |
| Theme settings admin | ✅ Done | AdminTheme page exists |
| CSS variable generation | ✅ Done | GlobalStyleEngine.js |
| Custom global CSS | ⚠️ Unknown | Not confirmed in audit |
| Color palette editor | ⚠️ Unknown | ColorPickerField exists, palette management unclear |
| Typography scale editor | ❌ Missing | Font size/family not globally configurable |
| Brand color tokens | ⚠️ Partial | Hardcoded `#043920`, `#fcfaf7` throughout |

### 2.7 Header / Footer Builder

| Feature | Status | Notes |
|---------|--------|-------|
| Header settings (logo, colors, blur) | ✅ Done | AdminHeader page, HeaderSettings model |
| Sticky header toggle | ✅ Done | settings.sticky |
| Hide on home top | ✅ Done | settings.hideOnHomeTop |
| Header nav links from menu | ✅ Done | Menu 'main' drives navLinks |
| CTA button in header | ✅ Done | ctaButton config |
| Footer builder | ⚠️ Partial | AdminFooter exists; footer rendering may be hardcoded |
| Visual header/footer preview | ❌ Missing | Settings are form-only, no live preview |

### 2.8 Blog Editor

| Feature | Status | Notes |
|---------|--------|-------|
| Create / edit / delete blog posts | ✅ Done | AdminBlogEditor.jsx |
| Rich text editor | ✅ Done | RichTextField.jsx |
| Blog categories | ✅ Done | AdminCategories.jsx |
| Blog list admin | ✅ Done | AdminBlogs.jsx |
| Blog cover image | ✅ Done | ImagePickerField in form |
| Blog SEO fields | ⚠️ Unknown | Not confirmed in audit |
| Scheduled publishing | ❌ Missing | No publishAt date |
| Blog revision history | ❌ Missing | PageRevision for sections only |
| Blog preview before publish | ❌ Missing |  |

### 2.9 Product / Category / Order Management

| Feature | Status | Notes |
|---------|--------|-------|
| Product list / edit | ✅ Done | AdminProducts.jsx |
| Category management | ✅ Done | AdminCategories.jsx |
| Order list with status | ✅ Done | AdminOrders.jsx |
| Order status management | ✅ Done | Status badges + update |
| Product images | ✅ Done | via Media |
| Inventory / stock tracking | ⚠️ Partial | Low stock alerts in dashboard |
| Product variants (size/color) | ❌ Missing |  |
| Bulk product operations | ❌ Missing |  |
| Order fulfillment / shipping tracking | ❌ Missing |  |
| Coupon / promo code management | ✅ Done | AdminCoupons.jsx |

### 2.10 SEO Editor

| Feature | Status | Notes |
|---------|--------|-------|
| Per-page SEO fields | ✅ Done | metaTitle, metaDescription, ogImage, canonicalUrl, noIndex |
| Character count hints | ✅ Done | In PageBuilder2 SEO modal |
| Hard validation (60/160 char limits) | ❌ Missing | Hints exist, not enforced |
| Google SERP preview | ❌ Missing |  |
| Structured data editor | ❌ Missing |  |
| Sitemap generation | ❌ Missing |  |
| Bulk SEO operations | ❌ Missing |  |

### 2.11 Revision History

| Feature | Status | Notes |
|---------|--------|-------|
| Fire-and-forget section snapshots | ✅ Done | PageRevision model, triggers on every save |
| localStorage version snapshots (10) | ✅ Done | PageBuilder2 auto-saves on client |
| Revision restore UI | ❌ Missing | Snapshots exist but no UI to view/restore |
| Diff viewer (before vs after) | ❌ Missing |  |
| Named checkpoints | ❌ Missing |  |

### 2.12 Live Preview

| Feature | Status | Notes |
|---------|--------|-------|
| Preview pane in PageBuilder2 | ✅ Done | Splits into 3-col with preview panel |
| Device switcher (desktop/tablet/mobile) | ✅ Done | Viewport scaling via CSS |
| Zoom controls (50-200%) | ✅ Done |  |
| Preview synced to draft sections | ✅ Done | draftSections → PreviewRenderer |
| Inline click-to-edit on canvas | ❌ Missing | Preview is read-only |
| Full-page preview (new tab) | ❌ Missing |  |
| Visual builder canvas | ❌ Missing | The core gap — no Elementor-like editing |

---

## 3. Elementor-like Builder — Gap Analysis

| Feature | Status | Notes |
|---------|--------|-------|
| Left sidebar widget panel | ❌ Missing | No widget panel beside canvas |
| Section/container structure | ⚠️ Partial | Section → WidgetTree exists, no Column layer |
| Drag widgets from sidebar to canvas | ❌ Missing | Widgets added via modal only |
| Drag sections from sidebar to page | ❌ Missing |  |
| Drag-drop reorder sections | ✅ Done | In PageBuilder2 list view only |
| Drag-drop reorder widgets | ✅ Done | In WidgetTreeEditor drawer only |
| Nested containers | ❌ Missing | Flat widget tree only |
| Column system | ❌ Missing | CSS grid columns exist in settings, no visual column blocks |
| Spacing controls (visual) | ⚠️ Partial | JSON fields exist, no visual margin/padding sliders |
| Typography controls (visual) | ⚠️ Partial | Field exists, no live type preview |
| Color controls (visual picker) | ✅ Done | ColorPickerField.jsx |
| Responsive controls per element | ✅ Done | ResponsiveField per section/widget |
| Animation controls | ✅ Done | AnimationControlsField per section/widget |
| Hover / active states | ❌ Missing |  |
| Live canvas (clicking selects element) | ❌ Missing |  |
| Selected element outline / handles | ❌ Missing |  |
| Floating quick toolbar on selection | ❌ Missing |  |
| Navigator tree | ❌ Missing |  |
| Breadcrumb (Page → Section → Widget) | ❌ Missing |  |
| Copy / paste styles | ❌ Missing |  |
| Duplicate element on canvas | ⚠️ Partial | Keyboard Cmd+D in widget editor |
| Delete on canvas | ⚠️ Partial | Keyboard only |
| Undo / Redo | ✅ Done | 50-item history, keyboard shortcuts |
| Autosave | ✅ Done | 10s localStorage, needs server autosave |
| Revision history | ⚠️ Partial | Stored, no restore UI |
| Top bar (responsive switcher, save) | ⚠️ Partial | Preview switcher exists, not canvas-integrated |
| Zoom controls | ✅ Done | 50-200% zoom in preview pane |
| Inline text editing on canvas | ❌ Missing |  |

---

## 4. Developer Experience Audit

### 4.1 Architecture

| Component | Status | Quality | Notes |
|-----------|--------|---------|-------|
| SectionRegistry.js | ✅ Complete | Good | 40+ sections, clean API |
| WidgetRegistry.jsx | ✅ Complete | Good | 14 widgets, WidgetShell wrapper |
| FieldRenderer.jsx | ✅ Complete | Good | 15 field types, clean dispatch |
| PageRenderer.jsx | ✅ Complete | Good | Template-aware, responsive |
| AnimationEngine.js | ✅ Complete | Good | FM + GSAP unified presets |
| ResponsiveEngine.js | ✅ Complete | Good | CSS variable injection |
| GlobalStyleEngine.js | ✅ Complete | Good | Preset resolution |
| TemplateEngine.js | ✅ Complete | Good | Constraint enforcement |
| useCmsPageState.js | ✅ Complete | Good | Clean API, undo/redo |
| shared/cms/ | ✅ Complete | Good | Centralized definitions |

### 4.2 Adding a New Section (Ease: Medium)

1. Add definition to `shared/cms/sections.js`
2. Add component to `src/sections/`
3. Register in `SectionRenderer.jsx` SECTION_COMPONENTS map
4. Add fields to `SectionRegistry.js` in CMS

**Problem:** Steps are spread across 4 files with no generator. Easy to miss one.

### 4.3 Adding a New Widget (Ease: Medium)

1. Add definition to `shared/cms/widgets.js`
2. Add renderer function to `WidgetRegistry.jsx`
3. Add to WIDGET_REGISTRY map

**Problem:** Definition and renderer in different files. Renderer could get out of sync with definition.

### 4.4 Gaps in DX

| Issue | Impact |
|-------|--------|
| No CLI generator for section/widget | Medium — manual multi-file edits |
| No JSDoc / TypeScript types | Medium — IDE no autocomplete |
| No schema validation at save time | High — malformed data silently saved |
| No widget allowlist enforcement in UI | Medium — wrong widgets can be added to sections |
| Dual V1/V2 architecture | High — onboarding confusion |
| No documentation files | High — no README for CMS architecture |
| No Storybook or component demos | Low — can't preview fields/widgets in isolation |

---

## 5. User Experience Audit

### 5.1 Admin Layout

| Feature | Status | Notes |
|---------|--------|-------|
| Clear navigation hierarchy | ✅ Done | 3 groups, 16 items |
| Quick access from dashboard | ✅ Done | Navigation cards in AdminOverview |
| Responsive admin UI | ⚠️ Partial | No mobile admin layout verified |
| Dark mode | ❌ Missing |  |
| Breadcrumb navigation | ❌ Missing |  |
| Search across admin | ❌ Missing |  |

### 5.2 Editing Flow

| Feature | Status | Notes |
|---------|--------|-------|
| Select page → edit sections | ✅ Done | Sidebar-based workflow |
| Section type visible at a glance | ✅ Done | Icons + type label on cards |
| Save feedback (success/error toast) | ⚠️ Partial | Some routes have toast, not all |
| Unsaved changes warning | ✅ Done | Dirty state dialog |
| Preview while editing | ✅ Done | Split pane preview |
| Clear empty state for new pages | ⚠️ Partial | No illustrated empty state |

### 5.3 Loading / Error / Empty States

| Feature | Status | Notes |
|---------|--------|-------|
| Page load skeleton | ⚠️ Partial | ProductDetail has skeleton, others unclear |
| Section save loading indicator | ⚠️ Partial | Saving state tracked, spinner unclear |
| API error messages | ⚠️ Partial | Generic messages, not specific |
| Empty section list state | ⚠️ Partial | Unclear if illustrated |
| Global error boundary | ❌ Missing | Unhandled render error crashes app |

### 5.4 Non-Developer Usability

- **Current level:** Developer-friendly form editor. A non-developer could edit text/images but would struggle with JSON fields, animation configs, and responsive settings.
- **Gap to WordPress:** WordPress WYSIWYG (Gutenberg/Elementor) — direct canvas interaction. Somacan is sidebar-only editing with no canvas feedback.
- **Gap to Elementor:** Visual drag-and-drop, inline editing, visual spacing handles, visual color/typography controls.

---

## 6. Security Audit Summary

| Issue | Severity | Status |
|-------|----------|--------|
| Admin API key in localStorage | High | ❌ Unfixed |
| No CSRF protection on mutations | High | ❌ Unfixed |
| RichTextField dangerouslySetInnerHTML XSS | High | ❌ Unfixed |
| No rate limiting on API routes | Medium | ❌ Unfixed |
| No input sanitization on admin endpoints | Medium | ❌ Unfixed |
| CORS not restricted to known origins | Medium | ⚠️ Unknown |

---

## 7. What Is Done / Partial / Missing — Summary

### ✅ Done (Solid)
- V2 CMS architecture (engine stack)
- Widget registry + renderer
- Section registry + renderer
- Template engine with constraints
- Responsive engine (CSS variables)
- Animation engine (FM + GSAP)
- Global style engine + presets
- PageBuilder2 (list/edit/preview/drag-drop/undo-redo/autosave)
- CMS page context (draft/saved, undo/redo)
- Header settings (CMS-driven)
- Menu builder (CRUD + nesting)
- Blog editor
- Product/order/category management
- Cart + checkout (with server-side quote)
- Mobile menu (premium animation)
- Responsive public pages (all major sections)
- SEO meta injection (DynamicPage)
- PageRevision model (fire-and-forget)

### ⚠️ Partial
- Live preview (read-only, not interactive)
- Footer builder (admin exists, rendering unclear)
- Revision history (stored, no restore UI)
- Media library (basic, no optimization/folders)
- SEO validation (hints, not enforced)
- Error states / loading states
- Admin mobile usability
- Blog SEO fields
- Multi-level menu rendering

### ❌ Missing (Critical Gaps)
- **Visual builder canvas** (Elementor-like experience)
- **Nested containers / column system**
- **Inline editing on canvas**
- **Widget drag from sidebar to canvas**
- **Revision history restore UI**
- **Section / widget template library**
- **Error boundaries** (renders crash entire pages)
- **Server-side autosave** (only localStorage)
- **Structured data / JSON-LD**
- **Sitemap.xml + robots.txt**
- **CSRF / XSS security fixes**
- **API key secure storage**
- **Payment gateway** (beyond COD/bank transfer)
- **Product variants**
- **Scheduled publishing**
- **RBAC / role-based access**
- **Global search in admin**
- **Image optimization pipeline**
- **TypeScript types / JSDoc**
- **CMS developer documentation**

---

## 8. Prioritized Roadmap

### PHASE 0 — Critical Fixes (Before anything else)
| Task | Difficulty | Priority |
|------|-----------|----------|
| Add error boundaries to SectionRenderer, WidgetRenderer, edit drawer | Easy | 🔴 P0 |
| Fix PageBuilder2 DnD bug (filteredSections vs sections) | Easy | 🔴 P0 |
| Add localStorage quota error handling | Easy | 🔴 P0 |
| Fix history flush on save | Easy | 🔴 P0 |
| Add CSRF middleware to all mutating routes | Medium | 🔴 P0 |
| Sanitize RichTextField output (DOMPurify) | Easy | 🔴 P0 |

### PHASE 1 — Visual Builder (Elementor Evolution)
| Task | Difficulty | Priority |
|------|-----------|----------|
| New route `/admin/visual-builder/:pageId` | Medium | 🟠 P1 |
| Builder shell: 3-panel layout (sidebar/canvas/controls) | Medium | 🟠 P1 |
| Canvas with section hover/select outlines | Hard | 🟠 P1 |
| Left panel: Widgets tab + Sections tab | Medium | 🟠 P1 |
| Drag widgets from sidebar to canvas (@dnd-kit) | Hard | 🟠 P1 |
| Drag sections from sidebar to page | Hard | 🟠 P1 |
| Floating quick toolbar on selected element | Medium | 🟠 P1 |
| Top bar: device switcher + undo/redo + save | Medium | 🟠 P1 |
| Navigator tree panel | Medium | 🟠 P1 |
| Breadcrumb (Page → Section → Widget) | Easy | 🟠 P1 |

### PHASE 2 — Container System
| Task | Difficulty | Priority |
|------|-----------|----------|
| Container/column layer (Page → Section → Container → Widget) | Hard | 🟠 P1 |
| Visual column controls (add/remove columns) | Hard | 🟠 P1 |
| Container flex/grid settings (gap, alignment, direction) | Medium | 🟠 P1 |
| Nested container rendering in PageRenderer | Hard | 🟠 P1 |

### PHASE 3 — Controls System
| Task | Difficulty | Priority |
|------|-----------|----------|
| Visual spacing controls (margin/padding sliders) | Medium | 🟡 P2 |
| Visual typography controls (font, size, weight, line-height) | Medium | 🟡 P2 |
| Hover/active state controls | Hard | 🟡 P2 |
| Animation replay button in editor | Easy | 🟡 P2 |
| Inline text editing on canvas | Hard | 🟡 P2 |
| Copy/paste styles across elements | Medium | 🟡 P2 |

### PHASE 4 — Content Safety
| Task | Difficulty | Priority |
|------|-----------|----------|
| Revision history restore UI | Medium | 🟡 P2 |
| Server-side autosave (debounced 30s) | Medium | 🟡 P2 |
| Section / widget template library (save/load) | Medium | 🟡 P2 |
| Conflict detection (optimistic locking) | Hard | 🟡 P2 |

### PHASE 5 — SEO & Performance
| Task | Difficulty | Priority |
|------|-----------|----------|
| Google SERP preview in SEO editor | Medium | 🟡 P2 |
| Structured data / JSON-LD per page | Medium | 🟡 P2 |
| Sitemap.xml auto-generation | Easy | 🟡 P2 |
| robots.txt | Easy | 🟡 P2 |
| Image optimization (WebP conversion) | Medium | 🟡 P2 |
| Lazy loading for all CMS images | Easy | 🟡 P2 |

### PHASE 6 — DX & Documentation
| Task | Difficulty | Priority |
|------|-----------|----------|
| Developer documentation (CMS_ARCHITECTURE.md) | Easy | 🟢 P3 |
| Widget creation guide | Easy | 🟢 P3 |
| Section creation guide | Easy | 🟢 P3 |
| CLI/generator for new section/widget | Hard | 🟢 P3 |
| TypeScript types for CMS schema | Medium | 🟢 P3 |
| JSON schema validation at API layer | Medium | 🟢 P3 |

### PHASE 7 — Commerce & Advanced
| Task | Difficulty | Priority |
|------|-----------|----------|
| Payment gateway integration (Stripe) | Hard | 🟢 P3 |
| Product variants (size/color) | Medium | 🟢 P3 |
| Scheduled publishing | Medium | 🟢 P3 |
| RBAC (role-based access control) | Hard | 🟢 P3 |
| Real-time collaboration (WebSocket) | Hard | 🟢 P3 |
| Global admin search | Medium | 🟢 P3 |

---

## 9. Implementation Estimate

| Phase | Scope | Effort |
|-------|-------|--------|
| Phase 0 — Critical fixes | 6 bugs/security issues | 1–2 days |
| Phase 1 — Visual builder shell | New builder route + canvas + panels | 5–7 days |
| Phase 2 — Container system | Column layer + nested rendering | 4–6 days |
| Phase 3 — Controls system | Spacing/typography/hover controls | 3–5 days |
| Phase 4 — Content safety | Revisions UI + server autosave + templates | 3–4 days |
| Phase 5 — SEO & performance | SERP preview + sitemap + image optimization | 2–3 days |
| Phase 6 — DX & docs | Docs + TypeScript + validation | 3–4 days |
| Phase 7 — Commerce | Stripe + variants + RBAC | 7–10 days |

**Total to Elementor-equivalent:** Phase 0–3 = ~2–3 weeks  
**Total production-ready commerce:** All phases = ~5–6 weeks

---

## 10. Files Reference

| File | Lines | Status | Role |
|------|-------|--------|------|
| `src/cms/SectionRegistry.js` | 1031 | ✅ Complete | 40+ section definitions |
| `src/cms/AnimationEngine.js` | 297 | ✅ Complete | FM + GSAP presets |
| `src/cms/FieldRenderer.jsx` | 177 | ✅ Complete | 15 field type dispatch |
| `src/cms/SectionFormRenderer.jsx` | 210 | ✅ Complete | 5-tab section editor |
| `src/cms/WidgetTreeEditor.jsx` | 590 | ✅ Complete | Widget list editor |
| `src/cms/v2/CmsPageContext.jsx` | 195 | ✅ Complete | Draft/saved/undo state |
| `src/cms/v2/useCmsPageState.js` | ~150 | ✅ Complete | Section state operations |
| `src/cms/v2/PageRenderer.jsx` | 125 | ✅ Complete | Public page renderer |
| `src/cms/v2/WidgetRegistry.jsx` | 461 | ✅ Complete | 14 widget renderers |
| `src/cms/v2/WidgetRenderer.jsx` | 46 | ✅ Complete | Widget dispatch |
| `src/cms/v2/TemplateEngine.js` | ~80 | ✅ Complete | Template constraints |
| `src/cms/v2/GlobalStyleEngine.js` | ~80 | ✅ Complete | Style preset resolution |
| `src/cms/v2/ResponsiveEngine.js` | ~100 | ✅ Complete | Breakpoint + CSS vars |
| `src/components/admin/PageBuilder2.jsx` | ~1200 | ✅ Complete | Main builder UI |
| `src/components/admin/AdminLayout.jsx` | ~200 | ✅ Complete | Admin shell + nav |
| `src/components/admin/MenuBuilder.jsx` | ~300 | ✅ Complete | Menu CRUD + drag |
| `src/components/cms/SectionRenderer.jsx` | ~120 | ⚠️ V1+V2 | Section dispatcher |
| `src/components/cms/WidgetSectionRenderer.jsx` | 79 | ✅ Complete | Widget grid renderer |
| `src/hooks/useHeaderSettings.js` | 75 | ✅ Complete | Header CMS data |
| `src/App.jsx` | ~150 | ✅ Complete | Route definitions |
| `backend/models/Page.js` | 69 | ✅ Complete | Page model |
| `backend/models/PageRevision.js` | 39 | ✅ Complete | Revision log |
| `backend/models/PageSection.js` | 82 | ✅ Complete | Section model |
| `backend/routes/pages.js` | ~200 | ✅ Complete | Page CRUD routes |
| `backend/routes/page-sections.js` | ~250 | ✅ Complete | Section CRUD routes |
| `shared/cms/sections.js` | ~300 | ✅ Complete | Section type definitions |
| `shared/cms/widgets.js` | ~400 | ✅ Complete | Widget type definitions |

---

*End of audit. See VISUAL_BUILDER_PLAN.md for the implementation roadmap.*
