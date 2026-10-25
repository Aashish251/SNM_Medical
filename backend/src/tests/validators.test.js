const { validators } = require("../utils/validators");

describe("registration validators", () => {
  it.each(["user@example.com", "firstname.lastname@company.co.in"])(
    "accepts valid email %s",
    (email) => expect(validators.email(email)).toBe(true)
  );

  it.each(["user@", "user.com", "user@@example.com", "user@example.c"])(
    "rejects invalid email %s",
    (email) => expect(validators.email(email)).toBe(false)
  );

  it.each(["0", "0.5", "1", "2.5", "5.0", "12.3", "20.5", "50"])(
    "accepts %s years of experience",
    (experience) => expect(validators.experience(experience)).toBe(true)
  );

  it.each(["-1", "50.1", "51", "12.34", "1..2", "abc"])(
    "rejects %s years of experience",
    (experience) => expect(validators.experience(experience)).toBe(false)
  );
});
