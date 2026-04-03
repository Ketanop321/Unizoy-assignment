import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { csrfProtection, generateCsrfToken } from './middleware/csrf.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { publicReadLimiter } from './middleware/rate-limiters.js';
import { v1Router } from './routes/v1/index.js';
import { successResponse } from './utils/api-response.js';

export const app = express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(publicReadLimiter);

app.get('/api/health', (_req, res) => {
  res.status(200).json(successResponse('API is healthy', { status: 'ok' }));
});

app.get('/api/v1/auth/csrf-token', (req, res) => {
  const token = generateCsrfToken(req, res);
  res.status(200).json(successResponse('CSRF token generated', { csrfToken: token }));
});

app.use('/api/v1', csrfProtection, v1Router);

app.use(notFoundHandler);
app.use(errorHandler);
