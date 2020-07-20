// connection
const { Pool } = require('pg');
const { database} = require('./keys.js');
const pool = new Pool(database);

module.exports = pool;