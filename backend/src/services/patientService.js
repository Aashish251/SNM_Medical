const { promisePool } = require("../config/database");
const { validators } = require("../utils/validators");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../utils/errorHandler");

const PATIENT_SELECT = `
  SELECT
    id,
    regn_no AS regnNo,
    DATE_FORMAT(visit_date, '%Y-%m-%d') AS date,
    patient_name AS patientName,
    guardian_name AS guardianName,
    age,
    gender,
    phone AS mobileNumber,
    email,
    address,
    disease,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM patient_registration
`;

function ensureRequired(value, label) {
  if (value === undefined || value === null || value === "") {
    throw new BadRequestError(`${label} is required`);
  }
}

function normalizePayload(payload = {}) {
  const regnNo = payload.regnNo ?? payload.regn;
  const rawDate = payload.date ?? payload.visitDate;
  const patientName = payload.patientName ?? payload.name;
  const mobileNumber =
    payload.mobileNumber ?? payload.mobile ?? payload.phone;
  const guardianName =
    payload.guardianName ?? payload.guardian ?? payload.fatherOrSpouseName ?? "";
  const genderValue = String(payload.gender ?? payload.sex ?? "").trim();
  const gender = ["male", "female", "other"].find(
    (value) => value === genderValue.toLowerCase()
  );
  const age =
    payload.age === undefined || payload.age === null || payload.age === ""
      ? null
      : Number(payload.age);
  const disease = payload.disease ?? payload.symptoms;

  ensureRequired(regnNo, "Registration number");
  ensureRequired(rawDate, "Date");
  ensureRequired(patientName, "Patient name");
  ensureRequired(mobileNumber, "Mobile number");
  ensureRequired(payload.address, "Address");
  ensureRequired(gender, "Gender");
  ensureRequired(disease, "Disease / symptoms");

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new BadRequestError("Date must be a valid date");
  }

  if (!validators.mobile(String(mobileNumber))) {
    throw new BadRequestError("Mobile number must be a valid 10-digit number");
  }

  const email = String(payload.email ?? "").trim();
  if (email && !validators.email(email)) {
    throw new BadRequestError("Email must be a valid email address");
  }

  if (age !== null && (!Number.isInteger(age) || age < 0)) {
    throw new BadRequestError("Age must be a non-negative whole number");
  }

  const normalizedGender = gender[0].toUpperCase() + gender.slice(1);

  return {
    regnNo: String(regnNo).trim(),
    date: parsedDate.toISOString().slice(0, 10),
    patientName: String(patientName).trim(),
    guardianName: String(guardianName).trim(),
    age,
    gender: normalizedGender,
    mobileNumber: String(mobileNumber).trim(),
    email,
    address: String(payload.address).trim(),
    disease: String(disease).trim(),
  };
}

function mapPatientRow(row) {
  if (!row) return null;

  return {
    ...row,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : row.createdAt,
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt.toISOString()
        : row.updatedAt,
  };
}

async function findDuplicate(regnNo, date, excludedId) {
  const query = excludedId
    ? `SELECT id FROM patient_registration
       WHERE regn_no = ? AND visit_date = ? AND id <> ? LIMIT 1`
    : `SELECT id FROM patient_registration
       WHERE regn_no = ? AND visit_date = ? LIMIT 1`;
  const values = excludedId
    ? [regnNo, date, excludedId]
    : [regnNo, date];
  const [rows] = await promisePool.execute(query, values);

  if (rows.length > 0) {
    throw new ConflictError(
      "Patient registration already exists for this registration number and date"
    );
  }
}

exports.createPatientRegistration = async (payload) => {
  const patient = normalizePayload(payload);
  await findDuplicate(patient.regnNo, patient.date);

  const [result] = await promisePool.execute(
    `INSERT INTO patient_registration (
      regn_no, visit_date, patient_name, guardian_name, age, gender,
      phone, email, address, disease, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      patient.regnNo,
      patient.date,
      patient.patientName,
      patient.guardianName,
      patient.age,
      patient.gender,
      patient.mobileNumber,
      patient.email,
      patient.address,
      patient.disease,
    ]
  );

  return exports.getPatientRegistrationById(result.insertId);
};

exports.listPatientRegistrations = async () => {
  const [rows] = await promisePool.execute(
    `${PATIENT_SELECT} ORDER BY visit_date DESC, id DESC`
  );
  return rows.map(mapPatientRow);
};

exports.getPatientRegistrationById = async (id) => {
  const patientId = Number(id);
  if (!Number.isInteger(patientId) || patientId <= 0) {
    throw new BadRequestError("Patient registration ID must be a positive integer");
  }

  const [rows] = await promisePool.execute(
    `${PATIENT_SELECT} WHERE id = ? LIMIT 1`,
    [patientId]
  );
  return mapPatientRow(rows[0]);
};

exports.updatePatientRegistration = async (id, payload) => {
  const patientId = Number(id);
  if (!Number.isInteger(patientId) || patientId <= 0) {
    throw new BadRequestError("Patient registration ID must be a positive integer");
  }

  const patient = normalizePayload(payload);
  const existing = await exports.getPatientRegistrationById(patientId);
  if (!existing) {
    throw new NotFoundError("Patient registration not found");
  }

  await findDuplicate(patient.regnNo, patient.date, patientId);

  await promisePool.execute(
    `UPDATE patient_registration
     SET regn_no = ?, visit_date = ?, patient_name = ?, guardian_name = ?,
         age = ?, gender = ?, phone = ?, email = ?, address = ?, disease = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      patient.regnNo,
      patient.date,
      patient.patientName,
      patient.guardianName,
      patient.age,
      patient.gender,
      patient.mobileNumber,
      patient.email,
      patient.address,
      patient.disease,
      patientId,
    ]
  );

  return exports.getPatientRegistrationById(patientId);
};

exports.deletePatientRegistration = async (id) => {
  const patientId = Number(id);
  if (!Number.isInteger(patientId) || patientId <= 0) {
    throw new BadRequestError("Patient registration ID must be a positive integer");
  }

  const [result] = await promisePool.execute(
    "DELETE FROM patient_registration WHERE id = ?",
    [patientId]
  );
  if (result.affectedRows === 0) {
    throw new NotFoundError("Patient registration not found");
  }
};
