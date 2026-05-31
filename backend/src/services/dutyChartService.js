const { readData, updateData, getNextArrayId } = require("./localDataStore");

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
  };

  ensureRequired(entry.name, "Name");
  ensureRequired(entry.contact, "Contact number");
  ensureRequired(entry.shift, "Duty shift");

  return entry;
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

exports.listCharts = async ({ department, year } = {}) => {
  const data = await readData();

  return data.dutyCharts
    .filter((chart) => !department || chart.department === department)
    .filter((chart) => !year || String(chart.year) === String(year))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map(summarizeChart);
};

exports.getChartById = async (chartId) => {
  const data = await readData();
  return data.dutyCharts.find((chart) => chart.id === Number(chartId)) || null;
};

exports.createEntry = async (payload) => {
  const chartInput = normalizeChartPayload(payload);
  const entryInput = normalizeEntryPayload(payload);
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
