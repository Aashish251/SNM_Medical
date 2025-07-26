const mysql = require('mysql2');

// Create connection pool with correct MySQL2 options
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin@123',
  database: process.env.DB_NAME || 'snm_dispensary',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timeout: 60000,           
  reconnect: true           
});


const promisePool = pool.promise();

const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('MySQL Database connected successfully to snm_dispensary');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  promisePool,
  testConnection
};
