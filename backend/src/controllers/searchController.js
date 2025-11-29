const searchService = require('../services/searchService');
const ExcelJS = require('exceljs');

exports.masterSearch = async (req, res) => {
  try {
    const result = await searchService.masterSearch(req.body);
    const data = result?.data || [];
    const pagination = result?.pagination || {
      current: req.body.page || 1,
      total: 1,
      count: data.length,
      totalRecords: data.length
    };

    res.status(200).json({
      success: true,
      message: `Found ${pagination.totalRecords} record(s)`,
      data,
      pagination
    });
  } catch (error) {
    console.error('Master Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform master search',
      error: error.message
    });
  }
};

// ✅ Export to Excel
exports.exportSearch = async (req, res) => {
  try {
    const result = await searchService.masterSearch({
      ...req.body,
      // ensure page/limit fetch all rows on server side if SP supports it
      page: 1,
      limit: req.body.limit || 1000000
    });

    const data = result?.data || [];

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(200).json({ success: true, message: 'No data to export', data: [] });
    }

    // Create workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Master Search');

    // sanitize / flatten objects and prepare headers
    const firstRow = data[0];
    const keys = Object.keys(firstRow);

    // Create readable headers e.g., fullName -> Full Name
    sheet.columns = keys.map((k) => ({
      header: k
        .replace(/([A-Z])/g, ' $1') // camelCase -> "camel Case"
        .replace(/_/g, ' ')         // snake_case -> "snake case"
        .replace(/\b\w/g, (c) => c.toUpperCase()), // capitalize
      key: k,
      width: 25
    }));

    // write rows (ensure primitive values)
    data.forEach((row) => {
      const safeRow = {};
      keys.forEach((k) => {
        let val = row[k];
        // convert Date objects to ISO strings / readable format
        if (val instanceof Date) val = val.toISOString();
        // convert null/undefined to empty string
        if (val === null || typeof val === 'undefined') val = '';
        // flatten nested objects if necessary
        if (typeof val === 'object' && !(val instanceof Date)) {
          try {
            val = JSON.stringify(val);
          } catch (e) {
            val = String(val);
          }
        }
        safeRow[k] = val;
      });
      sheet.addRow(safeRow);
    });

    // Set headers BEFORE streaming
    const filename = `master_search_export_${Date.now()}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream workbook to response (memory friendly)
    await workbook.xlsx.write(res);
    // write() does not automatically end the response in all versions, so:
    res.end();
  } catch (error) {
    console.error('Export Error (stream):', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Export failed' });
    } else {
      // headers already sent — connection likely aborted by client
      try { res.end(); } catch (_) {}
    }
  }
};

// ✅ Approve user
exports.approveUser = async (req, res) => {
  try {
    const { regId } = req.params;
    const approved = await searchService.approveUser(regId);
    res.json({
      success: approved,
      message: approved ? 'User approved successfully' : 'User not found'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Approval failed' });
  }
};

// ✅ Update selected users
exports.updateSelected = async (req, res) => {
  try {
    const { users } = req.body;
    if (!Array.isArray(users) || users.length === 0)
      return res.status(400).json({ success: false, message: 'No users provided' });

    await searchService.updateSelectedUsers(users);
    res.json({ success: true, message: 'Users updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};
