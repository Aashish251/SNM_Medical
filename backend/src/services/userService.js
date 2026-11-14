const { promisePool } = require('../config/database');
const { getRelativeFilePath, normalizeFilePath } = require('../utils/filePathHelper');
const logger = require('../utils/logger');
const { validators } = require('../utils/validators');

exports.addUserRole = async ({
  regId,
  isPresent = null,
  passEntry = null,
  isDeleted = null,
  isAdmin = null,
  remark = null,
  sewaLocation = null,
  samagamHeldIn = null,
  onduty = null
}) => {
  let connection;
  try {
    connection = await promisePool.getConnection();

    const boolToTinyInt = (val) => {
      if (val === undefined || val === null || val === "") return null;
      if (typeof val === "string") {
        const normalized = val.trim().toLowerCase();
        if (["0", "false", "no"].includes(normalized)) return 0;
        if (["1", "true", "yes"].includes(normalized)) return 1;
      }
      return val ? 1 : 0;
    };
    const normalize = (val) =>
      val === undefined || val === null || val === "" ? null : val;


    const [resultSets] = await connection.query(
      `CALL sp_update_master_user_role(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        regId.toString(), // supports "1" or "1,2,3"
        boolToTinyInt(isPresent),
        boolToTinyInt(passEntry),
        boolToTinyInt(isDeleted),
        boolToTinyInt(isAdmin),
        normalize(remark),
        normalize(sewaLocation),
        normalize(samagamHeldIn),
        normalize(onduty)
      ]
    );

    const affected = resultSets[0]?.[0]?.affected_rows || 0;

    return {
      success: affected > 0,
      message:
        affected > 0
          ? `User role updated successfully for ${affected} record(s)`
          : 'No record updated. Please check user ID or data.',
      affectedRows: affected
    };
  } catch (error) {
    logger.error('addUserRole Service Error', { error: error.message, regId });
    throw error;
  } finally {
    if (connection) connection.release();
  }
};


exports.getUserProfile = async (userId) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error('Invalid user id');
    }

    const [results] = await promisePool.execute(
      'CALL sp_get_user_profile(?)',
      [userId]
    );

    const users = results?.[0] || [];

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];

    // DOB handling - safe parse
    const rawDob = user.dob || user.date_of_birth || null;
    let birthDate = null;
    let age = null;

    if (rawDob) {
      const temp = new Date(rawDob);
      if (!isNaN(temp.getTime())) {
        birthDate = temp;
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        if (
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
      }
    }

    // Location
    const location =
      user.city_name && user.state_name
        ? `${user.city_name}, ${user.state_name}`
        : user.state_name || user.city_name || "Not specified";

    // Helper to safely coerce numeric fields
    const toInt = (val, fallback = 0) => {
      if (val === null || typeof val === 'undefined' || val === '') return fallback;
      const n = Number(val);
      return Number.isNaN(n) ? fallback : n;
    };

    return {
      id: toInt(user.reg_id, 0),

      // basic profile fields (UI naming convention)
      userType: user.user_type || "ms",
      loginId: user.login_id || "",
      title: user.title || "Mr",
      fullName: user.full_name || "",
      email: user.email || "",
      mobileNo: user.mobile_no || "",
      password: "", // never return real password
      confirmPassword: "",

      // date fields
      dateOfBirth: birthDate ? birthDate.toISOString().split("T")[0] : "",
      age: age === null ? null : age,

      // numeric gender as in form: 1/2/3
      gender: user.gender == null ? null : toInt(user.gender, 1),

      // address & ids
      address: user.address || "",
      stateId: toInt(user.state_id, 0),
      cityId: toInt(user.city_id, 0),
      qualificationId: toInt(user.qualification_id, 0),
      departmentId: toInt(user.department_id, 0),

      // day/shift/sewa
      availableDayId: toInt(user.available_day_id, 1),
      shiftTimeId: toInt(user.shifttime_id, 1),

      // flags (ensure numeric 0/1)
      isPresent: toInt(user.is_present, 0),
      passEntry: toInt(user.pass_entry, 0),

      sewaLocation: toInt(user.sewa_location_id, 0),

      // other fields
      remark: user.remark || "",
      experience: user.total_exp || 0,
      lastSewa: user.prev_sewa_perform || "",
      recommendedBy: user.recom_by || "",
      samagamHeldIn: user.samagam_held_in || "",

      isDeleted: toInt(user.is_deleted, 0),
      isApproved: toInt(user.is_approved, 0),

      favoriteFood: user.favorite_food || "",
      childhoodNickname: user.childhood_nickname || "",
      motherMaidenName: user.mother_maiden_name || "",
      hobbies: user.hobbies || "",

      certificate: user.certificate_doc_path || "",
      profileImage: user.profile_img_path || "",

      joinedDate: user.created_datetime || null,
      updatedDate: user.updated_datetime || null,

      // computed / display names (extra fields)
      qualificationName: user.qualification_name || "",
      departmentName: user.department_name || "",
      sewaLocationName: user.sewalocation_name || "",
      shiftTime: user.shifttime || "",
      availableDay: user.available_day || "",
      cityName: user.city_name || "",
      stateName: user.state_name || "",

      // computed location
      location,
    };
  } catch (err) {
    // rethrow — controller will handle status codes / messages
    logger.error('getUserProfile error', { userId, error: err.message });
    throw err;
  }
};
exports.updateUserProfile = async (regId, data) => {
  data = Object.fromEntries(Object.entries(data || {}).map(([key, value]) => [
    key,
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  ]));
  let connection;
  try {
    if (!regId || isNaN(regId)) {
      throw new Error('Invalid registration ID');
    }

    const {
      fullName,
      email,
      mobileNo,
      address,
      stateId,
      cityId,
      departmentId,
      qualificationId,
      availableDayId,
      shiftTimeId,
      profileImage,
      dateOfBirth,
      gender,
      title,
      remark,
      experience,
      lastSewa,
      recommendedBy,
      samagamHeldIn,
      favoriteFood,
      childhoodNickname,
      motherMaidenName,
      hobbies,
      certificate
    } = data;

    let parsedExp = null;
    if (experience !== undefined && experience !== null && experience !== "") {
      const numExp = parseFloat(experience);
      if (isNaN(numExp) || numExp < 0 || numExp > 60) {
        throw new Error("Enter experience between 0 and 50 years");
      }
      parsedExp = Math.round(numExp * 10) / 10;
    }

    // Fetch existing user data to preserve unchanged fields
    const [existingUserResult] = await promisePool.execute(
      'CALL sp_get_user_profile(?)',
      [regId]
    );

    const existingUser = existingUserResult?.[0]?.[0];
    if (!existingUser) {
      throw new Error('User not found');
    }

    for (const [label, value] of Object.entries({
      'Full name': fullName, 'Address': address, 'Last sewa': lastSewa,
      'Recommended by': recommendedBy, 'Samagam held in': samagamHeldIn,
      'Favorite food': favoriteFood, 'Childhood nickname': childhoodNickname,
      "Mother's name": motherMaidenName, 'Hobbies': hobbies, 'Remark': remark,
    })) {
      if (value && typeof value === 'string' && value.trim() && !/[A-Za-z]/.test(String(value))) {
        throw new Error(`${label} must contain at least one letter`);
      }
    }

    if (mobileNo) {
      const [duplicates] = await promisePool.execute(
        'SELECT reg_id FROM registration_tbl WHERE mobile_no = ? AND reg_id <> ? AND is_deleted = 0 LIMIT 1',
        [mobileNo, regId]
      );
      if (duplicates.length) throw new Error('Mobile number already registered');
    }
    if (dateOfBirth && new Date(dateOfBirth) > new Date(new Date().toDateString())) {
      throw new Error('Birthdate cannot be in the future');
    }

    /* --------------------------------------------------------
       Normalize Gender (Dynamic) - only if provided
    -------------------------------------------------------- */
    let genderValue = null;
    if (gender !== null && gender !== undefined && gender !== "") {
      if (typeof gender === "number") {
        genderValue = gender;
      } else if (typeof gender === "string") {
        // Try to parse as number first (e.g., "1", "2", "3")
        const numGender = parseInt(gender, 10);
        if (!isNaN(numGender) && numGender > 0) {
          genderValue = numGender;
        } else {
          // Parse as text (e.g., "male", "female")
          const g = gender.toLowerCase();
          if (g === "male") genderValue = 1;
          else if (g === "female") genderValue = 2;
          else genderValue = 3;
        }
      }
    }

    // Handle profile image path if file was uploaded
    // IMPORTANT: Only update if a new file was provided; otherwise preserve existing
    let profileImagePath = null;
    if (profileImage && typeof profileImage === 'string') {
      // File path already uploaded by controller, use directly
      profileImagePath = profileImage;
    } else if (profileImage && profileImage.filename) {
      // Fallback for multer file object (backward compatibility)
      profileImagePath = getRelativeFilePath(profileImage, 'profile');
    } else {
      // If no new file provided, preserve existing value
      profileImagePath = existingUser.profile_img_path || null;
    }

    // Handle certificate document path if file was uploaded
    // IMPORTANT: Only update if a new file was provided; otherwise preserve existing
    let certificatePath = null;
    if (certificate && typeof certificate === 'string') {
      // File path already uploaded by controller, use directly
      certificatePath = certificate;
    } else if (certificate && certificate.filename) {
      // Fallback for multer file object (backward compatibility)
      certificatePath = getRelativeFilePath(certificate, 'certificates');
    } else {
      // If no new file provided, preserve existing value
      certificatePath = existingUser.certificate_doc_path || null;
    }

    // Helper function to normalize empty values to null
    const normalize = (val) => {
      if (val === null || val === undefined || val === "") {
        return null;
      }
      return val;
    };

    connection = await promisePool.getConnection();

    // Call stored procedure to update user profile
    const [result] = await connection.query(
      `CALL sp_save_user_profile(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        'update',                         // p_action
        regId,                            // p_id
        existingUser.user_type,           // p_user_type (preserve existing)
        existingUser.login_id,            // p_login_id (preserve existing)
        normalize(title) || existingUser.title,  // p_title (update if provided, else preserve)
        normalize(fullName) || existingUser.name || existingUser.full_name,
        normalize(email) || existingUser.email,
        existingUser.password,            // p_password (do NOT update here)
        normalize(mobileNo) || existingUser.mobile_no,
        normalize(dateOfBirth) || (existingUser.date_of_birth ? new Date(existingUser.date_of_birth).toISOString().split('T')[0] : null),
        genderValue !== null ? genderValue : existingUser.gender,
        normalize(address) || existingUser.address,
        stateId !== undefined && stateId !== null && stateId !== "" ? parseInt(stateId, 10) : existingUser.state_id,
        cityId !== undefined && cityId !== null && cityId !== "" ? parseInt(cityId, 10) : existingUser.city_id,
        qualificationId !== undefined && qualificationId !== null && qualificationId !== "" ? parseInt(qualificationId, 10) : existingUser.qualification_id,
        departmentId !== undefined && departmentId !== null && departmentId !== "" ? parseInt(departmentId, 10) : existingUser.department_id,
        availableDayId ? parseInt(availableDayId, 10) : existingUser.available_day_id,
        shiftTimeId ? parseInt(shiftTimeId, 10) : existingUser.shifttime_id,
        profileImagePath,  // Now always has a value (new file, existing file, or null)
        certificatePath,   // Now always has a value (new file, existing file, or null)
        existingUser.is_present,          // p_is_present (no change)
        existingUser.pass_entry,          // p_pass_entry (no change)
        existingUser.sewa_location_id,    // p_sewa_location_id (no change)
        normalize(remark) ?? existingUser.remark,
        parsedExp !== null ? parsedExp : (existingUser.total_exp ? parseFloat(existingUser.total_exp) : null),
        normalize(lastSewa) ?? existingUser.prev_sewa_perform,
        normalize(recommendedBy) ?? existingUser.recom_by,
        samagamHeldIn !== undefined ? normalize(samagamHeldIn) : existingUser.samagam_held_in,
        existingUser.is_deleted,          // p_is_deleted (no change)
        favoriteFood !== undefined ? normalize(favoriteFood) : existingUser.favorite_food,
        childhoodNickname !== undefined ? normalize(childhoodNickname) : existingUser.childhood_nickname,
        motherMaidenName !== undefined ? normalize(motherMaidenName) : existingUser.mother_maiden_name,
        hobbies !== undefined ? normalize(hobbies) : existingUser.hobbies,
        existingUser.is_approved,         // p_is_approved (don't change here)
      ]
    );

    const affected = result?.affectedRows || 0;

    // Debug log to see what SP returns
    logger.debug('SP Update Result', {
      regId,
      affectedRows: affected,
    });

    if (!affected) throw new Error('User not found or no changes made');

    return {
      success: true,
      message: 'Profile updated successfully',
      affectedRows: affected
    };
  } catch (error) {
    logger.error('updateUserProfile Service Error', { regId, error: error.message });
    throw error;
  } finally {
    if (connection) connection.release();
  }
};
