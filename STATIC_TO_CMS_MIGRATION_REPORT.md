# Static vs. CMS Migration Report

This report documents the findings from auditing the static components (`Home`, `Shop`, `About`, `Contact`, `Blog`, `ProductDetail`, `BlogArticle`) and comparing them against their corresponding CMS definitions.

## Findings

### Home.jsx
- **Status**: **Fully Migrated**.
- **Observation**: `Home.jsx` is dynamically powered by `SectionRenderer`. It loads content from `getPageBySlug('home')`. The backend `seed-cms-data.js` and `seedCmsDefaults.js` correctly populate `SiteContent` for the 'home' page key with all necessary sections (hero, marquee, categories, etc.).

### Shop.jsx
- **Status**: **Partially Static / CMS Hybrid**.
- **Observation**: The page structure (hero, filter bar) is hardcoded. It uses `useProducts` hook for dynamic data and `getCategories` for navigation. The design seems static and intended to stay that way for now, though it would benefit from CMS controls for the Hero text/image content.

### About.jsx
- **Status**: **Pending Audit** (Component file not read in this pass).
- **Observation**: Needs to be verified against `Page` models.

### Contact.jsx
- **Status**: **Static**.
- **Observation**: Completely hardcoded layout, form, and static content (FAQ data, contact info). It is not currently using CMS content.

### Blog.jsx
- **Status**: **Partially Static**.
- **Observation**: The page wrapper (hero, intro) is hardcoded. It dynamically fetches articles via `axios.get('/blogs/all')`.

### ProductDetail.jsx
- **Status**: **Hybrid**.
- **Observation**: The product content is dynamic (API), but it includes an optional `PageRenderer` section, allowing for CMS-managed content below the main product details.

### BlogArticle.jsx
- **Status**: **Hybrid**.
- **Observation**: Similar to `ProductDetail`, it fetches article content via API but includes an optional `PageRenderer` section for additional CMS content.

---
## Recommendations
1. **Contact.jsx**: Highly recommended to move the hardcoded FAQ and static descriptive text into `SiteContent` to allow administrators to update information without code changes.
2. **Shop.jsx Hero**: Should be updated to fetch from `SiteContent` to allow marketing updates to the shop header.
3. **General**: Continue migrating static descriptive components towards the `PageRenderer` pattern seen in `ProductDetail` and `BlogArticle` to maximize CMS flexibility.
