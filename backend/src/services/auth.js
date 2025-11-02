const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');
const jwtConfig = require('../config/jwt');

exports.login = async ({ role, email, password }) => {
  if (!email || !password) throw new Error('Email and password are required');

  const userType = role?.toLowerCase() === 'admin' ? 'admin' : 'ms';
  const loginId = email.trim();

  console.log('\n🔍 [LOGIN DEBUG]');
  console.log('→ Role:', userType);
  console.log('→ Login ID:', loginId);

  // Step 1: Get hashed password from DB
  const [existingRows] = await promisePool.execute(
    'SELECT reg_id, password FROM registration_tbl WHERE (email = ? OR mobile_no = ?) AND user_type = ? AND is_deleted = 0 AND is_approved = 1',
    [loginId, loginId, userType]
  );
  console.log('→ Fetched user count:', existingRows.length);

  if (!existingRows.length) throw new Error('Invalid email or password');

  const hashedPassword = existingRows[0].password;
  console.log('→ Hashed Password (from DB):', hashedPassword);

  // Step 2: Call SP with the same hash
  const [spResult] = await promisePool.execute('CALL sp_validate_login(?, ?, ?)', [
    userType,
    loginId,
    hashedPassword
  ]);
  console.log('→ SP raw result:', JSON.stringify(spResult));

  const rows = spResult[0] || spResult;
  console.log('→ SP user count:', rows.length);

  if (!rows.length) throw new Error('Invalid email or password');

  const userRow = rows[0];

  // Step 3: Validate password
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('→ bcrypt.compare result:', isValid);

  if (!isValid) throw new Error('Invalid email or password');

  // Step 4: Fetch full record
  const [dbRows] = await promisePool.execute(
    'SELECT reg_id, login_id, user_type, full_name, email FROM registration_tbl WHERE reg_id = ?',
    [userRow.reg_id]
  );
  const user = dbRows[0];
  console.log('→ Final user:', user);

  // Step 5: JWT
  const token = jwt.sign(
    {
      userId: user.reg_id,
      email: user.email,
      userType: user.user_type,
    },
    jwtConfig.secret || process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: jwtConfig.expiresIn || '1d' }
  );

  console.log('✅ Login success for', user.email);

  return {
    token,
    user: {
      id: user.reg_id,
      name: user.full_name,
      email: user.email,
      userType: user.user_type,
      role: user.user_type === 'admin' ? 'Administrator' : 'Medical Staff',
    },
  };
};


/**
 * Validate role mapping between userType and requested role
 */
function validateRole(userType, requestedRole) {
  const type = userType.toLowerCase();
  const role = requestedRole.toLowerCase();

  const groups = {
    admin: ['admin', 'administrator'],
    medical: ['ms', 'medical', 'staff', 'sewadar', 'medical staff'],
  };

  return (
    (groups.admin.includes(type) && groups.admin.includes(role)) ||
    (groups.medical.includes(type) && groups.medical.includes(role))
  );
}
