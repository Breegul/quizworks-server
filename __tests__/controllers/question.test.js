const questionController = require("../../controllers/question");

describe('Question Controller', () => {

    describe('getByQuizId', () => {
        test('is a function', () => {
            expect(typeof questionController.getByQuizId).toBe('function');
        });
        test('should return a list of questions for a given quiz ID', async () => {
            // Create a new quiz with some questions
            const quizId = 1;
            const questions = [{ text: 'What is 2+2?', quiz_id: quizId }, { text: 'What is the capital of France?', quiz_id: quizId }, { text: 'Who directed the movie "The Dark Knight"?', quiz_id: quizId }];
            await Question.create(questions);
            // Make a request to the API to get the questions for the quiz
            const response = await request(app)
                .get(`/quizzes/${quizId}/questions`)
                .expect(200);
            // Check that the response contains the correct questions
            const { body } = response;
            expect(body).toHaveLength(3);
            expect(body[0]).toMatchObject({ text: 'What is 2+2?' });
            expect(body[1]).toMatchObject({ text: 'What is the capital of France?' });
            expect(body[2]).toMatchObject({ text: 'Who directed the movie "The Dark Knight"?' });
        });
        test('should return an empty array if no questions are found for the quiz', async () => {
            // Make a request to the API for a quiz that doesn't exist
            const response = await request(app)
                .get('/quizzes/9999/questions')
                .expect(200);
            // Check that the response is an empty array
            const { body } = response;
            expect(body).toHaveLength(0);
        });
        test('should return an error if the quiz ID is not a number', async () => {
            // Make a request to the API with an invalid quiz ID
            const response = await request(app)
                .get('/quizzes/invalid/questions')
                .expect(500);
            // Check that the response contains an error message
            const { body } = response;
            expect(body).toHaveProperty('error');
            expect(body.error).toMatch(/invalid input syntax for integer/);
        });
    });

    describe('getByQuestionId', () => {
        test('is a function', () => {
            expect(typeof questionController.getByQuestionId).toBe('function');
        });
        test('should return the correct question when a valid ID is provided', async () => {
            const question = { id: 1, text: 'What is your name?', quiz_id: 1 };
            const mockReq = { params: { q_id: '1' } };
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Question.getByQuestionId = jest.fn().mockResolvedValue(question);
            await getByQuestionId(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(question);
        });
        test('should return a 500 error when an invalid ID is provided', async () => {
            const mockReq = { params: { q_id: 'abc' } };
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Question.getByQuestionId = jest.fn().mockRejectedValue(new Error('Invalid ID'));
            await getByQuestionId(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
        test('should return a 500 error when an error occurs', async () => {
            const mockReq = { params: { q_id: '1' } };
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Question.getByQuestionId = jest.fn().mockRejectedValue(new Error('Database error'));
            await getByQuestionId(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('create', () => {

        beforeAll(async () => {
            await db.connect();
        });

        afterAll(async () => {
            await db.disconnect();
        });

        beforeEach(async () => {
            await Question.removeAll();
        });

        test('is a function', () => {
            expect(typeof questionController.create).toBe('function');
        });
        test('should create a new question and return it', async () => {
            const quizId = 1;
            const questionData = {
                text: 'What is the capital of France?',
                quiz_id: quizId,
            };
            const res = await request(app)
                .post(`/quizzes/${quizId}/questions`)
                .send(questionData);
            expect(res.status).toBe(201);
            expect(res.body.text).toBe(questionData.text);
            expect(res.body.quiz_id).toBe(questionData.quiz_id);
            const question = await Question.getById(res.body.id);
            expect(question.text).toBe(questionData.text);
            expect(question.quiz_id).toBe(questionData.quiz_id);
        });
        test('should return 500 if an error occurs while creating the question', async () => {
            const quizId = 1;
            const questionData = {
                text: 'What is the capital of France?',
                quiz_id: quizId,
            };
            // Remove the `create` method to simulate an error
            jest.spyOn(Question, 'create').mockImplementation(() => {
                throw new Error('Something went wrong');
            });
            const res = await request(app)
                .post(`/quizzes/${quizId}/questions`)
                .send(questionData);
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Internal server error');
        });
    });

    describe('destroy', () => {

        let question;

        beforeAll(async () => {
            // create a question to be deleted
            question = await Question.create('What is the capital of France?', 1);
        });

        afterAll(async () => {
            // cleanup the created question
            await question.destroy();
        });

        test('is a function', () => {
            expect(typeof questionController.destroy).toBe('function');
        });
        test('DELETE /quizzes/:id/questions/:q_id should delete a question', async () => {
            const response = await request(app)
                .delete(`/quizzes/${question.quiz_id}/questions/${question.id}`)
                .expect(204);
            expect(response.body).toMatchObject({});
            // ensure the question is deleted
            const deletedQuestion = await Question.getByQuestionId(question.id);
            expect(deletedQuestion).toBeNull();
        });
        test('DELETE /quizzes/:id/questions/:q_id should return 404 for non-existing question', async () => {
            const response = await request(app)
                .delete(`/quizzes/${question.quiz_id}/questions/0`)
                .expect(404);
            expect(response.body).toMatchObject({ message: 'Question not found' });
        });
        test('DELETE /quizzes/:id/questions/:q_id should return 500 for server error', async () => {
            const mockFn = jest.spyOn(Question.prototype, 'destroy');
            mockFn.mockImplementation(() => {
                throw new Error('Something went wrong!');
            });
            const response = await request(app)
                .delete(`/quizzes/${question.quiz_id}/questions/${question.id}`)
                .expect(500);
            expect(response.body).toMatchObject({ message: 'Internal server error' });
            mockFn.mockRestore();
        });
    });

    describe('update', () => {

        let question;
        beforeAll(async () => {
          // Create a new question for testing
          question = await Question.create('Test question', 1);
        });
    
        afterAll(async () => {
          // Delete the test question after all tests have run
          await question.destroy();
          await db.end();
        });

        test('is a function', () => {
            expect(typeof questionController.update).toBe('function');
        });
        test('should update a question with valid data', async () => {
            const updatedQuestion = { text: 'Updated test question', quiz_id: 1 };
            const response = await request(app)
              .put(`/questions/${question.id}`)
              .send(updatedQuestion)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200);
            expect(response.body.text).toBe(updatedQuestion.text);
            expect(response.body.quiz_id).toBe(updatedQuestion.quiz_id);
            // Make sure the question was actually updated in the database
            const updatedQuestionData = await Question.getByQuestionId(question.id);
            expect(updatedQuestionData.text).toBe(updatedQuestion.text);
            expect(updatedQuestionData.quiz_id).toBe(updatedQuestion.quiz_id);
          });
          test('should return a 404 error when updating a question that does not exist', async () => {
            const updatedQuestion = { text: 'Updated test question', quiz_id: 1 };
            const response = await request(app)
              .put('/questions/1234')
              .send(updatedQuestion)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(404);
            expect(response.body.message).toBe('Question not found');
          });
          test('should return a 500 error when updating a question with invalid data', async () => {
            const updatedQuestion = { quiz_id: 1 };
            const response = await request(app)
              .put(`/questions/${question.id}`)
              .send(updatedQuestion)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(500);
            expect(response.body.message).toBe('Internal server error');
          });
    });
})