const { pool } = require('../database/pool.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


class Token {
  constructor(userId, tokenHash, expirationTime, createdAt, tokenId) {
    this.userId = userId;
    this.tokenHash = tokenHash;
    this.expirationTime = expirationTime;
    this.createdAt = createdAt;
    this.tokenId = tokenId;
  }

  // async createToken() {
  //   try {
  //     const query = 'INSERT INTO tokens(user_id, token_hash, expiration_time) VALUES ($1, $2, $3) RETURNING *';
  //     const values = [this.userId, this.tokenHash, this.expirationTime];
  //     const { rows } = await pool.query(query, values);
  //     const { id, user_id, token_hash, expiration_time } = rows[0];
  //     this.id = id;
  //     this.userId = user_id;
  //     this.tokenHash = token_hash;
  //     this.expirationTime = expiration_time;
  //     return this;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('An error occurred while saving the token');
  //   }
  // }

  // async createToken(userId) {
  //   try {
  //     const token = new Token(uuidv4(), this.user_id, this.tokenHash, this.expirationTime);
  //     const tokenHash = await bcrypt.hash(token, 10);

  //     const expirationTime = new Date(Date.now() + 3600000).toISOString();
  //     const createdAt = new Date().toISOString();

  //     const query = {
  //       text: `
  //         INSERT INTO tokens (user_id, token_hash, created_at, expiration_time)
  //         VALUES ($1, $2, $3, $4)
  //         RETURNING *
  //       `,
  //       values: [userId, tokenHash, createdAt, expirationTime],
  //     };

  //     const { rows } = await pool.query(query);
  //     const [savedToken] = rows;

  //     //return new Token(savedToken.user_id, savedToken.token_hash, savedToken.expiration_time, savedToken.id);
  //     return new Token(savedToken.user_id, token, new Date(savedToken.expiration_time));

  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('An error occurred while saving the token');
  //   }
  // }

  async createToken() {
    try {
      //const tokenHash = await bcrypt.hash(this.tokenHash, 10);
      //const tokenCreatedAt = new Date(Date.now()).toISOString();
      const id = uuidv4();
      const query = {
        text: `
          INSERT INTO tokens (user_id, token_hash, created_at, expiration_time, id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
        values: [this.userId, this.tokenHash, this.createdAt, this.expirationTime, id],
      };

      const { rows } = await pool.query(query);
      //console.log("rows[0].id: ", rows[0].id);
      if (rows.length === 0) {
        throw new Error('User not found');
      }
      const [createdToken] = rows;

      return new Token(createdToken.user_id, createdToken.token_hash, createdToken.expiration_time, createdToken.created_at, createdToken.id);
    } catch (error) {
      //console.error(error);
      throw new Error('An error occurred while saving the token');
    }
  }

  // async getTokenByTokenHash(tokenHash) {
  //   try {
  //     const query = 'SELECT * FROM tokens WHERE token_hash = $1';
  //     const values = [tokenHash];
  //     const { rows } = await pool.query(query, values);
  //     if (rows.length !== 1) {
  //       throw new Error("Unable to locate token by hash.");
  //     }
  //     const { id, user_id, token_hash, expiration_time } = rows[0];
  //     return new Token(user_id, token_hash, expiration_time);
  //   } catch (error) {
  //     //console.error(error);
  //     throw new Error('An error occurred while finding the token by token hash');
  //   }
  // }

  async getTokenByTokenHash(tokenHash) {
    try {
      const query = 'SELECT * FROM tokens WHERE token_hash = $1';
      const values = [tokenHash];
      const { rows } = await pool.query(query, values);
      if (rows.length !== 1) {
        throw new Error("Unable to locate token by hash.");
      }
      const tokenData = rows[0];
      // const [foundToken] = rows;
      // if (!foundToken) {
      //   return null;
      // }
      // const token = {
      //   tokenId: tokenData.id,
      //   userId: tokenData.user_id,
      //   tokenHash: tokenData.token_hash,
      //   expirationTime: new Date(tokenData.expiration_time),
      //   createdAt: tokenData.created_at,
      // };
      // return new Token(token.userId, token.tokenHash, token.expirationTime, token.createdAt, token.tokenId);
      const { id, user_id, token_hash, expiration_time, created_at } = rows[0];
      return new Token(user_id, token_hash, new Date(expiration_time), created_at, id);
      //return new Token(foundToken.user_id, foundToken.token_hash, foundToken.expiration_time);
    } catch (error) {
      throw new Error('An error occurred while finding the token by token hash');
    }
  }

  async deleteTokenByTokenHash(tokenHash) {
    try {
      const query = 'SELECT * FROM tokens WHERE token_hash = $1';
      const values = [tokenHash];
      const result = await pool.query(query, values);
      if (result.rows.length <= 0) {
        throw new Error('Token not found');
      }
      const deletequery = 'DELETE FROM tokens WHERE token_hash = $1';
      const deletevalues = [tokenHash];
      await pool.query(deletequery, deletevalues);
    } catch (error) {
      //console.error(error);
      throw new Error('An error occurred while deleting the token by token hash');
    }
  }
}

module.exports = Token;