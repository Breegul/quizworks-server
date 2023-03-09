const answerController = require("../../controllers/answer");

describe('Answer controller', () => {
    describe('getByQuestionId', () => {
        test('is a function', () => {
            expect(typeof answerController.getByQuestionId).toBe('function');
        })
    })

    // 'GET /questions/:q_id/answers
    describe('getByAnswerId', () => {

        beforeAll(async () => {
            // create a test question and answers
            await pool.query('INSERT INTO questions (text, quiz_id) VALUES ($1, $2) RETURNING id;', ['test question', 1]);
            const questionId = (await pool.query('SELECT id FROM questions WHERE text = $1;', ['test question'])).rows[0].id;
            await pool.query('INSERT INTO answers (text, is_correct, question_id) VALUES ($1, $2, $3);', ['test answer 1', true, questionId]);
            await pool.query('INSERT INTO answers (text, is_correct, question_id) VALUES ($1, $2, $3);', ['test answer 2', false, questionId]);
        });

        afterAll(async () => {
            // delete the test question and answers
            await pool.query('DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE text = $1);', ['test question']);
            await pool.query('DELETE FROM questions WHERE text = $1;', ['test question']);
            // end the database connection
            pool.end();
        });

        test('is a function', () => {
            expect(typeof answerController.getByAnswerId).toBe('function');
        });
        test('should return all answers for a question', async () => {
            const response = await request(app).get('/questions/1/answers');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty('text', 'test answer 1');
            expect(response.body[0]).toHaveProperty('is_correct', true);
            expect(response.body[1]).toHaveProperty('text', 'test answer 2');
            expect(response.body[1]).toHaveProperty('is_correct', false);
        });
        test('should return an empty array for a question with no answers', async () => {
            // create a new question with no answers
            await pool.query('INSERT INTO questions (text, quiz_id) VALUES ($1, $2) RETURNING id;', ['empty question', 1]);
            const questionId = (await pool.query('SELECT id FROM questions WHERE text = $1;', ['empty question'])).rows[0].id;

            const response = await request(app).get(`/questions/${questionId}/answers`);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(0);

            // delete the empty question
            await pool.query('DELETE FROM questions WHERE text = $1;', ['empty question']);
        });
        test('should return a 404 error for a non-existent question', async () => {
            const response = await request(app).get('/questions/999/answers');
            expect(response.statusCode).toBe(404);
        });
    });

    describe('create', () => {

        beforeAll(async () => {
            await pool.query("DELETE FROM answers;");
        });

        afterAll(async () => {
            await pool.end();
        });

        test('is a function', () => {
            expect(typeof answerController.create).toBe('function');
        });
        test("Should create a new answer and return 201 status code", async () => {
            const question = await Answer.create("What is the capital of France?", true, 1);
            const response = await request(app)
                .post("/questions/1/answers")
                .send({
                    text: "Paris",
                    is_correct: true,
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(201);
            expect(response.body.text).toBe("Paris");
            expect(response.body.is_correct).toBe(true);
            expect(response.body.question_id).toBe(1);

            const result = await Answer.getByAnswerId(response.body.id);
            expect(result.text).toBe("Paris");
            expect(result.is_correct).toBe(true);
            expect(result.question_id).toBe(1);
        });
        test("Should return 500 status code if text is missing", async () => {
            const response = await request(app)
                .post("/questions/1/answers")
                .send({
                    is_correct: true,
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error");
        });
        test("Should return 500 status code if is_correct is missing", async () => {
            const response = await request(app)
                .post("/questions/1/answers")
                .send({
                    text: "Paris",
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error");
        });
        test("Should return 500 status code if question_id is missing", async () => {
            const response = await request(app)
                .post("/questions/1/answers")
                .send({
                    text: "Paris",
                    is_correct: true,
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error");
        });
    });

    describe('destroy', () => {

        let answer;

        beforeAll(async () => {
            // Insert a new answer into the database to test deletion
            const query = {
                text: 'INSERT INTO answers (text, is_correct, question_id) VALUES ($1, $2, $3) RETURNING *;',
                values: ['Test answer', true, 1],
            };
            const { rows } = await pool.query(query);
            answer = new Answer(rows[0]);
        });

        afterAll(async () => {
            // Remove the inserted answer from the database
            const query = {
                text: 'DELETE FROM answers WHERE id = $1;',
                values: [answer.id],
            };
            await pool.query(query);
        });

        test('is a function', () => {
            expect(typeof answerController.destroy).toBe('function');
        });
        test('should delete the answer from the database', async () => {
            // Call the destroy function to delete the answer
            await answer.destroy();

            // Check if the answer was deleted from the database
            const query = {
                text: 'SELECT * FROM answers WHERE id = $1;',
                values: [answer.id],
            };
            const { rows } = await pool.query(query);
            expect(rows).toHaveLength(0);
        });
        test('should throw an error if the answer does not exist', async () => {
            // Call the destroy function with an invalid ID
            const invalidId = 9999;
            const answer = new Answer({ id: invalidId });
            await expect(answer.destroy()).rejects.toThrow('Answer not found');
        });
    });

    describe('update', () => {

        let answer;

        beforeAll(async () => {
            // Create an answer to update
            const createdAnswer = await Answer.create({
                text: 'Sample Answer',
                is_correct: false,
                question_id: 1,
            });
            answer = createdAnswer;
        });

        afterAll(async () => {
            // Delete the answer created for testing
            await answer.destroy();
        });

        test('is a function', () => {
            expect(typeof answerController.update).toBe('function');
        });

        test('should return a 404 error if answer does not exist', async () => {
            const res = await request(app)
                .put(`/questions/1/answers/0`)
                .send({ text: 'Updated Answer', is_correct: true });

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('Answer not found');
        });

        test('should return a 400 error if invalid data is sent', async () => {
            const res = await request(app)
                .put(`/questions/1/answers/${answer.id}`)
                .send({ text: '', is_correct: true });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Missing required data.');
        });
    });
})