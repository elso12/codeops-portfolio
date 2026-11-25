import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let rotatedRefreshToken: string;

  const testUser = {
    email: 'alice@example.com',
    name: 'Alice',
    password: 'StrongPassword123!',
  };

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows access to public routes without a token', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('blocks protected routes when no access token is provided', async () => {
    await request(app.getHttpServer()).get('/protected').expect(401);
    await request(app.getHttpServer()).get('/auth/profile').expect(401);
  });

  it('registers a new user and omits passwordHash from response', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
    });
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.refreshTokenHash).toBeUndefined();
  });

  it('rejects duplicate registration with 409 Conflict', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);
  });

  it('rejects login with invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword!' })
      .expect(401);
  });

  it('logs in and returns access and refresh tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body.user.email).toBe(testUser.email);
    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('allows access to protected routes with a valid access token', async () => {
    const profileRes = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(profileRes.body.email).toBe(testUser.email);

    const protectedRes = await request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(protectedRes.body.user.email).toBe(testUser.email);
  });

  it('rejects access token on refresh endpoint', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);
  });

  it('refreshes and rotates tokens using a valid refresh token', async () => {
    // Wait 1s so JWT iat differs and rotated token is distinct
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(200);

    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
    expect(res.body.refreshToken).not.toBe(refreshToken);

    accessToken = res.body.accessToken;
    rotatedRefreshToken = res.body.refreshToken;
  });

  it('rejects reuse of the old refresh token after rotation', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(403);
  });

  it('logs out and invalidates the refresh token', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${rotatedRefreshToken}`)
      .expect(403);
  });
});
