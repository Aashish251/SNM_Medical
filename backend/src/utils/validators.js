// All validation rules in one place
exports.validators = {
  email: (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email || "").trim()),
  experience: (value) => {
    const text = String(value ?? "");
    return /^\d{1,2}(?:\.\d)?$/.test(text) && Number(text) >= 0 && Number(text) <= 50;
  },
  mobile: (mobile) => /^[6-9]\d{9}$/.test(mobile),
  password: (password) => Boolean(password && String(password).trim().length >= 6),
  name: (name) => /^[a-zA-Z\s]{2,50}$/.test(name),
};
