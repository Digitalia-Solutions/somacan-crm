import express from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, categoryId, featured, search } = req.query;
    let where = {};

    if (category) where.category = category;
    if (categoryId) where.categoryId = categoryId;
    if (featured) where.isFeatured = true;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, required: false }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Category, required: false }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product (admin)
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
