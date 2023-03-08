const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Token = require('../../models/token');
const User = require('../../models/user');
const { pool } = require('../../database/pool');

describe('Token model', () => {

  let token;

  beforeAll(() => {
    // Generate a test token
    const userId = 1;
    const tokenHash = bcrypt.hashSync('testToken', 10);
    const expirationTime = new Date(Date.now() + 3600000).toISOString();
    const createdAt = new Date(Date.now()).toISOString();
    const tokenId = uuidv4();
    // const options = {
    //   year: 'numeric',
    //   month: 'numeric',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    //   hour12: true
    // };
    // const expirationCalc = Math.floor((Date.now() + 3600000) / 1000); // expiration time is 1 hour from now, in Unix timestamp format
    // const expirationTime = new Date(expirationCalc * 1000).toLocaleString('en-US', options); // expiration time is a Unix timestamp, so multiply by 1000 to convert to milliseconds

    //const expirationTime = new Date(Date.now() + 3600000).toISOString();
    //const expirationTime = new Date(Date.now() + 3600000).toLocaleString('en-US', { timeZone: 'Europe/Dublin' }); // 1 hour from now in the database timezone
    //const expirationTime = new Date(Date.now() + 3600000).toLocaleString('en-US', { timeZone: 'Europe/Dublin', hour12: false });

    token = new Token(userId, tokenHash, expirationTime, createdAt, tokenId);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM tokens');
    //await pool.query('DELETE FROM users');
    await pool.end();
  });
  test('constructor is a function', () => {
    expect(typeof Token).toBe('function');
  });
  describe('createToken', () => {
    test('is a function', () => {
      expect(typeof Token.prototype.createToken).toBe('function');
    });
    test('should create a new token in the database', async () => {
      const username = uuidv4();
      const password = "Password-test";
      const role = "student";
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.createUser(username, hashedPassword, role);
      const tokenHash = await bcrypt.hash(uuidv4(), 10);
      const tokenExpirationDate = new Date(Date.now() + 3600000).toISOString();
      const tokenCreateAtDate = new Date(Date.now()).toISOString();
      const tokenId = uuidv4();
      const token = new Token(user.id, tokenHash, tokenExpirationDate, tokenCreateAtDate, tokenId);
      const result = await token.createToken(token.tokenHash);
      expect(result).toBeDefined();
      expect(result.userId).toBeDefined();
      expect(result.tokenHash).toBe(token.tokenHash);
      expect(result.expirationTime.toISOString()).toBe(token.expirationTime);
      expect(result.createdAt.toISOString()).toBe(token.createdAt);
      // Check if the token exists in the database
      const query = 'SELECT * FROM tokens WHERE id = $1';
      //console.log("result.id: ", result.id);
      const values = [result.tokenId];
      //console.log("values: ", values);
      const { rows } = await pool.query(query, values);
      //console.log("rows.length: ", rows.length);
      //console.log("tokenExpirationDate: ", tokenExpirationDate);
      //console.log("result.expirationTime: ", result.expirationTime);
      expect(rows.length).toBe(1);
      expect(rows[0].user_id).toBe(token.userId);
      expect(rows[0].token_hash).toBe(token.tokenHash);
      //expect(rows[0].expiration_time.toISOString()).toEqual(token.expirationTime.toLocaleString('en-US', { timeZone: 'Europe/London' }));
      expect(rows[0].expiration_time.toISOString()).toEqual(token.expirationTime.toLocaleString('en-US', { timeZone: 'Europe/London' }));
      expect(rows[0].created_at.toISOString()).toEqual(token.createdAt.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    });
  });

  describe('getTokenByTokenHash', () => {
    test('is a function', () => {
      expect(typeof Token.prototype.getTokenByTokenHash).toBe('function');
    });
    test('should return a token with a valid token hash', async () => {
      // Generate a test token and insert it into the database
      const userId = 1;
      const tokenHash = bcrypt.hashSync('testToken2', 10);
      const expirationTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      //const expectedExpirationTime = new Date(expirationTime).toLocaleString('en-US', { timeZone: 'Europe/London' });
      const tokenId = uuidv4();
      const tokenCreatedAt = new Date(Date.now()).toISOString();
      const insertQuery = 'INSERT INTO tokens(user_id, token_hash, created_at, expiration_time, id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const insertValues = [userId, tokenHash, tokenCreatedAt, expirationTime, tokenId];
      const { rows } = await pool.query(insertQuery, insertValues);
      const tokenHashToFind = rows[0].token_hash;
      // Retrieve the token by token hash
      const result = await token.getTokenByTokenHash(tokenHashToFind);
      // Check if the result is a token object
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Token);
      expect(result.tokenHash).toBe(tokenHashToFind);
      expect(result.userId).toBe(userId);
      //expect(result.expirationTime.toISOString()).toEqual(token.expirationTime.toLocaleString('en-US', { timeZone: 'Europe/London' }));
      expect(result.expirationTime.toISOString()).toEqual(expirationTime);
    });

    test('should throw an error with an invalid token hash', async () => {
      // Try to retrieve a non-existent token
      await expect(token.getTokenByTokenHash('invalidTokenHash')).rejects.toThrow();
    });
  });

  describe('deleteTokenByTokenHash', () => {
    test('is a function', () => {
      expect(typeof Token.prototype.deleteTokenByTokenHash).toBe('function');
    });
    test('should delete a token with a valid token hash from the database', async () => {
      // Generate a test token and insert it into the database
      const deleteUserId = 1;
      const deleteTokenHash = bcrypt.hashSync('testToken3', 10);
      const deleteExpirationTime = new Date(Date.now() + 3600000).toISOString();
      const deleteCreatedAt = new Date(Date.now()).toISOString();
      const deleteTokenId = uuidv4();
      const insertQuery = 'INSERT INTO tokens(id, user_id, token_hash, expiration_time, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const insertValues = [deleteTokenId, deleteUserId, deleteTokenHash, deleteExpirationTime, deleteCreatedAt];
      const { rows } = await pool.query(insertQuery, insertValues);
      const tokenId = rows[0].id;
      const tokenHashToDelete = rows[0].token_hash;
      // Delete the token by token hash
      //await token.deleteTokenByTokenHash(deleteTokenHash);
      await token.deleteTokenByTokenHash(tokenHashToDelete);
      // Check if the token was deleted from the database
      const query = 'SELECT * FROM tokens WHERE id = $1';
      const values = [tokenId];
      const result = await pool.query(query, values);
      expect(result.rows.length).toBe(0);
    });
    test('should throw an error with an invalid token hash', async () => {
      await expect(token.deleteTokenByTokenHash('invalidTokenHash')).rejects.toThrow();
    });
  });
});
