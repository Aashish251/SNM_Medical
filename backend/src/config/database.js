const mysql = require('mysql2');
require('dotenv').config();
const logger = require('../utils/logger');

// Validate required database config
if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
  console.error('FATAL: DB_HOST and DB_PASSWORD must be set in .env');
  process.exit(1);
}

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'snm_dispensary',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
  queueLimit: 0,
  // Production hardening
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000,
});

const promisePool = pool.promise();

const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    logger.info('MySQL Database connected successfully', {
      database: process.env.DB_NAME || 'snm_dispensary',
    });

    // Test a simple query
    await connection.execute('SELECT 1 as test');
    logger.info('Database query test successful');

    connection.release();
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error: error.message });
    return false;
  }
};

// Handle pool events
pool.on('connection', () => {
  logger.debug('New database connection established');
});

pool.on('error', (err) => {
  logger.error('Database pool error', { error: err.message, code: err.code });
});

module.exports = {
  pool,
  promisePool,
  testConnection,
};
