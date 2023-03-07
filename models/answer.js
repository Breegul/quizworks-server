const {pool} = require('../database/pool.js');

class Answer {
    constructor({id, text, is_correct, question_id}) {
        this.id = id;
        this.text = text;
        this.is_correct = is_correct;
        this.question_id = question_id;
    }

    static async getByQuestionId(question_id) {
        try {
            const query = {
                text: "SELECT * FROM answers WHERE question_id = $1;",
                values: [question_id]
            }
            const res = await pool.query(query);
            return res.rows.map(a => new Answer(a));
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting an answer by question_id.');
        }
    }

    static async getByAnswerId(answer_id) {
        try {
            const query = {
                text: "SELECT * FROM answers WHERE id = $1;",
                values: [answer_id]
            }
            const res = await pool.query(query);
            return new Answer(res.rows[0]);
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting an answer by id.');
        }
    }

    static async create(data) {
        try {
            const query = {
                text: "INSERT INTO answers (text, is_correct, question_id) VALUES ($1, $2, $3) RETURNING *;",
                values: [data.text, data.is_correct, data.question_id]
            }
            const res = await pool.query(query);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error("An error occurred while creating an answer")
        }
    }

    async destroy() {
        try {
            const query = {
                text: 'DELETE FROM answers WHERE id = $1 RETURNING *;', 
                values: [this.id]
            }
            const res = await pool.query(query);
            return new Answer(res.rows[0])
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while deleting an answer.');
        }
    }

    async update(data) {
        try {
            const query = {
                text: 'UPDATE answers SET text = $1, is_correct = $2 WHERE id = $3 RETURNING *;',
                values: [data.text, data.is_correct, this.id]
            }
            const res = await pool.query(query);
            return new Answer(res.rows[0]);
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while updating an answer.')
        }
    }
}

module.exports = Answer;