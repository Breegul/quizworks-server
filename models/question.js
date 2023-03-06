const pool = require('../database/pool.js');

class Question {
    constructor({ question_id, text, quiz_id }) {
        this.id = question_id;
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
            throw new Error('An error occurred while getting a quiz by id.');
        }
    }

    static async getByQuestionId(question_id) {
        try {
            const query = {
                text: "SELECT * FROM questions WHERE question_id = $1;",
                values: [question_id]
            }
            const res = await pool.query(query);
            return res.rows.map(q => new Question(q));
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while getting a quiz by id.');
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
            throw new Error("An error occurred while creating a quiz")
        }
    }

    async deleteQuestion(id) {
        try {
            const query = {
                text: 'DELETE FROM questions WHERE id = $1 RETURNING *;', 
                values: [this.id]
            }
            const res = await pool.query(query);
            console.log(res);
            return new Question(res.rows[0])
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while deleting quiz by id.');
        }
    }

    // async updateQuizById(id, title, description, user_id) {
    //     try {
    //         const query =
    //             'UPDATE quizzes SET title = $2, description = $3, user_id = $4 WHERE id = $1 RETURNING *';
    //         const values = [id, title, description, user_id];
    //         const { rows } = await pool.query(query, values);
    //         if (rows.length !== 1) {
    //             throw new Error('Unable to update quiz.');
    //         }
    //         return rows[0];
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('An error occurred while updating quiz by id.');
    //     }
    // }


}

module.exports = Question;