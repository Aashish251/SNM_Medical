// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisePool } = require('../config/database');
const { sanitizeInput } = require('../utils/sanitize');
const cors = require('cors');
const jwtConfig = require('../config/jwt');

/**
 * Authenticate user and generate JWT.
 */
exports.login = async ({ role, email, password }) => {
  if (!email || !password) throw new Error('Email and password are required');

  const [rows] = await promisePool.execute(
    'SELECT login_id, user_type, password, reg_id, full_name, email FROM registration_tbl WHERE email = ? AND is_deleted = 0',
    [email.toLowerCase().trim()]
  );

  if (!rows.length) throw new Error('Invalid email or password');
  const user = rows[0];

  // Validate password (hash upgrade if plain text found)
  const isHashed = user.password.startsWith('$2');
  let isValid = false;

  if (isHashed) {
    isValid = await bcrypt.compare(password, user.password);
  } else if (password === user.password) {
    // Upgrade plain text password
    const hashed = await bcrypt.hash(password, 12);
    await promisePool.execute(
      'UPDATE registration_tbl SET password = ?, updated_datetime = NOW() WHERE reg_id = ?',
      [hashed, user.reg_id]
    );
    isValid = true;
  }

  if (!isValid) throw new Error('Invalid email or password');

  // Optional: Validate role if provided
  if (role && !validateRole(user.user_type, role)) {
    throw new Error('You do not have permission to access this role');
  }

  // Generate token
  const token = jwt.sign(
    {
      userId: user.reg_id,
      email: user.email,
      userType: user.user_type,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return {
    token,
    user: {
      id: user.reg_id,
      name: user.full_name,
      email: user.email,
      userType: user.user_type,
      role: user.user_type === 'admin' ? 'Administrator' : 'Medical Staff',
    },
  };
};

/**
 * Simpler login (no role validation)
 */
exports.loginSimple = async ({ email, password }) => {
  if (!email || !password) throw new Error('Email and password are required');

  const [rows] = await promisePool.execute(
    'SELECT login_id, user_type, password, reg_id, full_name, email FROM registration_tbl WHERE email = ? AND is_deleted = 0',
    [email.toLowerCase().trim()]
  );

  if (!rows.length) throw new Error('Invalid email or password');
  const user = rows[0];

  const isHashed = user.password.startsWith('$2');
  let isValid = false;

  if (isHashed) {
    isValid = await bcrypt.compare(password, user.password);
  } else if (password === user.password) {
    const hashed = await bcrypt.hash(password, 12);
    await promisePool.execute(
      'UPDATE registration_tbl SET password = ?, updated_datetime = NOW() WHERE reg_id = ?',
      [hashed, user.reg_id]
    );
    isValid = true;
  }

  if (!isValid) throw new Error('Invalid email or password');

  const token = jwt.sign(
    {
      userId: user.reg_id,
      email: user.email,
      userType: user.user_type,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return {
    token,
    user: {
      id: user.reg_id,
      name: user.full_name,
      email: user.email,
      userType: user.user_type,
      role: user.user_type === 'admin' ? 'Administrator' : 'Medical Staff',
    },
  };
};

/**
 * Forgot password (generate token and log for now).
 */
exports.forgotPassword = async (mobile) => {
  if (!mobile) throw new Error('Mobile number is required');

  const [rows] = await promisePool.execute('CALL sp_forgot_password_by_mobile(?)', [mobile.trim()]);
  const result = Array.isArray(rows[0]) ? rows[0] : [];

  // Always respond success (for privacy)
  if (result.length > 0) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(`Password reset token for ${mobile}: ${resetToken}`);
  }

  return 'If your mobile number is registered, you will receive password reset instructions shortly.';
};

/**
 * Validate role mapping between userType and requested role.
 */
function validateRole(userType, requestedRole) {
  const type = userType.toLowerCase();
  const role = requestedRole.toLowerCase();

  const groups = {
    admin: ['admin', 'administrator'],
    medical: ['ms', 'medical', 'staff', 'sewadar', 'medical staff'],
  };

  return (
    (groups.admin.includes(type) && groups.admin.includes(role)) ||
    (groups.medical.includes(type) && groups.medical.includes(role))
  );
}

