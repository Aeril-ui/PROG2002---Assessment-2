require('dotenv').config();

var mysql = require('mysql2/promise');

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'charityevents_db'
});

module.exports = pool;
