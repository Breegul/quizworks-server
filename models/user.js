const { pool } = require('../database/pool.js');
const bcrypt = require('bcrypt');

class User {

    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    async getUserById(id) {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const values = [id];
            const { rows } = await pool.query(query, values);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while retrieving user by ID.');
        }
    }

    static async getUserByUsername(username) {
        try {
            const query = 'SELECT * FROM users WHERE username = $1';
            const values = [username];
            const { rows } = await pool.query(query, values);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            return rows[0];
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while retrieving user by ID.');
        }
    }

    static async createUser(username, password, role) {
        try {
            const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
            const values = [username, password, role];
            const { rows } = await pool.query(query, values);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('An error occurred while retrieving user by ID.');
        }
    }

    async updateUser(id, username, password, role) {
        try {
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);
            const query = 'UPDATE users SET username = $2, password = $3, role = $4 WHERE id = $1 RETURNING *';
            const values = [id, username, hash, role];
            const { rows } = await pool.query(query, values);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('An error occurred while retrieving user by ID.');
        }
    }

    async deleteUser(id) {
        try {
            const query = 'DELETE FROM users WHERE id = $1';
            const values = [id];
            await pool.query(query, values);
        } catch (error) {
            //console.error(error);
            throw new Error('An error occurred while retrieving user by ID.');
        }
    }

    static async verifyUser(username, password) {
        try {
            const user = await this.getUserByUsername(username);
            if (!user) {
                throw new Error('User not found');
            }
            // console.log(password);
            // console.log(user.password);
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                //return null;
                throw new Error('User or password incorrect');
            }
            return user;
        } catch (error) {
            console.log(error);
            throw new Error('An error occurred while retrieving user by ID.');
        }
    }
}

module.exports = User;
//module.exports = new User();
