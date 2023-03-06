const { pool } = require('../database/pool.js');
const bcrypt = require('bcrypt');

class User {

    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    async getUserById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async getUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async createUser(username, password, role) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, hash, role];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async updateUser(id, username, password, role) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const query = 'UPDATE users SET username = $2, password = $3, role = $4 WHERE id = $1 RETURNING *';
        const values = [id, username, hash, role];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async deleteUser(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const values = [id];
        await pool.query(query, values);
    }

    async verifyUser(username, password) {
        const user = await getUserByUsername(username);
        if (!user) {
            return null;
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return null;
        }
        return user;
    }
}

module.exports = User;