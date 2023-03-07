const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');
const pool = require('./pool.js');

dotenv.config();

const sqlSeedDatabase = fs.readFileSync(__dirname + '/seeds.sql').toString();

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query(sqlSeedDatabase);
    console.log('Sample data added successfully.');
  } catch (err) {
    console.error('Error adding sample data: ', err);
  } finally {
    client.release();
    client.end();
    //pool.end();
  }
}

seedDatabase();

// Export for testing purposes
module.exports = {
  seedDatabase
}