const { validators } = require("../utils/validators");
const { readData, updateData, getNextArrayId } = require("./localDataStore");

function ensureRequired(value, label) {
  if (!value && value !== 0) {
    throw new Error(`${label} is required`);
  }
}

function normalizePayload(payload = {}) {
  const record = {
    regnNo: payload.regn || payload.regnNo,
    date: payload.date,
    patientName: payload.name || payload.patientName,
    mobileNumber: payload.mobile || payload.mobileNumber || payload.phone,
    email: payload.email || "",
    address: payload.address,
    guardianName: payload.guardian || payload.guardianName || "",
    age: payload.age ? Number(payload.age) : null,
    gender: payload.sex || payload.gender,
    disease: payload.disease || payload.symptoms,
  };

  ensureRequired(record.regnNo, "Registration number");
  ensureRequired(record.date, "Date");
  ensureRequired(record.patientName, "Patient name");
  ensureRequired(record.mobileNumber, "Mobile number");
  ensureRequired(record.address, "Address");
  ensureRequired(record.gender, "Gender");
  ensureRequired(record.disease, "Disease / symptoms");

  if (Number.isNaN(new Date(record.date).getTime())) {
    throw new Error("Date must be a valid date");
  }

  if (!validators.mobile(String(record.mobileNumber))) {
    throw new Error("Mobile number must be a valid 10-digit number");
  }

  if (record.email && !validators.email(record.email)) {
    throw new Error("Email must be a valid email address");
  }

  return record;
}

exports.createPatientRegistration = async (payload) => {
  const patient = normalizePayload(payload);
  const timestamp = new Date().toISOString();
  let createdRecord;

  await updateData(async (data) => {
    const duplicate = data.patientRegistrations.find(
      (item) => item.regnNo === patient.regnNo && item.date === patient.date
    );

    if (duplicate) {
      throw new Error("Patient registration already exists for this registration number and date");
    }

    createdRecord = {
      id: getNextArrayId(data.patientRegistrations),
      ...patient,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    data.patientRegistrations.push(createdRecord);
  });

  return createdRecord;
};

exports.listPatientRegistrations = async () => {
  const data = await readData();
  return [...data.patientRegistrations].sort((a, b) => String(b.date).localeCompare(String(a.date)));
};

exports.getPatientRegistrationById = async (id) => {
  const data = await readData();
  return data.patientRegistrations.find((item) => item.id === Number(id)) || null;
};
