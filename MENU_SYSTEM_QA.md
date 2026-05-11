# Menu System QA Documentation

## Overview

This document details the CMS menu system architecture, gaps discovered, and fixes applied to sync admin menu management with frontend navigation display.

## Two Menu Systems Found

### System A: Legacy JSON Blob (Menus table)
- **Location:** `Menus` table with `items` JSON column
- **Schema:** `{ id, name, items (JSON array), isActive }`
- **Current Data:** Main menu has hardcoded items: 
  ```json
  [
    {"to":"/","label":"Accueil"},
    {"to":"/shop","label":"Boutique"},
    {"to":"/about","label":"Notre Histoire"},
    {"to":"/blog","label":"Journal"},
    {"to":"/contact","label":"Contact"}
  ]
  ```
- **Admin Interface:** `MenuBuilder.jsx` (old, unused)
- **Frontend Usage:** Never used (Navbar doesn't call `/api/menus/:name`)

### System B: Relational MenuItem Table (New)
- **Location:** `MenuItems` table with foreign key to `Menus`
- **Schema:**
  ```
  MenuItems {
    id (PK)
    menuId (FK to Menus)
    parentId (FK for hierarchical nesting)
    label
    url
    type (ENUM: 'internal', 'external', 'page')
    target (e.g., '_self', '_blank')
    order (sort order)
    isActive
  }
  ```
- **Admin Interface:** `AdminMenus.jsx` (current, writes here)
- **Frontend Usage:** Not connected until this fix
- **Initial State:** EMPTY — no items were saved

## Critical Gap Identified

**The Problem:** Admin menu changes were being stored in `MenuItem` table but frontend Navbar was reading from `HeaderSettings.navLinks` JSON blob, making the admin UI effectively non-functional.

```
AdminMenus.jsx
    ↓ writes to
MenuItem table
    ↓
/api/menus/:name
    ↓
useHeaderSettings hook
    ↓
Navbar

BUT Navbar actually reads from:
HeaderSettings.navLinks (old fallback)
    ↓
useHeaderSettings hook returns this first
    ↓
Navbar ignores MenuItem data
```

## Fixes Applied

### Fix 1: Backend Route Enhancement (`backend/routes/menus.js`)

**Change:** Updated `GET /api/menus/:name` to prefer relational MenuItem system

**Implementation:**
- Added `MenuItem` model import
- Implemented `buildTree()` helper to convert flat MenuItem rows into nested structure
- Modified route to:
  1. Fetch Menu by name
  2. Query all MenuItem rows for that menu (ordered by `order` ASC)
  3. Build nested tree structure (handles parent/child relationships)
  4. Return `{ ...menu, items: nestedTree }`
  5. Fallback to old JSON blob if no MenuItem rows exist

**Tree Structure Output:**
```json
{
  "id": 1,
  "name": "main",
  "items": [
    {
      "id": 1,
      "label": "Accueil",
      "url": "/",
      "type": "internal",
      "target": "_self"
    },
    {
      "id": 2,
      "label": "Boutique",
      "url": "/shop",
      "type": "internal",
      "target": "_self"
    }
  ]
}
```

**Status:** ✅ Tested and working

### Fix 2: Database Seeding

**Action:** Populated MenuItems table with initial 5 nav items from the main menu

**Data Inserted:**
```sql
INSERT INTO MenuItems (menuId, parentId, label, url, type, target, `order`, isActive)
VALUES
(1, NULL, 'Accueil', '/', 'internal', '_self', 0, 1),
(1, NULL, 'Boutique', '/shop', 'internal', '_self', 1, 1),
(1, NULL, 'Notre Histoire', '/about', 'internal', '_self', 2, 1),
(1, NULL, 'Journal', '/blog', 'internal', '_self', 3, 1),
(1, NULL, 'Contact', '/contact', 'internal', '_self', 4, 1);
```

**Status:** ✅ Seeded

### Fix 3: Frontend Hook Update (`frontend/src/hooks/useHeaderSettings.js`)

**Change:** Modified `useHeaderSettings` to fetch and prefer CMS menu data

**Implementation:**
- Added `getMenu` to API imports
- Created `menuItemsToNavLinks()` converter function
- Modified useEffect to fetch both header settings and menu in parallel
- Priority order:
  1. **CMS menu items** (highest priority) — if menu has items, use them
  2. **Header settings navLinks** — fallback if menu is empty
  3. **Hard-coded defaults** — final fallback

**Data Flow:**
```
Promise.all([
  getHeaderSettings(),
  getMenu('main')
])
  → menuData.items exists?
    → YES: use menuItemsToNavLinks(menuData.items)
    → NO: use headerData.navLinks || DEFAULTS
```

**Status:** ✅ Implemented

### Fix 4: Navbar Active State (`frontend/src/components/Navbar.jsx`)

**Change:** Added route-aware active link highlighting

**Implementation:**
- Added active state detection for each nav item:
  - Root path (`/`) only matches exactly
  - Other paths match on prefix (e.g., `/about*` highlights for `/about*`)
- Desktop nav: Show full underline when active, partial on hover when inactive
- Mobile nav: Bold text + active color when current route matches

**Active State Logic:**
```javascript
const isActive = item.href === '/'
  ? location.pathname === '/'
  : location.pathname.startsWith(item.href);
```

**Visual Changes:**
- Desktop: `w-full` underline when active, `w-0 group-hover:w-full` when inactive
- Mobile: Bold + active color when active, normal + text color when inactive

**Status:** ✅ Implemented

## Data Flow After Fixes

```
1. Admin edits menus in AdminMenus.jsx
                    ↓
2. Save via updateMenuItem() API
                    ↓
3. MenuItems table updated (in database)
                    ↓
4. User visits site
                    ↓
5. Navbar → useHeaderSettings hook
                    ↓
6. Hook fetches getMenu('main')
                    ↓
7. Backend GET /api/menus/main
   - Queries MenuItems (relational)
   - Builds nested tree
   - Returns items array
                    ↓
8. Hook converts items to navLinks format
                    ↓
9. Navbar renders with active state detection
                    ↓
10. Admin menu changes appear on frontend
```

## Testing Checklist

- [x] MenuItems seeded with 5 nav items
- [x] GET /api/menus/main returns MenuItem data
- [x] useHeaderSettings fetches menu data
- [x] Navbar renders menu from CMS
- [x] Active link detection works on desktop
- [x] Active link detection works on mobile
- [ ] AdminMenus.jsx can create new items
- [ ] AdminMenus.jsx can reorder items
- [ ] AdminMenus.jsx can create nested items (children)
- [ ] AdminMenus.jsx can delete items

## Remaining Risks

### Risk 1: Children/Nested Items
The relational system supports `parentId` nesting, and the tree builder handles it, but:
- **Not tested:** AdminMenus.jsx may not have UI for creating child menu items
- **Recommendation:** Verify AdminMenus.jsx supports parent/child UI before creating nested items

### Risk 2: Backward Compatibility
System A (JSON blob) is still in place and used as fallback:
- **Current:** Both systems can coexist (MenuItem takes precedence)
- **Future:** Consider deprecating Menus.items column once all menus migrate to MenuItem
- **Action:** Keep fallback for safety; can remove after 1-2 releases

### Risk 3: The Old MenuBuilder.jsx
MenuBuilder.jsx still writes to Menu.items JSON blob. If someone uses it:
- **Impact:** Writes won't appear on frontend (Navbar reads from MenuItem)
- **Recommendation:** Archive or remove MenuBuilder.jsx to avoid confusion
- **Location:** `frontend/src/components/admin/MenuBuilder.jsx`

### Risk 4: Missing Type Conversion
MenuItem has `type: ENUM('internal', 'external', 'page')` but:
- **Gap:** The 'page' type isn't used in Navbar
- **Recommendation:** Clarify what 'page' type means; may need special handling

## Deployment Considerations

1. **DB Migration:** Seed MenuItems before deploying frontend changes
2. **Fallback:** The old JSON blob system stays active during transition
3. **Testing:** Verify AdminMenus.jsx can manage items after deployment
4. **Monitoring:** Check that menu API calls include items in response

## Files Modified

- `backend/routes/menus.js` — Added MenuItem querying and tree builder
- `frontend/src/hooks/useHeaderSettings.js` — Added menu fetching
- `frontend/src/components/Navbar.jsx` — Added active state detection
- `somacan_refactor.MenuItems` table — Seeded initial 5 items

## Files Not Yet Updated

- `frontend/src/components/admin/AdminMenus.jsx` — May need verification
- `frontend/src/components/admin/MenuBuilder.jsx` — Legacy, consider archiving
