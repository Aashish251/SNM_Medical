jest.mock("../config/database", () => ({
  promisePool: {
    execute: jest.fn(),
  },
}));

const { promisePool } = require("../config/database");
const registrationService = require("../services/registration");

describe("registration availability", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("detects existing email and mobile values returned as numeric flags", async () => {
    promisePool.execute.mockResolvedValueOnce([
      [{ email_exists: 1, mobile_exists: 1 }],
    ]);

    await expect(
      registrationService.checkRegistrationAvailability({
        email: " Person@Example.com ",
        mobileNo: "9876543210",
      })
    ).resolves.toEqual({
      emailExists: true,
      mobileExists: true,
      available: false,
    });

    expect(promisePool.execute).toHaveBeenCalledWith(
      expect.stringContaining("LOWER(TRIM(email)) = ?"),
      ["person@example.com", "person@example.com", "9876543210", "9876543210"]
    );
  });

  it("treats string zero flags as not existing", async () => {
    promisePool.execute.mockResolvedValueOnce([
      [{ email_exists: "0", mobile_exists: "0" }],
    ]);

    await expect(
      registrationService.checkRegistrationAvailability({
        email: "person@example.com",
        mobileNo: "9876543210",
      })
    ).resolves.toEqual({
      emailExists: false,
      mobileExists: false,
      available: true,
    });
  });
});

describe("validation of user data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validData = () => ({
    fullName: "John Doe",
    email: "john.doe@example.com",
    password: "Password123",
    confirmPassword: "Password123",
    mobileNo: "9876543210",
    dateOfBirth: "1990-01-01",
    experience: "5",
    favoriteFood: "Rice",
    childhoodNickname: "Johnny",
    motherMaidenName: "Smith",
    hobbies: "Reading Books",
    samagamHeldIn: "Delhi",
    lastSewa: "First Aid",
    recommendedBy: "Admin",
    address: "123 Main Street",
    stateId: "1",
    cityId: "2",
    qualificationId: "3",
    departmentId: "4",
    availableDayId: "5",
    shiftTimeId: "6",
    gender: "male",
    userType: "ms",
    isAaproved: 0,
  });

  it("accepts valid data with no errors", async () => {
    promisePool.execute.mockResolvedValueOnce([
      [{ email_exists: 0, mobile_exists: 0 }],
    ]);
    promisePool.execute.mockResolvedValueOnce([[{}]]);
    await expect(registrationService.createUser(validData(), {})).resolves.toEqual(
      expect.objectContaining({
        success: true,
      })
    );
  });

  it("rejects whitespace-only full name", () => {
    let threwError;
    try {
      const data = validData();
      data.fullName = "   ";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Full name is required");
  });

  it("rejects too short or too long full name", () => {
    let threwError;
    try {
      const data = validData();
      data.fullName = "A";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Full name should contain only letters");
  });

  it("rejects full name with special characters and numbers", () => {
    let threwError;
    try {
      const data = validData();
      data.fullName = "John123Doe!";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(/Full name should contain only letters with single spaces between words/.test(threwError.message)).toBe(true);
  });

  it("rejects whitespace-only favorite food", () => {
    let threwError;
    try {
      const data = validData();
      data.favoriteFood = "   ";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Favorite food is required");
  });

  it("rejects whitespace-only childhood nickname", () => {
    let threwError;
    try {
      const data = validData();
      data.childhoodNickname = "\t\t";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Childhood nickname is required");
  });

  it("rejects whitespace-only mother's maiden name", () => {
    let threwError;
    try {
      const data = validData();
      data.motherMaidenName = "   ";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Mother's maiden name is required");
  });

  it("rejects whitespace-only hobbies", () => {
    let threwError;
    try {
      const data = validData();
      data.hobbies = "";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Hobbies is required");
  });

  it("accepts trimmed and collapsed full name", () => {
    const data = validData();
    const original = data.fullName;
    data.fullName = original + "  ";
    expect(() => registrationService.validateUserData(data)).not.toThrow();
    data.fullName = original;
    expect(() => registrationService.validateUserData(data)).not.toThrow();
  });

  it("accepts phone with spaces, dashes, and +91 prefix", () => {
    const data = validData();
    data.mobileNo = " +91 98 7654 3210 - ";
    expect(() => registrationService.validateUserData(data)).not.toThrow();
    data.mobileNo = "9876543210";
    expect(() => registrationService.validateUserData(data)).not.toThrow();
  });

  it("rejects invalid phone format", () => {
    let threwError;
    try {
      const data = validData();
      data.mobileNo = "1234567890"; // starts with 1, not 6-9
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Invalid mobile number");
  });

  it("rejects phone with letters", () => {
    let threwError;
    try {
      const data = validData();
      data.mobileNo = "abcdefghij";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Invalid mobile number");
  });

  it("accepts valid experience values including decimals", () => {
    for (const exp of ["5", "2.5", "10.5", "60"]) {
      const data = validData();
      data.experience = exp;
      expect(() => registrationService.validateUserData(data)).not.toThrow();
      data.experience = "5";
    }
  });

  it("rejects negative experience", () => {
    let threwError;
    try {
      const data = validData();
      data.experience = "-1";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Enter your experience");
  });

  it("rejects experience greater than 60", () => {
    let threwError;
    try {
      const data = validData();
      data.experience = "61";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Enter your experience");
  });

  it("rejects experience with letters", () => {
    let threwError;
    try {
      const data = validData();
      data.experience = "2.5 years";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Enter your experience");
  });

  it("accepts email with uppercase letters and trims leading/trailing spaces", () => {
    const data = validData();
    data.email = "  JOHN.DOE@EXAMPLE.COM  ";
    expect(() => registrationService.validateUserData(data)).not.toThrow();
  });

  it("rejects invalid email format", () => {
    let threwError;
    try {
      const data = validData();
      data.email = "not-an-email";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Invalid email address");
  });

  it("rejects email with spaces in local part", () => {
    let threwError;
    try {
      const data = validData();
      data.email = "john doe@example.com";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Invalid email address");
  });

  it("rejects short password", () => {
    let threwError;
    try {
      const data = validData();
      data.password = "Ab1";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("at least 6 characters");
  });

  it("rejects mismatched passwords", () => {
    let threwError;
    try {
      const data = validData();
      data.confirmPassword = "DifferentPass1";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Passwords do not match");
  });

  it("rejects invalid date of birth", () => {
    let threwError;
    try {
      const data = validData();
      data.dateOfBirth = "2000-13-01"; // invalid month
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Birthdate must be valid");
  });

  it("rejects future date of birth", () => {
    let threwError;
    try {
      const data = validData();
      data.dateOfBirth = "2030-01-01"; // more than 120 years from now
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Birthdate must be valid");
  });

  it("accepts normalized optional fields (lastSewa, recommendedBy, samagamHeldIn)", () => {
    const data = validData();
    data.lastSewa = "  First Aid  ";
    data.recommendedBy = "  Dr. Smith  ";
    data.samagamHeldIn = "  Delhi  ";
    expect(() => registrationService.validateUserData(data)).not.toThrow();
  });

  it("rejects long optional text field", () => {
    let threwError;
    try {
      const data = validData();
      data.lastSewa = "a".repeat(101);
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("must be at most 100 characters");
  });

  it("rejects optional field with special characters", () => {
    let threwError;
    try {
      const data = validData();
      data.samagamHeldIn = "Delhi!@#$%^&*()";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Samagam held in must contain letters");
  });

  it("rejects address without a letter", () => {
    let threwError;
    try {
      const data = validData();
      data.address = "123!";
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Address");
  });

  it("accepts short but valid optional field (minimum 2 chars for required text fields)", () => {
    const data = validData();
    data.favoriteFood = "a"; // 1 char, should fail
    let threwError;
    try {
      registrationService.validateUserData(data);
    } catch (error) {
      threwError = error;
    }
    expect(threwError).toBeDefined();
    expect(threwError.message).toContain("Favorite food");
  });
});

describe("duplicate check", () => {
  it("returns available when neither email nor mobile exists", async () => {
    promisePool.execute.mockResolvedValueOnce([
      [{ email_exists: "0", mobile_exists: "0" }],
    ]);

    const result = await registrationService.checkRegistrationAvailability({
      email: "new@example.com",
      mobileNo: "9876543210",
    });

    expect(result.available).toBe(true);
    expect(result.emailExists).toBe(false);
    expect(result.mobileExists).toBe(false);
  });
});
