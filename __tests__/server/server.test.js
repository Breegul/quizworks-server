const request = require('supertest');
const { startServer, closeServer } = require('../../server');

let app;

beforeAll(async () => {
  app = await startServer();
});

afterAll(() => {
  closeServer();
});

describe('Test server routes', () => {
  test('GET / should return 200 and correct message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Application');
    expect(response.body.description).toBe('GET / route homepage');
  });
});
