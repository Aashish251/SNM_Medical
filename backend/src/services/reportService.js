const { promisePool } = require('../config/database');
const { readData } = require('./localDataStore');
const logger = require('../utils/logger');

const DEFAULT_REPORT_TITLE = '60 Maharashtra Nirankari Sant Samagam';
const DEFAULT_MASTER_REPORT_TITLE = '58th Maharashtra Samagam Dispensary Master Report';
const DEFAULT_DAILY_REPORT_TITLE = '60TH MAHARASHTRA NIRANKARI SANT SAMAGAM';
const MAX_REPORT_DATES = 3;
const DEFAULT_MASTER_LOCATIONS = [
  'Dispensary 1',
  'Dispensary 2',
  'Dispensary 3',
  'Langar 1',
  'Langar 2',
  'Langar 3',
];
const DEFAULT_DAILY_DEPARTMENTS = [
  'Registration',
  'OPD',
  'INDOOR',
  'Homeopathy',
  'Accupressure',
  'Physiotherapy',
  'Dental',
  'Eye',
  'ENT',
  'ECG',
  'Pediatric',
  'ICU',
  'Injection',
  'Dressing',
  'Pathology',
];
const DEFAULT_DAILY_LOCATIONS = [
  { key: 'Dispensary 1', label: 'Dispensary-1' },
  { key: 'Dispensary 2', label: 'Dispensary-2' },
  { key: 'Dispensary 3', label: 'Dispensary-3' },
  { key: 'Langar 1', label: 'Langar-1' },
  { key: 'Langar 2', label: 'Langar-2' },
  { key: 'Langar 3', label: 'Langar-3' },
];

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const normalizeDateList = (query = {}, options = {}) => {
  const { required = true, maxDates = MAX_REPORT_DATES } = options;
  const rawDates = [
    query.date1,
    query.date2,
    query.date3,
    ...(typeof query.dates === 'string' ? query.dates.split(',') : []),
  ]
    .map((date) => (typeof date === 'string' ? date.trim() : ''))
    .filter(Boolean);

  const dates = [...new Set(rawDates)];
  const limitedDates = maxDates ? dates.slice(0, maxDates) : dates;

  if (required && !limitedDates.length) {
    throw new Error('At least one report date is required');
  }

  const invalidDate = limitedDates.find((date) => !isValidDate(date));
  if (invalidDate) {
    throw new Error(`Invalid date "${invalidDate}". Use YYYY-MM-DD format`);
  }

  return limitedDates;
};

const formatDateLabel = (date) => {
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

const formatDisplayDate = (date) => {
  const [year, month, day] = date.split('-');
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
};

const normalizeLocationList = (query = {}) => {
  const requestedLocations = typeof query.locations === 'string'
    ? query.locations.split(',').map((location) => location.trim()).filter(Boolean)
    : [];

  return requestedLocations.length ? [...new Set(requestedLocations)] : DEFAULT_MASTER_LOCATIONS;
};

const getRecordDate = (record = {}) => {
  const rawDate = record.date || record.registrationDate || record.visitDate || record.createdAt;
  if (!rawDate) return null;

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
};

const getRecordLocation = (record = {}) =>
  record.location ||
  record.sewaLocation ||
  record.sewaLocationName ||
  record.sewalocation ||
  record.department ||
  record.departmentName ||
  record.dispensary ||
  'Not assigned';

const normalizeLookupKey = (value = '') =>
  String(value).toLowerCase().replace(/[\s_-]+/g, '');

const getRecordDepartment = (record = {}) => {
  const explicitDepartment =
    record.reportDepartment ||
    record.serviceDepartment ||
    record.department ||
    record.departmentName ||
    record.service ||
    record.category;

  if (explicitDepartment) return explicitDepartment;

  return getRecordVisitType(record) === 'ipd' ? 'INDOOR' : 'OPD';
};

const getRecordVisitType = (record = {}) => {
  const rawType = [
    record.visitType,
    record.patientType,
    record.registrationType,
    record.type,
    record.category,
    record.regnNo,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return rawType.includes('ipd') ? 'ipd' : 'opd';
};

const createMetric = () => ({ opd: 0, ipd: 0 });

const addMetric = (metric, opd, ipd) => {
  metric.opd += Number(opd) || 0;
  metric.ipd += Number(ipd) || 0;
};

const readPatientMetric = (record = {}) => {
  if (record.opd !== undefined || record.ipd !== undefined) {
    return {
      opd: Number(record.opd) || 0,
      ipd: Number(record.ipd) || 0,
    };
  }

  return getRecordVisitType(record) === 'ipd'
    ? { opd: 0, ipd: 1 }
    : { opd: 1, ipd: 0 };
};

const toReportRow = (label, metric) => ({
  label,
  opd: metric.opd,
  ipd: metric.ipd,
  total: metric.opd + metric.ipd,
});

const normalizeSingleDate = (query = {}) => {
  const [date] = normalizeDateList({
    dates: query.date || query.reportDate || query.date1 || query.dates,
  });
  return date;
};

exports.getDailyReport = async (query = {}) => {
  const data = await readData();
  const records = Array.isArray(data.patientRegistrations) ? data.patientRegistrations : [];
  const reportDate = normalizeSingleDate(query);
  const title = typeof query.title === 'string' && query.title.trim()
    ? query.title.trim()
    : DEFAULT_DAILY_REPORT_TITLE;
  const includeEmpty = query.includeEmpty === 'true';

  const requestedDepartments = typeof query.departments === 'string'
    ? query.departments.split(',').map((department) => department.trim()).filter(Boolean)
    : [];
  const departments = requestedDepartments.length
    ? [...new Set(requestedDepartments)]
    : [...DEFAULT_DAILY_DEPARTMENTS];

  const requestedLocations = typeof query.locations === 'string'
    ? query.locations.split(',').map((location) => location.trim()).filter(Boolean)
    : [];
  const locations = requestedLocations.length
    ? [...new Set(requestedLocations)].map((location) => ({ key: location, label: location }))
    : [...DEFAULT_DAILY_LOCATIONS];

  const departmentLookup = new Map(departments.map((department) => [normalizeLookupKey(department), department]));
  const locationLookup = new Map(locations.map((location) => [normalizeLookupKey(location.key), location.key]));
  locations.forEach((location) => {
    locationLookup.set(normalizeLookupKey(location.label), location.key);
  });

  const matrix = new Map();
  const getCell = (department, location) => {
    const key = `${department}::${location}`;
    if (!matrix.has(key)) matrix.set(key, 0);
    return key;
  };

  records.forEach((record) => {
    const date = getRecordDate(record);
    if (date !== reportDate) return;

    const departmentKey = normalizeLookupKey(getRecordDepartment(record));
    const locationKey = normalizeLookupKey(getRecordLocation(record));
    const department = departmentLookup.get(departmentKey);
    const location = locationLookup.get(locationKey);

    if (!department || !location) return;

    const metric = readPatientMetric(record);
    const count = metric.opd + metric.ipd;
    const cellKey = getCell(department, location);
    matrix.set(cellKey, matrix.get(cellKey) + count);
  });

  const totalsByLocation = Object.fromEntries(locations.map((location) => [location.key, 0]));
  const rows = departments.map((department) => {
    const values = {};
    let total = 0;

    locations.forEach((location) => {
      const value = matrix.get(getCell(department, location.key)) || 0;
      values[location.key] = value;
      totalsByLocation[location.key] += value;
      total += value;
    });

    return {
      department,
      values,
      total,
    };
  }).filter((row) => includeEmpty || row.total > 0);

  const grandTotal = Object.values(totalsByLocation).reduce((sum, value) => sum + value, 0);

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
};

exports.getRegistrationReport = async (query = {}) => {
  const dates = normalizeDateList(query);
  const title = typeof query.title === 'string' && query.title.trim()
    ? query.title.trim()
    : DEFAULT_REPORT_TITLE;

  let connection;

  try {
    connection = await promisePool.getConnection();
    const departmentMap = await buildDepartmentMap(connection);
    const placeholders = dates.map(() => '?').join(', ');

    const [rows] = await connection.execute(
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

    rows.forEach((row) => {
      const departmentId = Number(row.department_id) || 0;
      const registrationDate = row.registration_date;
      const count = Number(row.total) || 0;

      if (!reportRows.has(departmentId)) {
        reportRows.set(departmentId, {
          departmentId,
          department: departmentMap.get(departmentId) || 'Not assigned',
          values: Object.fromEntries(dates.map((date) => [date, 0])),
          total: 0,
        });
      }

      const reportRow = reportRows.get(departmentId);
      reportRow.values[registrationDate] = count;
      reportRow.total += count;
      totalsByDate[registrationDate] = (totalsByDate[registrationDate] || 0) + count;
    });

    const filteredRows = Array.from(reportRows.values())
      .filter((row) => row.total > 0 || query.includeEmpty === 'true')
      .sort((a, b) => a.department.localeCompare(b.department));

    const grandTotal = Object.values(totalsByDate).reduce((sum, count) => sum + count, 0);

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
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Registration report service error', { error: error.message, query });
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

exports.getMasterReport = async (query = {}) => {
  const data = await readData();
  const records = Array.isArray(data.patientRegistrations) ? data.patientRegistrations : [];
  const requestedDates = normalizeDateList(query, { required: false, maxDates: null });
  const title = typeof query.title === 'string' && query.title.trim()
    ? query.title.trim()
    : DEFAULT_MASTER_REPORT_TITLE;
  const includeEmpty = query.includeEmpty === 'true';
  const hasLocationFilter = typeof query.locations === 'string' && query.locations.trim() !== '';

  const recordDates = [...new Set(records.map(getRecordDate).filter(Boolean))].sort();
  const dates = requestedDates.length ? requestedDates : recordDates;
  if (!dates.length) {
    throw new Error('At least one report date is required');
  }

  const locations = normalizeLocationList(query);
  if (!hasLocationFilter) {
    records.forEach((record) => {
      const location = getRecordLocation(record);
      if (!locations.includes(location)) locations.push(location);
    });
  }
  const matrix = new Map();

  const getCell = (date, location) => {
    const key = `${date}::${location}`;
    if (!matrix.has(key)) matrix.set(key, createMetric());
    return matrix.get(key);
  };

  records.forEach((record) => {
    const date = getRecordDate(record);
    if (!date || !dates.includes(date)) return;

    const location = getRecordLocation(record);
    if (hasLocationFilter && !locations.includes(location)) return;

    const metric = readPatientMetric(record);
    addMetric(getCell(date, location), metric.opd, metric.ipd);
  });

  const dateWise = dates.map((date) => {
    const rows = locations.map((location) => toReportRow(location, getCell(date, location)));
    const visibleRows = includeEmpty ? rows : rows.filter((row) => row.total > 0);
    const totals = visibleRows.reduce((sum, row) => ({
      opd: sum.opd + row.opd,
      ipd: sum.ipd + row.ipd,
      total: sum.total + row.total,
    }), { opd: 0, ipd: 0, total: 0 });

    return {
      date,
      label: formatDateLabel(date),
      rows: visibleRows,
      totals,
    };
  });

  const locationWise = locations.map((location) => {
    const rows = dates.map((date) => toReportRow(date, getCell(date, location))).map((row) => ({
      ...row,
      date: row.label,
      label: formatDateLabel(row.label),
    }));
    const visibleRows = includeEmpty ? rows : rows.filter((row) => row.total > 0);
    const totals = visibleRows.reduce((sum, row) => ({
      opd: sum.opd + row.opd,
      ipd: sum.ipd + row.ipd,
      total: sum.total + row.total,
    }), { opd: 0, ipd: 0, total: 0 });

    return {
      location,
      rows: visibleRows,
      totals,
    };
  }).filter((card) => includeEmpty || card.totals.total > 0);

  const totals = dateWise.reduce((sum, card) => ({
    opd: sum.opd + card.totals.opd,
    ipd: sum.ipd + card.totals.ipd,
    total: sum.total + card.totals.total,
  }), { opd: 0, ipd: 0, total: 0 });

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
    totals,
    generatedAt: new Date().toISOString(),
  };
};
