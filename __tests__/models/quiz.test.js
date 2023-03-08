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
        test('returns an array of Quiz objects', async () => {
            const quizzes = await Quiz.getAllQuizzes();
            expect(Array.isArray(quizzes)).toBe(true);
            expect(quizzes.length).toBeGreaterThan(0);
            quizzes.forEach(quiz => {
                expect(quiz instanceof Quiz).toBe(true);
                expect(quiz).toHaveProperty('id');
                expect(quiz).toHaveProperty('title');
                expect(quiz).toHaveProperty('description');
                expect(quiz).toHaveProperty('user_id');
            });
        });
    });

    describe('getAllQuizzesByUserId', () => {
        test('is a function', () => {
            expect(typeof Quiz.getAllQuizzesByUserId).toBe('function');
        });
        test('should return an array of quiz objects with valid user_id', async () => {
            // Insert a new quiz into the database
            const insertQuery = 'INSERT INTO quizzes (title, description, user_id) VALUES ($1, $2, $3) RETURNING *';
            const insertValues = ['Test Quiz', 'This is a test quiz.', 1];
            const { rows } = await pool.query(insertQuery, insertValues);
            const userId = rows[0].user_id;
            // Retrieve the quizzes by user id
            //const result = await new Quiz({}).getAllQuizzesByUserId(userId);
            const result = await Quiz.getAllQuizzesByUserId(userId);
            // Check if the result is an array of quiz objects
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('title');
            expect(result[0]).toHaveProperty('description');
            expect(result[0]).toHaveProperty('user_id');
            expect(result[0].user_id).toBe(userId);
        });
        test('should throw an error with invalid user_id', async () => {
            // Try to retrieve quizzes with a non-existent user id
            await expect(Quiz.getAllQuizzesByUserId(999)).rejects.toThrow('Unable to locate quiz.');
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
        test('should create a new quiz with valid data', async () => {
            //const quizId = Math.floor(Math.random() * 1000) + 1;
            const quizTitle = 'New Quiz';
            const quizDescription = 'This is a new quiz.';
            const user_id = 1;
            const quiz = await Quiz.create(quizTitle, quizDescription, user_id);
            expect(quiz).toBeDefined();
            expect(quiz).toHaveProperty('id');
            expect(quiz.title).toBe('New Quiz');
            expect(quiz.description).toBe('This is a new quiz.');
            expect(quiz.user_id).toBe(1);
        });
        test('should throw an error when creating a new quiz with missing data', async () => {
            const title = 'New Quiz';
            const description = 'This is a new quiz.';
            await expect(Quiz.create(title, description)).rejects.toThrow('Unable to locate quiz.');
        });
        test('should throw an error when creating a new quiz with invalid data', async () => {
            const title = 123;
            const description = 'This is a new quiz.';
            const user_id = 'invalid';
            await expect(Quiz.create(title, description, user_id)).rejects.toThrow('Unable to locate quiz.');
        });
        test('should throw an error when creating a new quiz with non-existing user_id', async () => {
            const title = 'New Quiz';
            const description = 'This is a new quiz.';
            const user_id = 999;
            await expect(Quiz.create(title, description, user_id)).rejects.toThrow('Unable to locate quiz.');
        });
    });

    describe('updateQuizById', () => {
        test('is a function', () => {
            expect(typeof Quiz.prototype.updateQuizById).toBe('function');
        });
        test('should update quiz with valid data', async () => {
            // Insert a new quiz into the database
            const insertQuery = 'INSERT INTO quizzes (title, description, user_id) VALUES ($1, $2, $3) RETURNING *';
            const insertValues = ['Test Quiz', 'This is a test quiz.', 1];
            const { rows } = await pool.query(insertQuery, insertValues);
            const quizId = rows[0].id;
            // Update the quiz with new data
            const title = 'Updated Quiz Title';
            const description = 'This is an updated quiz.';
            const user_id = 2;
            // if you get any errors, check line below to remove ({})
            const updatedQuiz = await new Quiz({}).updateQuizById(quizId, title, description, user_id);
            // Check if the quiz was updated with the new data
            expect(updatedQuiz).toBeDefined();
            expect(updatedQuiz).toHaveProperty('id');
            expect(updatedQuiz).toHaveProperty('title');
            expect(updatedQuiz).toHaveProperty('description');
            expect(updatedQuiz).toHaveProperty('user_id');
            expect(updatedQuiz.id).toBe(quizId);
            expect(updatedQuiz.title).toBe(title);
            expect(updatedQuiz.description).toBe(description);
            expect(updatedQuiz.user_id).toBe(user_id);
        });
        test('should throw an error with invalid data', async () => {
            // Try to update a non-existent quiz
            await expect(new Quiz({}).updateQuizById(999, 'Updated Quiz Title', 'This is an updated quiz.', 2)).rejects.toThrow('Unable to locate quiz.');
        });
    });

    describe('deleteQuizById', () => {
        test('is a function', () => {
            expect(typeof Quiz.prototype.deleteQuizById).toBe('function');
        });
        test('should delete a quiz with valid id', async () => {
            // Insert a new quiz into the database
            const insertQuery = 'INSERT INTO quizzes (title, description, user_id) VALUES ($1, $2, $3) RETURNING *';
            const insertValues = ['Test Quiz', 'This is a test quiz.', 1];
            const { rows } = await pool.query(insertQuery, insertValues);
            const quizId = rows[0].id;
            // Delete the quiz by id
            await Quiz.prototype.deleteQuizById(quizId);
            // Try to retrieve the quiz by id (it should not exist)
            await expect(Quiz.getOneQuizById(quizId)).rejects.toThrow('Unable to locate quiz.');
        });
        test('should throw an error with invalid id', async () => {
            // Try to delete a non-existent quiz
            await expect(Quiz.prototype.deleteQuizById(999)).rejects.toThrow('Unable to locate quiz.');
        });
    });
});
