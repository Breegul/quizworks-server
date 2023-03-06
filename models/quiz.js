const pool = require('../database/pool.js');

class Quiz {
    constructor({ quiz_id, title, description, user_id }) {
        this.id = quiz_id;
        this.title = title;
        this.description = description;
        this.user_id = user_id;
    }

    static async getAllQuizzes() {
        try {
            const query = "SELECT * FROM quizzes;";
            const res = await pool.query(query);
            return res.rows.map(q => new Quiz(q));
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting a quiz by id.');
        }
    }

    async getAllQuizzesByUserId(user_id) {
        try {
            const query = {
                text: "SELECT * FROM quizzes WHERE user_id = $1;",
                values: [user_id]
            }
            const res = await pool.query(query);
            return res.rows.map(q => new Quiz(q));
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting a quiz by id.');
        }
    }

    async getOneQuizById(id) {
        try {
            const query = {
                text: "SELECT * FROM quizzes WHERE id = $1;",
                values: [id]
            }
            const res = await pool.query(query);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting a quiz by id.');
        }
    }

    static async create(data) {
        try {
            const query = {
                text: "INSERT INTO quizzes (title, description, user_id) VALUES ($1, $2, $3) RETURNING *;",
                values: [data.title, data.description, data.user_id]
            }
            const res = await pool.query(query);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error("An error occurred while creating a quiz")
        }
    }

    async updateQuizById(id, title, description, user_id) {
        try {
            const query =
                'UPDATE quizzes SET title = $2, description = $3, user_id = $4 WHERE id = $1 RETURNING *';
            const values = [id, title, description, user_id];
            const { rows } = await pool.query(query, values);
            if (rows.length !== 1) {
                throw new Error('Unable to update quiz.');
            }
            return rows[0];
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while updating quiz by id.');
        }
    }

    async deleteQuizById(id) {
        try {
            const query = 'DELETE FROM quizzes WHERE id = $1';
            const values = [id];
            await pool.query(query, values);
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while deleting quiz by id.');
        }
    }
}

module.exports = Quiz;