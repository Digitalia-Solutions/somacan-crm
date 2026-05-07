import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET all categories with product counts
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { active: true },
      include: [{
        model: Product,
        attributes: ['id']
      }],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    const categoriesWithCount = categories.map(cat => {
      const plain = cat.get({ plain: true });
      return {
        ...plain,
        productCount: plain.Products ? plain.Products.length : 0
      };
    });

    res.json(categoriesWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single category by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug, active: true }
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
