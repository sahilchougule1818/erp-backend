const { Pool } = require('pg');
require('dotenv').config();

// Railway provides DATABASE_URL, use it if available
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || process.env.PGHOST,
        port: process.env.DB_PORT || process.env.PGPORT,
        database: process.env.DB_NAME || process.env.PGDATABASE,
        user: process.env.DB_USER || process.env.PGUSER,
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
      }
);

module.exports = pool;