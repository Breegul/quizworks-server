const Question = require('../../models/question');
const { pool } = require('../../database/pool.js');

describe('Question model', () => {
    let question;
    beforeAll(() => {
        question = new Question({ id: 1, text: 'Test Question', quiz_id: 1 });
    })

    test('constructor is a function', () => {
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
        test('should create a question in the database', async () => {
            // Create a new question
            const quizId = 1;
            const questionText = 'What is the capital of France?';
            const question = await Question.create(questionText, quizId);
            // Check if the question was created in the database
            const query = 'SELECT * FROM questions WHERE id = $1';
            const values = [question.id];
            const result = await pool.query(query, values);
            //console.log('result:', result);
            expect(result.rows.length).toBe(1);
            expect(result.rows[0].text).toBe(questionText);
            expect(result.rows[0].quiz_id).toBe(quizId);
        });
    });

    describe('destroy', () => {
        test('is a function', () => {
            expect(typeof question.destroy).toBe('function');
        });
        test('should delete a question from the database', async () => {
            // Insert a question into the database
            const quizId = 1;
            const questionText = 'What is the capital of France?';
            const insertQuery = 'INSERT INTO questions(text, quiz_id) VALUES ($1, $2) RETURNING *';
            const insertValues = [questionText, quizId];
            const { rows } = await pool.query(insertQuery, insertValues);
            const questionId = rows[0].id;
            // Delete the question from the database
            const deletedQuestionId = await Question.prototype.destroy(questionId);
            // Check if the deleted question matches the expected values
            //expect(deletedQuestion).toBeInstanceOf(Question);
            expect(deletedQuestionId).toBe(questionId);
            //expect(deletedQuestion.text).toBe(questionText);
            //expect(deletedQuestion.quizId).toBe(quizId);
            // Check if the question was deleted from the database
            const query = 'SELECT * FROM questions WHERE id = $1';
            const values = [questionId];
            const result = await pool.query(query, values);
            expect(result.rows.length).toBe(0);
        });
    });

    describe('update', () => {
        test('is a function', () => {
            expect(typeof Question.update).toBe('function');
        });
        test('should update a question in the database', async () => {
            // Insert a question into the database
            const quizId = 1;
            const questionText = 'What is the capital of France?';
            const insertQuery = 'INSERT INTO questions(text, quiz_id) VALUES ($1, $2) RETURNING *';
            const insertValues = [questionText, quizId];
            const { rows } = await pool.query(insertQuery, insertValues);
            const questionId = rows[0].id;
            //console.log("rows[0] : ", rows[0]);
            //console.log("questionId : ", questionId);
            // Update the question in the database
            const updatedQuestionText = 'What is the capital of Spain?';
            const updatedQuestion = await Question.update(questionId, updatedQuestionText, quizId);
            //const updatedQuestion = await new Question({}).update(questionId, updatedQuestionText);
            // Check if the updated question matches the expected values
            //console.log("updatedQuestion : ", updatedQuestion);
            //expect(updatedQuestion).toBeInstanceOf(Question);
            expect(updatedQuestion.id).toBe(questionId);
            expect(updatedQuestion.text).toBe(updatedQuestionText);
            expect(updatedQuestion.quiz_id).toBe(quizId);
            // Check if the question was updated in the database
            const query = 'SELECT * FROM questions WHERE id = $1';
            const values = [questionId];
            const result = await pool.query(query, values);
            expect(result.rows.length).toBe(1);
            expect(result.rows[0].text).toBe(updatedQuestionText);
            expect(result.rows[0].quiz_id).toBe(quizId);
          });
          
    });
})