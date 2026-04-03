import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app-error.js';

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
    return;
  }

  if (req.user.role !== 'ADMIN') {
    next(new AppError(403, 'FORBIDDEN', 'Admin access required'));
    return;
  }

  next();
};
