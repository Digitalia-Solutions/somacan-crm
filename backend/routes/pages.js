import express from 'express';
import Page from '../models/Page.js';
import SiteContent from '../models/SiteContent.js';
import PageSection from '../models/PageSection.js';
import { requireAdmin } from '../middleware/admin.js';
import { getTemplateDefinition } from '../../shared/cms/templates.js';
import { createResponsiveValue } from '../../shared/cms/responsive.js';

const router = express.Router();

function normalizePublicSection(section) {
  const raw = typeof section.toJSON === 'function' ? section.toJSON() : section;
  return {
    ...raw,
    responsive: createResponsiveValue(raw.responsive || {}),
  };
}

// ─── Public routes ───────────────────────────────────────────

// GET /api/pages — List published pages
router.get('/', async (_req, res) => {
  try {
    const pages = await Page.findAll({
      where: { isPublished: true },
      order: [['createdAt', 'DESC']],
    });
    return res.json(pages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/pages/:slug — Get page + all sections for that page
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug, isPublished: true },
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Primary: use PageSection (allows duplicate section types)
    let sections = await PageSection.findAll({
      where: { pageSlug: page.slug, isActive: true },
      order: [['order', 'ASC']],
    });

    // Fallback: if no PageSection rows exist, use legacy SiteContent
    if (sections.length === 0) {
      sections = await SiteContent.findAll({
        where: { pageKey: page.slug, active: true },
        order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
      });
    }

    return res.json({
      ...page.toJSON(),
      templateDefinition: getTemplateDefinition(page.template),
      sections: sections.map(normalizePublicSection),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ─── Admin routes ────────────────────────────────────────────

// POST /api/admin/pages — Create page
router.post('/admin', requireAdmin, async (req, res) => {
  try {
    const page = await Page.create(req.body);
    return res.status(201).json(page);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// PUT /api/admin/pages/:id — Update page
router.put('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    await page.update(req.body);
    return res.json(page);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admin/pages/:id — Delete page
router.delete('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    await page.destroy();
    return res.json({ message: 'Page deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
