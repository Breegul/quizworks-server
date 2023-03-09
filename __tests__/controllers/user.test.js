const request = require('supertest');
const userController = require('../../controllers/user');
const app = require('../../server.js');

describe('User controller', () => {

    describe('getUserById', () => {

      let id;

      beforeAll(async () => {
        const user = await userModel.createUser('testuser', 'testpassword', 'user');
        id = user.id;
      });
    
      afterAll(async () => {
        await userModel.deleteUser(id);
      });

      test('is a function', () => {
        expect(typeof userController.getUserById).toBe('function');
      });
      test('should return a user by ID', async () => {
        const response = await request(app).get(`/users/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe('testuser');
        expect(response.body.role).toBe('user');
      });
      test('should return an error for an invalid ID', async () => {
        const response = await request(app).get('/users/invalid-id');
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('An unexpected error occurred.');
      });
    });
  
    describe('getUserByUsername', () => {

      let id;

      beforeAll(async () => {
        const user = await userModel.createUser('testuser', 'testpassword', 'user');
        id = user.id;
      });
    
      afterAll(async () => {
        await userModel.deleteUser(id);
      });

      test('is a function', () => {
        expect(typeof userController.getUserByUsername).toBe('function');
      });
      test('should return a user by username', async () => {
        const response = await request(app).get('/users/by_username/testuser');
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe('testuser');
        expect(response.body.role).toBe('user');
      });
      test('should return an error for an invalid username', async () => {
        const response = await request(app).get('/users/by_username/invalid-username');
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('An unexpected error occurred.');
      });
    });
  
    describe('createUser', () => {

      let id;

      afterAll(async () => {
        await userModel.deleteUser(id);
      });

      test('is a function', () => {
        expect(typeof userController.createUser).toBe('function');
      });
      test('should create a new user', async () => {
        const response = await request(app).post('/users').send({
          username: 'testuser',
          password: 'testpassword',
          role: 'user',
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.username).toBe('testuser');
        expect(response.body.role).toBe('user');
        expect(response.body.password).not.toBeDefined();
        id = response.body.id;
      });
      test('should return an error for a missing field', async () => {
        const response = await request(app).post('/users').send({
          username: 'testuser',
          password: 'testpassword',
        });
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('An unexpected error occurred.');
      });
    });
  
    describe('updateUser', () => {
      test('is a function', () => {
        expect(typeof userController.updateUser).toBe('function');
      });
      test('should update the user successfully', async () => {
        // create a user to update
        const saltRounds = 10;
        const password = 'password';
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await userModel.createUser('testuser', hashedPassword, 'user');
        const response = await request(app)
          .put(`/users/${user.id}`)
          .send({ username: 'updateduser', password: 'updatedpassword', role: 'admin' })
          .expect(200);
        expect(response.body.username).toBe('updateduser');
        expect(response.body.role).toBe('admin');
        // cleanup
        await userModel.deleteUser(user.id);
      });
      test('should return an error if the user does not exist', async () => {
        const response = await request(app)
          .put('/users/9999')
          .send({ username: 'updateduser', password: 'updatedpassword', role: 'admin' })
          .expect(500);
  
        expect(response.body.error).toBe('An unexpected error occurred.');
      });
    });
  
    describe('deleteUser', () => {
      test('is a function', () => {
        expect(typeof userController.deleteUser).toBe('function');
      });
      test('should delete the user successfully', async () => {
        // create a user to delete
        const saltRounds = 10;
        const password = 'password';
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await userModel.createUser('testuser', hashedPassword, 'user');
  
        const response = await request(app)
          .delete(`/users/${user.id}`)
          .expect(204);
        expect(response.body).toEqual({});
        // make sure the user has been deleted
        const deletedUser = await userModel.getUserById(user.id);
        expect(deletedUser).toBeNull();
      });
      test('should return an error if the user does not exist', async () => {
        const response = await request(app)
          .delete('/users/9999')
          .expect(500);
        expect(response.body.error).toBe('An unexpected error occurred.');
      });
    });
  
    describe('loginUser', () => {
      test('is a function', () => {
        expect(typeof userController.loginUser).toBe('function');
      });
      test('should return a JWT token if the user credentials are correct', async () => {
        const saltRounds = 10;
        const password = 'password';
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await userModel.createUser('testuser', hashedPassword, 'user');
  
        const response = await request(app)
          .post('/users/login')
          .send({ username: 'testuser', password: 'password' })
          .expect(200);
  
        expect(response.body.token).toBeDefined();
  
        // cleanup
        await userModel.deleteUser(user.id);
      });
      test('should return an error if the user credentials are incorrect', async () => {
        const response = await request(app)
          .post('/users/login')
          .send({ username: 'testuser', password: 'wrongpassword' })
          .expect(401);
        expect(response.body.error).toBe('Invalid username or password.');
      });
    });
  
  });
  