const Answer = require('../../models/answer');

describe('Answer model', () => {
    let answer;

    beforeAll(()=>{
        answer = new Answer({ id: 1, text: "test ans", is_correct: true, question_id:1});
    })
    test('constructor is a function', ()=>{
        expect(typeof Answer).toBe('function');
    })

    describe('getByQuestionId', () => {
        test('is a function', () => {
            expect(typeof Answer.getByQuestionId).toBe('function');
        });
    });

    describe('getByAnswerId', () => {
        test('is a function', () => {
            expect(typeof Answer.getByAnswerId).toBe('function');
        });
    });

    describe('create', () => {
        test('is a function', () => {
            expect(typeof Answer.create).toBe('function');
        });
    });

    describe('destroy', () => {
        test('is a function', () => {
            expect(typeof answer.destroy).toBe('function');
        });
    });

    describe('update', () => {
        test('is a function', () => {
            expect(typeof answer.update).toBe('function');
        });
    });
})