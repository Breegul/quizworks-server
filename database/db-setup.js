const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');
const pool = require('./pool.js');

dotenv.config();

const sqlSetupDatabase = fs.readFileSync(__dirname + '/tables.sql').toString();

async function setupDatabase() {
  const client = await pool.connect();
  try {
    await client.query(sqlSetupDatabase);
    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error creating tables: ', err);
  } finally {
    client.release();
    client.end();
  }
}

setupDatabase();