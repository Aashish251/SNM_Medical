const { promisePool } = require('../config/database');
const { readData } = require('./localDataStore');
const logger = require('../utils/logger');

const DEFAULT_REPORT_TITLE = '60 Maharashtra Nirankari Sant Samagam';
const DEFAULT_MASTER_REPORT_TITLE = '58th Maharashtra Samagam Dispensary Master Report';
const DEFAULT_DAILY_REPORT_TITLE = '60TH MAHARASHTRA NIRANKARI SANT SAMAGAM';
const MAX_REPORT_DATES = 5;

const isValidDate = (value) => {
  if (!value || typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const formatDateLabel = (date) => {
  if (!date || typeof date !== 'string') return '';
  const parts = date.split('-');
  if (parts.length !== 3) return date;
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};

const formatDisplayDate = (date) => {
  if (!date || typeof date !== 'string') return '';
  const parts = date.split('-');
  if (parts.length !== 3) return date;
  const [year, month, day] = parts;
  return `${Number(day)}/${Number(month)}/${year}`;
};

const readDepartmentId = (department = {}) =>
  department.department_id ??
  department.departmentId ??
  department.dept_id ??
  department.id ??
  department.value ??
  null;

const readDepartmentName = (department = {}, fallback) =>
  department.department_name ??
  department.departmentName ??
  department.dept_name ??
  department.name ??
  department.title ??
  fallback;

const buildDepartmentMap = async (connection) => {
  try {
    const [departmentResults] = await connection.execute('CALL sp_get_department_by_id(?)', [0]);
    const departments = departmentResults[0] || [];

    const byId = new Map();
    departments.forEach((department, index) => {
      const id = Number(readDepartmentId(department));
      if (!Number.isNaN(id) && id > 0) {
        byId.set(id, readDepartmentName(department, `Department ${index + 1}`));
      }
    });

    return byId;
  } catch (error) {
    logger.warn('Failed to call sp_get_department_by_id', { error: error.message });
    return new Map();
  }
};

const buildLocationMap = async (connection) => {
  try {
    const [locationResults] = await connection.execute('CALL sp_get_sewalocation_by_id(?)', [0]);
    const locations = locationResults[0] || [];

    const byId = new Map();
    locations.forEach((loc, index) => {
      const id = Number(loc.id ?? loc.sewalocation_id ?? loc.value);
      const name = loc.sewalocation_name ?? loc.name ?? loc.location_name ?? `Location ${index + 1}`;
      if (!Number.isNaN(id) && id > 0) {
        byId.set(id, name);
      }
    });

    return byId;
  } catch (error) {
    logger.warn('Failed to call sp_get_sewalocation_by_id', { error: error.message });
    return new Map();
  }
};

const fetchAvailableDates = async (connection) => {
  try {
    const [dbDates] = await connection.execute(
      `SELECT DATE_FORMAT(created_datetime, '%Y-%m-%d') AS dt, COUNT(*) AS count
       FROM registration_tbl
       WHERE is_deleted = 0 AND created_datetime IS NOT NULL
       GROUP BY dt
       ORDER BY dt DESC`
    );

    const localData = await readData().catch(() => ({}));
    const localRecords = Array.isArray(localData.patientRegistrations) ? localData.patientRegistrations : [];
    
    const countMap = new Map();
    (dbDates || []).forEach((row) => {
      if (isValidDate(row.dt)) {
        countMap.set(row.dt, (countMap.get(row.dt) || 0) + Number(row.count));
      }
    });

    localRecords.forEach((record) => {
      const dt = record.date ? String(record.date).slice(0, 10) : null;
      if (dt && isValidDate(dt)) {
        countMap.set(dt, (countMap.get(dt) || 0) + 1);
      }
    });

    return Array.from(countMap.entries())
      .map(([date, count]) => ({
        date,
        count,
        label: formatDateLabel(date),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    logger.error('fetchAvailableDates error', { error: error.message });
    return [];
  }
};

const normalizeDateList = async (query = {}, connection, options = {}) => {
  const { maxDates = MAX_REPORT_DATES } = options;
  const rawDates = [
    query.date1,
    query.date2,
    query.date3,
    query.date,
    ...(typeof query.dates === 'string' ? query.dates.split(',') : []),
  ]
    .map((date) => (typeof date === 'string' ? date.trim() : ''))
    .filter(Boolean);

  let dates = [...new Set(rawDates)].filter((d) => isValidDate(d));

  if (!dates.length && connection) {
    const available = await fetchAvailableDates(connection);
    if (available.length > 0) {
      dates = available.slice(0, maxDates || 1).map((a) => a.date);
    }
  }

  if (!dates.length) {
    dates = [new Date().toISOString().slice(0, 10)];
  }

  return maxDates ? dates.slice(0, maxDates) : dates;
};

const isIpdDepartment = (name = '') => {
  return /ipd|indoor|in-patient|icu|ward/i.test(name);
};

exports.getReportMetadata = async () => {
  let connection;
  try {
    connection = await promisePool.getConnection();
    const [availableDates, depMap, locMap] = await Promise.all([
      fetchAvailableDates(connection),
      buildDepartmentMap(connection),
      buildLocationMap(connection),
    ]);

    const departments = Array.from(depMap.entries()).map(([id, name]) => ({ id, name }));
    const locations = Array.from(locMap.entries()).map(([id, name]) => ({ id, name }));
    const totalRecords = availableDates.reduce((sum, d) => sum + d.count, 0);

    return {
      availableDates,
      departments,
      locations,
      summary: {
        totalRecords,
        totalDates: availableDates.length,
        totalDepartments: departments.length,
        totalLocations: locations.length,
        latestDate: availableDates[0]?.date || new Date().toISOString().slice(0, 10),
      },
    };
  } finally {
    if (connection) connection.release();
  }
};

exports.getRegistrationReport = async (query = {}) => {
  let connection;
  try {
    connection = await promisePool.getConnection();
    const dates = await normalizeDateList(query, connection, { maxDates: 5 });
    const title = typeof query.title === 'string' && query.title.trim()
      ? query.title.trim()
      : DEFAULT_REPORT_TITLE;
    const includeEmpty = query.includeEmpty === 'true' || query.includeEmpty === true;
    const includeRecords = query.includeRecords === 'true' || query.includeRecords === true;

    const [departmentMap, locationMap] = await Promise.all([
      buildDepartmentMap(connection),
      buildLocationMap(connection),
    ]);

    const placeholders = dates.map(() => '?').join(', ');

    const [dbRows] = await connection.execute(
      `SELECT
         COALESCE(department_id, 0) AS department_id,
         DATE_FORMAT(created_datetime, '%Y-%m-%d') AS registration_date,
         COUNT(*) AS total
       FROM registration_tbl
       WHERE is_deleted = 0
         AND created_datetime IS NOT NULL
         AND DATE(created_datetime) IN (${placeholders})
       GROUP BY COALESCE(department_id, 0), DATE_FORMAT(created_datetime, '%Y-%m-%d')
       ORDER BY department_id`,
      dates
    );

    const reportRows = new Map();
    const totalsByDate = Object.fromEntries(dates.map((date) => [date, 0]));

    departmentMap.forEach((departmentName, departmentId) => {
      reportRows.set(departmentId, {
        departmentId,
        department: departmentName,
        values: Object.fromEntries(dates.map((date) => [date, 0])),
        total: 0,
      });
    });

    dbRows.forEach((row) => {
      const departmentId = Number(row.department_id) || 0;
      const registrationDate = row.registration_date;
      const count = Number(row.total) || 0;

      if (!reportRows.has(departmentId)) {
        reportRows.set(departmentId, {
          departmentId,
          department: departmentMap.get(departmentId) || (departmentId === 0 ? 'General / Unassigned' : `Department ${departmentId}`),
          values: Object.fromEntries(dates.map((date) => [date, 0])),
          total: 0,
        });
      }

      const reportRow = reportRows.get(departmentId);
      reportRow.values[registrationDate] = (reportRow.values[registrationDate] || 0) + count;
      reportRow.total += count;
      totalsByDate[registrationDate] = (totalsByDate[registrationDate] || 0) + count;
    });

    // Also blend any local patientRegistrations
    try {
      const localData = await readData().catch(() => ({}));
      const patientRegistrations = Array.isArray(localData.patientRegistrations) ? localData.patientRegistrations : [];
      patientRegistrations.forEach((record) => {
        const rDate = record.date ? String(record.date).slice(0, 10) : null;
        if (rDate && dates.includes(rDate)) {
          const deptName = record.disease || record.department || 'General Patient Registration';
          let foundRow = null;
          for (const row of reportRows.values()) {
            if (row.department.toLowerCase() === deptName.toLowerCase()) {
              foundRow = row;
              break;
            }
          }
          if (!foundRow) {
            const fakeId = 9000 + reportRows.size;
            foundRow = {
              departmentId: fakeId,
              department: deptName,
              values: Object.fromEntries(dates.map((date) => [date, 0])),
              total: 0,
            };
            reportRows.set(fakeId, foundRow);
          }
          foundRow.values[rDate] = (foundRow.values[rDate] || 0) + 1;
          foundRow.total += 1;
          totalsByDate[rDate] = (totalsByDate[rDate] || 0) + 1;
        }
      });
    } catch (_) {}

    const filteredRows = Array.from(reportRows.values())
      .filter((row) => row.total > 0 || includeEmpty)
      .sort((a, b) => b.total - a.total || a.department.localeCompare(b.department));

    const grandTotal = Object.values(totalsByDate).reduce((sum, count) => sum + count, 0);

    // Optional detail records for drill-down view
    let records = [];
    if (includeRecords && dates.length > 0) {
      const [recordRows] = await connection.execute(
        `SELECT
           reg_id,
           full_name,
           mobile_no,
           department_id,
           sewa_location_id,
           gender,
           DATE_FORMAT(created_datetime, '%Y-%m-%d %H:%i') AS created_at
         FROM registration_tbl
         WHERE is_deleted = 0
           AND created_datetime IS NOT NULL
           AND DATE(created_datetime) IN (${placeholders})
         ORDER BY reg_id DESC
         LIMIT 100`,
        dates
      );

      records = (recordRows || []).map((r) => ({
        id: r.reg_id,
        fullName: r.full_name,
        mobileNo: r.mobile_no,
        gender: r.gender,
        department: departmentMap.get(r.department_id) || 'General',
        location: locationMap.get(r.sewa_location_id) || 'Dispensary',
        createdAt: r.created_at,
      }));
    }

    return {
      title,
      dates,
      columns: dates.map((date) => ({
        key: date,
        label: formatDateLabel(date),
      })),
      rows: filteredRows,
      totals: {
        byDate: totalsByDate,
        grandTotal,
      },
      records,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Registration report service error', { error: error.message, query });
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

exports.getDailyReport = async (query = {}) => {
  let connection;
  try {
    connection = await promisePool.getConnection();
    const [reportDate] = await normalizeDateList(query, connection, { maxDates: 1 });
    const title = typeof query.title === 'string' && query.title.trim()
      ? query.title.trim()
      : DEFAULT_DAILY_REPORT_TITLE;
    const includeEmpty = query.includeEmpty === 'true' || query.includeEmpty === true;

    const [departmentMap, locationMap] = await Promise.all([
      buildDepartmentMap(connection),
      buildLocationMap(connection),
    ]);

    // Query aggregated counts for this date
    const [dbRows] = await connection.execute(
      `SELECT
         COALESCE(department_id, 0) AS department_id,
         COALESCE(sewa_location_id, 0) AS sewa_location_id,
         COUNT(*) AS count
       FROM registration_tbl
       WHERE is_deleted = 0
         AND created_datetime IS NOT NULL
         AND DATE(created_datetime) = ?
       GROUP BY department_id, sewa_location_id`,
      [reportDate]
    );

    // Identify active locations or all locations
    const activeLocIds = new Set();
    const activeDeptIds = new Set();
    dbRows.forEach((r) => {
      activeLocIds.add(r.sewa_location_id);
      activeDeptIds.add(r.department_id);
    });

    // Build location columns list
    const locations = [];
    const seenLocNames = new Set();
    locationMap.forEach((locName, locId) => {
      if (activeLocIds.has(locId) || includeEmpty || locId <= 8) {
        if (!seenLocNames.has(locName)) {
          seenLocNames.add(locName);
          locations.push({ key: locName, label: locName, id: locId });
        }
      }
    });

    // If no locations in master, fallback
    if (locations.length === 0) {
      ['Dispensary 1', 'Dispensary 2', 'Dispensary 3', 'Langar 1', 'Langar 2'].forEach((loc) => {
        locations.push({ key: loc, label: loc });
      });
    }

    // Matrix Map: departmentName -> Map(locationName -> count)
    const matrix = new Map();
    const getDepLocCount = (depName, locName) => {
      if (!matrix.has(depName)) matrix.set(depName, new Map());
      return matrix.get(depName).get(locName) || 0;
    };
    const addDepLocCount = (depName, locName, count) => {
      if (!matrix.has(depName)) matrix.set(depName, new Map());
      const cur = matrix.get(depName).get(locName) || 0;
      matrix.get(depName).set(locName, cur + count);
    };

    dbRows.forEach((r) => {
      const depName = departmentMap.get(r.department_id) || (r.department_id === 0 ? 'General' : `Department ${r.department_id}`);
      const locName = locationMap.get(r.sewa_location_id) || (r.sewa_location_id === 0 ? 'Unassigned' : `Dispensary ${r.sewa_location_id}`);
      addDepLocCount(depName, locName, Number(r.count) || 0);

      // Ensure locName exists in columns
      if (!seenLocNames.has(locName)) {
        seenLocNames.add(locName);
        locations.push({ key: locName, label: locName });
      }
    });

    // Also blend localDataStore patientRegistrations
    try {
      const localData = await readData().catch(() => ({}));
      const patientRegistrations = Array.isArray(localData.patientRegistrations) ? localData.patientRegistrations : [];
      patientRegistrations.forEach((record) => {
        const rDate = record.date ? String(record.date).slice(0, 10) : null;
        if (rDate === reportDate) {
          const depName = record.disease || record.department || 'General OPD';
          const locName = record.location || record.dispensary || 'Dispensary 1';
          addDepLocCount(depName, locName, 1);
          if (!seenLocNames.has(locName)) {
            seenLocNames.add(locName);
            locations.push({ key: locName, label: locName });
          }
        }
      });
    } catch (_) {}

    // Include departments from master if includeEmpty
    if (includeEmpty) {
      departmentMap.forEach((depName) => {
        if (!matrix.has(depName)) {
          matrix.set(depName, new Map());
        }
      });
    }

    const totalsByLocation = Object.fromEntries(locations.map((loc) => [loc.key, 0]));
    const rows = [];

    matrix.forEach((locMapValues, depName) => {
      const values = {};
      let total = 0;

      locations.forEach((loc) => {
        const val = locMapValues.get(loc.key) || 0;
        values[loc.key] = val;
        totalsByLocation[loc.key] = (totalsByLocation[loc.key] || 0) + val;
        total += val;
      });

      if (total > 0 || includeEmpty) {
        rows.push({
          department: depName,
          values,
          total,
        });
      }
    });

    rows.sort((a, b) => b.total - a.total || a.department.localeCompare(b.department));

    const grandTotal = Object.values(totalsByLocation).reduce((sum, val) => sum + val, 0);

    return {
      title,
      date: reportDate,
      dateLabel: formatDisplayDate(reportDate),
      reportTitle: `DAILY REPORT CHART - ${formatDisplayDate(reportDate)}`,
      columns: locations,
      rows,
      totals: {
        byLocation: totalsByLocation,
        grandTotal,
      },
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Daily report service error', { error: error.message, query });
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

exports.getMasterReport = async (query = {}) => {
  let connection;
  try {
    connection = await promisePool.getConnection();
    const dates = await normalizeDateList(query, connection, { maxDates: 5 });
    const title = typeof query.title === 'string' && query.title.trim()
      ? query.title.trim()
      : DEFAULT_MASTER_REPORT_TITLE;
    const includeEmpty = query.includeEmpty === 'true' || query.includeEmpty === true;

    const [departmentMap, locationMap] = await Promise.all([
      buildDepartmentMap(connection),
      buildLocationMap(connection),
    ]);

    const placeholders = dates.map(() => '?').join(', ');

    const [dbRows] = await connection.execute(
      `SELECT
         DATE_FORMAT(created_datetime, '%Y-%m-%d') AS reg_date,
         COALESCE(department_id, 0) AS department_id,
         COALESCE(sewa_location_id, 0) AS sewa_location_id,
         COUNT(*) AS count
       FROM registration_tbl
       WHERE is_deleted = 0
         AND created_datetime IS NOT NULL
         AND DATE(created_datetime) IN (${placeholders})
       GROUP BY reg_date, department_id, sewa_location_id`,
      dates
    );

    // Map: date -> location -> { opd: 0, ipd: 0, total: 0 }
    const cellMatrix = new Map();
    const allLocationsSet = new Set();

    locationMap.forEach((locName) => {
      allLocationsSet.add(locName);
    });

    const getMetrics = (date, locName) => {
      const key = `${date}::${locName}`;
      if (!cellMatrix.has(key)) {
        cellMatrix.set(key, { opd: 0, ipd: 0, total: 0 });
      }
      return cellMatrix.get(key);
    };

    dbRows.forEach((r) => {
      const date = r.reg_date;
      const depName = departmentMap.get(r.department_id) || 'General';
      const locName = locationMap.get(r.sewa_location_id) || (r.sewa_location_id === 0 ? 'Unassigned' : `Dispensary ${r.sewa_location_id}`);
      allLocationsSet.add(locName);

      const count = Number(r.count) || 0;
      const metrics = getMetrics(date, locName);
      if (isIpdDepartment(depName)) {
        metrics.ipd += count;
      } else {
        metrics.opd += count;
      }
      metrics.total += count;
    });

    // Also blend localDataStore patientRegistrations
    try {
      const localData = await readData().catch(() => ({}));
      const patientRegistrations = Array.isArray(localData.patientRegistrations) ? localData.patientRegistrations : [];
      patientRegistrations.forEach((record) => {
        const rDate = record.date ? String(record.date).slice(0, 10) : null;
        if (rDate && dates.includes(rDate)) {
          const locName = record.location || record.dispensary || 'Dispensary 1';
          allLocationsSet.add(locName);
          const metrics = getMetrics(rDate, locName);
          const isIpd = /ipd|indoor/i.test(record.type || record.visitType || '');
          if (isIpd) {
            metrics.ipd += 1;
          } else {
            metrics.opd += 1;
          }
          metrics.total += 1;
        }
      });
    } catch (_) {}

    const locations = Array.from(allLocationsSet);

    // Build Date-wise Breakdown
    const dateWise = dates.map((date) => {
      const rows = locations.map((loc) => {
        const metrics = getMetrics(date, loc);
        return {
          label: loc,
          opd: metrics.opd,
          ipd: metrics.ipd,
          total: metrics.total,
        };
      });

      const visibleRows = includeEmpty ? rows : rows.filter((r) => r.total > 0);
      const dateTotals = visibleRows.reduce(
        (acc, r) => ({
          opd: acc.opd + r.opd,
          ipd: acc.ipd + r.ipd,
          total: acc.total + r.total,
        }),
        { opd: 0, ipd: 0, total: 0 }
      );

      return {
        date,
        label: formatDateLabel(date),
        rows: visibleRows,
        totals: dateTotals,
      };
    });

    // Build Location-wise Breakdown
    const locationWise = locations.map((loc) => {
      const rows = dates.map((date) => {
        const metrics = getMetrics(date, loc);
        return {
          date,
          label: formatDateLabel(date),
          opd: metrics.opd,
          ipd: metrics.ipd,
          total: metrics.total,
        };
      });

      const visibleRows = includeEmpty ? rows : rows.filter((r) => r.total > 0);
      const locTotals = visibleRows.reduce(
        (acc, r) => ({
          opd: acc.opd + r.opd,
          ipd: acc.ipd + r.ipd,
          total: acc.total + r.total,
        }),
        { opd: 0, ipd: 0, total: 0 }
      );

      return {
        location: loc,
        rows: visibleRows,
        totals: locTotals,
      };
    }).filter((item) => includeEmpty || item.totals.total > 0);

    // Overall grand totals
    const grandTotals = dateWise.reduce(
      (acc, d) => ({
        opd: acc.opd + d.totals.opd,
        ipd: acc.ipd + d.totals.ipd,
        total: acc.total + d.totals.total,
      }),
      { opd: 0, ipd: 0, total: 0 }
    );

    return {
      title,
      dates,
      columns: dates.map((date) => ({
        key: date,
        label: formatDateLabel(date),
      })),
      locations,
      dateWise,
      locationWise,
      totals: grandTotals,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Master report service error', { error: error.message, query });
    throw error;
  } finally {
    if (connection) connection.release();
  }
};
