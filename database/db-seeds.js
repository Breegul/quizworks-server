const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');
const { pool } = require('./pool.js');

dotenv.config();

const sqlSeedDatabase = fs.readFileSync(__dirname + '/seeds.sql').toString();

async function seedDatabase(done) {
  const client = await pool.connect();
  try {
    await client.query(sqlSeedDatabase);
    if (!done) {
      console.log('Sample data added successfully.');
    }
    if (done) {
      done();
    }
  } catch (err) {
    console.error('Error adding sample data: ', err);
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
  seedDatabase();
}

//seedDatabase();

// Export for testing purposes
module.exports = seedDatabase;