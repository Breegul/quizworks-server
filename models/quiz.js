const pool = require('../database/pool.js');

class Quiz {
    constructor({ quiz_id, title, description, user_id }) {
        this.id = quiz_id;
        this.title = title;
        this.description = description;
        this.user_id = user_id;
    }

    static async getAll() {
        const query = "SELECT * FROM quizzes;";
        const res = await pool.query(query);
        return res.rows.map(q => new Quiz(q));
    }

    static async getById(id) {
        const query = {
            text: "SELECT * FROM quizzes WHERE id = $1;",
            values: [id]
        }
        const res = await pool.query(query);
        return res.rows[0];
    }

    static async getByUserId(user_id) {
        const query = {
            text: "SELECT * FROM quizzes WHERE user_id = $1;",
            values: [user_id]
        }
        const res = await pool.query(query);
        return res.rows.map(q => new Quiz(q));
    }
}

module.exports = Quiz;