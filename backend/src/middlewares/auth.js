const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;


    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please login first.'
      });
    }


    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        logger.warn('Token verification failed', {
          error: err.message,
          errorType: err.name,
          ip: req.ip,
          path: req.path,
        });

        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expired. Please login again.'
          });
        }

        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({
            success: false,
            message: 'Invalid token. Please login again.'
          });
        }

        return res.status(403).json({
          success: false,
          message: 'Token verification failed'
        });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {
    logger.error('Auth middleware error', { error: error.message, path: req.path });
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = authenticateToken;
