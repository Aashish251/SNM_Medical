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
  sortBy = 'r.full_name',
  sortOrder = 'ASC'
}) => {
  const offset = (page - 1) * limit;
  let connection;

  try {
    connection = await promisePool.getConnection();

    const [resultSets] = await connection.execute(
      `CALL sp_master_search(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        searchKey,
        departmentId,
        qualificationId,
        sewaLocationId,
        cityId,
        stateId,
        isPresent,
        passEntry,
        limit
      ]
    );

    let results = resultSets[0] || resultSets;

    results = results.map(toCamelCase);
    // Sorting (in-memory)
    results.sort((a, b) => {
      const fieldA = a[sortBy.split('.').pop()]?.toString().toLowerCase();
      const fieldB = b[sortBy.split('.').pop()]?.toString().toLowerCase();
      return sortOrder === 'ASC'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });

    // Pagination (simulate)
    const paginated = results.slice(offset, offset + limit);

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