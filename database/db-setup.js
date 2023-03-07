const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');
const { pool } = require('./pool.js');

dotenv.config();

const sqlSetupDatabase = fs.readFileSync(__dirname + '/tables.sql').toString();

async function setupDatabase(done) {
  const client = await pool.connect();
  try {
    await client.query(sqlSetupDatabase);
    if (!done) {
      console.log('Tables created successfully.');
    }
    if (done) {
      done();
    }
  } catch (err) {
    console.error('Error creating tables: ', err);
    if (done) {
      done(err);
    }
  } finally {
    client.release();
    client.end();
    //pool.end();
  }
}

// Call the setupDatabase function if the module is not being imported
if (require.main === module) {
  setupDatabase();
}

//setupDatabase();

// Export for testing purposes
module.exports = setupDatabase;