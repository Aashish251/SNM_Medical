const { AppError } = require("../utils/errorHandler");
const { promisePool } = require("../config/database");

const MODULES = {
  qualification: {
    label: "Qualifications",
    singularLabel: "Qualification",
    table: "qualification_tbl",
    valueColumn: "qualification_name",
    procedure: "CALL sp_get_qualification_by_id(?)",
    params: [0],
    idFields: ["id", "qualification_id"],
    valueFields: ["qualification_name", "name"],
  },
  department: {
    label: "Departments",
    singularLabel: "Department",
    table: "department_tbl",
    valueColumn: "department_name",
    procedure: "CALL sp_department_master(?, ?, ?, ?, ?)",
    params: ["GET", null, null, null, null],
    idFields: ["id", "department_id"],
    valueFields: ["department_name", "name"],
  },
  sewalocation: {
    label: "Sewa Locations",
    singularLabel: "Sewa Location",
    table: "sewalocation_tbl",
    valueColumn: "sewalocation_name",
    procedure: "CALL sp_get_sewalocation_by_id(?)",
    params: [0],
    idFields: ["id", "sewalocation_id"],
    valueFields: ["sewalocation_name", "name", "location_name"],
  },
  shifttime: {
    label: "Shift Times",
    singularLabel: "Shift Time",
    table: "shifttime_tbl",
    valueColumn: "shifttime",
    procedure: "CALL sp_get_shifttime_by_id(?)",
    params: [0],
    idFields: ["id", "shifttime_id"],
    valueFields: ["shifttime", "shifttime_name", "name"],
  },
  availableday: {
    label: "Availability",
    singularLabel: "Availability",
    table: "available_day_tbl",
    valueColumn: "available_day",
    procedure: "CALL sp_get_available_day_by_id(?)",
    params: [0],
    idFields: ["id", "available_day_id"],
    valueFields: ["available_day", "available_day_name", "name"],
  },
  state: {
    label: "States",
    singularLabel: "State",
    table: "state_tbl",
    valueColumn: "state_name",
    procedure: "CALL sp_get_state_details(?)",
    params: [null],
    idFields: ["id", "state_id"],
    valueFields: ["state_name", "name"],
  },
  city: {
    label: "Cities",
    singularLabel: "City",
    table: "city_tbl",
    valueColumn: "city_name",
    procedure: "CALL sp_get_city_details(?)",
    params: [null],
    idFields: ["id", "city_id"],
    valueFields: ["city_name", "name"],
  },
};

function getModule(moduleName) {
  const module = MODULES[moduleName];
  if (!module) {
    throw new AppError(`Unsupported master module: ${moduleName}`, 400);
  }
  return module;
}

function getField(row, fields) {
  for (const field of fields) {
    if (row[field] !== undefined && row[field] !== null) {
      return row[field];
    }
  }
  return null;
}

async function getRows(moduleName, search = "") {
  const module = getModule(moduleName);
  if (moduleName === "city") {
    const [rows] = await promisePool.execute(
      `SELECT id, city_name, state_id
       FROM city_tbl
       WHERE is_deleted = 0
         AND (? = '' OR city_name LIKE CONCAT('%', ?, '%'))
       ORDER BY city_name`,
      [search.trim(), search.trim()]
    );
    return rows.map((row) => ({
      ...row,
      value: row.city_name,
    }));
  }

  const params =
    moduleName === "department" && search.trim()
      ? ["GET", null, null, null, search.trim()]
      : module.params;
  const [resultSets] = await promisePool.execute(module.procedure, params);
  const rows = resultSets[0] || [];
  const normalizedSearch = search.trim().toLowerCase();

  return rows
    .map((row) => ({
      ...row,
      id: getField(row, module.idFields),
      value: getField(row, module.valueFields),
    }))
    .filter((row) => row.id !== null && row.value !== null)
    .filter(
      (row) =>
        !normalizedSearch ||
        String(row.value).toLowerCase().includes(normalizedSearch)
    );
}

exports.listModules = async () =>
  Promise.all(
    Object.entries(MODULES).map(async ([module, config]) => ({
      module,
      label: config.label,
      count: (await getRows(module)).length,
    }))
  );

exports.listItems = async (moduleName, search = "") =>
  getRows(moduleName, search);

exports.createItem = async (moduleName, payload, userId) => {
  const module = getModule(moduleName);
  const value = String(payload.value || payload.name || "").trim();
  if (!value || value.length > 100) {
    throw new AppError("Value is required and must be 100 characters or fewer", 400);
  }

  const updatedBy = Number(userId);
  if (!Number.isInteger(updatedBy) || updatedBy < 1) {
    throw new AppError("A valid signed-in user is required", 401);
  }

  const columns = [module.valueColumn];
  const values = [value];
  const placeholders = ["?"];
  const extraConditions = [];

  if (moduleName === "state") {
    const countryId = Number(payload.countryId);
    if (!Number.isInteger(countryId) || countryId < 1) {
      throw new AppError("A valid country ID is required for a state", 400);
    }
    columns.push("country_id");
    values.push(countryId);
    placeholders.push("?");
    extraConditions.push("country_id = ?");
  }

  if (moduleName === "city") {
    const stateId = Number(payload.stateId);
    if (!Number.isInteger(stateId) || stateId < 1) {
      throw new AppError("A valid state is required for a city", 400);
    }
    const [states] = await promisePool.execute(
      "SELECT id FROM state_tbl WHERE id = ? AND is_deleted = 0 LIMIT 1",
      [stateId]
    );
    if (!states.length) {
      throw new AppError("Selected state was not found", 400);
    }
    columns.push("state_id");
    values.push(stateId);
    placeholders.push("?");
    extraConditions.push("state_id = ?");
  }

  const duplicateSql = `SELECT id FROM ${module.table}
    WHERE ${module.valueColumn} = ? AND is_deleted = 0
    ${extraConditions.length ? `AND ${extraConditions.join(" AND ")}` : ""}
    LIMIT 1`;
  const [duplicates] = await promisePool.execute(duplicateSql, [
    value,
    ...values.slice(1),
  ]);
  if (duplicates.length) {
    throw new AppError(`${module.singularLabel} already exists`, 409);
  }

  if (["qualification", "department", "sewalocation", "shifttime", "availableday"].includes(moduleName)) {
    columns.push("created_datetime", "updated_datetime", "updated_by");
    values.push(updatedBy);
    placeholders.push("NOW()", "NOW()", "?");
  }

  columns.push("is_deleted");
  values.push(0);
  placeholders.push("?");

  const [result] = await promisePool.execute(
    `INSERT INTO ${module.table} (${columns.join(", ")})
     VALUES (${placeholders.join(", ")})`,
    values
  );

  return {
    id: result.insertId,
    value,
    ...(moduleName === "city" ? { stateId: Number(payload.stateId) } : {}),
    ...(moduleName === "state" ? { countryId: Number(payload.countryId) } : {}),
  };
};

exports.updateItem = async (moduleName, id, payload) => {
  if (moduleName !== "department") {
    throw new AppError("Update is not supported for this master module", 405);
  }
  const value = String(payload.value || payload.name || "").trim();
  if (!value || value.length > 100) {
    throw new AppError("Value is required and must be 100 characters or fewer", 400);
  }
  await promisePool.execute(MODULES.department.procedure, [
    "UPDATE",
    Number(id),
    value,
    Number(payload.updatedBy) || 1,
    null,
  ]);
  return { id: Number(id), value };
};

exports.deleteItem = async (moduleName, id, deletedBy = 1) => {
  if (moduleName !== "department") {
    throw new AppError("Delete is not supported for this master module", 405);
  }
  await promisePool.execute(MODULES.department.procedure, [
    "DELETE",
    Number(id),
    null,
    Number(deletedBy) || 1,
    null,
  ]);
  return { id: Number(id), isDeleted: true };
};
