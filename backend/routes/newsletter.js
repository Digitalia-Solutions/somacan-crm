import express from 'express';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import PopupConfig from '../models/PopupConfig.js';
import { sendNewsletterWelcome } from '../services/mailer.js';

const router = express.Router();

// Public: get active popup config
router.get('/popup', async (_req, res) => {
  try {
    const [popup] = await PopupConfig.findOrCreate({
      where: { name: 'default' },
      defaults: { name: 'default' },
    });
    return res.json(popup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Public: subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, firstName = '', source = 'newsletter_section' } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Email invalide.' });
    }

    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email: email.toLowerCase().trim() },
      defaults: { email: email.toLowerCase().trim(), firstName, source },
    });

    if (!created && subscriber.status === 'active') {
      return res.status(409).json({ message: 'Vous êtes déjà inscrit.' });
    }

    if (!created && subscriber.status === 'unsubscribed') {
      await subscriber.update({ status: 'active', firstName, source });
    }

    sendNewsletterWelcome(subscriber.get({ plain: true })).catch((err) =>
      console.error('Newsletter welcome email error:', err.message)
    );

    return res.status(201).json({ message: 'Inscription confirmée.' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
