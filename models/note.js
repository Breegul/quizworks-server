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
            console.error(error);
            throw new Error('An error occurred while retrieving task by id');
        }
    }

    async getAllByUserId(userId) {
        try {
            const query = 'SELECT * FROM notes WHERE user_id = $1';
            const values = [userId];
            const { rows } = await pool.query(query, values);
            return rows;
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while retrieving task by id');
        }
    }

    async createNote(title, content, userId) {
        try {
            const query = 'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *';
            const values = [title, content, userId];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while retrieving task by id');
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
            console.error(error);
            throw new Error('An error occurred while retrieving task by id');
        }
    }

    async deleteNoteById(id) {
        try {
            const query = 'DELETE FROM notes WHERE id = $1';
            const values = [id];
            await pool.query(query, values);
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred while retrieving task by id');
        }
    }
}

module.exports = Note;