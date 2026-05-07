import express from 'express';
import MenuItem from '../models/MenuItem.js';
import Menu from '../models/Menu.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// GET /api/menu-items?menuId=X — list items for a menu, nested
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { menuId } = req.query;
    const where = menuId ? { menuId: Number(menuId) } : {};
    const items = await MenuItem.findAll({ where, order: [['order', 'ASC'], ['id', 'ASC']] });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/menu-items — create item
router.post('/', requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// PUT /api/menu-items/:id — update item
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'MenuItem not found' });
    await item.update(req.body);
    return res.json(item);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /api/menu-items/:id — delete item (also deletes children)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'MenuItem not found' });
    // Delete children first
    await MenuItem.destroy({ where: { parentId: item.id } });
    await item.destroy();
    return res.json({ message: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/menu-items/reorder — update order for multiple items
router.post('/reorder', requireAdmin, async (req, res) => {
  try {
    // req.body = [{ id, order }]
    await Promise.all(req.body.map(({ id, order }) =>
      MenuItem.update({ order }, { where: { id } })
    ));
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
