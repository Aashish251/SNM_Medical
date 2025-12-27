const e = require('express');
const { promisePool } = require('../config/database');

exports.addUserRole = async ({
  regId,
  isPresent = null,
  passEntry = null,
  isDeleted = null,
  isAdmin = null,
  remark = null,
  sewaLocation = null,
  samagamHeldIn = null
}) => {
  let connection;
  try {
    connection = await promisePool.getConnection();

    const boolToTinyInt = (val) => (val === null ? null : val ? 1 : 0); const normalize = (val) =>
    val === undefined || val === null || val === "" ? null : val;


    const [resultSets] = await connection.query(
      `CALL sp_update_master_user_role(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        regId.toString(), // supports "1" or "1,2,3"
        boolToTinyInt(isPresent),
        boolToTinyInt(passEntry),
        boolToTinyInt(isDeleted),
        boolToTinyInt(isAdmin),
        normalize(remark),
        normalize(sewaLocation),     
        normalize(samagamHeldIn) 
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
    console.error(' approve Service Error:', error);
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
    console.error('getUserProfile error:', err);
    throw err;
  }
};
exports.updateUserProfile = async (regId, data) => {
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
      profileImage,
      dateOfBirth,
      gender,
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

    // Fetch existing user data to preserve unchanged fields
    const [existingUserResult] = await promisePool.execute(
      'CALL sp_get_user_profile(?)',
      [regId]
    );

    const existingUser = existingUserResult?.[0]?.[0];
    if (!existingUser) {
      throw new Error('User not found');
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
    let profileImagePath = null;
    if (profileImage) {
      // Get relative path from the uploads directory
      profileImagePath = `/uploads/${profileImage.filename}`;
    }

    // Handle certificate document path if file was uploaded
    let certificatePath = null;
    if (certificate && certificate.filename) {
      certificatePath = `/uploads/${certificate.filename}`;
    } else if (typeof certificate === 'string' && certificate) {
      // If certificate is already a string path, use it as-is
      certificatePath = certificate;
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
        existingUser.title,               // p_title (preserve existing)
        normalize(fullName),              // Only update if provided
        normalize(email),                 // Only update if provided
        existingUser.password,            // p_password (do NOT update here)
        normalize(mobileNo),              // Only update if provided
        normalize(dateOfBirth),           // Only update if provided
        genderValue,                      // Only update if provided
        normalize(address),               // Only update if provided
        stateId ? parseInt(stateId) : null,
        cityId ? parseInt(cityId) : null,
        qualificationId ? parseInt(qualificationId) : null,
        departmentId ? parseInt(departmentId) : null,
        existingUser.available_day_id,   // p_available_day_id (no change)
        existingUser.shifttime_id,       // p_shifttime_id (no change)
        profileImagePath,                 // Only if file uploaded
        certificatePath,                  // Only if file uploaded
        existingUser.is_present,          // p_is_present (no change)
        existingUser.pass_entry,          // p_pass_entry (no change)
        existingUser.sewa_location_id,    // p_sewa_location_id (no change)
        normalize(remark),                // Only update if provided
        experience ? parseFloat(experience) : null,
        normalize(lastSewa),              // Only update if provided
        normalize(recommendedBy),         // Only update if provided
        normalize(samagamHeldIn),         // Only update if provided
        existingUser.is_deleted,          // p_is_deleted (no change)
        normalize(favoriteFood),          // Only update if provided
        normalize(childhoodNickname),     // Only update if provided
        normalize(motherMaidenName),      // Only update if provided
        normalize(hobbies),               // Only update if provided
        existingUser.is_approved,         // p_is_approved (don't change here)
      ]
    );

    const affected = result?.affectedRows || 0;

    // Debug log to see what SP returns
    console.log('SP Update Result:', {
      affectedRows: affected,
      result: result
    });

    if (!affected) throw new Error('User not found or no changes made');

    return {
      success: true,
      message: 'Profile updated successfully',
      affectedRows: affected
    };
  } catch (error) {
    console.error(' updateUserProfile Service Error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};