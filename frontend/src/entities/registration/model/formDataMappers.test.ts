import { describe, expect, it } from "vitest";
import {
  createRegistrationFormData,
  createUpdateProfileFormData,
} from "@entities/registration/model/formDataMappers";
import type { FormValues } from "@shared/types/CommonType";

const baseFormValues: FormValues = {
  fullName: "Test User",
  email: "test@example.com",
  mobileNo: "9876543210",
  dateOfBirth: "1990-01-01",
  address: "123 Street",
  stateId: "1",
  cityId: "2",
  departmentId: "3",
  qualificationId: "4",
  title: "Mr",
  age: 30,
  shiftTimeId: "morning",
  availableDayId: "monday",
  gender: "Male",
  userType: "ms",
  experience: "5",
  lastSewa: "2024",
  recommendedBy: "Admin",
  samagamHeldIn: "Delhi",
  favoriteFood: "Rice",
  childhoodNickname: "Nick",
  motherMaidenName: "Smith",
  hobbies: "Reading",
  password: "secret123",
  confirmPassword: "secret123",
  remark: "Updated profile",
};

describe("formDataMappers", () => {
  it("builds registration FormData with credentials", () => {
    const formData = createRegistrationFormData(baseFormValues);

    expect(formData.get("fullName")).toBe("Test User");
    expect(formData.get("email")).toBe("test@example.com");
    expect(formData.get("password")).toBe("secret123");
    expect(formData.get("confirmPassword")).toBe("secret123");
    expect(formData.get("id")).toBeNull();
    expect(formData.get("remark")).toBeNull();
  });

  it("builds update profile FormData with id and remark", () => {
    const formData = createUpdateProfileFormData(baseFormValues, 42);

    expect(formData.get("id")).toBe("42");
    expect(formData.get("remark")).toBe("Updated profile");
    expect(formData.get("password")).toBeNull();
    expect(formData.get("confirmPassword")).toBeNull();
  });
});
