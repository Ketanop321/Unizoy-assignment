import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5000';
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/unizoy_job_board';
  process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-with-at-least-thirty-two-characters';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
  process.env.JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret-with-at-least-thirty-two-chars';
  process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';
  process.env.CSRF_SECRET = process.env.CSRF_SECRET ?? 'csrf-test-secret-12345';
});

describe('API smoke tests', () => {
  it('returns healthy status', async () => {
    const { app } = await import('./app.js');

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
  });

  it('returns csrf token', async () => {
    const { app } = await import('./app.js');

    const response = await request(app).get('/api/v1/auth/csrf-token');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.csrfToken).toBeTypeOf('string');
  });
});
