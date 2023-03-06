const tokenController = require('../../controllers/token');

describe('Token controller', () => {

    describe('authenticateUser', () => {
      test('is a function', () => {
        expect(typeof tokenController.authenticateUser).toBe('function');
      });
    });
  
    describe('getAllQuizzesByUserId', () => {
      test('is a function', () => {
        expect(typeof tokenController.authenticateToken).toBe('function');
      });
    });
  
  });
  