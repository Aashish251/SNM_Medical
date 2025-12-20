const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');
const jwtConfig = require('../config/jwt');

exports.login = async ({ role, email, mobileNo, password }) => {
  try {
    const loginIdentifier = email || mobileNo;
    
    if (!loginIdentifier || !password) {
      throw new Error('Invalid request: Email or mobile number and password are required');
    }

    const userType = role?.toLowerCase() === 'admin' ? 'admin' : 'ms';

    const loginId = String(loginIdentifier).trim();

    
    const [spResult] = await promisePool.execute(
      'CALL sp_validate_login(?, ?)',
      [userType, loginId]
    );

    const rows = spResult[0] || [];

    if (!rows.length) {
      throw new Error('Invalid login ID or password');
    }

    const user = rows[0];
   
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid login ID or password');
    }

    
    if (user.is_deleted === 1) {
      throw new Error('Your account has been deactivated.');
    }

    if (user.is_approved !== 1) {
      throw new Error('Your account is not approved yet.');
    }

    if (user.user_type !== userType) {
      throw new Error(
        `You are not authorized to login as ${
          userType === 'admin' ? 'Administrator' : 'Medical Staff'
        }`
      );
    }

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
        role: user.user_type === 'admin' ? 'Administrator' : 'Medical Staff',
        profilePic: user.profile_img_path || '/uploads/default_profile.png',
      },
    };
  } catch (error) {
    // Re-throw authentication errors as-is
    if (error instanceof Error && (
      error.message.includes('Invalid') ||
      error.message.includes('not approved') ||
      error.message.includes('deactivated') ||
      error.message.includes('not authorized')
    )) {
      throw error;
    }
    
    // Log database or other errors and provide generic message
    console.error('Login service error:', error);
    throw new Error('An error occurred during login. Please try again.');
  }
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