import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'somacan-dev-secret-change-me';

export async function attachUserIfPresent(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if (user) {
      req.user = user;
    }
  } catch (_error) {
    req.user = null;
  }

  next();
}

export async function requireAuth(req, res, next) {
  await attachUserIfPresent(req, res, () => {});

  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  next();
}

export async function requireAdminUser(req, res, next) {
  await requireAuth(req, res, async () => {});

  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}

export function signUserToken(user) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

export function serializeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    addressLine1: user.addressLine1,
    addressLine2: user.addressLine2,
    city: user.city,
    postalCode: user.postalCode,
    country: user.country,
    latitude: user.latitude,
    longitude: user.longitude,
    locationLabel: user.locationLabel,
    createdAt: user.createdAt,
  };
}
