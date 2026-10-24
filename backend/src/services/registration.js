const bcrypt = require("bcryptjs");
const { promisePool } = require("../config/database");
const { sanitizeInput } = require("../utils/sanitize");
const { validators } = require("../utils/validators");
const logger = require("../utils/logger");

const BCRYPT_ROUNDS = 12;

const GENDER_MAP = {
  male: 1,
  female: 2,
  other: 3,
};

/**
 * Normalizes gender input from string or number to standard ID
 */
const normalizeGender = (gender) => {
  const parsed = parseInt(gender, 10);
  if (!isNaN(parsed) && parsed > 0) return parsed;
  return GENDER_MAP[String(gender || "").toLowerCase()] || 1;
};

/**
 * Checks existing registration by email or mobile number
 */
const findExistingUser = async ({ email = "", mobileNo = "" } = {}) => {
  const cleanEmail = email ? String(email).trim().toLowerCase() : "";
  const cleanMobile = mobileNo ? String(mobileNo).trim() : "";

  if (!cleanEmail && !cleanMobile) {
    return { emailExists: false, mobileExists: false, available: true };
  }

  const [rows] = await promisePool.execute(
    `SELECT email, mobile_no FROM registration_tbl
     WHERE is_deleted = 0 AND ((? <> '' AND LOWER(email) = ?) OR (? <> '' AND mobile_no = ?))
     LIMIT 2`,
    [cleanEmail, cleanEmail, cleanMobile, cleanMobile]
  );

  const emailExists = Boolean(cleanEmail && rows.some((row) => row.email && row.email.toLowerCase() === cleanEmail));
  const mobileExists = Boolean(cleanMobile && rows.some((row) => row.mobile_no && String(row.mobile_no) === cleanMobile));

  return {
    emailExists,
    mobileExists,
    available: !emailExists && !mobileExists,
  };
};

/**
 * Builds the parameter array for sp_save_user_profile
 */
const buildUserProfileParams = ({ data, filePaths, hashedPassword, loginId, genderValue }) => [
  "insert",
  0,
  data.userType || "ms",
  loginId,
  data.title || "Mr",
  data.fullName,
  data.email,
  hashedPassword,
  data.mobileNo,
  data.dateOfBirth,
  genderValue,
  data.address || "",
  parseInt(data.stateId, 10) || 0,
  parseInt(data.cityId, 10) || 0,
  parseInt(data.qualificationId, 10) || 0,
  parseInt(data.departmentId, 10) || 0,
  parseInt(data.availableDayId, 10) || 0,
  parseInt(data.shiftTimeId, 10) || 0,
  filePaths.profileImagePath || "",
  filePaths.certificatePath || "",
  parseInt(data.isPresent, 10) || 0,
  parseInt(data.passEntry, 10) || 0,
  parseInt(data.sewaLocationId, 10) || 0,
  "", // placeholder required by stored procedure
  parseFloat(data.experience) || 0,
  data.lastSewa || "",
  data.recommendedBy || "",
  data.samagamHeldIn || "",
  0,  // placeholder required by stored procedure
  data.favoriteFood || "",
  data.childhoodNickname || "",
  data.motherMaidenName || "",
  data.hobbies || "",
  parseInt(data.isAaproved, 10) || 0,
];

/**
 * Validates user data before persisting
 */
const validateUserData = (data) => {
  const { fullName, email, password, confirmPassword, mobileNo, dateOfBirth } = data;

  if (!fullName || !email || !password || !confirmPassword || !mobileNo || !dateOfBirth) {
    throw new Error("Required fields are missing");
  }

  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(fullName)) {
    throw new Error("Full name should contain letters with single spaces between words");
  }

  if (!validators.email(email)) throw new Error("Invalid email address");
  if (!validators.mobile(mobileNo)) throw new Error("Invalid mobile number");
  if (new Date(dateOfBirth) > new Date(new Date().toDateString())) {
    throw new Error("Birthdate cannot be in the future");
  }
  if (!validators.password(password)) throw new Error("Password must be at least 6 characters");
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  const textFieldsToCheck = {
    "Full name": fullName,
    "Address": data.address,
    "Last sewa": data.lastSewa,
    "Recommended by": data.recommendedBy,
    "Samagam held in": data.samagamHeldIn,
    "Favorite food": data.favoriteFood,
    "Childhood nickname": data.childhoodNickname,
    "Mother's name": data.motherMaidenName,
    "Hobbies": data.hobbies,
  };

  for (const [label, val] of Object.entries(textFieldsToCheck)) {
    if (val && !/[A-Za-z]/.test(String(val))) {
      throw new Error(`${label} must contain at least one letter`);
    }
  }
};

/**
 * Fetches all dropdown master data in parallel
 */
exports.getDropdownData = async () => {
  const [
    [states],
    [departments],
    [qualifications],
    [sewaLocations],
    [availableDays],
    [shiftTimes],
  ] = await Promise.all([
    promisePool.execute("CALL sp_get_state_details(?)", [null]),
    promisePool.execute("CALL sp_get_department_by_id(?)", [0]),
    promisePool.execute("CALL sp_get_qualification_by_id(?)", [0]),
    promisePool.execute("CALL sp_get_sewalocation_by_id(?)", [0]),
    promisePool.execute("CALL sp_get_available_day_by_id(?)", [0]),
    promisePool.execute("CALL sp_get_shifttime_by_id(?)", [0]),
  ]);

  return {
    states: states[0] || [],
    departments: departments[0] || [],
    qualifications: qualifications[0] || [],
    sewaLocations: sewaLocations[0] || [],
    shiftTimes: shiftTimes[0] || [],
    availableDays: availableDays[0] || [],
  };
};

/**
 * Fetches cities for a given state
 */
exports.getCitiesByState = async (stateId) => {
  const [cities] = await promisePool.execute("CALL sp_get_city_details(?)", [stateId]);
  return cities[0] || [];
};

/**
 * Checks if email already exists
 */
exports.checkEmailExists = async (email) => {
  const { emailExists } = await findExistingUser({ email });
  return emailExists;
};

/**
 * Checks availability of email and mobile number
 */
exports.checkRegistrationAvailability = async ({ email, mobileNo } = {}) => {
  return findExistingUser({ email, mobileNo });
};

/**
 * Creates and registers a new user
 */
exports.createUser = async (rawUserData = {}, filePaths = {}) => {
  // Normalize and trim strings
  const data = Object.fromEntries(
    Object.entries(rawUserData).map(([key, value]) => [
      key,
      typeof value === "string" ? sanitizeInput(value.trim().replace(/\s+/g, " ")) : value,
    ])
  );

  data.email = data.email ? data.email.toLowerCase() : "";
  data.password = String(rawUserData.password ?? "").trim();
  data.confirmPassword = String(rawUserData.confirmPassword ?? "").trim();

  // 1. Validation (Fail-fast before DB queries)
  validateUserData(data);

  // 2. Duplicate Check
  const { emailExists, mobileExists } = await findExistingUser({
    email: data.email,
    mobileNo: data.mobileNo,
  });

  if (emailExists) throw new Error("Email already registered");
  if (mobileExists) throw new Error("Mobile number already registered");

  // 3. Normalize values and hash password
  const genderValue = normalizeGender(data.gender);
  const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const userType = data.userType || "ms";
  const loginId = `${userType}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // 4. Build parameter array and execute stored procedure
  const paramArr = buildUserProfileParams({
    data,
    filePaths,
    hashedPassword,
    loginId,
    genderValue,
  });

  await promisePool.execute(
    `CALL sp_save_user_profile(${paramArr.map(() => "?").join(",")})`,
    paramArr
  );

  logger.info("User registered successfully", { email: data.email, loginId });

  return {
    success: true,
    message: "User registered successfully",
    data: { email: data.email, loginId },
  };
};
