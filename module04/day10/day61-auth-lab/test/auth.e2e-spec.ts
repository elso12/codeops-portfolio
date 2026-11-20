import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
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

  const testUser = {
    email: 'student@example.com',
    password: 'Password123!',
  };

  let accessToken: string;
  let refreshToken: string;
  let rotatedAccessToken: string;
  let rotatedRefreshToken: string;

  describe('POST /api/auth/register', () => {
    it('creates a new user and returns safe fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.roles).toEqual(['customer']);
      expect(res.body.passwordHash).toBeUndefined();
      expect(res.body.refreshHash).toBeUndefined();
      expect(res.body.password).toBeUndefined();
    });

    it('rejects duplicate email with 409', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(res.body.message).toBe('Email already registered');
    });

    it('validates email format', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'invalid-email', password: 'Password123!' })
        .expect(400);

      expect(res.body.message).toContain('email must be an email');
    });

    it('enforces minimum password length', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'other@example.com', password: 'short' })
        .expect(400);

      expect(res.body.message).toContain(
        'password must be longer than or equal to 8 characters',
      );
    });

    it('rejects non-whitelisted payload fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'attacker@example.com',
          password: 'Password123!',
          roles: ['admin'],
        })
        .expect(400);

      expect(res.body.message).toContain('property roles should not exist');
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns access and refresh tokens for valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(testUser)
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('returns 401 for incorrect password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'WrongPassword!' })
        .expect(401);

      expect(res.body.message).toBe('Invalid credentials');
    });

    it('returns the same 401 message for unknown email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'unknown@example.com', password: 'Password123!' })
        .expect(401);

      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('Protected endpoints', () => {
    it('blocks unauthenticated requests with 401', async () => {
      await request(app.getHttpServer()).get('/api/auth/me').expect(401);
      await request(app.getHttpServer()).post('/api/auth/logout').expect(401);
    });

    it('returns current user profile with valid bearer token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.email).toBe(testUser.email);
      expect(res.body.roles).toEqual(['customer']);
    });

    it('rejects tampered access tokens', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}invalid`)
        .expect(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('rotates refresh token and returns new token pair', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.refreshToken).not.toBe(refreshToken);

      rotatedAccessToken = res.body.accessToken;
      rotatedRefreshToken = res.body.refreshToken;
    });

    it('rejects reused refresh token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(res.body.message).toBe('Invalid refresh token');
    });

    it('allows continuing refresh cycle with the newly rotated token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: rotatedRefreshToken })
        .expect(200);

      expect(res.body.refreshToken).not.toBe(rotatedRefreshToken);
      rotatedAccessToken = res.body.accessToken;
      rotatedRefreshToken = res.body.refreshToken;
    });
  });

  describe('POST /api/auth/logout', () => {
    it('clears refresh token state while keeping access token valid until exp', async () => {
      const resLogout = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${rotatedAccessToken}`)
        .expect(200);

      expect(resLogout.body).toEqual({ message: 'Logged out' });

      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: rotatedRefreshToken })
        .expect(401);

      const resMe = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${rotatedAccessToken}`)
        .expect(200);

      expect(resMe.body.email).toBe(testUser.email);
    });
  });
});
