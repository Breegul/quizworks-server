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
}

module.exports = Quiz;