const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: false
  /*ssl: {
    rejectUnauthorized: false
  }*/
});

//module.exports = pool;

module.exports = {
  pool,
};
