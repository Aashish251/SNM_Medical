const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authenticateToken = require('../middleware/auth');

// Get dashboard data
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const [data] = await db.execute(
      'SELECT * FROM dashboard_items WHERE user_id = ?',
      [req.user.userId]
    );
    
    res.json({ data });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
