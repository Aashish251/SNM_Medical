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
