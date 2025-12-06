const bcrypt = require("bcryptjs");
const { promisePool } = require("../config/database");
const { sanitizeInput } = require("../utils/sanitize");
const { validators } = require("../utils/validators");

/**
 * ============================================================
 * 🔽 Get dropdown data (states, departments, qualifications)
 * ============================================================
 */
exports.getDropdownData = async () => {
  let connection;
  try {
    connection = await promisePool.getConnection();

    console.log('Fetching dropdown data: states, departments, qualifications, sewa locations');

    // Get states
    const [statesResult] = await connection.execute('CALL sp_get_state_details(?)', [null]);

    // Get departments
    const [departmentsResult] = await connection.execute('CALL sp_get_department_by_id(?)', [0]);

    // Get qualifications
    const [qualificationsResult] = await connection.execute('CALL sp_get_qualification_by_id(?)', [0]);

    // Get sewa locations
    const [sewaLocationsResult] = await connection.execute('CALL sp_get_sewalocation_by_id(?)', [0]);

    return {
      states: statesResult[0] || [],
      departments: departmentsResult[0] || [],
      qualifications: qualificationsResult[0] || [],
      sewaLocations: sewaLocationsResult[0] || []
    };

  } catch (error) {
    console.error('Dropdown Data Error:', error);
    throw new Error('Failed to fetch dropdown data');
  } finally {
    if (connection) connection.release();
  }
};

/**
 * ============================================================
 * 🏙️ Get cities based on stateId
 * ============================================================
 */
exports.getCitiesByState = async (stateId) => {
  const connection = await promisePool.getConnection();
  try {
    const [cities] = await connection.execute("CALL sp_get_city_details(?)", [stateId]);
    return cities[0] || [];
  } catch (error) {
    console.error("City Fetch Error:", error);
    throw new Error("Unable to fetch cities for the given state");
  } finally {
    connection.release();
  }
};

/**
 * ============================================================
 * 📧 Check if an email already exists
 * ============================================================
 */
exports.checkEmailExists = async (email) => {
  const cleanEmail = sanitizeInput(email.toLowerCase());
  if (!validators.email(cleanEmail)) throw new Error("Invalid email format");

  const [rows] = await promisePool.execute(
    "SELECT reg_id FROM registration_tbl WHERE email = ? AND is_deleted = 0",
    [cleanEmail]
  );
  return rows.length > 0;
};

/**
 * ============================================================
 * 🧾 Register user (without files)
 * ============================================================
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
    userType = "ms",
    title = "Mr",
    gender,
    availability,
    shift, 
    experience = 0,
    lastSewa = "",
    recommendedBy = "",
    samagamHeldIn = "",
    isAaproved = 0 // 
  } = body;

  // ✅ Sanitize inputs
  const data = {
    fullName: sanitizeInput(fullName) || "",
    email: sanitizeInput(email?.toLowerCase()) || "",
    mobileNo: sanitizeInput(mobileNo) || "",
    address: sanitizeInput(address) || "",
    userType: sanitizeInput(userType) || "ms",
    title: sanitizeInput(title) || "Mr",
    lastSewa: sanitizeInput(lastSewa) || "",
    recommendedBy: sanitizeInput(recommendedBy) || "",
    samagamHeldIn: sanitizeInput(samagamHeldIn) || "",
  };

  // ✅ Validation;
  if (password !== confirmPassword) throw new Error("Passwords do not match");
  
  // ✅ Check duplicates
  const [[existingEmail], [existingMobile]] = await Promise.all([
    promisePool.execute(
      "SELECT reg_id FROM registration_tbl WHERE email = ? AND is_deleted = 0",
      [data.email]
    ),
    promisePool.execute(
      "SELECT reg_id FROM registration_tbl WHERE mobile_no = ? AND is_deleted = 0",
      [data.mobileNo]
    ),
  ]);

  if (existingEmail.length > 0) throw new Error("Email already registered");
  if (existingMobile.length > 0) throw new Error("Mobile number already registered");

  // ✅ Prepare data
  const hashedPassword = await bcrypt.hash(password, 60);
  const loginId = `${data.userType}_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;

  // const genderValue =
  //   typeof gender === "string"
  //     ? gender.toLowerCase() === "female"
  //       ? 2
  //       : gender.toLowerCase() === "other" || gender.toLowerCase() === "others"
  //       ? 3
  //       : 1
  //     : gender;

  const paramArr = [
    "insert",
    0,
    data.userType,
    loginId,
    data.title,
    data.fullName,
    data.email,
    hashedPassword,
    data.mobileNo,
    dateOfBirth,
    gender,
    data.address,
    parseInt(stateId) || 0,
    parseInt(cityId) || 0,
    parseInt(qualificationId) || 0,
    parseInt(departmentId) || 0,
    availability,
    shift,
    "",
    "",
    1,
    0,
    1,
    "",
    parseFloat(experience) || 0.0,
    data.lastSewa,
    data.recommendedBy,
    data.samagamHeldIn,
    0,
    "", "", "", "",
    parseInt(isAaproved) || 0 
  ];

  const connection = await promisePool.getConnection();
  try {
    await connection.execute(
      `CALL sp_save_user_profile(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      paramArr
    );

    return {
      success: true,
      message: "Registration successful!",
      data: { email: data.email, fullName: data.fullName, userType: data.userType, loginId },
    };
  } catch (error) {
    console.error("Registration Error:", error);
    throw new Error(error.message || "Registration failed, please try again.");
  } finally {
    connection.release();
  }
};

/**
 * ============================================================
 * 🧾 Register user
 * ============================================================
 */
exports.createUser = async (data = {}, filePaths = {}) => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid registration data provided");
  }

  const {
    userType = "ms",
    loginId = "",
    title = "Mr",
    fullName = "",
    email = "",
    password = "",
    confirmPassword = "",
    mobileNo = "",
    dateOfBirth = "",
    gender = 1,
    address = "",
    stateId = 0,
    cityId = 0,
    qualificationId = 0,
    departmentId = 0,
    availableDayId = 1,
    shiftTimeId = 1,
    isPresent = 1,
    passEntry = 0,
    sewaLocationId = 1,
    remark = "",
    experience = 0,
    lastSewa = "",
    recommendedBy = "",
    samagamHeldIn = "",
    isDeleted = 0,
    favoriteFood = "",
    childhoodNickname = "",
    motherMaidenName = "",
    hobbies = "",
    isAaproved = 0
  } = data;

  // ============================================================
  // ✅ Step 1: Basic Field Validation
  // ============================================================
  const requiredFields = ["fullName", "email", "password", "confirmPassword", "mobileNo", "dateOfBirth"];
  const missing = requiredFields.filter((f) => !data[f]);
  if (missing.length) throw new Error(`Missing required fields: ${missing.join(", ")}`);

  if (password !== confirmPassword) throw new Error("Passwords do not match");

  if (!validators.email(email)) throw new Error("Invalid email address format");
  if (!validators.mobile(mobileNo)) throw new Error("Invalid mobile number format");
  if (!validators.password(password)) throw new Error("Password must be at least 8 characters long");

  // ============================================================
  // ✅ Step 2: Duplicate Check (Email + Mobile)
  // ============================================================
  const cleanEmail = sanitizeInput(email.toLowerCase());
  const cleanMobile = sanitizeInput(mobileNo);

  const connection = await promisePool.getConnection();
  try {
    const [emailRows] = await connection.execute(
      "SELECT reg_id FROM registration_tbl WHERE LOWER(email) = ? AND is_deleted = 0 LIMIT 1",
      [cleanEmail]
    );
    if (emailRows.length > 0) {
      throw new Error("This email address is already registered. Please use another email.");
    }

    const [mobileRows] = await connection.execute(
      "SELECT reg_id FROM registration_tbl WHERE mobile_no = ? AND is_deleted = 0 LIMIT 1",
      [cleanMobile]
    );
    if (mobileRows.length > 0) {
      throw new Error("This mobile number is already registered. Please use another number.");
    }

    // ============================================================
    // ✅ Step 3: Proceed with Registration
    // ============================================================

    const hashedPassword = await bcrypt.hash(password, 12);
    const generatedLoginId =
      loginId || `${userType}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let genderValue = 1;
    if (typeof gender === "string") {
      const lower = gender.toLowerCase();
      if (lower === "female") genderValue = 2;
      else if (lower === "other" || lower === "others") genderValue = 3;
    }

    const paramArr = [
      "insert",
      0,
      userType,
      generatedLoginId,
      title,
      fullName,
      cleanEmail,
      hashedPassword,
      cleanMobile,
      dateOfBirth,
      genderValue,
      address,
      parseInt(stateId) || 0,
      parseInt(cityId) || 0,
      parseInt(qualificationId) || 0,
      parseInt(departmentId) || 0,
      parseInt(availableDayId) || 1,
      parseInt(shiftTimeId) || 1,
      filePaths.profileImagePath || "",
      filePaths.certificatePath || "",
      parseInt(isPresent) || 1,
      parseInt(passEntry) || 0,
      parseInt(sewaLocationId) || 1,
      remark,
      parseFloat(experience) || 0.0,
      lastSewa,
      recommendedBy,
      samagamHeldIn,
      parseInt(isDeleted) || 0,
      favoriteFood,
      childhoodNickname,
      motherMaidenName,
      hobbies,
      parseInt(isAaproved) || 0
    ];

    // Replace undefined → null
    for (let i = 0; i < paramArr.length; i++) {
      if (paramArr[i] === undefined) paramArr[i] = null;
    }

    await connection.execute(
      `CALL sp_save_user_profile(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      paramArr
    );

    return {
      success: true,
      message: "User registered successfully!",
      data: {
        fullName,
        email: cleanEmail,
        userType,
        loginId: generatedLoginId,
        mobileNo: cleanMobile,
        profileImage: filePaths.profileImagePath || "",
        certificate: filePaths.certificatePath || "",
        isAaproved: parseInt(isAaproved) || 0
      },
    };

  } catch (error) {
    console.error("Registration Error:", error);
    throw new Error(error.message || "Registration failed. Please try again.");
  } finally {
    connection.release();
  }
};
