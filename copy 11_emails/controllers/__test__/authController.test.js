const request = require('supertest');

const app = require('../../index');

describe('test POST /auth/login', () => {
  beforeAll(() => console.log('BEFORE ALL'));
  beforeEach(() => console.log('BEFORE EACH'));
  afterEach(() => console.log('AFTER EACH'));
  afterAll(() => console.log('AFTER ALL'));

  it('should return user obj and jwt', async () => {
    const testData = {
      email: 'user@example.com',
      password: 'Pass_1234',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
  });

  it('should return 401 - 1', async () => {
    const testData = {
      email: 'user@example.com',
      password: 'Pass&1234',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 - 2', async () => {
    const testData = {
      email: 'user@example.com',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });
});
