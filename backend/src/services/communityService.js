const { validators } = require("../utils/validators");
const { readData, updateData, getNextArrayId } = require("./localDataStore");

function validateEmail(email) {
  if (email && !validators.email(email)) {
    throw new Error("Email must be a valid email address");
  }
}

function validatePhone(phone) {
  if (phone && !validators.mobile(phone)) {
    throw new Error("Phone must be a valid 10-digit mobile number");
  }
}

function ensureRequired(value, label) {
  if (!value && value !== 0) {
    throw new Error(`${label} is required`);
  }
}

function createTimestamp() {
  return new Date().toISOString();
}

function validateDate(value, label) {
  const parsed = new Date(value);

  if (!value || Number.isNaN(parsed.getTime())) {
    throw new Error(`${label} must be a valid date`);
  }
}

function normalizeBloodDrive(payload = {}) {
  const record = {
    organizerName: payload.organizer_name || payload.organizerName,
    address: payload.address,
    landmark: payload.landmark || "",
    driveDate: payload.drive_date || payload.driveDate,
    startTime: payload.start_time || payload.startTime,
    endTime: payload.end_time || payload.endTime,
    phone: payload.phone || "",
    email: payload.email || "",
    entryType: payload.entry_type || payload.entryType,
  };

  ensureRequired(record.organizerName, "Organizer name");
  ensureRequired(record.address, "Address");
  ensureRequired(record.driveDate, "Drive date");
  ensureRequired(record.startTime, "Start time");
  ensureRequired(record.endTime, "End time");
  ensureRequired(record.entryType, "Entry type");
  validateDate(record.driveDate, "Drive date");
  validatePhone(record.phone);
  validateEmail(record.email);

  return record;
}

function normalizeHealthDrive(payload = {}) {
  const record = {
    organizerName: payload.organizer_name || payload.organizerName,
    address: payload.address,
    landmark: payload.landmark || "",
    campDate: payload.camp_date || payload.campDate,
    startTime: payload.start_time || payload.startTime,
    endTime: payload.end_time || payload.endTime,
    services: payload.services || "",
    phone: payload.phone || "",
    email: payload.email || "",
    registrationType: payload.registration_type || payload.registrationType,
    notes: payload.notes || "",
  };

  ensureRequired(record.organizerName, "Organizer name");
  ensureRequired(record.address, "Address");
  ensureRequired(record.campDate, "Camp date");
  ensureRequired(record.startTime, "Start time");
  ensureRequired(record.endTime, "End time");
  ensureRequired(record.registrationType, "Registration type");
  validateDate(record.campDate, "Camp date");
  validatePhone(record.phone);
  validateEmail(record.email);

  return record;
}

exports.createBloodDrive = async (payload) => {
  const drive = normalizeBloodDrive(payload);
  const timestamp = createTimestamp();
  let createdRecord;

  await updateData(async (data) => {
    createdRecord = {
      id: getNextArrayId(data.bloodDrives),
      ...drive,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    data.bloodDrives.push(createdRecord);
  });

  return createdRecord;
};

exports.listBloodDrives = async () => {
  const data = await readData();
  return [...data.bloodDrives].sort((a, b) => String(b.driveDate).localeCompare(String(a.driveDate)));
};

exports.getBloodDriveById = async (id) => {
  const data = await readData();
  return data.bloodDrives.find((item) => item.id === Number(id)) || null;
};

exports.createHealthDrive = async (payload) => {
  const drive = normalizeHealthDrive(payload);
  const timestamp = createTimestamp();
  let createdRecord;

  await updateData(async (data) => {
    createdRecord = {
      id: getNextArrayId(data.healthDrives),
      ...drive,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    data.healthDrives.push(createdRecord);
  });

  return createdRecord;
};

exports.listHealthDrives = async () => {
  const data = await readData();
  return [...data.healthDrives].sort((a, b) => String(b.campDate).localeCompare(String(a.campDate)));
};

exports.getHealthDriveById = async (id) => {
  const data = await readData();
  return data.healthDrives.find((item) => item.id === Number(id)) || null;
};

exports.checkBloodDonationEligibility = async (payload = {}) => {
  const age = Number(payload.age);
  const weight = Number(payload.weight);
  const hemoglobin = Number(payload.hb ?? payload.hemoglobin);
  const illness = String(payload.illness || "").toLowerCase();
  const lastDonationDate = payload.lastDonation || payload.last_donation_date || null;
  const driveId = payload.driveId ? Number(payload.driveId) : null;

  if (!Number.isFinite(age)) throw new Error("Age is required");
  if (!Number.isFinite(weight)) throw new Error("Weight is required");
  if (!Number.isFinite(hemoglobin)) throw new Error("Hemoglobin is required");
  if (!illness) throw new Error("Recent illness selection is required");
  if (lastDonationDate) validateDate(lastDonationDate, "Last donation date");

  let eligible = true;
  let reason = "Eligible to Donate";

  if (age < 18 || age > 65) {
    eligible = false;
    reason = "Age must be between 18 and 65.";
  } else if (weight < 50) {
    eligible = false;
    reason = "Minimum weight should be 50 kg.";
  } else if (hemoglobin < 12.5) {
    eligible = false;
    reason = "Hemoglobin too low.";
  } else if (illness === "yes") {
    eligible = false;
    reason = "Recent illness detected.";
  } else if (lastDonationDate) {
    const today = new Date();
    const lastDate = new Date(lastDonationDate);
    const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

    if (diffDays < 90) {
      eligible = false;
      reason = "Minimum 3 months gap required since last donation.";
    }
  }

  const result = {
    eligible,
    reason,
    checkedAt: createTimestamp(),
    inputs: {
      age,
      weight,
      hemoglobin,
      illness,
      lastDonationDate,
      driveId,
    },
  };

  await updateData(async (data) => {
    data.eligibilityChecks.push({
      id: getNextArrayId(data.eligibilityChecks),
      ...result,
    });
  });

  return result;
};
