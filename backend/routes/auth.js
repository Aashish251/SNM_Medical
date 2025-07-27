const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working with SNM Dispensary DB!' });
});

// Enhanced login route with mixed password handling
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);
    console.log('Password provided length:', password?.length);

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user from database
    const [users] = await promisePool.execute(
      'SELECT reg_id, full_name, email, password, user_type FROM registration_tbl WHERE email = ? AND is_deleted = 0',
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];
    console.log('User found:', user.full_name);
    console.log('tored password length:', user.password?.length);
    console.log('Password format:', user.password?.startsWith('$2') ? 'Hashed' : 'Plain text');

    let isPasswordValid = false;
    let needsHashUpdate = false;

    try {
      // CHECK IF PASSWORD IS HASHED OR PLAIN TEXT
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$') || user.password.startsWith('$2y$')) {
        // HASHED PASSWORD - Use bcrypt comparison
        console.log('Using bcrypt comparison for hashed password');
        const normalizedHash = user.password.replace(/^\$2[ay]\$/, '$2b$');
        isPasswordValid = await bcrypt.compare(password.toString(), normalizedHash);
      } else {
        // PLAIN TEXT PASSWORD - Direct comparison (SECURITY RISK)
        console.log('Using plain text comparison - will convert to hash');
        isPasswordValid = (password === user.password);
        needsHashUpdate = true; // Flag to update password to hash
      }
      
      console.log('Password comparison result:', isPasswordValid);
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }

    if (!isPasswordValid) {
      console.log('Password validation failed for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // SECURITY ENHANCEMENT - Convert plain text to hash after successful login
    if (needsHashUpdate) {
      try {
        console.log('Converting plain text password to hash for security...');
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await promisePool.execute(
          'UPDATE registration_tbl SET password = ?, updated_datetime = NOW() WHERE reg_id = ?',
          [hashedPassword, user.reg_id]
        );
        
        console.log('Password successfully converted to hash for user:', user.email);
      } catch (hashError) {
        console.error('Failed to update password hash:', hashError);
        // Don't fail login due to hash update error, just log it
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.reg_id,
        email: user.email,
        userType: user.user_type
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', user.full_name);

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.reg_id,
        name: user.full_name,
        email: user.email,
        userType: user.user_type
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

module.exports = router;
