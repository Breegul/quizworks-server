const quizController = require('../../controllers/quiz');

describe('Quiz controller', () => {

    describe('getAllQuizzes', () => {
      test('is a function', () => {
        expect(typeof quizController.getAllQuizzes).toBe('function');
      });
    });
  
    describe('getAllQuizzesByUserId', () => {
      test('is a function', () => {
        expect(typeof quizController.getAllQuizzesByUserId).toBe('function');
      });
    });
  
    describe('getOneQuizById', () => {
      test('is a function', () => {
        expect(typeof quizController.getOneQuizById).toBe('function');
      });
    });
  
    describe('updateQuizById', () => {
      test('is a function', () => {
        expect(typeof quizController.updateQuizById).toBe('function');
      });
    });
  
    describe('deleteQuizById', () => {
      test('is a function', () => {
        expect(typeof quizController.deleteQuizById).toBe('function');
      });
    });
  
    describe('createQuiz', () => {
      test('is a function', () => {
        expect(typeof quizController.createQuiz).toBe('function');
      });
    });
  
  });
  