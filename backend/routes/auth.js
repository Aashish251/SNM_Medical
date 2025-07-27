const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working with SNM Dispensary DB!' });
});

// Login route with correct role mapping
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    console.log('Login attempt:', { email, password, role });
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query registration_tbl directly
    const [users] = await promisePool.execute(
      'SELECT * FROM registration_tbl WHERE email = ? AND is_deleted = 0',
      [email]
    );
    
    console.log('Database query result:', users);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials - User not found' });
    }

    const user = users[0];
    console.log('Found user:', user);
    
    // Check password (your passwords are stored as plain text)
    const isValidPassword = password === user.password;
    
    console.log('Password check:', { provided: password, stored: user.password, valid: isValidPassword });
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials - Wrong password' });
    }

    // Map database user_type to frontend role
    let userRole;
    if (user.user_type === 'admin') {
      userRole = 'Admin';
    } else if (user.user_type === 'ms') {
      userRole = 'Medical Staff';
    } else {
      userRole = 'Medical Staff'; // default
    }

    // Check role if provided (map frontend role to database user_type)
    if (role) {
      const expectedUserType = role === 'Admin' ? 'admin' : 'ms';
      if (user.user_type !== expectedUserType) {
        return res.status(401).json({ 
          message: `Invalid role. User is ${userRole}, but ${role} was selected.` 
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.reg_id, 
        email: user.email,
        role: userRole,
        fullName: user.full_name,
        userType: user.user_type
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('Login successful, generating token for:', user.full_name);
    
    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.reg_id, 
        email: user.email, 
        name: user.full_name,
        role: userRole,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
