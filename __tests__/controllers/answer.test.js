const answerController = require("../../controllers/answer");

describe('Answer controller', () => {
    describe('getByQuestionId', () => {
        test('is a function', () => {
            expect(typeof answerController.getByQuestionId).toBe('function');
        })
    })

    describe('getByAnswerId', () => {
        test('is a function', () => {
            expect(typeof answerController.getByAnswerId).toBe('function');
        });
    });

    describe('create', () => {
        test('is a function', () => {
            expect(typeof answerController.create).toBe('function');
        });
    });

    describe('destroy', () => {
        test('is a function', () => {
            expect(typeof answerController.destroy).toBe('function');
        });
    });

    describe('update', () => {
        test('is a function', () => {
            expect(typeof answerController.update).toBe('function');
        });
    });
})