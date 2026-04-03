import { doubleCsrf } from 'csrf-csrf';
import { env } from '../config/env.js';

const csrf = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: (req) => req.headers['user-agent']?.toString() ?? 'anonymous',
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/',
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

export const csrfProtection = csrf.doubleCsrfProtection;
export const generateCsrfToken = csrf.generateCsrfToken;
