import type { CampListingConfig } from "@widgets/camp-listing";

export const BLOOD_DONATION_HERO_BADGE = "Upcoming camps";
export const BLOOD_DONATION_HERO_TITLE = "Blood donation camps near you";
export const BLOOD_DONATION_HERO_SUBTITLE =
  "Find a drive, express your interest to volunteer, and help strengthen care in your community through Medical Sewa.";

export const BLOOD_DONATION_LISTING_CONFIG: Omit<CampListingConfig, "camps"> = {
  heroBadge: BLOOD_DONATION_HERO_BADGE,
  heroTitle: BLOOD_DONATION_HERO_TITLE,
  heroSubtitle: BLOOD_DONATION_HERO_SUBTITLE,
  heroHeadingId: "blood-donation-hero-heading",
  searchTitle: "Find a blood donation camp near you",
  searchDescription:
    "Search by city, blood group, organizer, or location and discover camp details in one view.",
  searchPlaceholder: "Search by city, blood group, organizer…",
  searchInputId: "blood-donation-search",
  filterCities: ["Mumbai", "Chennai", "Pune"],
  showEligibilityCheck: true,
  labels: {
    walkInAction: "Donate Blood",
    appointmentAction: "Book Appointment",
    registrationDialogTitle: "Register for donation",
    registrationDialogDescription: (campTitle) =>
      `Complete this registration to reserve your slot for ${campTitle}.`,
    filterDescription: "Refine the camp list by city and donation type.",
  },
};
