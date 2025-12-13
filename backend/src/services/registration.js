const bcrypt = require("bcryptjs");
const { promisePool } = require("../config/database");
const { sanitizeInput } = require("../utils/sanitize");
const { validators } = require("../utils/validators");
const BCRYPT_ROUNDS = 12; 

/**
 * Fetch available_day map from DB
 * { "Weekdays": 1, "Weekends": 2, ... }
 */
const getAvailableDayMap = async (connection) => {
  const [rows] = await connection.execute(
    "CALL sp_get_available_day_by_id(?)",
    [0]
  );

  const map = {};
  (rows[0] || []).forEach(r => {
    map[r.available_day] = r.id;
  });

  return map;
};

/**
 * Fetch shifttime map from DB
 * { "Morning - 6.00 AM to 12.00 PM": 1, ... }
 */
const getShiftTimeMap = async (connection) => {
  const [rows] = await connection.execute(
    "CALL sp_get_shifttime_by_id(?)",
    [0]
  );

  const map = {};
  (rows[0] || []).forEach(r => {
    map[r.shifttime] = r.id;
  });

  return map;
};


/**
 * Map availability label to ID
 */
const getAvailabilityId = (availability) => {
  if (!availability) return 1; // default
  // If it's already a number, return it
  if (typeof availability === "number" && !isNaN(availability)) {
    return parseInt(availability);
  }
  // Try to map the string label
  return AVAILABILITY_MAP[availability] || 1;
};

/**
 * Map shift label to ID
 */
const getShiftId = (shift) => {
  if (!shift) return 1; // default
  // If it's already a number, return it
  if (typeof shift === "number" && !isNaN(shift)) {
    return parseInt(shift);
  }
  // Try to map the string label
  return SHIFT_MAP[shift] || 1;
};

exports.getDropdownData = async () => {
  const connection = await promisePool.getConnection();
  try {
    const [states] = await connection.execute("CALL sp_get_state_details(?)", [null]);
    const [departments] = await connection.execute("CALL sp_get_department_by_id(?)", [0]);
    const [qualifications] = await connection.execute("CALL sp_get_qualification_by_id(?)", [0]);
    const [sewaLocations] = await connection.execute("CALL sp_get_sewalocation_by_id(?)", [0]);

    return {
      states: states[0] || [],
      departments: departments[0] || [],
      qualifications: qualifications[0] || [],
      sewaLocations: sewaLocations[0] || []
    };
  } finally {
    connection.release();
  }
};

exports.getCitiesByState = async (stateId) => {
  const connection = await promisePool.getConnection();
  try {
    const [cities] = await connection.execute("CALL sp_get_city_details(?)", [stateId]);
    return cities[0] || [];
  } finally {
    connection.release();
  }
};

exports.createUser = async (data = {}, filePaths = {}) => {
  const connection = await promisePool.getConnection();

  try {
      const {
      fullName,
      email,
      password,
      confirmPassword,
      mobileNo,
      dateOfBirth,
      gender,
      address = "",
      stateId,
      cityId,
      departmentId,
      qualificationId,
      availability,      
      shift,             
      isPresent = 0,
      passEntry = 0,
      sewaLocationId = 0,
      experience = 0,
      lastSewa = "",
      recommendedBy = "",
      samagamHeldIn = "",
      favoriteFood = "",
      childhoodNickname = "",
      motherMaidenName = "",
      hobbies = "",
      userType = "ms",
      title = "Mr",
      isAaproved = 0
    } = data;

    const cleanEmail = sanitizeInput(email?.toLowerCase());
    const cleanMobile = sanitizeInput(mobileNo);
    const cleanName = sanitizeInput(fullName);

    /* --------------------------------------------------------
       2️⃣ Validation
    -------------------------------------------------------- */
    if (!cleanName || !cleanEmail || !password || !confirmPassword || !cleanMobile || !dateOfBirth)
      throw new Error("Required fields are missing");

    if (!validators.email(cleanEmail)) throw new Error("Invalid email");
    if (!validators.mobile(cleanMobile)) throw new Error("Invalid mobile number");
    if (!validators.password(password)) throw new Error("Weak password");
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    /* --------------------------------------------------------
       3️⃣ Duplicate Check (O(1) with indexes)
    -------------------------------------------------------- */
    const [[emailExists]] = await connection.execute(
      "SELECT 1 FROM registration_tbl WHERE email = ? AND is_deleted = 0 LIMIT 1",
      [cleanEmail]
    );
    if (emailExists) throw new Error("Email already registered");

    const [[mobileExists]] = await connection.execute(
      "SELECT 1 FROM registration_tbl WHERE mobile_no = ? AND is_deleted = 0 LIMIT 1",
      [cleanMobile]
    );
    if (mobileExists) throw new Error("Mobile number already registered");

    /* --------------------------------------------------------
       4️⃣ Normalize Gender (Dynamic)
    -------------------------------------------------------- */
    let genderValue = null;
    if (typeof gender === "number") genderValue = gender;
    else if (typeof gender === "string") {
      const g = gender.toLowerCase();
      if (g === "male") genderValue = 1;
      else if (g === "female") genderValue = 2;
      else genderValue = 3;
    }

    /* --------------------------------------------------------
        Map Availability and Shift to IDs
    -------------------------------------------------------- */
    const availableDayMap = await getAvailableDayMap(connection);
    const shiftTimeMap = await getShiftTimeMap(connection);

    const availableDayId =
      typeof availability === "number"
        ? availability
        : availableDayMap[availability] || null;

    const shiftTimeId =
      typeof shift === "number"
        ? shift
        : shiftTimeMap[shift] || null;

    /* --------------------------------------------------------
       5️Hash Password + Login ID 
    -------------------------------------------------------- */
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS); // hash password securely with bcrypt 
    const loginId = `${userType}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

      const paramArr = [
      "insert",
      0,
      userType,
      loginId,
      title,
      cleanName,
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
      availableDayId,
      shiftTimeId,
      filePaths.profileImagePath || "",
      filePaths.certificatePath || "",
      parseInt(isPresent) || 0,
      parseInt(passEntry) || 0,
      parseInt(sewaLocationId) || 0,
      "",
      parseFloat(experience) || 0,
      lastSewa,
      recommendedBy,
      samagamHeldIn,
      0,
      favoriteFood,
      childhoodNickname,
      motherMaidenName,
      hobbies,
      parseInt(isAaproved) || 0
    ];

    /* --------------------------------------------------------
       7️⃣ Execute SP
    -------------------------------------------------------- */
    await connection.execute(
      `CALL sp_save_user_profile(${paramArr.map(() => "?").join(",")})`,
      paramArr
    );

    return {
      success: true,
      message: "User registered successfully",
      data: { email: cleanEmail, loginId }
    };

  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  } finally {
    connection.release();
  }
};
