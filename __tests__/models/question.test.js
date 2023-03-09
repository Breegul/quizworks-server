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

        beforeAll(async () => {
            const quizId = 1;
            const questions = [
                { text: 'Question 1', quiz_id: quizId },
                { text: 'Question 2', quiz_id: quizId },
                { text: 'Question 3', quiz_id: quizId },
            ];
            const query = {
                text: 'INSERT INTO questions (text, quiz_id) VALUES ($1, $2), ($3, $4), ($5, $6) RETURNING *;',
                values: [questions[0].text, questions[0].quiz_id, questions[1].text, questions[1].quiz_id, questions[2].text, questions[2].quiz_id],
            };
            await pool.query(query);
        });

        afterAll(async () => {
            // Clean up test data
            await pool.query('DELETE FROM questions;');
        });

        test('is a function', () => {
            expect(typeof Question.getByQuizId).toBe('function');
        });
        // This test below needs fixing. Code: #####
        test('should return an array of questions for a given quiz_id', async () => {
            const quizId = 1;
            const questions = await Question.getByQuizId(quizId);
            //expect(questions).toHaveLength(3);
            questions.forEach((question, i) => {
                expect(question).toBeInstanceOf(Question);
                expect(question.text).toBe(`Question ${i + 1}`);
                expect(question.quiz_id).toBe(quizId);
            });
        });
        // This test below needs fixing. Code: #####
        test('should throw an error if quiz_id does not exist', async () => {
            const quizId = 999;
            await expect(Question.getByQuizId(quizId)).rejects.toThrow('An error occurred while getting a question by quiz_id.');
        });
    });

    describe('getByQuestionId', () => {

        beforeAll(async () => {
            // Insert test data
            const { rows } = await pool.query('INSERT INTO questions (text, quiz_id) VALUES ($1, $2) RETURNING *;', ['Question 1', 1]);
            question = rows[0];
        });

        afterAll(async () => {
            // Clean up test data
            await pool.query('DELETE FROM questions WHERE id = $1;', [question.id]);
        });

        test('is a function', () => {
            expect(typeof Question.getByQuestionId).toBe('function');
        });
        // This test below needs fixing. Code: #####
        test('should return a Question object for a given question id', async () => {
            const result = await Question.getByQuestionId(question.id);
            expect(result).toBeInstanceOf(Question);
            expect(result.id).toBe(question.id);
            expect(result.text).toBe('Question 1');
            expect(result.quiz_id).toBe(1);
        });
        // This test below needs fixing. Code: #####
        test('should throw an error if question not found', async () => {
            await expect(Question.getByQuestionId(9999)).rejects.toThrow('Question not found');
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