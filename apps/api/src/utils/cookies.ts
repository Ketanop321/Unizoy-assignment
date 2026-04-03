import type { Response } from 'express';
import type { AuthenticatedUser } from '../types/express.js';
import { env } from '../config/env.js';
import { signAccessToken, signRefreshToken } from './jwt.js';

const isProduction = env.NODE_ENV === 'production';
const cookieSameSite = isProduction ? ('none' as const) : ('lax' as const);

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: cookieSameSite,
  path: '/',
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
};

export const setAuthCookies = (res: Response, user: AuthenticatedUser): void => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken', baseCookieOptions);
  res.clearCookie('refreshToken', baseCookieOptions);
};
