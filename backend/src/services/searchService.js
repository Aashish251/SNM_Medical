const { promisePool } = require('../config/database');
const ExcelJS = require('exceljs');

const toCamelCase = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const camelKey = key
      .toLowerCase()
      .replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  });
  return newObj;
};

exports.getSewaLocations = async () => {
  let connection;
  try {
    connection = await promisePool.getConnection();
    const [resultSets] = await connection.execute(
      `CALL sp_get_sewalocation_by_id(?)`,
      [0] // 0 => get all sewa locations
    );
    const results = resultSets[0] || resultSets;
    return results.map(toCamelCase);
  } catch (error) {
    console.error('❌ getSewaLocations Error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

exports.masterSearch = async ({
  searchKey = null,
  departmentId = null,
  qualificationId = null,
  sewaLocationId = null,
  cityId = null,
  stateId = null,
  isPresent = null,
  passEntry = null,
  limit = 10,
  page = 1,
  sortBy = 'fullName',
  sortOrder = 'ASC'
}) => {
  const offset = (page - 1) * limit;
  let connection;

  try {
    connection = await promisePool.getConnection();

    const [resultSets] = await connection.execute(
      `CALL sp_master_search(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        searchKey,
        departmentId,
        qualificationId,
        sewaLocationId,
        cityId,
        stateId,
        isPresent,
        passEntry,
        page,   // ✅ new
        limit   // ✅ new
      ]
    );


    let results = resultSets[0] || resultSets;

    // Convert to camelCase for frontend
    results = results.map(toCamelCase);

    results = results.map((row) => ({
      ...row,
      sewaLocationId: row.sewaLocationId || null,
      isPresent: row.isPresent === 'YES' ? 1 : 0,
      passEntry: row.passEntry === 'YES' ? 1 : 0
    }));

    // ✅ Safe sorting
    results.sort((a, b) => {
      const fieldA = (a?.[sortBy] ?? '').toString().toLowerCase();
      const fieldB = (b?.[sortBy] ?? '').toString().toLowerCase();
      if (!fieldA && !fieldB) return 0;
      if (!fieldA) return 1;
      if (!fieldB) return -1;
      return sortOrder === 'ASC'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });

    // ✅ Pagination
    const totalRecords = results.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const paginated = results.slice(offset, offset + limit);
    const currentCount = paginated.length;
    
    return { data: paginated, total: results.length };
  } catch (error) {
    console.error('Master Search Service Error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// ✅ Export to Excel
exports.exportToExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Master Search Data');

  if (!data.length) return null;

  sheet.columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key,
    width: 25
  }));

  data.forEach((row) => sheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

// ✅ Approve user
exports.approveUser = async (regId) => {
  const [result] = await promisePool.execute(
    `UPDATE registration_tbl SET is_approved = 1 WHERE reg_id = ?`,
    [regId]
  );
  return result.affectedRows > 0;
};

// ✅ Update selected users' values
exports.updateSelectedUsers = async (userUpdates) => {
  const queries = userUpdates.map((u) =>
    promisePool.execute(
      `UPDATE registration_tbl 
       SET is_present = ?, pass_entry = ?, department_id = ?, qualification_id = ? 
       WHERE reg_id = ?`,
      [u.is_present, u.pass_entry, u.department_id, u.qualification_id, u.reg_id]
    )
  );

  await Promise.all(queries);
  return true;
};