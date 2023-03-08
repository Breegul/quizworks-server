const questionController = require("../../controllers/question");

describe('Question Controller', () => {

    describe('getByQuizId', () => {
        test('is a function', () => {
            expect(typeof questionController.getByQuizId).toBe('function');
        });
    });

    describe('getByQuestionId', () => {
        test('is a function', () => {
            expect(typeof questionController.getByQuestionId).toBe('function');
        });
    });

    describe('create', () => {
        test('is a function', () => {
            expect(typeof questionController.create).toBe('function');
        });
    });

    describe('destroy', () => {
        test('is a function', () => {
            expect(typeof questionController.destroy).toBe('function');
        });
    });

    describe('update', () => {
        test('is a function', () => {
            expect(typeof questionController.update).toBe('function');
        });
    });
})