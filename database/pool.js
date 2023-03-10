const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: true
});

//module.exports = pool;

module.exports = {
  pool,
};
