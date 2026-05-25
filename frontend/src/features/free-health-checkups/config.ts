import type { BloodDonationCamp } from "./types";

export const BLOOD_DONATION_HERO_BADGE = "Upcoming camps";
export const BLOOD_DONATION_HERO_TITLE = "Free health check-up camps near you";
export const BLOOD_DONATION_HERO_SUBTITLE =
  "Find community wellness camps with screenings, consultations, and referral support organised by Medical Sewa.";

export const BLOOD_LOCATION_FILTER_ALL = "all";
export type BloodTimeframe = "all" | "upcoming";
export type BloodSort = "date-asc" | "date-desc";

export const MOCK_BLOOD_CAMPS: BloodDonationCamp[] = [
  {
    id: "fhc-mumbai-east",
    title: "Thane East Wellness Camp",
    shortDescription: "Services available: vital screening, doctor consult, referral support.",
    organizerName: "Sewa Health Collective",
    fullAddress: "Zilla Parishad Ground, Thane East, Mumbai, Maharashtra 400603",
    landmark: "Next to Doshi Hospital",
    driveDate: "Friday, June 28, 2026",
    startTime: "9:00 AM",
    endTime: "3:00 PM",
    phone: "+91 98200 12345",
    email: "thane.health@medicalsewa.org",
    entryType: "walk-in",
  },
  {
    id: "fhc-chennai-senior",
    title: "Nungambakkam Senior Care Clinic",
    shortDescription: "Services available: blood pressure check, medication review, health coaching.",
    organizerName: "Tamil Nadu Health Network",
    fullAddress: "Community Hall, Nungambakkam, Chennai, Tamil Nadu 600034",
    landmark: "Opposite Women’s College",
    driveDate: "Monday, July 4, 2026",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    phone: "+91 98400 98765",
    email: "tnhealth@medicalsewa.org",
    entryType: "appointment",
  },
  {
    id: "fhc-pune-youth",
    title: "Pune Youth Wellness Drive",
    shortDescription: "Services available: vision screening, mental wellness, lifestyle coaching.",
    organizerName: "Medical Sewa Foundation",
    fullAddress: "MIT Sports Complex, Kothrud, Pune, Maharashtra 411038",
    landmark: "Near the main gate",
    driveDate: "Sunday, July 12, 2026",
    startTime: "8:30 AM",
    endTime: "2:30 PM",
    phone: "+91 020 2546 7890",
    email: "punewellness@medicalsewa.org",
    entryType: "walk-in",
  },
  {
    id: "fhc-mumbai-family",
    title: "Andheri West Family Health Check",
    shortDescription: "Services available: child health assessment, family screening, referral pathways.",
    organizerName: "Mumbai Wellness Alliance",
    fullAddress: "St. Andrews School Grounds, Andheri West, Mumbai, Maharashtra 400058",
    landmark: "Beside the chapel",
    driveDate: "Sunday, July 19, 2026",
    startTime: "9:30 AM",
    endTime: "5:00 PM",
    phone: "+91 96190 23456",
    email: "mumbai.wellness@medicalsewa.org",
    entryType: "appointment",
  },
];
