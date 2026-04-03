import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url().transform((value) => value.replace(/\/+$/, '')),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  COOKIE_DOMAIN: z.string().optional(),
  CSRF_SECRET: z.string().min(16),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errorMessage = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');

  throw new Error(`Invalid environment configuration: ${errorMessage}`);
}

export const env = parsed.data;
