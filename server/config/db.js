const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345', 
  database: 'shop_banh_keo',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;