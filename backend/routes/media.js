import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Media from '../models/Media.js';
import { requireAdmin } from '../middleware/admin.js';
import { Op } from 'sequelize';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'public/uploads/'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext || mime);
  },
});

// GET /api/media — list all (admin, with optional search ?q=&folder=)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { q, folder } = req.query;
    const where = {};
    if (folder) where.folder = folder;
    if (q) where.filename = { [Op.like]: `%${q}%` };
    const items = await Media.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/media/upload — upload file + save metadata
router.post('/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const url = `/public/uploads/${req.file.filename}`;
    const media = await Media.create({
      filename: req.file.originalname,
      url,
      mimeType: req.file.mimetype,
      size: req.file.size,
      altText: req.body.altText || '',
      title: req.body.title || req.file.originalname,
      folder: req.body.folder || 'uploads',
    });
    return res.status(201).json(media);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PATCH /api/media/:id — update altText/title
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    const { altText, title, folder } = req.body;
    await media.update({ altText, title, folder });
    return res.json(media);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /api/media/:id — delete file + DB row
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    // Delete physical file
    const filePath = 'public' + media.url.replace('/public', '');
    try { fs.unlinkSync(filePath); } catch { /* file may not exist */ }
    await media.destroy();
    return res.json({ message: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
