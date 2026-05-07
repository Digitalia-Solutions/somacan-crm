# Somacan CMS Architecture

Mini WordPress/Elementor-like CMS built on top of the existing Express/Sequelize/React stack.

---

## Overview

The system is a **headless CMS** where:
- The **backend** stores pages and their sections as structured JSON in MySQL
- The **admin frontend** provides a drag-and-drop-style Page Builder to edit sections
- The **public frontend** fetches sections via API and renders them using a `SectionRenderer`

---

## Folder Structure

```
backend/
├── models/
│   ├── Page.js              # Page entity (slug, title, SEO fields, isPublished)
│   ├── PageSection.js       # NEW — section entity per page
│   ├── SiteContent.js       # Legacy — kept for backward compat
│   └── index.js             # Associations
├── routes/
│   ├── page-sections.js     # NEW — full CRUD for PageSection
│   ├── pages.js             # Updated — fallback to PageSection first
│   └── admin.js             # Updated — pages list/create/update

frontend/src/
├── cms/                     # NEW — CMS engine
│   ├── SectionRegistry.js   # Single source of truth for all section types
│   ├── SectionFormRenderer.jsx  # Renders the form for any section type
│   ├── FieldRenderer.jsx    # Dispatches field type → field component
│   └── fields/              # All field components
│       ├── TextField.jsx
│       ├── TextareaField.jsx
│       ├── RichTextField.jsx       # HTML / CKEditor
│       ├── ColorPickerField.jsx    # Color swatch + hex input
│       ├── ImagePickerField.jsx    # URL + file upload
│       ├── LinkField.jsx           # URL + text + target
│       ├── SelectField.jsx
│       ├── SwitchField.jsx
│       ├── RepeaterField.jsx       # Array of sub-items
│       ├── ProductSelectorField.jsx
│       ├── CategorySelectorField.jsx
│       ├── IconPickerField.jsx
│       ├── AnimationControlsField.jsx
│       └── ResponsiveField.jsx     # Desktop/Tablet/Mobile tabs
├── components/
│   ├── cms/
│   │   └── SectionRenderer.jsx     # Updated — handles both old + new format
│   └── admin/
│       ├── PageBuilder2.jsx        # NEW — full Page Builder UI
│       └── ... (existing)
├── sections/                # React components (unchanged, data comes from CMS now)
│   ├── Hero.jsx
│   ├── CategorySection.jsx
│   ├── ProductsShowcase.jsx
│   ├── FaqSection.jsx
│   ├── NewsletterSection.jsx
│   ├── FeaturesBar.jsx
│   ├── ExpertiseSection.jsx
│   ├── TestimonialsSection.jsx
│   ├── StatsSection.jsx
│   ├── OfferSection.jsx
│   ├── StorySection.jsx
│   └── BlogPreview.jsx
```

---

## Data Models

### Page
```sql
id            INT PK
title         VARCHAR
slug          VARCHAR UNIQUE
description   TEXT
template      ENUM(custom, home, shop, blog, contact)
isPublished   BOOLEAN
metaTitle     VARCHAR       -- SEO
metaDescription TEXT        -- SEO
ogImage       VARCHAR       -- SEO
canonicalUrl  VARCHAR       -- SEO
createdAt, updatedAt
```

### PageSection
```sql
id            INT PK
pageId        INT FK → Pages.id (CASCADE DELETE)
pageSlug      VARCHAR       -- denormalized for fast lookup
type          VARCHAR       -- matches SectionRegistry key (e.g. 'Hero', 'FaqSection')
name          VARCHAR       -- human label (e.g. "Hero Principal")
order         INT           -- display order, 0-based
isActive      BOOLEAN       -- hide/show without deleting
content       JSON          -- section-specific props (matches component props)
settings      JSON          -- visual settings (backgroundColor, minHeight, etc.)
animation     JSON          -- { type, duration, delay, easing, stagger, triggerOnScroll }
responsive    JSON          -- { desktop, tablet, mobile } → { padding, visible }
seo           JSON          -- { metaTitle, metaDesc, ogImage, schema }
createdAt, updatedAt
```

---

## API Endpoints

### Public
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/pages` | List published pages |
| GET | `/api/pages/:slug` | Get page + ordered active sections |
| GET | `/api/pages/:slug/sections` | Active sections only |

### Admin (requires admin JWT)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/pages/list` | All pages |
| POST | `/api/admin/pages/create` | Create page |
| PUT | `/api/admin/pages/:id` | Update page (title, slug, SEO, isPublished) |
| GET | `/api/admin/page-sections?pageSlug=home` | Sections for a page |
| POST | `/api/admin/page-sections` | Create section |
| PUT | `/api/admin/page-sections/:id` | Update section |
| DELETE | `/api/admin/page-sections/:id` | Delete section |
| POST | `/api/admin/page-sections/:id/duplicate` | Duplicate section |
| POST | `/api/admin/page-sections/reorder` | Bulk reorder `[{ id, order }]` |
| PATCH | `/api/admin/page-sections/:id/toggle` | Toggle isActive |

---

## SectionRegistry

The **single source of truth** for all section types. Located at `src/cms/SectionRegistry.js`.

Each entry declares:
```js
{
  type: 'Hero',           // Must match React component name in SectionRenderer
  label: 'Hero Principal', // Human label in admin
  icon: 'sparkles',       // Icon name for admin grid
  defaultContent: {},     // Prefilled when creating
  defaultSettings: {},    // Default visual settings
  defaultAnimation: {},   // Default animation config
  fields: [],             // Content fields (rendered in "Contenu" tab)
  settingsFields: [],     // Settings fields (rendered in "Apparence" tab)
}
```

### Registered Section Types
| Type | Label | Dark BG |
|------|-------|---------|
| Hero | Hero Principal | No |
| FeaturesBar | Bandeau défilant | Yes |
| CategorySection | Grille Catégories | No |
| ProductsShowcase | Vitrine Produits | No |
| StorySection | Section Histoire | No |
| ExpertiseSection | Notre Philosophie | Yes |
| StatsSection | Section Chiffres | No |
| OfferSection | Section Offre | No |
| TestimonialsSection | Témoignages | No |
| FaqSection | FAQ | No |
| NewsletterSection | Newsletter | Yes |
| BlogPreview | Aperçu Blog | No |

---

## Field Types

| Field Type | Component | Use Case |
|-----------|-----------|---------|
| `text` | TextField | Single line text, labels, titles |
| `textarea` | TextareaField | Multi-line plain text |
| `richtext` | RichTextField | HTML content, descriptions, FAQ answers |
| `color` | ColorPickerField | Any color property |
| `image` | ImagePickerField | Images — URL or file upload |
| `link` | LinkField | { url, text, target } |
| `select` | SelectField | Enum options |
| `switch` | SwitchField | Boolean toggle |
| `repeater` | RepeaterField | Arrays (FAQ items, stats, nav links…) |
| `product-selector` | ProductSelectorField | Product IDs from DB |
| `category-selector` | CategorySelectorField | Category IDs from DB |
| `icon` | IconPickerField | Lucide icon name |
| `animation` | AnimationControlsField | Animation settings object |
| `responsive` | ResponsiveField | Desktop/tablet/mobile overrides |

---

## SectionRenderer Flow

```
API: GET /api/pages/home
  → { ...page, sections: [PageSection, ...] }
  
Home.jsx
  → sections.map(s => <SectionRenderer section={s} />)

SectionRenderer.jsx
  → detect format (new: section.type exists; old: section.contentType exists)
  → new format:
      Component = SECTION_COMPONENTS[section.type]
      wrapperStyle = { backgroundColor: section.settings.backgroundColor, ... }
      props = section.content
      return <div style={wrapperStyle}><Component {...props} /></div>
  → old format: legacy logic (backward compat)
```

---

## Admin Page Builder Flow

```
PageBuilder2.jsx
  → loads pages via GET /api/admin/pages/list
  → user selects page
  → loads sections via GET /api/admin/page-sections?pageSlug=home
  → user clicks "Add Section"
    → modal shows all SECTION_REGISTRY types
    → user picks type
    → POST /api/admin/page-sections with defaultContent + defaultSettings
  → user clicks "Edit" on a section
    → right drawer opens
    → SectionFormRenderer renders fields from registry
    → user edits content/settings/animation
    → PUT /api/admin/page-sections/:id
  → user drags to reorder
    → POST /api/admin/page-sections/reorder
  → user toggles visibility
    → PATCH /api/admin/page-sections/:id/toggle
```

---

## Animation System

Each section has an `animation` JSON field:
```json
{
  "type": "fade-up",
  "duration": 1200,
  "delay": 0,
  "easing": "power3.out",
  "stagger": 100,
  "triggerOnScroll": true
}
```

- **Framer Motion**: used for component-level entrance animations
- **GSAP + ScrollTrigger**: used for advanced scroll effects (parallax, stagger rows)
- Sections retain their existing GSAP animations — the `animation` JSON is an additional layer for the CMS-controlled entrance effect

---

## Responsive System

Each section has a `responsive` JSON field:
```json
{
  "desktop": { "padding": "96px 160px", "visible": true },
  "tablet":  { "padding": "48px 48px",  "visible": true },
  "mobile":  { "padding": "24px 24px",  "visible": true }
}
```

SectionRenderer applies CSS classes based on visibility:
- `mobile.visible = false` → `hidden md:block`
- `tablet.visible = false` → `md:hidden lg:block`

---

## SEO System

Each Page supports:
- `metaTitle`, `metaDescription`, `ogImage`, `canonicalUrl`

Future implementation via React Helmet Async:
- Dynamic `<title>` and `<meta>` per page
- FAQ schema injected when `FaqSection` is present
- Product schema on product detail pages

---

## Migration Path

### Phase 1 (Done)
- ✅ PageSection model created
- ✅ Full admin CRUD API
- ✅ SectionRegistry with all 12 section types
- ✅ All 14 field components
- ✅ SectionFormRenderer (3-tab editor)
- ✅ PageBuilder2 admin component
- ✅ SectionRenderer backward-compatible update
- ✅ Public API fallback (PageSection → SiteContent)

### Phase 2 (Next)
- Add PageBuilder2 to admin router/nav
- Seed home page sections from existing hardcoded data
- Install CKEditor 5 and wire RichTextField
- Add React Helmet Async for SEO meta tags
- Add drag-and-drop reorder (react-beautiful-dnd or @dnd-kit)

### Phase 3 (Future)
- Extend to Shop, Product, Cart, Checkout pages
- Add ThemeSettings (global design tokens)
- Add GlobalSettings model
- Add Media library
- Add section preview panel
