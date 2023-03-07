const Quiz = require('../../models/quiz');
const { pool } = require('../../database/pool.js');

describe('Quiz model', () => {

    afterAll(async () => {
        await pool.end();
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
            expect(typeof Quiz.prototype.getAllQuizzesByUserId).toBe('function');
        });
    });

    describe('getOneQuizById', () => {
        test('is a function', () => {
            expect(typeof Quiz.getOneQuizById).toBe('function');
        });

        test('should return a quiz object with valid id', async () => {
            // Insert a new quiz into the database
            const insertQuery = 'INSERT INTO quizzes (title, description, user_id) VALUES ($1, $2, $3) RETURNING *';
            const insertValues = ['Test Quiz', 'This is a test quiz.', 1];
            const { rows } = await pool.query(insertQuery, insertValues);
            const quizId = rows[0].id;

            // Retrieve the quiz by id
            const result = await Quiz.getOneQuizById(quizId);

            // Check if the result is a quiz object
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('user_id');
            expect(result.id).toBe(quizId);
            expect(result.title).toBe('Test Quiz');
            expect(result.description).toBe('This is a test quiz.');
            expect(result.user_id).toBe(1);
        });

        test('should throw an error with invalid id', async () => {
            // Try to retrieve a non-existent quiz
            await expect(Quiz.getOneQuizById(999)).rejects.toThrow('Unable to locate quiz.');
        }); 
        
    });
    describe('create', () => {
        test('is a function', () => {
            expect(typeof Quiz.create).toBe('function');
        });
    });
    describe('updateQuizById', () => {
        test('is a function', () => {
            expect(typeof Quiz.prototype.updateQuizById).toBe('function');
        });
    });

    describe('deleteQuizById', () => {
        test('is a function', () => {
            expect(typeof Quiz.prototype.deleteQuizById).toBe('function');
        });
    });
});
