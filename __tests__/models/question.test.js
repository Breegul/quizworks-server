const Question = require('../../models/question');

describe('Question model', () => {
    let question;
    beforeAll(()=>{
        question = new Question({id: 1, text: 'Test Question', quiz_id: 1});
    })

    test('constructor is a function', ()=>{
        expect(typeof Question).toBe('function');
    })

    describe('getByQuizId', () => {
        test('is a function', () => {
            expect(typeof Question.getByQuizId).toBe('function');
        });
    });

    describe('getByQuestionId', () => {
        test('is a function', () => {
            expect(typeof Question.getByQuestionId).toBe('function');
        });
    });

    describe('create', () => {
        test('is a function', () => {
            expect(typeof Question.create).toBe('function');
        });
    });

    describe('destroy', () => {
        test('is a function', () => {
            expect(typeof question.destroy).toBe('function');
        });
    });

    describe('update', () => {
        test('is a function', () => {
            expect(typeof question.update).toBe('function');
        });
    });
 })