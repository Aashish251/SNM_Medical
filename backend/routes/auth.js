const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

// Test route

// Login route using stored procedure
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    console.log('Login attempt:', { email, role });
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Determine user_type based on role
    let user_type = 'ms'; // medical staff
    if (role === 'Admin') {
      user_type = 'admin';
    }

    // Use stored procedure for login validation
    const [results] = await promisePool.execute(
      'CALL sp_validate_login(?, ?, ?)',
      [user_type, email, password]
    );

    if (results.length === 0 || results[0].length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0][0]; // First result set, first row
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.reg_id, 
        email: email,
        role: user.user_type === 'admin' ? 'Admin' : 'Medical Staff',
        fullName: user.full_name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.reg_id, 
        email: email, 
        name: user.full_name,
        role: user.user_type === 'admin' ? 'Admin' : 'Medical Staff',
        qualification: user.qualification_id,
        department: user.department_id,
        mobile: user.mobile_no
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot password route using stored procedure
router.post('/forgot-password', async (req, res) => {
  try {
    const { mobile_no } = req.body;
    
    if (!mobile_no) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    // Use stored procedure for password recovery
    const [results] = await promisePool.execute(
      'CALL sp_forgot_password_by_mobile(?)',
      [mobile_no]
    );

    if (results.length === 0 || results[0].length === 0) {
      return res.status(404).json({ message: 'Mobile number not found' });
    }

    const user = results[0][0];
    
    res.json({
      success: true,
      message: 'User found',
      data: {
        login_id: user.login_id,
        // Don't send actual password in production - send reset link instead
        password: user.password
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
