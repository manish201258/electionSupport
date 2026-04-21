const request = require('supertest');
const app = require('../src/app');

describe('Election Education API', () => {
  test('GET /health returns ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('GET /api/timeline returns data', async () => {
    const response = await request(app).get('/api/timeline');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  test('POST /api/chat validates body', async () => {
    const response = await request(app).post('/api/chat').send({ message: 'a' });
    expect(response.statusCode).toBe(400);
  });

  test('POST /api/chat returns reply', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'How to vote in India?' });

    expect(response.statusCode).toBe(200);
    expect(typeof response.body.reply).toBe('string');
    expect(response.body.reply.length).toBeGreaterThan(20);
  });
});
