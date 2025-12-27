const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');
const jwtConfig = require('../config/jwt');

exports.login = async ({ role, email, mobileNo, password }) => {
  const loginIdentifier = email || mobileNo;

  if (!loginIdentifier || !password) {
    throw new Error('Please enter your email/mobile number and password.');
  }

  const selectedRole = role?.toLowerCase() === 'admin' ? 'admin' : 'ms';
  const loginId = String(loginIdentifier).trim();
  const isEmail = loginId.includes('@');

  // Call SP (NO role filtering)
  const [spResult] = await promisePool.execute(
    'CALL sp_validate_login(?)',
    [loginId]
  );

  const rows = spResult[0] || [];

  // User not found
  if (!rows.length) {
    throw new Error(
      isEmail
        ? 'This email address is not registered.'
        : 'This mobile number is not registered.'
    );
  }

  const user = rows[0];

  // Password check
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Incorrect password. Please try again.');
  }

  // Status checks
  if (user.is_deleted === 1) {
    throw new Error('Your account has been deactivated. Please contact the administrator.');
  }

  if (user.is_approved !== 1) {
    throw new Error('Your account is not approved yet. Please wait for administrator approval.');
  }

  // ROLE MISMATCH — CORRECT & CLEAR
  if (user.user_type !== selectedRole) {
    if (user.user_type === 'admin') {
      throw new Error(
        'You are an Admin. Please login using the Admin option.'
      );
    } else {
      throw new Error(
        'You are a Medical Staff member. Please login using the Medical Staff option.'
      );
    }
  }

  // 🎟 JWT
  const token = jwt.sign(
    {
      userId: user.reg_id,
      userType: user.user_type,
      loginId: user.login_id
    },
    jwtConfig.secret || process.env.JWT_SECRET,
    { expiresIn: jwtConfig.expiresIn || '1d' }
  );

  return {
    token,
    user: {
      id: user.reg_id,
      name: user.full_name,
      email: user.email,
      userType: user.user_type,
      role: user.user_type === 'admin' ? 'admin' : 'ms',
      profilePic: user.profile_img_path || '/uploads/default_profile.png'
    }
  };
};



/**
 * Step 1: Validate user and security question answers
 */
exports.validateForgotPassword = async ({
  email,
  mobileNo,
  favoriteFood,
  childhoodNickname,
  motherMaidenName,
  hobbies
}) => {
  if (!email || !mobileNo) {
    throw new Error('Email and mobile number are required');
  }

  const [spResult] = await promisePool.execute(
    'CALL sp_checkupdate_forgotpassword(?, ?, ?, ?, ?, ?)',
    [
      email.trim(),
      mobileNo.trim(),
      favoriteFood?.trim() || null,
      childhoodNickname?.trim() || null,
      motherMaidenName?.trim() || null,
      hobbies?.trim() || null
    ]
  );

  const rows = spResult[0] || spResult;
  const result = rows[0];

  if (!result) throw new Error('Unexpected database response');

  if (result.status === 'INVALID EMAIL OR MOBILE NO') {
    return {
      success: false,
      message: 'Invalid email or mobile number.',
      data: result
    };
  }

  if (result.status === 'FAIL') {
    return {
      success: false,
      message: `Only ${result.matched_answers} answer(s) matched. Please try again.`,
      data: result
    };
  }

  // PASS case
  return {
    success: true,
    message: 'Validation successful. You may proceed to reset your password.',
    data: {
      reg_id: result.v_reg_id || result.reg_id,
      matched_answers: result.matched_answers,
      status: result.status
    }
  };
};


/**
 * Step 2: Reset password using reg_id and status (PASS)
 */

exports.resetPassword = async ({ regId, newPassword, confirmPassword, status }) => {
  if (newPassword !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  if (status !== 'PASS') {
    throw new Error('You are not authorized to reset the password.');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Call SP
  const [spResult] = await promisePool.execute('CALL sp_update_password(?, ?, ?)', [
    regId,
    hashedPassword,
    status
  ]);

  // Check response
  const rows = spResult[0] || spResult;
  const result = rows?.[0] || {};

  if (result.status === 'INVALID USER') {
    return {
      success: false,
      message: 'Invalid user ID or operation not permitted.'
    };
  }

  return {
    success: true,
    message: 'Password updated successfully. You can now log in.'
  };
};