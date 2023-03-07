const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/user');

const app = express();
app.use(express.json());
app.use('/', userRoutes);

describe('User Routes', () => {
  describe('POST /register', () => {
    test('should create a new user', async () => {
      const newUser = {
        name: 'user4',
        email: 'password4',
        role: 'teacher'
      };
      const response = await request(app)
        .post('/register')
        .send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.role).toBe(newUser.role);
    });

    test('should return 400 if email already exists', async () => {
      const existingUser = {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'password123'
      };
      const response = await request(app)
        .post('/register')
        .send(existingUser);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('POST /login', () => {
    test('should login user and return JWT token', async () => {
      const credentials = {
        email: 'johndoe@example.com',
        password: 'password123'
      };
      const response = await request(app)
        .post('/login')
        .send(credentials);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('should return 401 if credentials are invalid', async () => {
      const invalidCredentials = {
        email: 'johndoe@example.com',
        password: 'wrongpassword'
      };
      const response = await request(app)
        .post('/login')
        .send(invalidCredentials);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid email or password');
    });
  });
});
