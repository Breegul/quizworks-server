const request = require('supertest');
const { startServer, closeServer } = require('../../server');

describe('Test server routes', () => {

  let server;

  beforeAll(done => {
    server = startServer(done);
  }, 50000);

  afterAll(done => {
    closeServer(server, done);
  });

  test('GET / should return 200 and correct message', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Application');
    expect(response.body.description).toBe('GET / route homepage');
  }, 50000);
});
