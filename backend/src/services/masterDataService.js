const { readData, updateData, getNextArrayId } = require("./localDataStore");

const MODULES = {
  qualification: { extraFieldLabel: null },
  department: { extraFieldLabel: null },
  sewalocation: { extraFieldLabel: null },
  shifttime: { extraFieldLabel: null },
  availableday: { extraFieldLabel: null },
  state: { extraFieldLabel: "countryId" },
  city: { extraFieldLabel: "stateId" },
};

function validateModule(moduleName) {
  if (!MODULES[moduleName]) {
    throw new Error(`Unsupported master module: ${moduleName}`);
  }
}

function normalizePayload(moduleName, payload = {}) {
  const value = (payload.value || payload.name || "").trim();
  const extraId = payload.extra_id ?? payload.extraId ?? payload.countryId ?? payload.stateId ?? null;

  if (!value) {
    throw new Error("Value is required");
  }

  if ((moduleName === "state" || moduleName === "city") && (extraId === null || extraId === "")) {
    throw new Error(`${MODULES[moduleName].extraFieldLabel} is required`);
  }

  return {
    value,
    extraId: extraId === "" ? null : extraId,
    updatedBy: payload.updated_by || payload.updatedBy || 1,
  };
}

exports.listModules = async () => {
  const data = await readData();

  return Object.keys(MODULES).map((key) => ({
    module: key,
    extraFieldLabel: MODULES[key].extraFieldLabel,
    count: (data.masterData[key] || []).filter((item) => !item.isDeleted).length,
  }));
};

exports.listItems = async (moduleName, search = "") => {
  validateModule(moduleName);
  const data = await readData();
  const normalizedSearch = search.trim().toLowerCase();

  return (data.masterData[moduleName] || [])
    .filter((item) => !item.isDeleted)
    .filter((item) => !normalizedSearch || item.value.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => a.value.localeCompare(b.value));
};

exports.createItem = async (moduleName, payload) => {
  validateModule(moduleName);
  const item = normalizePayload(moduleName, payload);
  const timestamp = new Date().toISOString();
  let createdRecord;

  await updateData(async (data) => {
    const items = data.masterData[moduleName];
    const duplicate = items.find(
      (existing) => !existing.isDeleted && existing.value.toLowerCase() === item.value.toLowerCase()
    );

    if (duplicate) {
      throw new Error(`${moduleName} already exists`);
    }

    createdRecord = {
      id: getNextArrayId(items),
      value: item.value,
      extraId: item.extraId,
      createdAt: timestamp,
      updatedAt: timestamp,
      updatedBy: item.updatedBy,
      isDeleted: false,
    };

    items.push(createdRecord);
  });

  return createdRecord;
};

exports.updateItem = async (moduleName, id, payload) => {
  validateModule(moduleName);
  const updates = normalizePayload(moduleName, payload);
  const timestamp = new Date().toISOString();
  let updatedRecord = null;

  await updateData(async (data) => {
    const items = data.masterData[moduleName];
    const item = items.find((entry) => entry.id === Number(id) && !entry.isDeleted);

    if (!item) {
      throw new Error(`${moduleName} record not found`);
    }

    const duplicate = items.find(
      (entry) =>
        entry.id !== Number(id) &&
        !entry.isDeleted &&
        entry.value.toLowerCase() === updates.value.toLowerCase()
    );

    if (duplicate) {
      throw new Error(`${moduleName} already exists`);
    }

    item.value = updates.value;
    item.extraId = updates.extraId;
    item.updatedBy = updates.updatedBy;
    item.updatedAt = timestamp;
    updatedRecord = { ...item };
  });

  return updatedRecord;
};

exports.deleteItem = async (moduleName, id, deletedBy = 1) => {
  validateModule(moduleName);
  let deletedRecord = null;

  await updateData(async (data) => {
    const items = data.masterData[moduleName];
    const item = items.find((entry) => entry.id === Number(id) && !entry.isDeleted);

    if (!item) {
      throw new Error(`${moduleName} record not found`);
    }

    item.isDeleted = true;
    item.updatedBy = deletedBy;
    item.updatedAt = new Date().toISOString();
    deletedRecord = { ...item };
  });

  return deletedRecord;
};
