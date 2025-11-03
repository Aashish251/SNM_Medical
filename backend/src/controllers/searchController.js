const searchService = require('../services/searchService');

exports.masterSearch = async (req, res) => {
  try {
    const data = await searchService.masterSearch(req.body);
    res.json({
      success: true,
      message: `Found ${data.total} record(s)`,
      ...data
    });
  } catch (error) {
    console.error('Master Search Error:', error);
    res.status(500).json({ success: false, message: 'Search failed', error: error.message });
  }
};

// ✅ Export to Excel
exports.exportSearch = async (req, res) => {
  try {
    const { data } = await searchService.masterSearch(req.body);
    const buffer = await searchService.exportToExcel(data);

    if (!buffer) return res.status(404).send('No data to export');

    res.setHeader('Content-Disposition', 'attachment; filename=MasterSearch.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ success: false, message: 'Export failed' });
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
