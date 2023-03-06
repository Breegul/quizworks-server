const { pool } = require('../database/pool.js');

class Token {
  constructor(userId, tokenHash, expirationTime) {
    this.userId = userId;
    this.tokenHash = tokenHash;
    this.expirationTime = expirationTime;
  }

  async createToken() {
    try {
      const query = 'INSERT INTO tokens(user_id, token_hash, expiration_time) VALUES ($1, $2, $3) RETURNING *';
      const values = [this.userId, this.tokenHash, this.expirationTime];
      const { rows } = await pool.query(query, values);
      const { id, user_id, token_hash, expiration_time } = rows[0];
      this.id = id;
      this.userId = user_id;
      this.tokenHash = token_hash;
      this.expirationTime = expiration_time;
      return this;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while saving the token');
    }
  }

  async getTokenByTokenHash(tokenHash) {
    try {
      const query = 'SELECT * FROM tokens WHERE token_hash = $1';
      const values = [tokenHash];
      const { rows } = await pool.query(query, values);
      if (rows.length !== 1) {
        throw new Error("Unable to locate token by hash.");
      }
      const { id, user_id, token_hash, expiration_time } = rows[0];
      return new Token(user_id, token_hash, expiration_time);
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while finding the token by token hash');
    }
  }

  async deleteTokenByTokenHash(tokenHash) {
    try {
      const query = 'DELETE FROM tokens WHERE token_hash = $1';
      const values = [tokenHash];
      await pool.query(query, values);
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while deleting the token by token hash');
    }
  }
}

module.exports = Token;