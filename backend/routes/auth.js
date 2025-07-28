const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Call stored procedure
    const [rows] = await promisePool.execute('CALL sp_login_user(?)', [email.toLowerCase().trim()]);
    const users = Array.isArray(rows[0]) ? rows[0] : [];

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    if (!user.password || typeof user.password !== 'string') {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let isPasswordValid = false;

    // Check if hashed or plain password
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$') || user.password.startsWith('$2y$')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Plain text fallback, convert to hash upon success
      isPasswordValid = (password === user.password);
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await promisePool.execute(
          'UPDATE registration_tbl SET password = ?, updated_datetime = NOW() WHERE reg_id = ?',
          [hashedPassword, user.reg_id]
        );
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.reg_id, email: user.email, userType: user.user_type },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.reg_id,
        name: user.full_name,
        email: user.email,
        userType: user.user_type,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

module.exports = router;
