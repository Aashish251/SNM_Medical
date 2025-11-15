const { promisePool } = require('../config/database');

exports.addUserRole = async ({
  regId,
  isPresent = null,
  passEntry = null,
  isDeleted = null,
  isAdmin = null,
  remark = null,
  sewaLocationId = null,
  samagamHeldIn = null
}) => {
  let connection;
  try {
    connection = await promisePool.getConnection();

    const boolToTinyInt = (val) => (val === null ? null : val ? 1 : 0);

    const [resultSets] = await connection.query(
      `CALL sp_update_master_user_role(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        regId.toString(), // supports "1" or "1,2,3"
        boolToTinyInt(isPresent),
        boolToTinyInt(passEntry),
        boolToTinyInt(isDeleted),
        boolToTinyInt(isAdmin),
        remark,
        sewaLocationId,
        samagamHeldIn
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
    console.error('❌ approve Service Error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};


exports.getUserProfile = async (userId) => {
  const [results] = await promisePool.execute(
    'CALL sp_get_user_profile(?)',
    [userId]
  );

  const users = results?.[0] || [];

  if (users.length === 0) {
    throw new Error('User not found');
  }

  const user = users[0];

  // DOB handling
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
      : user.state_name || "Not specified";

  return {
    id: user.reg_id,
    name: user.full_name,
    title: user.title || "Mr/Ms",
    email: user.email,
    mobile: user.mobile_no,
    address: user.address || "Not provided",
    dateOfBirth: birthDate ? birthDate.toISOString().split("T")[0] : null,
    age,
    gender: user.gender == 1 ? "Male" : user.gender == 2 ? "Female" : "Other",

    qualification: user.qualification_name,
    department: user.department_name,
    sewaLocation: user.sewalocation_name,
    shiftTime: user.shifttime,
    availableDay: user.available_day,

    experience: user.total_exp || 0,
    previousSewa: user.prev_sewa_perform || "None",
    recommendedBy: user.recom_by || "Not specified",

    samagamHeldIn: user.samagam_held_in,
    certificate: user.certificate_doc_path,
    profileImage: user.profile_img_path,

    isPresent: user.is_present,
    passEntry: user.pass_entry,
    isAdmin: user.is_admin,
    isDeleted: user.is_deleted,
    isApproved: user.is_approved,

    joinedDate: user.created_datetime,
    updatedDate: user.updated_datetime,
    location,
  };
};

exports.updateUserProfile = async (userId, data) => {
  const {
    fullName,
    email,
    mobileNo,
    address,
    stateId,
    cityId,
    departmentId,
    qualificationId
  } = data;

  try {
    const [resultSets] = await promisePool.execute(
      `CALL sp_update_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        fullName,
        email,
        mobileNo,
        address,
        stateId,
        cityId,
        departmentId,
        qualificationId
      ]
    );

    const affected = resultSets?.[0]?.affected_rows || 0;

    return {
      success: affected > 0,
      affectedRows: affected,
      message:
        affected > 0
          ? "Profile updated successfully"
          : "No changes were made or user not found",
    };
  } catch (error) {
    console.error("❌ updateUserProfile Service Error:", error);
    throw error;
  }
};
