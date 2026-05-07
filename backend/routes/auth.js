import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { requireAdminUser, requireAuth, serializeUser, signUserToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone = '',
      addressLine1 = '',
      addressLine2 = '',
      city = '',
      postalCode = '',
      country = 'Maroc',
      latitude = null,
      longitude = null,
      locationLabel = '',
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account already exists for this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      role: 'customer',
      password: hashedPassword,
      phone,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      latitude,
      longitude,
      locationLabel,
    });

    const token = signUserToken(user);

    return res.status(201).json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signUserToken(user);

    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signUserToken(user);

    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: serializeUser(req.user) });
});

router.post('/admin/bootstrap', async (req, res) => {
  try {
    const setupKey = process.env.ADMIN_SETUP_KEY || '';
    const providedKey = req.headers['x-admin-setup-key'];

    if (!setupKey || providedKey !== setupKey) {
      return res.status(401).json({ message: 'Admin setup authentication required' });
    }

    const { firstName, lastName, email, password, phone = '' } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account already exists for this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      phone,
      password: hashedPassword,
      role: 'admin',
    });

    return res.status(201).json({
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/admin/users', requireAdminUser, async (_req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.json(users.map(serializeUser));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone = '',
      addressLine1 = '',
      addressLine2 = '',
      city = '',
      postalCode = '',
      country = 'Maroc',
      latitude = null,
      longitude = null,
      locationLabel = '',
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name and email are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(409).json({ message: 'An account already exists for this email' });
    }

    req.user.firstName = firstName.trim();
    req.user.lastName = lastName.trim();
    req.user.email = normalizedEmail;
    req.user.phone = phone?.trim() || '';
    req.user.addressLine1 = addressLine1?.trim() || '';
    req.user.addressLine2 = addressLine2?.trim() || '';
    req.user.city = city?.trim() || '';
    req.user.postalCode = postalCode?.trim() || '';
    req.user.country = country?.trim() || 'Maroc';
    req.user.latitude = latitude === '' || latitude === null || latitude === undefined ? null : Number(latitude);
    req.user.longitude = longitude === '' || longitude === null || longitude === undefined ? null : Number(longitude);
    req.user.locationLabel = locationLabel?.trim() || '';
    await req.user.save();

    return res.json({ user: serializeUser(req.user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const isValid = await bcrypt.compare(currentPassword, req.user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/claim-order-account/:token', async (req, res) => {
  try {
    const order = await Order.findOne({ where: { guestAccountToken: req.params.token } });

    if (!order) {
      return res.status(404).json({ message: 'Claim link is invalid or expired' });
    }

    return res.json({
      email: order.customer?.email || '',
      firstName: order.customer?.firstName || '',
      lastName: order.customer?.lastName || '',
      phone: order.customer?.phone || '',
      orderId: order.id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/claim-order-account', async (req, res) => {
  try {
    const { token, firstName, lastName, password, phone = '' } = req.body;

    if (!token || !firstName || !lastName || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const order = await Order.findOne({ where: { guestAccountToken: token } });
    if (!order) {
      return res.status(404).json({ message: 'Claim link is invalid or expired' });
    }

    const email = order.customer?.email?.toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ message: 'Order email is missing' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account already exists for this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone: phone || order.customer?.phone || '',
      password: hashedPassword,
      addressLine1: order.customer?.address || '',
      city: order.customer?.city || '',
      postalCode: order.customer?.postalCode || '',
      country: 'Maroc',
    });

    await Order.update(
      {
        userId: user.id,
        guestAccountToken: null,
        guestConvertedAt: new Date(),
      },
      {
        where: {
          guestAccountToken: token,
        },
      }
    );

    const tokenValue = signUserToken(user);

    return res.status(201).json({
      token: tokenValue,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

    return res.json({
      message: user
        ? 'If this email exists, password reset instructions can be sent from the next backend step.'
        : 'If this email exists, password reset instructions can be sent from the next backend step.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
