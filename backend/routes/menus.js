import express from 'express';
import Menu from '../models/Menu.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

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
