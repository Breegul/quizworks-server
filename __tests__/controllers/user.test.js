const userController = require('../../controllers/user');

describe('User controller', () => {

    describe('getUserById', () => {
      test('is a function', () => {
        expect(typeof userController.getUserById).toBe('function');
      });
    });
  
    describe('getUserByUsername', () => {
      test('is a function', () => {
        expect(typeof userController.getUserByUsername).toBe('function');
      });
    });
  
    describe('createUser', () => {
      test('is a function', () => {
        expect(typeof userController.createUser).toBe('function');
      });
    });
  
    describe('updateUser', () => {
      test('is a function', () => {
        expect(typeof userController.updateUser).toBe('function');
      });
    });
  
    describe('deleteUser', () => {
      test('is a function', () => {
        expect(typeof userController.deleteUser).toBe('function');
      });
    });
  
    describe('loginUser', () => {
      test('is a function', () => {
        expect(typeof userController.loginUser).toBe('function');
      });
    });
  
  });
  