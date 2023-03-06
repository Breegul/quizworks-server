const pool = require('../database/pool.js');

class Question {
    constructor({ id, text, quiz_id }) {
        this.id = id;
        this.text = text;
        this.quiz_id = quiz_id;
    }

    static async getByQuizId(quiz_id) {
        try {
            const query = {
                text: "SELECT * FROM questions WHERE quiz_id = $1;",
                values: [quiz_id]
            }
            const res = await pool.query(query);
            return res.rows.map(q => new Question(q));
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting a question by quiz_id.');
        }
    }

    static async getByQuestionId(question_id) {
        try {
            const query = {
                text: "SELECT * FROM questions WHERE id = $1;",
                values: [question_id]
            }
            const res = await pool.query(query);
            return new Question(res.rows[0]);
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting a question by id.');
        }
    }

    static async create(data) {
        try {
            const query = {
                text: "INSERT INTO questions (text, quiz_id) VALUES ($1, $2) RETURNING *;",
                values: [data.text, data.quiz_id]
            }
            const res = await pool.query(query);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error("An error occurred while creating a question")
        }
    }

    async destroy() {
        try {
            const query = {
                text: 'DELETE FROM questions WHERE id = $1 RETURNING *;', 
                values: [this.id]
            }
            const res = await pool.query(query);
            return new Question(res.rows[0])
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while deleting a question.');
        }
    }
}

module.exports = Question;
