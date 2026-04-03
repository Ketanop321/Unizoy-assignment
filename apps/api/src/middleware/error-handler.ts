import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const statusMap: Record<string, number> = {
      P2002: 409,
      P2003: 400,
      P2025: 404,
    };

    const statusCode = statusMap[error.code] ?? 400;

    res.status(statusCode).json(
      errorResponse('Database request failed', {
        code: 'DATABASE_ERROR',
        details: { prismaCode: [error.code] },
      }),
    );
    return;
  }

  if (error instanceof Error) {
    if ((error as { code?: string }).code === 'EBADCSRFTOKEN' || /csrf/i.test(error.message)) {
      res.status(403).json(errorResponse('Invalid CSRF token', { code: 'CSRF_TOKEN_INVALID' }));
      return;
    }
  }

  console.error('Unhandled API error', error);

  res.status(500).json(errorResponse('Something went wrong', { code: 'INTERNAL_ERROR' }));
};
