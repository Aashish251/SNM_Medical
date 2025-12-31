/**
 * Database path normalization utility
 * Fixes any absolute paths stored in the database and converts them to relative paths
 */

const { promisePool } = require('../config/database');
const { normalizeFilePath } = require('./filePathHelper');

/**
 * Normalize all file paths in the registration_tbl
 * Converts absolute paths like /opt/render/... to relative paths like /uploads/...
 */
exports.normalizeAllFilePaths = async () => {
  let connection;
  try {
    connection = await promisePool.getConnection();

    // Fetch all records with file paths
    const [records] = await connection.execute(
      'SELECT reg_id, profile_img_path, certificate_doc_path FROM registration_tbl WHERE profile_img_path IS NOT NULL OR certificate_doc_path IS NOT NULL'
    );

    if (!records || records.length === 0) {
      return { message: 'No records to normalize', updatedCount: 0 };
    }

    let updatedCount = 0;

    // Process each record
    for (const record of records) {
      const normalizedProfilePath = normalizeFilePath(record.profile_img_path);
      const normalizedCertPath = normalizeFilePath(record.certificate_doc_path);

      // Check if normalization changed anything
      const profileChanged = normalizedProfilePath !== record.profile_img_path;
      const certChanged = normalizedCertPath !== record.certificate_doc_path;

      if (profileChanged || certChanged) {
        await connection.execute(
          'UPDATE registration_tbl SET profile_img_path = ?, certificate_doc_path = ? WHERE reg_id = ?',
          [normalizedProfilePath || null, normalizedCertPath || null, record.reg_id]
        );
        updatedCount++;
        console.log(`Normalized record ${record.reg_id}: profile=${profileChanged}, certificate=${certChanged}`);
      }
    }

    return {
      message: `Successfully normalized file paths for ${updatedCount} record(s)`,
      updatedCount,
      totalRecords: records.length
    };
  } catch (error) {
    console.error('Error normalizing file paths:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Batch normalize file paths for specific user IDs
 */
exports.normalizeUserFilePaths = async (regIds) => {
  let connection;
  try {
    connection = await promisePool.getConnection();

    const idList = Array.isArray(regIds) ? regIds : [regIds];
    let updatedCount = 0;

    for (const regId of idList) {
      const [records] = await connection.execute(
        'SELECT reg_id, profile_img_path, certificate_doc_path FROM registration_tbl WHERE reg_id = ?',
        [regId]
      );

      if (records && records.length > 0) {
        const record = records[0];
        const normalizedProfilePath = normalizeFilePath(record.profile_img_path);
        const normalizedCertPath = normalizeFilePath(record.certificate_doc_path);

        if (normalizedProfilePath !== record.profile_img_path || normalizedCertPath !== record.certificate_doc_path) {
          await connection.execute(
            'UPDATE registration_tbl SET profile_img_path = ?, certificate_doc_path = ? WHERE reg_id = ?',
            [normalizedProfilePath || null, normalizedCertPath || null, regId]
          );
          updatedCount++;
        }
      }
    }

    return { message: `Normalized ${updatedCount} record(s)`, updatedCount };
  } catch (error) {
    console.error('Error normalizing user file paths:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = exports;
