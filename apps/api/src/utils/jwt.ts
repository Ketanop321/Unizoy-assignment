import jwt, { type SignOptions } from 'jsonwebtoken';
import type { AuthenticatedUser } from '../types/express.js';
import { env } from '../config/env.js';
import { AppError } from './app-error.js';

interface TokenPayload {
  sub: string;
  email: string;
  role: AuthenticatedUser['role'];
}

interface RefreshPayload {
  sub: string;
}

export const signAccessToken = (user: AuthenticatedUser): string =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    } as TokenPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] },
  );

export const signRefreshToken = (user: AuthenticatedUser): string =>
  jwt.sign(
    {
      sub: user.id,
    } as RefreshPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] },
  );

export const verifyAccessToken = (token: string): AuthenticatedUser => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;

    return {
      id: decoded.sub,
    };
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }
};
