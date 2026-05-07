import express from 'express';
import Blog from '../models/Blog.js';
import { requireAuth, requireAdminUser } from '../middleware/auth.js';

const router = express.Router();

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// Homepage preview — 3 latest published articles
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { isPublished: true },
      order: [['publishedAt', 'DESC']],
      limit: 3
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// All articles — for /blog listing & admin panel
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['publishedAt', 'DESC']]
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// By primary key — for admin editor
router.get('/id/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// By slug — for public article pages (must be LAST to avoid catching /all & /id/:id)
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADMIN ROUTES (auth required) ─────────────────────────────────────────────

router.post('/', requireAuth, requireAdminUser, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', requireAuth, requireAdminUser, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    await blog.update(req.body);
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', requireAuth, requireAdminUser, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    await blog.destroy();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
