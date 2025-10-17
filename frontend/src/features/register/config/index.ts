import { City, FormValues } from "../type";

export const STEPS = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Professional" },
  { id: 3, title: "Login" },
];

export const DUMMY = {
  states: ["UP", "Maharastra", "Delhi"],
  cities: {
    UP: [
      { id: "Lucknow", name: "Lucknow" },
      { id: "Varanasi", name: "Varanasi" },
    ],
    DL: [
      { id: "NewDelhi", name: "New Delhi" },
      { id: "KarolBagh", name: "Karol Bagh" },
    ],
  } as Record<string, City[]>,
  departments: ["General Medicine", "Pediatrics", "Orthopedics", "Dentistry"],
  qualifications: ["MBBS", "BDS", "BSc Nursing", "Pharmacy", "Physiotherapy"],
  availabilities: [
    { id: 1, title: "Weekdays" },
    { id: 2, title: "Weekends" },
    { id: 3, title: "Both" },
  ],
  shifts: [
    { id: 1, title: "Morning" },
    { id: 2, title: "Afternoon" },
    { id: 3, title: "Evening" },
    { id: 4, title: "Night" },
  ],
  titles: [
    { id: 1, title: "Mr" },
    { id: 2, title: "Mrs" },
    { id: 3, title: "Ms" },
    { id: 4, title: "Dr" },
  ],
  genders: [
    { id: 1, title: "Male" },
    { id: 2, title: "Female" },
    { id: 3, title: "Other" },
  ],
};

export const requiredFields: Record<number, (keyof FormValues)[]> = {
      1: ["title", "fullName", "contact", "gender", "email", "birthdate", "address", "stateId", "cityId"],
      2: ["qualificationId", "departmentId", "availability", "shift"],
      3: ["password", "confirmPassword"],
    };
