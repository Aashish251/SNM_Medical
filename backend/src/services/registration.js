const bcrypt = require('bcryptjs');
const { promisePool } = require('../config/database');
const { sanitizeInput } = require('../utils/sanitize');
const { validators } = require('../utils/validators');

/** Safely fallback undefined to null or other types */
function safe(val, fallback = null) {
  return val !== undefined ? val : fallback;
}

/**
 * Get dropdown data (states, departments, qualifications)
 */
exports.getDropdownData = async () => {
  try {
    const [states] = await promisePool.execute('CALL sp_get_state_details(?)', [null]);
    const [departments] = await promisePool.execute('CALL sp_get_department_by_id(?)', [0]);
    const [qualifications] = await promisePool.execute('CALL sp_get_qualification_by_id(?)', [0]);
    return {
      states: states[0] || [],
      departments: departments[0] || [],
      qualifications: qualifications[0] || [],
    };
  } catch (error) {
    throw new Error('Unable to fetch dropdown data');
  }
};

/**
 * Get cities based on stateId
 */
exports.getCitiesByState = async (stateId) => {
  const connection = await promisePool.getConnection();
  try {
    const [cities] = await connection.execute('CALL sp_get_city_details(?)', [stateId]);
    return cities[0] || [];
  } catch (error) {
    throw new Error('Unable to fetch cities for the given state');
  } finally {
    connection.release();
  }
};

/**
 * Check if an email already exists
 */
exports.checkEmailExists = async (email) => {
  const cleanEmail = sanitizeInput(email.toLowerCase());
  if (!validators.email(cleanEmail)) throw new Error('Invalid email format');
  const [rows] = await promisePool.execute(
    'SELECT reg_id FROM registration_tbl WHERE email = ? AND is_deleted = 0',
    [cleanEmail]
  );
  return rows.length > 0;
};

/**
 * Register a new user
 */
exports.registerUser = async (body) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    mobileNo,
    dateOfBirth,
    address,
    stateId,
    cityId,
    departmentId,
    qualificationId,
    userType = 'ms',
    title = 'Mr',
    gender = 1,
    experience = 0,
    lastSewa = '',
    recommendedBy = '',
    samagamHeldIn = '', // required
  } = body;

  // Step 1: Sanitize input
  const data = {
    fullName: sanitizeInput(fullName) || '',
    email: sanitizeInput(email?.toLowerCase()) || '',
    mobileNo: sanitizeInput(mobileNo) || '',
    address: sanitizeInput(address) || '',
    userType: sanitizeInput(userType) || 'ms',
    title: sanitizeInput(title) || 'Mr',
    lastSewa: sanitizeInput(lastSewa) || '',
    recommendedBy: sanitizeInput(recommendedBy) || '',
    samagamHeldIn: sanitizeInput(samagamHeldIn) || '',
  };

  // Step 2: Validation
  if (!data.fullName || !data.email || !password || !data.mobileNo)
    throw new Error('Full name, email, password, and mobile number are required');
  if (!validators.email(data.email))
    throw new Error('Invalid email address');
  if (!validators.mobile(data.mobileNo))
    throw new Error('Invalid mobile number');
  if (!validators.password(password))
    throw new Error('Password must be at least 8 characters long');
  if (password !== confirmPassword)
    throw new Error('Passwords do not match');
  if (!dateOfBirth)
    throw new Error('Date of birth is required');

  // Step 3: Check duplicates
  const [[existingEmail], [existingMobile]] = await Promise.all([
    promisePool.execute('SELECT reg_id FROM registration_tbl WHERE email = ? AND is_deleted = 0', [data.email]),
    promisePool.execute('SELECT reg_id FROM registration_tbl WHERE mobile_no = ? AND is_deleted = 0', [data.mobileNo]),
  ]);
  if (existingEmail.length > 0)
    throw new Error('Email already registered');
  if (existingMobile.length > 0)
    throw new Error('Mobile number already registered');

  // Step 4: Prepare user data
  const hashedPassword = await bcrypt.hash(password, 12);
  const loginId = `${data.userType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const genderValue =
    typeof gender === 'string'
      ? gender.toLowerCase() === 'male'
        ? 1
        : gender.toLowerCase() === 'female'
        ? 2
        : 3
      : gender;

  const paramArr = [
    'INSERT', 0,
    data.userType || 'ms',
    loginId || '',
    data.title || 'Mr',
    data.fullName,
    data.email,
    hashedPassword,
    data.mobileNo,
    dateOfBirth, // never null now
    genderValue,
    data.address,
    parseInt(stateId) || 0,
    parseInt(cityId) || 0,
    parseInt(qualificationId) || 0,
    parseInt(departmentId) || 0,
    1, 1, '', '',
    1, 0, 1, '',
    parseFloat(experience) || 0.0,
    data.lastSewa,
    data.recommendedBy,
    data.samagamHeldIn,
    0
  ];

  // Final cleanup: enforce no undefined
  for (let i = 0; i < paramArr.length; ++i) {
    if (paramArr[i] === undefined) paramArr[i] = null;
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.execute(
      `CALL sp_save_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      paramArr
    );
    return {
      success: true,
      message: 'Registration successful!',
      data: {
        email: data.email,
        fullName: data.fullName,
        userType: data.userType,
        loginId,
      },
    };
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error(error.message || 'Registration failed, please try again.');
  } finally {
    connection.release();
  }
};

/**
 * Create a user with file paths (optional for admin upload etc)
 */
exports.createUser = async (data, filePaths) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    mobileNo,
    dateOfBirth,
    address,
    stateId,
    cityId,
    departmentId,
    qualificationId,
    userType = 'ms',
    title = 'Mr',
    gender = 1,
    experience = 0,
    lastSewa = '',
    recommendedBy = '',
    samagamHeldIn = '',
  } = data;
  const dob = data.dateOfBirth || data.birthdate || null;

  if (!dob) {
    throw new Error('Date of birth is required');
  }

  if (password !== confirmPassword) throw new Error('Passwords do not match');

  const hashedPassword = await bcrypt.hash(password, 12);
  const loginId = `${userType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // Convert gender text → number
  let genderValue = 1;
  if (typeof gender === 'string') {
    const lower = gender.toLowerCase();
    if (lower === 'female') genderValue = 2;
    else if (lower === 'other' || lower === 'others') genderValue = 3;
  }

  const paramArr = [
    'INSERT', 0,
    userType || 'ms',
    loginId || '',
    title || 'Mr',
    fullName || '',
    email || '',
    hashedPassword,
    mobileNo || '',
    dob, // ✅ Corrected: now always has a valid date
    genderValue,
    address || '',
    parseInt(stateId) || 0,
    parseInt(cityId) || 0,
    parseInt(qualificationId) || 0,
    parseInt(departmentId) || 0,
    1, 1, '', '',
    1, 0, 1, '',
    parseFloat(experience) || 0.0,
    lastSewa || '',
    recommendedBy || '',
    samagamHeldIn || '',
    0
  ];

  for (let i = 0; i < paramArr.length; ++i) {
    if (paramArr[i] === undefined) paramArr[i] = null;
  }

  const [result] = await promisePool.execute(
    `CALL sp_save_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    paramArr
  );

  return {
    email,
    fullName,
    profileImage: filePaths.profileImagePath || '',
    certificate: filePaths.certificatePath || '',
  };
};

