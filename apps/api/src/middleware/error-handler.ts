import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
import { errorResponse } from '../utils/api-response.js';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(404, 'NOT_FOUND', 'Route not found'));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    const groupedErrors = error.issues.reduce<Record<string, string[]>>((acc, issue) => {
      const key = issue.path.join('.') || 'body';
      acc[key] = [...(acc[key] ?? []), issue.message];
      return acc;
    }, {});

    res.status(400).json(errorResponse('Validation failed', { code: 'VALIDATION_ERROR', details: groupedErrors }));
    return;
  }

  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json(errorResponse(error.message, { code: error.code, details: error.details }));
    return;
  }

  res.status(500).json(errorResponse('Something went wrong', { code: 'INTERNAL_ERROR' }));
};
