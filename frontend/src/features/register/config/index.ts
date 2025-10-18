import { City, FormValues } from "../type";

export const STEPS = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Professional" },
  { id: 3, title: "Login" },
];

export const DUMMY = {
  availabilities: [
    { id: 1, label: "Weekdays", value: "Weekdays" },
    { id: 2, label: "Weekends", value: "Weekends" },
    { id: 3, label: "Both", value: "Both" },
  ],
  shifts: [
    { id: 1, label: "Morning", value: "Morning" },
    { id: 2, label: "Afternoon", value: "Afternoon" },
    { id: 3, label: "Evening", value: "Evening" },
    { id: 4, label: "Night" , value: "Night"},
  ],
  titles: [
    { id: 1, label: "Mr", value: "Mr" },
    { id: 2, label: "Mrs", value: "Mrs" },
    { id: 3, label: "Ms", value: "Ms" },
    { id: 4, label: "Dr", value: "Dr" },
  ],
  genders: [
    { id: 1, label: "Male", value: "Male" },
    { id: 2, label: "Female", value: "Female" },
    { id: 3, label: "Other", value: "Other" },
  ],
};

export const requiredFields: Record<number, (keyof FormValues)[]> = {
      1: ["title", "fullName", "contact", "gender", "email", "birthdate", "address", "stateId", "cityId"],
      2: ["qualificationId", "departmentId", "availability", "shift"],
      3: ["password", "confirmPassword"],
    };
