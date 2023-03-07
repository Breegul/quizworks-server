const Quiz = require('../../models/quiz');

describe('Quiz model', () => {
    let quiz;

    beforeAll(() => {
        quiz = new Quiz({ quiz_id: 1, title: 'Math Quiz', description: 'A quiz about math', user_id: 1 });
    });
    test('constructor is a function', () => {
        expect(typeof Quiz).toBe('function');
      });
    describe('getAllQuizzes', () => {
        test('is a function', () => {
            expect(typeof Quiz.getAllQuizzes).toBe('function');
        });
    });

    describe('getAllQuizzesByUserId', () => {
        test('is a function', () => {
            expect(typeof quiz.getAllQuizzesByUserId).toBe('function');
        });
    });

    describe('getOneQuizById', () => {
        test('is a function', () => {
            expect(typeof quiz.getOneQuizById).toBe('function');
        });
    });

    describe('updateQuizById', () => {
        test('is a function', () => {
            expect(typeof quiz.updateQuizById).toBe('function');
        });
    });

    describe('deleteQuizById', () => {
        test('is a function', () => {
            expect(typeof quiz.deleteQuizById).toBe('function');
        });
    });
});
