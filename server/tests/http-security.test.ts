import { beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

const { prismaMock } = vi.hoisted(() => ({ prismaMock: { $queryRaw: vi.fn().mockResolvedValue([{ result: 1 }]) } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: prismaMock }));

let app: (typeof import('../src/app.js'))['app'];
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '4000';
  process.env.CLIENT_ORIGIN = 'http://localhost:5173';
  process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/taskforge_test';
  process.env.DIRECT_URL = 'mysql://test:test@localhost:3306/taskforge_test';
  process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-the-application';
  process.env.COOKIE_SECURE = 'false';
  process.env.COOKIE_SAME_SITE = 'lax';
  ({ app } = await import('../src/app.js'));
});

describe('HTTP security', () => {
  it('reports database health', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ status: 'ok', database: 'connected' });
  });

  it('rejects state-changing requests from an untrusted origin', async () => {
    const response = await request(app).post('/api/v1/auth/login').set('Origin', 'https://attacker.example');
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('ORIGIN_REJECTED');
  });

  it('requires a matching CSRF cookie and header', async () => {
    const response = await request(app).post('/api/v1/auth/login').set('Origin', 'http://localhost:5173');
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('CSRF_INVALID');
  });

  it('accepts the issued CSRF token and continues to request validation', async () => {
    const browser = request.agent(app);
    const csrfResponse = await browser.get('/api/v1/auth/csrf');
    const token = csrfResponse.body.data.token as string;
    expect(token).toHaveLength(64);
    const response = await browser.post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('X-CSRF-Token', token)
      .send({ email: 'invalid', password: 'x' });
    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
