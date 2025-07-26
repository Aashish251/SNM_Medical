const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/registration', require('./routes/registration')); // New route

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'SNM Dispensary Server is running!' });
});

// Database health check
app.get('/api/health/db', async (req, res) => {
  const isConnected = await testConnection();
  res.status(isConnected ? 200 : 500).json({ 
    message: isConnected ? 'SNM Dispensary Database connected' : 'Database connection failed',
    database: 'snm_dispensary'
  });
});

// Start server
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`SNM Dispensary Server running on port ${PORT}`);
      console.log(`Database: Connected to snm_dispensary`);
      console.log(`Medical Service Management System Ready`);
    });
  } else {
    console.error('Failed to connect to snm_dispensary database. Server not started.');
    process.exit(1);
  }
};

startServer();
