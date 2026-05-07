import { Router } from 'express';
import GlobalStylePreset from '../models/GlobalStylePreset.js';

const router = Router();

// Public: get all presets
router.get('/', async (req, res) => {
  try {
    const presets = await GlobalStylePreset.findAll({ order: [['scope', 'ASC'], ['name', 'ASC']] });
    res.json(presets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: get presets by scope
router.get('/:scope', async (req, res) => {
  try {
    const presets = await GlobalStylePreset.findAll({
      where: { scope: req.params.scope },
      order: [['name', 'ASC']],
    });
    res.json(presets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create preset
router.post('/admin', async (req, res) => {
  try {
    const preset = await GlobalStylePreset.create(req.body);
    res.status(201).json(preset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: update preset
router.put('/admin/:id', async (req, res) => {
  try {
    const preset = await GlobalStylePreset.findByPk(req.params.id);
    if (!preset) return res.status(404).json({ error: 'Not found' });
    await preset.update(req.body);
    res.json(preset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete preset
router.delete('/admin/:id', async (req, res) => {
  try {
    const preset = await GlobalStylePreset.findByPk(req.params.id);
    if (!preset) return res.status(404).json({ error: 'Not found' });
    await preset.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
