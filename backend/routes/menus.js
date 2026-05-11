import express from 'express';
import Menu from '../models/Menu.js';
import MenuItem from '../models/MenuItem.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// ─── Helper: Build nested tree from MenuItem items ────────────────

function buildTree(items, parentId = null) {
  return items
    .filter(item => (item.parentId ?? null) === parentId)
    .sort((a, b) => a.order - b.order)
    .map(item => {
      const tree = {
        id: item.id,
        label: item.label,
        url: item.url,
        type: item.type,
        target: item.target,
      };
      const children = buildTree(items, item.id);
      if (children.length > 0) {
        tree.children = children;
      }
      return tree;
    });
}

// ─── Public routes ───────────────────────────────────────────

// GET /api/menus/:name — Get menu items by name (public)
router.get('/:name', async (req, res) => {
  try {
    const menu = await Menu.findOne({
      where: { name: req.params.name, isActive: true },
    });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Try MenuItem relational system first
    const menuItems = await MenuItem.findAll({
      where: { menuId: menu.id, isActive: true },
      order: [['order', 'ASC']],
    });

    if (menuItems.length > 0) {
      // Use relational MenuItem system
      const rawItems = menuItems.map(i => (i.toJSON ? i.toJSON() : i));
      const tree = buildTree(rawItems);
      return res.json({ ...menu.toJSON(), items: tree });
    }

    // Fallback: return the JSON blob items from Menu.items (old system)
    return res.json(menu);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ─── Admin routes ────────────────────────────────────────────

// GET /api/menus/admin/all — List all menus (admin)
router.get('/admin/all', requireAdmin, async (_req, res) => {
  try {
    const menus = await Menu.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.json(menus);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/menus/admin — Create menu (admin)
router.post('/admin', requireAdmin, async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    return res.status(201).json(menu);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// PUT /api/menus/admin/:id — Update menu (admin)
router.put('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    await menu.update(req.body);
    return res.json(menu);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /api/menus/admin/:id — Delete menu (admin)
router.delete('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    await menu.destroy();
    return res.json({ message: 'Menu deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
