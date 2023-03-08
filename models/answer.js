const { pool } = require('../database/pool.js');

class Answer {
    constructor({ id, text, is_correct, question_id }) {
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
            const { rows } = await pool.query(query);
            return rows.map(a => new Answer(a));
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while getting an answer by question_id.');
        }
    }

    static async getByAnswerId(answer_id) {
        try {
            const query = {
                text: "SELECT * FROM answers WHERE id = $1;",
                values: [answer_id]
            }
            const { rows } = await pool.query(query);
            if (rows.length !== 1) {
                throw new Error('Unable to locate answer.');
            }
            //return new Answer(res.rows[0]);
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while getting an answer by id.');
        }
    }

    static async create(text, is_correct, question_id) {
        try {
            const query = {
                text: "INSERT INTO answers (text, is_correct, question_id) VALUES ($1, $2, $3) RETURNING *;",
                values: [text, is_correct, question_id]
            }
            const { rows } = await pool.query(query);
            if (rows.length !== 1) {
                throw new Error('Unable to locate answer.');
            }
            //console.log(rows[0]);
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error("An error occurred while creating an answer")
        }
    }

    static async destroy(deleteId) {
        try {
            const query = {
                text: 'DELETE FROM answers WHERE id = $1 RETURNING *;',
                values: [deleteId]
            }
            const { rows } = await pool.query(query);
            if (rows.length !== 1) {
                throw new Error('Unable to locate answer.');
            }
            //return new Answer(res.rows[0])
            return rows[0].id;
        } catch (error) {
            console.log(error);
            throw new Error('An error occurred while deleting an answer.');
        }
    }

    static async update(text, is_correct, answerId) {
        // console.error("text : ", text);
        // console.error("is_correct : ", is_correct);
        // console.error("answerId : ", answerId);
        try {
            // find answer by id, that it exists in the database
            const queryFind = 'SELECT * FROM answers WHERE id = $1';
            const valuesFind = [answerId];
            const res = await pool.query(queryFind, valuesFind);
            const foundRows = res.rows[0];
            console.log("found", foundRows);
            //console.error("foundRows[0] : ", foundRows[0]);
            if (foundRows.length === 0) {
                throw new Error('User not found');
            }

            // update
            const queryText = 'UPDATE answers SET text = $1, is_correct = $2 WHERE id = $3 RETURNING *;';
            const values = [text, is_correct, answerId];
            // This line below needs fixing. Code: #####
            const { rows } = await pool.query(queryText, values);
            //console.error("rows[0] : ", rows);
            if (rows.length !== 1) {
                throw new Error('Unable to locate answer.');
            }
            //console.error("rows[0] : ", rows[0]);
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('An error occurred while updating an answer.')
        }
    }
}

module.exports = Answer;