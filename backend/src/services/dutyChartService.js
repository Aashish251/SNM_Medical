const { readData, updateData, getNextArrayId } = require("./localDataStore");
const { promisePool } = require("../config/database");

function ensureRequired(value, label) {
  if (!value && value !== 0) {
    throw new Error(`${label} is required`);
  }
}

function normalizeChartPayload(payload = {}) {
  const chart = {
    title: payload.title,
    department: payload.department,
    date: payload.date,
  };

  ensureRequired(chart.title, "Samagam title");
  ensureRequired(chart.department, "Department");
  ensureRequired(chart.date, "Date");

  if (Number.isNaN(new Date(chart.date).getTime())) {
    throw new Error("Date must be a valid date");
  }

  return chart;
}

function normalizeEntryPayload(payload = {}) {
  const entry = {
    name: payload.name,
    contact: payload.contact,
    shift: payload.shift,
    status: payload.status || "assigned",
  };

  ensureRequired(entry.name, "Name");
  ensureRequired(entry.contact, "Contact number");
  ensureRequired(entry.shift, "Duty shift");

  return entry;
}

// Helper to flatten chart + entry into a single record for frontend
function summarizeEntry(entry, chart) {
  return {
    id: `${chart.id}_${entry.id}`,
    chartId: chart.id,
    entryId: entry.id,
    title: chart.title,
    department: chart.department,
    date: chart.date,
    year: chart.year,
    name: entry.name,
    contact: entry.contact,
    shift: entry.shift,
    status: entry.status || "assigned",
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

function summarizeChart(chart) {
  return {
    id: chart.id,
    title: chart.title,
    department: chart.department,
    date: chart.date,
    year: chart.year,
    totalEntries: chart.entries.length,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
  };
}

async function getApprovedUsersMap() {
  try {
    const [approvedRows] = await promisePool.execute(
      `SELECT mobile_no, full_name FROM registration_tbl WHERE is_deleted = 0 AND (is_approved = 1 OR is_approved = '1')`
    );
    const approvedContacts = new Set(
      approvedRows.map((r) => String(r.mobile_no || "").replace(/\D/g, "").slice(-10)).filter(Boolean)
    );
    const approvedNames = new Set(
      approvedRows.map((r) => String(r.full_name || "").trim().toLowerCase()).filter(Boolean)
    );
    return { approvedContacts, approvedNames };
  } catch (err) {
    return null;
  }
}

async function filterApprovedEntries(entries = []) {
  if (!entries || entries.length === 0) return [];
  const approvedMap = await getApprovedUsersMap();
  if (!approvedMap) return entries;

  const { approvedContacts, approvedNames } = approvedMap;
  return entries.filter((entry) => {
    const contact = String(entry.contact || "").replace(/\D/g, "").slice(-10);
    const name = String(entry.name || "").trim().toLowerCase();
    return (contact && approvedContacts.has(contact)) || (name && approvedNames.has(name));
  });
}

async function validateStaffApproval(name, contact) {
  try {
    const cleanContact = String(contact || "").replace(/\D/g, "").slice(-10);
    const cleanName = String(name || "").trim();

    let query = `SELECT reg_id, full_name, mobile_no, is_approved, is_deleted FROM registration_tbl WHERE is_deleted = 0`;
    const params = [];

    if (cleanContact && cleanName) {
      query += ` AND (RIGHT(REPLACE(mobile_no, ' ', ''), 10) = ? OR full_name = ?)`;
      params.push(cleanContact, cleanName);
    } else if (cleanContact) {
      query += ` AND RIGHT(REPLACE(mobile_no, ' ', ''), 10) = ?`;
      params.push(cleanContact);
    } else if (cleanName) {
      query += ` AND full_name = ?`;
      params.push(cleanName);
    }

    query += ` LIMIT 1`;

    const [rows] = await promisePool.execute(query, params);
    if (rows && rows.length > 0) {
      const u = rows[0];
      const isApproved = u.is_approved === 1 || u.is_approved === "1";
      if (!isApproved) {
        throw new Error(`Staff member "${name}" is not approved yet. Only approved users can be assigned duties.`);
      }
    } else {
      throw new Error(`Staff member "${name}" is not registered or approved. Only approved users can be assigned duties.`);
    }
  } catch (err) {
    if (err.message && err.message.includes("Only approved users")) {
      throw err;
    }
  }
}

exports.listCharts = async ({ department, year } = {}) => {
  const data = await readData();

  let charts = data.dutyCharts
    .filter((chart) => !department || chart.department === department)
    .filter((chart) => !year || String(chart.year) === String(year))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const approvedMap = await getApprovedUsersMap();
  if (approvedMap) {
    const { approvedContacts, approvedNames } = approvedMap;
    charts = charts.map((chart) => {
      const filteredEntries = chart.entries.filter((entry) => {
        const contact = String(entry.contact || "").replace(/\D/g, "").slice(-10);
        const name = String(entry.name || "").trim().toLowerCase();
        return (contact && approvedContacts.has(contact)) || (name && approvedNames.has(name));
      });
      return { ...chart, entries: filteredEntries };
    });
  }

  return charts.map(summarizeChart);
};

// New: List all entries flattened with chart context
exports.listEntries = async ({ department, year } = {}) => {
  const data = await readData();
  let charts = data.dutyCharts;

  if (department) {
    const deptKey = String(department).toLowerCase();
    charts = charts.filter((chart) => String(chart.department).toLowerCase() === deptKey);
  }
  if (year) {
    charts = charts.filter((chart) => String(chart.year) === String(year));
  }

  const allEntries = charts.flatMap((chart) =>
    chart.entries.map((entry) => summarizeEntry(entry, chart))
  );

  return await filterApprovedEntries(allEntries);
};

exports.getChartById = async (chartId) => {
  const data = await readData();
  const chart = data.dutyCharts.find((chart) => chart.id === Number(chartId)) || null;
  if (!chart) return null;

  const entries = await filterApprovedEntries(chart.entries);
  return {
    ...chart,
    entries,
  };
};

exports.getChartByDepartmentYear = async (department, year) => {
  ensureRequired(department, "Department");
  ensureRequired(year, "Year");

  if (!/^\d{4}$/.test(String(year))) {
    throw new Error("Year must be a valid 4-digit year");
  }

  const data = await readData();
  const departmentKey = String(department).toLowerCase();
  const charts = data.dutyCharts
    .filter((chart) => String(chart.department).toLowerCase() === departmentKey)
    .filter((chart) => String(chart.year) === String(year))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  if (!charts.length) {
    return null;
  }

  const allEntries = charts.flatMap((chart) =>
    chart.entries.map((entry) => summarizeEntry(entry, chart))
  );
  const entries = await filterApprovedEntries(allEntries);

  const latestChart = charts[charts.length - 1];

  return {
    id: `${department}_${year}`,
    title: latestChart.title,
    department,
    year: Number(year),
    date: latestChart.date,
    totalEntries: entries.length,
    charts: charts.map(summarizeChart),
    entries,
    createdAt: charts[0].createdAt,
    updatedAt: latestChart.updatedAt,
  };
};

// New: Create a chart without entries
exports.createChart = async (payload) => {
  const chartInput = normalizeChartPayload(payload);
  const timestamp = new Date().toISOString();
  let createdChart;

  await updateData(async (data) => {
    const chartYear = new Date(chartInput.date).getFullYear();
    const chart = {
      id: getNextArrayId(data.dutyCharts),
      title: chartInput.title,
      department: chartInput.department,
      date: chartInput.date,
      year: chartYear,
      entries: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    data.dutyCharts.push(chart);
    createdChart = { ...chart };
  });

  return createdChart;
};

// New: Update a chart's details
exports.updateChart = async (chartId, payload) => {
  const updates = normalizeChartPayload(payload);
  let updatedChart = null;

  await updateData(async (data) => {
    const chart = data.dutyCharts.find((item) => item.id === Number(chartId));
    if (!chart) {
      throw new Error("Duty chart not found");
    }

    chart.title = updates.title;
    chart.department = updates.department;
    chart.date = updates.date;
    chart.year = new Date(updates.date).getFullYear();
    chart.updatedAt = new Date().toISOString();
    updatedChart = { ...chart };
  });

  return updatedChart;
};

// New: Delete a chart and all its entries
exports.deleteChart = async (chartId) => {
  let deleted = false;

  await updateData(async (data) => {
    const originalLength = data.dutyCharts.length;
    data.dutyCharts = data.dutyCharts.filter((item) => item.id !== Number(chartId));

    if (data.dutyCharts.length === originalLength) {
      throw new Error("Duty chart not found");
    }

    deleted = true;
  });

  return deleted;
};

exports.createEntry = async (payload) => {
  const chartInput = normalizeChartPayload(payload);
  const entryInput = normalizeEntryPayload(payload);
  await validateStaffApproval(entryInput.name, entryInput.contact);
  const timestamp = new Date().toISOString();
  let responsePayload;

  await updateData(async (data) => {
    const chartYear = new Date(chartInput.date).getFullYear();
    let chart = data.dutyCharts.find(
      (item) =>
        item.title === chartInput.title &&
        item.department === chartInput.department &&
        item.date === chartInput.date
    );

    if (!chart) {
      chart = {
        id: getNextArrayId(data.dutyCharts),
        title: chartInput.title,
        department: chartInput.department,
        date: chartInput.date,
        year: chartYear,
        entries: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      data.dutyCharts.push(chart);
    }

    const entry = {
      id: getNextArrayId(chart.entries),
      ...entryInput,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    chart.entries.push(entry);
    chart.updatedAt = timestamp;

    responsePayload = {
      chart: { ...chart, entries: [...chart.entries] },
      entry,
    };
  });

  return responsePayload;
};

exports.updateEntry = async (chartId, entryId, payload) => {
  const updates = normalizeEntryPayload(payload);
  await validateStaffApproval(updates.name, updates.contact);
  let updatedEntry = null;

  await updateData(async (data) => {
    const chart = data.dutyCharts.find((item) => item.id === Number(chartId));
    if (!chart) {
      throw new Error("Duty chart not found");
    }

    const entry = chart.entries.find((item) => item.id === Number(entryId));
    if (!entry) {
      throw new Error("Duty chart entry not found");
    }

    entry.name = updates.name;
    entry.contact = updates.contact;
    entry.shift = updates.shift;
    entry.status = updates.status;
    entry.updatedAt = new Date().toISOString();
    chart.updatedAt = entry.updatedAt;
    updatedEntry = { ...entry };
  });

  return updatedEntry;
};

exports.deleteEntry = async (chartId, entryId) => {
  let deleted = false;

  await updateData(async (data) => {
    const chart = data.dutyCharts.find((item) => item.id === Number(chartId));
    if (!chart) {
      throw new Error("Duty chart not found");
    }

    const originalLength = chart.entries.length;
    chart.entries = chart.entries.filter((item) => item.id !== Number(entryId));

    if (chart.entries.length === originalLength) {
      throw new Error("Duty chart entry not found");
    }

    chart.updatedAt = new Date().toISOString();
    deleted = true;
  });

  return deleted;
};

exports.exportChart = async (chartId) => {
  const chart = await exports.getChartById(chartId);

  if (!chart) {
    throw new Error("Duty chart not found");
  }

  const header = ["Sr No", "Name", "Contact No", "Duty Shift"];
  const rows = chart.entries.map((entry, index) => [
    index + 1,
    entry.name,
    entry.contact,
    entry.shift,
  ]);

  const escapeValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [header, ...rows].map((row) => row.map(escapeValue).join(",")).join("\n");

  return {
    filename: `${chart.department}_${chart.year}_duty_chart.csv`.replace(/\s+/g, "_"),
    content: csv,
    chart,
  };
};

/**
 * Fetch department options directly from sp_department_master stored procedure.
 */
exports.getDutyDepartments = async (search = "") => {
  const [rows] = await promisePool.execute("CALL sp_department_master(?, ?, ?, ?, ?)", [
    "GET",
    null,
    null,
    null,
    search ? search.trim() : null,
  ]);

  const depts = rows[0] || [];
  return depts.map((d) => ({
    id: d.id,
    label: d.department_name,
    value: d.department_name,
  }));
};

/**
 * Fetch staff names from registration_tbl for duty assignment (approved only).
 */
exports.getDutyStaff = async (search = "", department = "") => {
  let query = `SELECT reg_id, full_name, mobile_no, department_id, is_approved FROM registration_tbl WHERE is_deleted = 0 AND (is_approved = 1 OR is_approved = '1')`;
  const params = [];

  if (search && search.trim()) {
    query += ` AND full_name LIKE ?`;
    params.push(`%${search.trim()}%`);
  }

  query += ` ORDER BY full_name ASC`;

  const [rows] = await promisePool.execute(query, params);

  // Fetch departments to map department_id -> department_name
  let deptMap = new Map();
  try {
    const [deptRows] = await promisePool.execute("CALL sp_department_master(?, ?, ?, ?, ?)", [
      "GET",
      null,
      null,
      null,
      null,
    ]);
    const depts = deptRows[0] || [];
    depts.forEach((d) => {
      deptMap.set(Number(d.id), d.department_name);
    });
  } catch (_) {
    // fallback if SP fails
  }

  let staff = rows.map((r) => {
    const deptId = r.department_id != null ? Number(r.department_id) : null;
    const deptName = deptId ? deptMap.get(deptId) || "" : "";
    return {
      id: r.reg_id,
      label: r.full_name,
      value: r.full_name,
      contact: r.mobile_no || "",
      departmentId: deptId,
      department: deptName,
      isApproved: true,
    };
  });

  if (department && department.trim()) {
    const targetDept = department.trim().toLowerCase();
    staff = staff.filter(
      (s) =>
        String(s.departmentId) === targetDept ||
        (s.department && s.department.toLowerCase() === targetDept)
    );
  }

  return staff;
};