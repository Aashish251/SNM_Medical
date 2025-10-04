const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please login first.'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        
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
      console.log(' Authenticated user:', decoded.userId);
      next();
    });

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = authenticateToken;
