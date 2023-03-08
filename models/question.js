const { pool } = require('../database/pool.js');

class Question {
    constructor({ id, text, quiz_id }) {
        this.id = id;
        this.text = text;
        this.quiz_id = quiz_id;
    }

    // static async getByQuizId(quiz_id) {
    //     try {
    //         const query = {
    //             text: "SELECT * FROM questions WHERE quiz_id = $1;",
    //             values: [quiz_id]
    //         }
    //         const res = await pool.query(query);
    //         return res.rows.map(q => new Question(q));
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('An error occurred while getting a question by quiz_id.');
    //     }
    // }

    static async getByQuizId(quiz_id) {
        try {
            const query = {
                text: "SELECT * FROM questions WHERE quiz_id = $1;",
                values: [quiz_id]
            }
            const { rows } = await pool.query(query);
            return rows.map(q => new Question(q));
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while getting a question by quiz_id.');
        }
    }

    // static async getByQuestionId(question_id) {
    //     try {
    //         const query = {
    //             text: "SELECT * FROM questions WHERE id = $1;",
    //             values: [question_id]
    //         }
    //         const res = await pool.query(query);
    //         return new Question(res.rows[0]);
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('An error occurred while getting a question by id.');
    //     }
    // }

    static async getByQuestionId(question_id) {
        try {
            const query = {
                text: "SELECT * FROM questions WHERE id = $1;",
                values: [question_id]
            }
            const { rows } = await pool.query(query);
            if (rows.length === 0) {
                throw new Error('Question not found');
            }
            return new Question(rows[0]);
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while getting a question by id.');
        }
    }

    // static async create(data) {
    //     try {
    //         const query = {
    //             text: "INSERT INTO questions (text, quiz_id) VALUES ($1, $2) RETURNING *;",
    //             values: [data.text, data.quiz_id]
    //         }
    //         const res = await pool.query(query);
    //         return res.rows[0];
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error("An error occurred while creating a question")
    //     }
    // }

    static async create(text, quizId) {
        try {
            const query = {
                text: "INSERT INTO questions (text, quiz_id) VALUES ($1, $2) RETURNING *;",
                values: [text, quizId]
            }
            const { rows } = await pool.query(query);
            //const { id, text: questionText, quiz_id } = rows[0];
            //return new Question(id, questionText, quiz_id);
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error("An error occurred while creating a question")
        }
    }

    // async destroy() {
    //     try {
    //         const query = {
    //             text: 'DELETE FROM questions WHERE id = $1 RETURNING *;',
    //             values: [this.id]
    //         }
    //         const res = await pool.query(query);
    //         return new Question(res.rows[0])
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('An error occurred while deleting a question.');
    //     }
    // }

    async destroy(questionId) {
        try {
            const query = {
                text: 'DELETE FROM questions WHERE id = $1 RETURNING *;',
                values: [questionId]
            }
            const { rows } = await pool.query(query);
            const { id, text: questionText, quiz_id } = rows[0];
            //return new Question(id, questionText, quiz_id);
            return rows[0].id;
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while deleting a question.');
        }
    }

    // async update(data) {
    //     try {
    //         const query = {
    //             text: "UPDATE questions SET text = $1 WHERE id = $2 RETURNING *;",
    //             values: [data.text, this.id]
    //         }
    //         const res = await pool.query(query);
    //         return new Question(res.rows[0]);
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('An error occurred while editing a question.')
    //     }
    // }

    static async update(idQuestion, textQuestion, quizId) {
        try {
            const queryText = "UPDATE questions SET text = $1, quiz_id = $2 WHERE id = $3 RETURNING *;";
            const queryValues = [textQuestion, quizId, idQuestion];
            const { rows } = await pool.query(queryText, queryValues);
            if (rows.length === 0) {
                throw new Error('Question not found');
            }
            //console.log("rows[0] : ", rows[0]);
            //const { id, text: questionText, quiz_id } = rows[0];
            //return new Question(id, questionText, quiz_id);
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while editing a question.')
        }
    }
}

module.exports = Question;
