import express from 'express';
import Article from '../models/Article.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.findAll({ where: { active: true }, order: [['publishedAt', 'DESC']] });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: Get single article by slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ where: { slug: req.params.slug } });
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create article
router.post('/', protect, admin, async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update article
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (article) {
      await article.update(req.body);
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete article
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (article) {
      await article.destroy();
      res.json({ message: 'Article deleted' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
