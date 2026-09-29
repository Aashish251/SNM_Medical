const { readData, updateData } = require('./localDataStore');

const LOCATIONS = ['Dispensary-1', 'Dispensary-2', 'Dispensary-3', 'Langar-1', 'Langar-2', 'Langar-3'];
const DEFAULTS = {
  registration: {
    title: '60 Maharashtra Nirankari Sant Samagam',
    dates: ['', '', ''],
    rows: [{ id: '1', department: 'Desp-1', values: [0, 0, 0] }],
  },
  daily: {
    title: '60TH MAHARASHTRA NIRANKARI SANT SAMAGAM',
    date: '',
    rows: [{ id: '1', department: '', values: [0, 0, 0, 0, 0, 0] }],
  },
  master: {
    title: '58th Maharashtra Samagam Dispensary Master Report',
    dates: [],
    locations: [...LOCATIONS],
    values: {},
  },
};

const isValidDate = (value) => {
  if (value === '') return true;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const assert = (condition, message) => {
  if (!condition) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
};

const readTitle = (title, fallback) => {
  const value = typeof title === 'string' ? title.trim() : '';
  assert(value.length <= 200, 'Report title must be 200 characters or fewer.');
  return value || fallback;
};

const readCount = (value) => {
  const count = Number(value);
  assert(Number.isSafeInteger(count) && count >= 0, 'Counts must be non-negative whole numbers.');
  return count;
};

const readRows = (rows, valueCount, allowEmptyDepartment) => {
  assert(Array.isArray(rows) && rows.length <= 200, 'Report must contain no more than 200 rows.');
  return rows.map((row, index) => {
    assert(row && typeof row === 'object' && !Array.isArray(row), 'Invalid report row.');
    const department = typeof row.department === 'string' ? row.department.trim() : '';
    assert(department.length <= 120, 'Department names must be 120 characters or fewer.');
    assert(allowEmptyDepartment || department, 'Department is required.');
    assert(Array.isArray(row.values) && row.values.length === valueCount, 'Invalid row values.');
    return {
      id: String(row.id || index + 1),
      department,
      values: row.values.map(readCount),
    };
  });
};

const normalizeBuilder = (type, input = {}) => {
  assert(input && typeof input === 'object' && !Array.isArray(input), 'Report data must be an object.');
  const defaults = DEFAULTS[type];
  const title = readTitle(input.title, defaults.title);

  if (type === 'registration') {
    assert(Array.isArray(input.dates) && input.dates.length === 3, 'Registration reports require three date columns.');
    assert(input.dates.every(isValidDate), 'Dates must use YYYY-MM-DD format.');
    return {
      title,
      dates: [...input.dates],
      rows: readRows(input.rows, 3, false),
    };
  }

  if (type === 'daily') {
    assert(isValidDate(input.date), 'Date must use YYYY-MM-DD format.');
    return {
      title,
      date: input.date,
      rows: readRows(input.rows, LOCATIONS.length, true),
    };
  }

  assert(Array.isArray(input.dates) && input.dates.length <= 31, 'Master reports support up to 31 dates.');
  assert(input.dates.every((date) => date && isValidDate(date)), 'Dates must use YYYY-MM-DD format.');
  assert(new Set(input.dates).size === input.dates.length, 'Dates cannot be duplicated.');
  assert(Array.isArray(input.locations) && input.locations.length > 0 && input.locations.length <= 20, 'Master reports require 1 to 20 locations.');
  const locations = input.locations.map((location) => {
    assert(typeof location === 'string' && location.trim().length > 0 && location.trim().length <= 120, 'Location names must be 1 to 120 characters.');
    return location.trim();
  });
  assert(new Set(locations).size === locations.length, 'Locations cannot be duplicated.');

  const values = {};
  input.dates.forEach((date) => {
    values[date] = {};
    locations.forEach((location) => {
      const cell = input.values?.[date]?.[location] || {};
      values[date][location] = {
        opd: readCount(cell.opd ?? 0),
        ipd: readCount(cell.ipd ?? 0),
      };
    });
  });
  return { title, dates: [...input.dates], locations, values };
};

exports.getReportBuilder = async (type) => {
  assert(Object.hasOwn(DEFAULTS, type), 'Unknown report type.');
  const data = await readData();
  return data.reportBuilders?.[type] || JSON.parse(JSON.stringify(DEFAULTS[type]));
};

exports.saveReportBuilder = async (type, input) => {
  assert(Object.hasOwn(DEFAULTS, type), 'Unknown report type.');
  const normalized = normalizeBuilder(type, input);
  await updateData((data) => {
    data.reportBuilders ||= {};
    data.reportBuilders[type] = normalized;
  });
  return normalized;
};