const { pool } = require('../database/pool.js');

class Note {
    constructor(note_id, title, content, user_id) {
        this.id = note_id;
        this.title = title;
        this.content = content;
        this.user_id = user_id;
    }

    async getNoteById(id) {
        try {
            const query = 'SELECT * FROM notes WHERE id = $1';
            const values = [id];
            const { rows } = await pool.query(query, values);
            if (rows.length !== 1) {
                throw new Error('Unable to locate note.');
            }
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate note.');
        }
    }

    async getAllByUserId(userId) {
        try {
            const query = 'SELECT * FROM notes WHERE user_id = $1';
            const values = [userId];
            const { rows } = await pool.query(query, values);
            return rows;
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate note.');
        }
    }

    async createNote(title, content, userId) {
        if (!title || !content || !userId) {
            throw new Error('Invalid input.');
        }
        try {
            const query = 'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *';
            const values = [title, content, userId];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate note.');
        }
    }

    async updateNoteById(id, title, content, userId) {
        try {
            const query = 'UPDATE notes SET title = $2, content = $3, user_id = $4 WHERE id = $1 RETURNING *';
            const values = [id, title, content, userId];
            const { rows } = await pool.query(query, values);
            if (rows.length !== 1) {
                throw new Error('Unable to locate note.');
            }
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate note.');
        }
    }

    async deleteNoteById(id) {
        try {
            // Check if the note exists in the database
            const selectQuery = 'SELECT * FROM notes WHERE id = $1';
            const selectValues = [id];
            const { rowCount } = await pool.query(selectQuery, selectValues);
            if (rowCount === 0) {
                throw new Error('Unable to locate note.');
            }
            // Delete the note
            const deleteQuery = 'DELETE FROM notes WHERE id = $1';
            const deleteValues = [id];
            await pool.query(deleteQuery, deleteValues);
        } catch (error) {
            //console.error(error);
            throw new Error('Unable to locate note.');
        }
    }
}

module.exports = Note;