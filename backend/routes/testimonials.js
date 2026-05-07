import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({ where: { isActive: true } });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
