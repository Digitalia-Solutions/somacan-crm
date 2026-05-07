import express from 'express';
import Page from '../models/Page.js';
import PageSection from '../models/PageSection.js';
import { requireAdmin } from '../middleware/admin.js';
import { getSectionDefinition, isWidgetSectionType } from '../../shared/cms/sections.js';
import { createResponsiveValue } from '../../shared/cms/responsive.js';
import { getTemplateDefinition, isSectionAllowedForTemplate } from '../../shared/cms/templates.js';

const router = express.Router();

function normalizeSectionPayload(payload = {}, existingSection = null) {
  const type = payload.type || existingSection?.type;
  const sectionDefinition = type ? getSectionDefinition(type) : null;
  const widgetTree = payload.widgetTree ?? existingSection?.widgetTree ?? sectionDefinition?.defaultWidgetTree ?? null;
  const responsive = createResponsiveValue(payload.responsive ?? existingSection?.responsive ?? {});

  return {
    ...payload,
    responsive,
    widgetTree: isWidgetSectionType(type) ? (Array.isArray(widgetTree) ? widgetTree : []) : widgetTree,
    globalStyleOverrides: payload.globalStyleOverrides ?? existingSection?.globalStyleOverrides ?? {},
    templateLock: payload.templateLock ?? existingSection?.templateLock ?? sectionDefinition?.type ?? null,
  };
}

async function validateSectionAgainstTemplate(pageSlug, sectionType, currentPage = null) {
  const page = currentPage || await Page.findOne({ where: { slug: pageSlug } });
  const templateKey = page?.template || 'custom';
  const templateDefinition = getTemplateDefinition(templateKey);

  if (!isSectionAllowedForTemplate(templateKey, sectionType)) {
    const label = templateDefinition.componentName || templateKey;
    throw new Error(`Section type "${sectionType}" is not allowed for ${label}.`);
  }
}

// ─── Public ────────────────────────────────────────────────────

// GET /api/pages/:slug/sections — ordered active sections for a slug
router.get('/pages/:slug/sections', async (req, res) => {
  try {
    const sections = await PageSection.findAll({
      where: { pageSlug: req.params.slug, isActive: true },
      order: [['order', 'ASC']],
    });
    return res.json(sections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ─── Admin ────────────────────────────────────────────────────

// GET /api/admin/page-sections?pageSlug=home — all sections for a page (including inactive)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { pageSlug } = req.query;
    const where = pageSlug ? { pageSlug } : {};
    const sections = await PageSection.findAll({
      where,
      order: [['order', 'ASC']],
    });
    return res.json(sections.map((section) => normalizeSectionPayload(section.toJSON(), section)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/page-sections — create section
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      pageSlug,
      type,
      name,
      order = 0,
      isActive = true,
      content = {},
      settings = {},
      animation = {},
      responsive = {},
      seo = {},
    } = req.body;

    if (!pageSlug || !type || !name) {
      return res.status(400).json({ message: 'pageSlug, type and name are required' });
    }

    // Find or create the Page record by slug
    let page = await Page.findOne({ where: { slug: pageSlug } });
    if (!page) {
      page = await Page.create({
        slug: pageSlug,
        title: pageSlug,
        isPublished: false,
      });
    }

    await validateSectionAgainstTemplate(pageSlug, type, page);

    const normalizedPayload = normalizeSectionPayload({
      pageSlug,
      type,
      name,
      order,
      isActive,
      content,
      settings,
      animation,
      responsive,
      seo,
      widgetTree: req.body.widgetTree,
      globalStyleOverrides: req.body.globalStyleOverrides,
      templateLock: req.body.templateLock,
    });

    const section = await PageSection.create({
      pageId: page.id,
      ...normalizedPayload,
    });

    return res.status(201).json(normalizeSectionPayload(section.toJSON(), section));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// PUT /api/admin/page-sections/:id — update any field
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const section = await PageSection.findByPk(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    let page = null;

    // If pageSlug is being changed, keep it in sync
    if (req.body.pageSlug && req.body.pageSlug !== section.pageSlug) {
      page = await Page.findOne({ where: { slug: req.body.pageSlug } });
      if (page) {
        req.body.pageId = page.id;
      }
    }

    await validateSectionAgainstTemplate(req.body.pageSlug || section.pageSlug, req.body.type || section.type, page);

    const normalizedPayload = normalizeSectionPayload(req.body, section);

    await section.update(normalizedPayload);
    return res.json(normalizeSectionPayload(section.toJSON(), section));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admin/page-sections/:id — delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const section = await PageSection.findByPk(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    await section.destroy();
    return res.json({ message: 'Section deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/page-sections/:id/duplicate — duplicate a section
router.post('/:id/duplicate', requireAdmin, async (req, res) => {
  try {
    const original = await PageSection.findByPk(req.params.id);
    if (!original) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const duplicate = await PageSection.create({
      pageId: original.pageId,
      pageSlug: original.pageSlug,
      type: original.type,
      name: `${original.name} (copie)`,
      order: original.order + 1,
      isActive: original.isActive,
      content: original.content,
      settings: original.settings,
      animation: original.animation,
      responsive: original.responsive,
      seo: original.seo,
      widgetTree: original.widgetTree,
      globalStyleOverrides: original.globalStyleOverrides,
      templateLock: original.templateLock,
    });

    return res.status(201).json(normalizeSectionPayload(duplicate.toJSON(), duplicate));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// POST /api/admin/page-sections/reorder — bulk reorder
router.post('/reorder', requireAdmin, async (req, res) => {
  try {
    const items = req.body; // [{ id, order }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Body must be an array of { id, order }' });
    }

    await Promise.all(
      items.map(({ id, order }) =>
        PageSection.update({ order }, { where: { id } })
      )
    );

    return res.json({ message: 'Sections reordered' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// PATCH /api/admin/page-sections/:id/toggle — toggle isActive
router.patch('/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const section = await PageSection.findByPk(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    await section.update({ isActive: !section.isActive });
    return res.json(normalizeSectionPayload(section.toJSON(), section));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
