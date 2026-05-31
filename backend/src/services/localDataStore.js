const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/app-data.json");

const DEFAULT_DATA = Object.freeze({
  bloodDrives: [],
  healthDrives: [],
  eligibilityChecks: [],
  patientRegistrations: [],
  dutyCharts: [],
  masterData: {
    qualification: [],
    department: [],
    sewalocation: [],
    shifttime: [],
    availableday: [],
    state: [],
    city: [],
  },
});

let writeQueue = Promise.resolve();

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function mergeWithDefaults(data = {}) {
  const merged = cloneDefaults();

  return {
    ...merged,
    ...data,
    masterData: {
      ...merged.masterData,
      ...(data.masterData || {}),
    },
  };
}

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(cloneDefaults(), null, 2), "utf8");
  }
}

async function readData() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return mergeWithDefaults(raw ? JSON.parse(raw) : {});
}

async function updateData(mutator) {
  writeQueue = writeQueue.catch(() => undefined).then(async () => {
    const current = await readData();
    const draft = mergeWithDefaults(current);
    await mutator(draft);
    const finalData = mergeWithDefaults(draft);
    await fs.writeFile(DATA_FILE, JSON.stringify(finalData, null, 2), "utf8");
    return finalData;
  });

  return writeQueue;
}

function getNextArrayId(items = []) {
  return items.reduce((maxId, item) => {
    const currentId = Number(item.id) || 0;
    return currentId > maxId ? currentId : maxId;
  }, 0) + 1;
}

module.exports = {
  readData,
  updateData,
  getNextArrayId,
};
