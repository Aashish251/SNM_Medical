import type { BloodDonationCamp } from "./types";

export const BLOOD_DONATION_HERO_BADGE = "Upcoming camps";
export const BLOOD_DONATION_HERO_TITLE = "Blood donation camps near you";
export const BLOOD_DONATION_HERO_SUBTITLE =
  "Find a drive, express your interest to volunteer, and help strengthen care in your community through Medical Sewa.";

export const BLOOD_LOCATION_FILTER_ALL = "all";
export type BloodTimeframe = "all" | "upcoming";
export type BloodSort = "date-asc" | "date-desc";

export const MOCK_BLOOD_CAMPS: BloodDonationCamp[] = [
  {
    id: "camp-mumbai-may",
    title: "Blood donation camp Mumbai",
    shortDescription: "High-capacity donation drive with refreshments and counselling for first-time donors.",
    organizerName: "Medical Sewa & Mumbai Hospitals Consortium",
    fullAddress: "Community Hall, JVPD Scheme, Near SNDT University, Mumbai, Maharashtra 400049",
    landmark: "Near SNDT University",
    driveDate: "Tue, 12 May, 2026",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    phone: "+91 8898209852",
    email: "snmdispensary@gmail.com",
    entryType: "walk-in",
  },
  {
    id: "camp-chennai",
    title: "Apollo community drive Chennai",
    shortDescription: "Focus on Bombay blood group and Rh-negative donors. Shuttle support nearby.",
    organizerName: "Apollo Outreach & Medical Sewa",
    fullAddress: "Apollo Speciality Annex, Pondy Bazaar Approach, Chennai, Tamil Nadu 600017",
    landmark: "Near Pondy Bazaar Approach",
    driveDate: "Sun, 18 May, 2026",
    startTime: "8:30 AM",
    endTime: "3:30 PM",
    phone: "+91 8898209852",
    email: "snmdispensary@gmail.com",
    entryType: "appointment",
  },
  {
    id: "camp-pune",
    title: "Pune university township drive",
    shortDescription: "Collaboration with campuses and NGOs to widen youth participation safely.",
    organizerName: "Medical Sewa Volunteers — Pune Circle",
    fullAddress: "SVM Hall, Behind Karve Statue, Kothrud, Pune, Maharashtra 411038",
    landmark: "Behind Karve Statue",
    driveDate: "Sat, 24 May, 2026",
    startTime: "10:00 AM",
    endTime: "4:30 PM",
    phone: "+91 8898209852",
    email: "snmdispensary@gmail.com",
    entryType: "walk-in",
  },
];
