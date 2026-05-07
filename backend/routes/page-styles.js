import express from 'express';
import PageStyle from '../models/PageStyle.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// ─── Public route ────────────────────────────────────────────
// GET /api/page-styles/:pageKey — Read page styling (for frontend rendering)
router.get('/:pageKey', async (req, res) => {
  try {
    const style = await PageStyle.findOne({
      where: { pageKey: req.params.pageKey },
    });
    return res.json(style || { pageKey: req.params.pageKey, styles: {} });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ─── Admin routes ────────────────────────────────────────────

// GET /api/page-styles/admin/:pageKey — Get page styling (admin)
router.get('/admin/:pageKey', requireAdmin, async (req, res) => {
  try {
    const style = await PageStyle.findOne({
      where: { pageKey: req.params.pageKey },
    });
    return res.json(style || { pageKey: req.params.pageKey, styles: {} });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PUT /api/page-styles/admin/:pageKey — Upsert page styling (admin)
router.put('/admin/:pageKey', requireAdmin, async (req, res) => {
  try {
    const { styles } = req.body;

    if (styles === undefined || styles === null || typeof styles !== 'object') {
      return res.status(400).json({ message: 'styles must be a JSON object' });
    }

    const [style, created] = await PageStyle.findOrCreate({
      where: { pageKey: req.params.pageKey },
      defaults: { styles },
    });

    if (!created) {
      style.styles = styles;
      await style.save();
    }

    return res.json(style);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
