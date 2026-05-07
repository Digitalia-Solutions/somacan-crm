import express from 'express';
import ContactSubmission from '../models/ContactSubmission.js';
import { sendContactNotification } from '../services/mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone = '',
      subject = '',
      message,
      source = 'contact_page',
    } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'Missing required contact fields' });
    }

    const submission = await ContactSubmission.create({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      source,
    });

    // Send admin notification + auto-reply (non-blocking)
    sendContactNotification(submission.get({ plain: true })).catch((err) =>
      console.error('Contact email error:', err.message)
    );

    return res.status(201).json(submission);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
