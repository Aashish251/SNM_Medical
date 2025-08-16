const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

router.post('/login', async (req, res) => {
  try {
    const { role, email, password } = req.body;

    console.log(' Login attempt for:', email, 'with role:', role);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const [userQuery] = await promisePool.execute(
      'SELECT login_id, user_type, password, reg_id, full_name, email FROM registration_tbl WHERE email = ? AND is_deleted = 0',
      [email.toLowerCase().trim()]
    );

    if (userQuery.length === 0) {
      console.log(' User not found for email:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const userRecord = userQuery[0];
    console.log(' User found:', userRecord.email, 'Type:', userRecord.user_type);

    // Verify password using bcrypt
    let isPasswordValid = false;
    if (userRecord.password.startsWith('$2b$') || userRecord.password.startsWith('$2a$') || userRecord.password.startsWith('$2y$')) {
      isPasswordValid = await bcrypt.compare(password, userRecord.password);
    } else {
      isPasswordValid = password === userRecord.password;
      if (isPasswordValid) {
        console.log('Upgrading plain text password to hashed for user:', userRecord.email);
        const hashedPassword = await bcrypt.hash(password, 12);
        await promisePool.execute(
          'UPDATE registration_tbl SET password = ?, updated_datetime = NOW() WHERE reg_id = ?',
          [hashedPassword, userRecord.reg_id]
        );
      }
    }

    if (!isPasswordValid) {
      console.log(' Invalid password for user:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    //  FIXED: Enhanced role validation with proper mapping
    if (role) {
      const isRoleValid = validateUserRole(userRecord.user_type, role);
      
      if (!isRoleValid) {
        console.log(` Role validation failed: User type '${userRecord.user_type}' cannot access role '${role}'`);
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to access this role' 
        });
      }
      
      console.log(' Role validation passed for:', role);
    }

    console.log(' Password verified and role validated for:', userRecord.email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: userRecord.reg_id, 
        email: userRecord.email, 
        userType: userRecord.user_type 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log(' Login successful for:', userRecord.email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userRecord.reg_id,
        name: userRecord.full_name,
        email: userRecord.email,
        userType: userRecord.user_type,
        role: userRecord.user_type === 'admin' ? 'Administrator' : 'Medical Staff'
      }
    });

  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

//  FIXED: Enhanced role validation function
function validateUserRole(userType, requestedRole) {
  const normalizedUserType = userType.toLowerCase().trim();
  const normalizedRole = requestedRole.toLowerCase().trim();
  
  // Define role groups - each array contains equivalent role names
  const roleGroups = [
    // Admin roles
    ['admin', 'administrator'],
    // Medical staff roles  
    ['ms', 'medical', 'medical staff', 'staff', 'sewadar', 'medical sewadar']
  ];
  
  // Find which group the user's type belongs to
  const userGroup = roleGroups.find(group => group.includes(normalizedUserType));
  
  if (!userGroup) {
    console.log(' User type not found in any role group:', normalizedUserType);
    return false;
  }
  
  // Check if requested role is in the same group
  const isValid = userGroup.includes(normalizedRole);
  
  console.log(` Role validation: UserType '${normalizedUserType}' vs Role '${normalizedRole}' = ${isValid ? 'VALID' : 'INVALID'}`);
  
  return isValid;
}

//  Alternative: Skip role validation entirely (if you prefer)
router.post('/login-simple', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(' Simple login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const [userQuery] = await promisePool.execute(
      'SELECT login_id, user_type, password, reg_id, full_name, email FROM registration_tbl WHERE email = ? AND is_deleted = 0',
      [email.toLowerCase().trim()]
    );

    if (userQuery.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const userRecord = userQuery[0];

    // Verify password
    let isPasswordValid = false;
    if (userRecord.password.startsWith('$2b$') || userRecord.password.startsWith('$2a$') || userRecord.password.startsWith('$2y$')) {
      isPasswordValid = await bcrypt.compare(password, userRecord.password);
    } else {
      isPasswordValid = password === userRecord.password;
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await promisePool.execute(
          'UPDATE registration_tbl SET password = ?, updated_datetime = NOW() WHERE reg_id = ?',
          [hashedPassword, userRecord.reg_id]
        );
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    //  NO ROLE VALIDATION - Just login successfully
    const token = jwt.sign(
      { 
        userId: userRecord.reg_id, 
        email: userRecord.email, 
        userType: userRecord.user_type 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log(' Simple login successful for:', userRecord.email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userRecord.reg_id,
        name: userRecord.full_name,
        email: userRecord.email,
        userType: userRecord.user_type,
        role: userRecord.user_type === 'admin' ? 'Administrator' : 'Medical Staff'
      }
    });

  } catch (error) {
    console.error(' Simple login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Rest of your auth routes...
router.post('/forgot-password', async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    const [rows] = await promisePool.execute('CALL sp_forgot_password_by_mobile(?)', [mobile.trim()]);
    const result = Array.isArray(rows[0]) ? rows[0] : [];

    res.json({
      success: true,
      message: 'If your mobile number is registered, you will receive password reset instructions shortly.'
    });

    if (result.length > 0) {
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      console.log(`🔑 Password reset token for ${mobile}: ${resetToken}`);
    }

  } catch (error) {
    console.error(' Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process password reset request.'
    });
  }
});

module.exports = router;
