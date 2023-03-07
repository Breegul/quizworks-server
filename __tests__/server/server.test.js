const request = require('supertest');
const server = require('../../server');

describe('Test server routes', () => {
  test('GET / should return 200 and correct message', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Application');
    expect(response.body.description).toBe('GET / route homepage');
  });
});
