import { attachUserIfPresent } from './auth.js';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

export async function requireAdmin(req, res, next) {
  await attachUserIfPresent(req, res, async () => {});

  if (req.user?.role === 'admin') {
    return next();
  }

  const providedKey = req.headers['x-admin-key'];

  if (ADMIN_API_KEY && providedKey === ADMIN_API_KEY) {
    return next();
  }

  if (!ADMIN_API_KEY) {
    return res.status(401).json({ message: 'Admin login required' });
  }

  return res.status(401).json({ message: 'Admin authentication required' });
}
