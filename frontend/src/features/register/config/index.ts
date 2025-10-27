import { City, FormValues } from "../type";

export const STEPS = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Professional" },
  { id: 3, title: "Login" },
];

export const DUMMY = {
  availabilities: [
    { id: 1, label: "Pre-Samagam", value: "Pre-Samagam" },
    { id: 2, label: "First-Day", value: "First-Day" },
    { id: 3, label: "Second-Day", value: "Second-Day" },
    { id: 4, label: "Third-Day", value: "Third-Day" },
    { id: 5, label: "Fourth-Day", value: "Fourth-Day" },
    { id: 6, label: "Post-Samagam", value: "Post-Samagam" },
    { id: 7, label: "All-Day", value: "All-Day" },
  ],

  shifts: [
    { id: 1, label: "Morning - 8.00 AM to 4.00 PM", value: "Morning" },
    { id: 2, label: "Evening - 4.00 PM to 10.00 PM", value: "Evening" },
    { id: 3, label: "Night - 10.00 PM to 8.00 AM", value: "Night" },
    { id: 4, label: "All-Time", value: "All-Time" },
  ],

  titles: [
    { id: 1, label: "Mr.", value: "Mr" },
    { id: 2, label: "Mrs.", value: "Mrs" },
    { id: 3, label: "Ms.", value: "Ms" },
    { id: 4, label: "Dr.", value: "Dr" },
  ],
  genders: [
    { id: 1, label: "Male", value: "Male" },
    { id: 2, label: "Female", value: "Female" },
    { id: 3, label: "Other", value: "Other" },
  ],
};

export const requiredFields: Record<number, (keyof FormValues)[]> = {
  1: [
    "title",
    "fullName",
    "contact",
    "gender",
    "email",
    "birthdate",
    "address",
    "stateId",
    "cityId",
  ],
  2: ["qualificationId", "departmentId", "availability", "shift"],
  3: ["password", "confirmPassword"],
};
