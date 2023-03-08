const Answer = require('../../models/answer');
const { pool } = require('../../database/pool.js');

describe('Answer model', () => {
    let answer;

    beforeAll(async () => {
        answer = new Answer({ id: 1, text: "test ans", is_correct: true, question_id: 1 });
    });

    afterAll(async () => {
        await pool.end();
    });

    test('constructor is a function', () => {
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
        test('should create an answer', async () => {
            // Arrange
            const text = 'Example answer';
            const isCorrect = true;
            const questionId = 1;
            // Act
            const createdAnswer = await Answer.create(text, isCorrect, questionId);
            //console.log(createdAnswer);
            // Assert
            expect(createdAnswer.text).toBe(text);
            expect(createdAnswer.is_correct).toBe(isCorrect);
            expect(createdAnswer.question_id).toBe(questionId);
            expect(createdAnswer.id).toBeDefined();
            //Clean up - delete the created answer
            const query = 'DELETE FROM answers WHERE id = $1';
            const values = [createdAnswer.id];
            await pool.query(query, values);
            //await new Answer().destroy(createdAnswer.id);
        });
        test('should throw an error if answer creation fails', async () => {
            // Arrange
            const text = 'Example answer';
            const isCorrect = true;
            const questionId = "invalid";
            await expect(Answer.create(text, isCorrect, questionId)).rejects.toThrow();
        });
    });

    describe('destroy', () => {
        test('is a function', () => {
            expect(typeof Answer.destroy).toBe('function');
        });
        test('should delete an answer from the database', async () => {
            // Arrange
            const answer = await Answer.create('Example answer31111111', true, 2);
            const answerId = answer.id;
            // Act
            const deletedAnswerId = await Answer.destroy(answerId);
            // Assert
            expect(deletedAnswerId).toBe(answerId);
            // Clean up - delete the created answer
            const query = 'DELETE FROM answers WHERE id = $1';
            const values = [deletedAnswerId];
            await pool.query(query, values);
        });
        test('should throw an error if answer deletion fails', async () => {
            // Arrange
            const answer = new Answer({ id: 99999, text: 'Non-existent answer', is_correct: false, question_id: 1 });
            // Act & Assert
            await expect(Answer.destroy()).rejects.toThrow();
        });
    });

    describe('update', () => {
        test('is a function', () => {
            expect(typeof Answer.update).toBe('function');
        });
        test('should update an answer in the database', async () => {
            // Arrange
            const { createdAnswerId } = await Answer.create('Example answer', true, 1);
            const text = 'Example updated answer';
            const isCorrect = false;
            const questionId = 1;
            // Act
            // This line below needs fixing. Code: #####
            const updatedAnswer = await Answer.update(text, isCorrect, createdAnswerId);
            console.log("updatedAnswer: ", updatedAnswer);            
            // Assert
            expect(updatedAnswer.text).toBe(text);
            expect(updatedAnswer.is_correct).toBe(isCorrect);
            expect(updatedAnswer.question_id).toBe(questionId);
            expect(updatedAnswer.id).toBe(createdAnswerId);
            // Clean up - delete the updated answer
            await Answer.destroy(updatedAnswer.id);
        });
        test('should throw an error if answer update fails', async () => {
            // Arrange
            const text = 'Example updated answer';
            const isCorrect = false;
            const updatedAnswer = await Answer.create('Example answer', true, 1);
            // Act & Assert
            await expect(
                Answer.update(text, isCorrect, updatedAnswer.id + 1000)
            ).rejects.toThrow();
            // Clean up - delete the created answer
            await Answer.destroy(updatedAnswer.id);
        });
    });
})