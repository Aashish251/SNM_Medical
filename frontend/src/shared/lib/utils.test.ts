import { afterEach, describe, expect, it, vi } from "vitest";
import { calculateAge, isValidBirthdate } from "./utils";

describe("birthdate utilities", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates age using the birthday, not just the birth year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 25));

    expect(calculateAge("2002-09-20")).toBe(24);
    expect(calculateAge("2002-11-20")).toBe(23);
  });

  it("rejects impossible, future, and implausibly old birthdates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 25));

    expect(isValidBirthdate("0002-09-20")).toBe(false);
    expect(calculateAge("0002-09-20")).toBe(0);
    expect(isValidBirthdate("2027-01-01")).toBe(false);
    expect(isValidBirthdate("2001-02-29")).toBe(false);
  });

  it("accepts leap-day birthdates on leap years", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 28));

    expect(isValidBirthdate("2000-02-29")).toBe(true);
    expect(calculateAge("2000-02-29")).toBe(25);
  });
});
