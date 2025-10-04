const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced logging format
app.use(morgan('combined', {
  skip: function (req, res) { 
    return res.statusCode < 400 && process.env.NODE_ENV === 'production';
  }
}));

// Request logging for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(` ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Routes with error handling
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/dashboard', require('./routes/dashboard'));
  app.use('/api/registration', require('./routes/registration'));
  app.use('/api/search', require('./routes/search'));
  app.use('/api/dutychart', require('./routes/dutychart'));
  app.use('/api/reports', require('./routes/reports'));
} catch (error) {
  console.error(' Error loading routes:', error.message);
  console.error('Make sure all route files exist in the routes/ directory');
}

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'SNM Dispensary Server is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health/db', async (req, res) => {
  const isConnected = await testConnection();
  res.status(isConnected ? 200 : 500).json({ 
    message: isConnected ? 'SNM Dispensary Database connected' : 'Database connection failed',
    database: 'snm_dispensary',
    timestamp: new Date().toISOString()
  });
});

// API endpoints overview
app.get('/api', (req, res) => {
  res.json({
    message: 'SNM Dispensary API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      authentication: '/api/auth',
      registration: '/api/registration', 
      dashboard: '/api/dashboard',
      search: '/api/search',
      dutychart: '/api/dutychart',
      reports: '/api/reports',
      health: '/health',
      dbHealth: '/api/health/db'
    },
    status: 'Active',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (AFTER all routes)
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unmatched routes (LAST)
app.use('*', (req, res) => {
  console.log(` 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api',
      'GET /health',
      'GET /api/health/db',
      'POST /api/auth/login',
      'POST /api/auth/forgot-password',
      'POST /api/registration/register',
      'GET /api/dashboard/stats',
      'GET /api/search/master-search',
      'GET /api/dutychart/filter',
      'GET /api/reports/daily',
      'GET /api/reports/registration',
      'GET /api/reports/master'
    ],
    timestamp: new Date().toISOString()
  });
});

// Enhanced server startup
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(` SNM Dispensary Server running on port ${PORT}`);
      console.log(` Database: Connected to snm_dispensary`);
      console.log(` Medical Service Management System Ready`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Available APIs:`);
      console.log(`   • Authentication: http://localhost:${PORT}/api/auth`);
      console.log(`   • Registration: http://localhost:${PORT}/api/registration`);
      console.log(`   • Dashboard: http://localhost:${PORT}/api/dashboard`);
      console.log(`   • Search: http://localhost:${PORT}/api/search`);
      console.log(`   • Dutychart: http://localhost:${PORT}/api/dutychart`);
      console.log(`   • Reports: http://localhost:${PORT}/api/reports`);
      console.log(`   • Health: http://localhost:${PORT}/health`);
      console.log(`   • API Overview: http://localhost:${PORT}/api`);
      console.log(` Ready to accept requests!`);
    });
  } else {
    console.error(' Failed to connect to snm_dispensary database. Server not started.');
    process.exit(1);
  }
};

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n Received SIGINT. Gracefully shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Gracefully shutting down...');
  process.exit(0);
});

startServer();
