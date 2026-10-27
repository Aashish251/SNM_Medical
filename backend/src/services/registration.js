const bcrypt = require("bcryptjs");
const { promisePool } = require("../config/database");
const logger = require("../utils/logger");
const { sanitizeInput } = require("../utils/sanitize");
const { normalizeText, normalizePhone, normalizeEmail, PATTERNS, validators } = require("../utils/validators");
const { ConflictError, ValidationError } = require("../utils/errorHandler");

const BCRYPT_ROUNDS = 12;
const MAX_REGISTRATION_AGE = 120;

const isDatabaseFlagSet = (value) => value === true || value === 1 || value === "1";

const getAgeFromDateOfBirth = (dateOfBirth) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateOfBirth || ""));
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return null;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  if (
    year > currentYear ||
    (year === currentYear && month > currentMonth) ||
    (year === currentYear && month === currentMonth && day > currentDay)
  ) {
    return null;
  }

  let age = currentYear - year;
  if (currentMonth < month || (currentMonth === month && currentDay < day)) age--;

  return age <= MAX_REGISTRATION_AGE ? age : null;
};

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
  const cleanEmail = normalizeEmail(email || "");
  const cleanMobile = normalizePhone(mobileNo || "");

  if (!cleanEmail && !cleanMobile) {
    return { emailExists: false, mobileExists: false, available: true };
  }

  const [rows] = await promisePool.execute(
    `SELECT
      (SELECT COUNT(1) FROM registration_tbl WHERE is_deleted = 0 AND ? <> '' AND LOWER(TRIM(email)) = ?) > 0 AS email_exists,
      (SELECT COUNT(1) FROM registration_tbl WHERE is_deleted = 0 AND ? <> '' AND mobile_no = ?) > 0 AS mobile_exists`,
    [cleanEmail, cleanEmail, cleanMobile, cleanMobile]
  );

  const emailExists = isDatabaseFlagSet(rows[0]?.email_exists);
  const mobileExists = isDatabaseFlagSet(rows[0]?.mobile_exists);

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

  // Required fields must be non-empty and not whitespace-only
  const requiredFields = [
    { label: "Full name", value: fullName },
    { label: "Email", value: email },
    { label: "Password", value: password },
    { label: "Confirm password", value: confirmPassword },
    { label: "Mobile number", value: mobileNo },
    { label: "Date of birth", value: dateOfBirth },
  ];
  for (const { label, value } of requiredFields) {
    if (value === undefined || value === null || typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${label} is required`);
    }
  }

  // Full name: required, letters only with single spaces between words, 2-50 chars
  if (!validators.name(fullName)) {
    throw new Error("Full name should contain only letters with single spaces between words and be between 2 and 50 characters");
  }

  // Email: required, valid format
  if (!validators.email(email)) {
    throw new Error("Invalid email address");
  }

  // Phone: required, valid 10-digit mobile
  if (!validators.mobile(mobileNo)) {
    throw new Error("Invalid mobile number");
  }

  // Experience: numeric only, allow decimals, min 0, max 60
  if (data.experience !== undefined && data.experience !== "" && data.experience !== null) {
    if (!validators.experience(data.experience)) {
      throw new Error("Enter your experience");
    }
  }

  if (getAgeFromDateOfBirth(dateOfBirth) === null) {
    throw new Error("Birthdate must be valid and no more than 120 years ago");
  }
  if (!validators.password(password)) throw new Error("Password must be at least 6 characters");
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  // Required security questions: 2-100 characters after trimming, not whitespace-only
  const securityQuestions = [
    { label: "Favorite food", value: data.favoriteFood },
    { label: "Childhood nickname", value: data.childhoodNickname },
    { label: "Mother's maiden name", value: data.motherMaidenName },
    { label: "Hobbies", value: data.hobbies },
  ];
  for (const { label, value } of securityQuestions) {
    if (value === undefined || value === null || typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${label} is required`);
    }
    if (!validators.securityAnswer(value)) {
      throw new Error(`${label} must be between 2 and 100 characters`);
    }
  }

  // Optional text fields: trimmed, single-spaced, max length 100
  const optionalTextFields = [
    { label: "Last sewa", value: data.lastSewa },
    { label: "Recommended by", value: data.recommendedBy },
    { label: "Samagam held in", value: data.samagamHeldIn },
  ];
  for (const { label, value } of optionalTextFields) {
    if (value && typeof value === "string") {
      const normalized = normalizeText(value);
      if (normalized.length > 100) {
        throw new Error(`${label} must be at most 100 characters`);
      }
      if (!PATTERNS.alphanumericText.test(normalized)) {
        throw new Error(`${label} must contain letters, spaces, and common punctuation`);
      }
    }
  }

  // Address: min 5, max 500, at least one letter
  if (data.address !== undefined && data.address !== null && String(data.address).trim() !== "") {
    if (!validators.address(data.address)) {
      throw new Error("Address must be between 5 and 500 characters and contain at least one letter");
    }
  }

  // Remark: optional, max 500, no whitespace-only
  if (data.remark !== undefined && data.remark !== null && data.remark !== "") {
    if (!validators.remark(data.remark)) {
      throw new Error("Remark cannot contain only spaces and must be at most 500 characters");
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
  // Normalize all string values: trim, collapse whitespace, sanitize
  const data = Object.fromEntries(
    Object.entries(rawUserData).map(([key, value]) => {
      if (typeof value === "string") {
        return [
          key,
          sanitizeInput(value.trim().replace(/\s+/g, " ")),
        ];
      }
      return [key, value];
    })
  );

  data.email = normalizeEmail(data.email);
  data.mobileNo = normalizePhone(data.mobileNo);
  data.password = String(rawUserData.password ?? "").trim();
  data.confirmPassword = String(rawUserData.confirmPassword ?? "").trim();

  // 1. Validation (Fail-fast before DB queries)
  validateUserData(data);

  // 2. Duplicate Check
  const { emailExists, mobileExists } = await findExistingUser({
    email: data.email,
    mobileNo: data.mobileNo,
  });

  const duplicateMessages = [];
  if (emailExists) {
    duplicateMessages.push("Email already registered");
  }
  if (mobileExists) {
    duplicateMessages.push("Mobile number already registered");
  }
  if (duplicateMessages.length > 0) {
    // Use field-specific messages and appropriate HTTP status
    const existingErrors = duplicateMessages.map((msg) => new Error(msg));
    throw existingErrors.length === 1
      ? new Error(duplicateMessages[0])
      : new ValidationError(duplicateMessages.join(". "));
  }

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

exports.validateUserData = validateUserData;

