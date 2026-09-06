import { faker } from "@faker-js/faker";
import { type Patient, type PatientGender, type PatientStatus } from "./schema";

faker.seed(54321);

const commonDiseases = [
  "General Checkup",
  "Fever & Flu",
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Migraine",
  "Gastritis",
  "Arthritis",
  "Allergic Rhinitis",
  "Skin Infection",
  "Bronchitis",
  "Dental Pain",
];

const statuses: PatientStatus[] = ["active", "outpatient", "discharged", "follow-up"];
const genders: PatientGender[] = ["Male", "Female", "Other"];

const currentYear = new Date().getFullYear();

export const patients: Patient[] = Array.from({ length: 150 }, (_, index) => {
  const gender = faker.helpers.arrayElement(genders);
  const sexType = gender === "Female" ? "female" : "male";
  const firstName = faker.person.firstName(sexType);
  const lastName = faker.person.lastName();
  const patientName = `${firstName} ${lastName}`;
  const guardianName = `${faker.person.firstName("male")} ${lastName}`;

  const regnIndex = String(index + 1).padStart(3, "0");
  const regnNo = `OPD-${currentYear}-${regnIndex}`;
  const regDate = faker.date.past({ years: 1 });
  const registrationDate = regDate.toISOString().split("T")[0];

  return {
    id: faker.string.uuid(),
    regnNo,
    patientName,
    mobileNumber: faker.phone.number({ style: "international" }),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
    guardianName,
    age: faker.number.int({ min: 5, max: 85 }),
    gender,
    disease: faker.helpers.arrayElement(commonDiseases),
    registrationDate,
    status: faker.helpers.arrayElement(statuses),
    createdAt: regDate,
    updatedAt: faker.date.recent(),
  };
});
