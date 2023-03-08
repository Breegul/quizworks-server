const { pool } = require('../database/pool.js');

class Quiz {
    constructor({ id, title, description, user_id }) {
        this.id = id;
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
            //console.error(error);
            throw new Error('Unable to locate quiz.');
        }
    }

    static async getAllQuizzesByUserId(user_id) {
        try {
            const query = {
                text: "SELECT * FROM quizzes WHERE user_id = $1;",
                values: [user_id]
            }
            const res = await pool.query(query);
            if (res.rows.length === 0) {
                throw new Error('Unable to locate quiz.');
            }
            return res.rows.map(q => new Quiz(q));
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate quiz.');
        }
    }

    static async getOneQuizById(id) {
        try {
            const query = {
                text: "SELECT * FROM quizzes WHERE id = $1;",
                values: [id]
            }
            const { rows } = await pool.query(query);
            if (rows.length !== 1) {
                throw new Error('Unable to locate quiz.');
            }
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate quiz.');
        }
    }

    static async create(title, description, user_id) {
        try {
            const query = {
                text: "INSERT INTO quizzes (title, description, user_id) VALUES ($1, $2, $3) RETURNING *;",
                values: [title, description, user_id]
            }
            if (!title || !description || !user_id) {
                throw new Error('Missing required data.');
            }
            const { rows } = await pool.query(query);
            if (rows.length !== 1) {
                throw new Error('Unable to update quiz.');
            }
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error("Unable to locate quiz.")
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
            //console.error(error);
            throw new Error('Unable to locate quiz.');
        }
    }

    async deleteQuizById(id) {
        try {
            const checkQuery = 'SELECT * FROM quizzes WHERE id = $1';
            const checkValues = [id];
            const checkResult = await pool.query(checkQuery, checkValues);
            if (checkResult.rows.length !== 1) {
                throw new Error('Unable to locate quiz.');
            }

            const deleteQuery = 'DELETE FROM quizzes WHERE id = $1';
            const deleteValues = [id];
            await pool.query(deleteQuery, deleteValues);
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate quiz.');
        }
    }
}

module.exports = Quiz;