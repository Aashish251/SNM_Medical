import type { CampListingConfig } from "@widgets/camp-listing";

export const BLOOD_DONATION_HERO_BADGE = "Upcoming camps";
export const BLOOD_DONATION_HERO_TITLE = "Free health check-up camps near you";
export const BLOOD_DONATION_HERO_SUBTITLE =
  "Find community wellness camps with screenings, consultations, and referral support organised by Medical Sewa.";

export const HEALTH_CHECKUP_LISTING_CONFIG: Omit<CampListingConfig, "camps"> = {
  heroBadge: BLOOD_DONATION_HERO_BADGE,
  heroTitle: BLOOD_DONATION_HERO_TITLE,
  heroSubtitle: BLOOD_DONATION_HERO_SUBTITLE,
  heroHeadingId: "health-checkup-hero-heading",
  searchTitle: "Find a free health check-up camp near you",
  searchDescription:
    "Search by city, service type, organizer, or location and discover camp details in one view.",
  searchPlaceholder: "Search by city, service type, organizer…",
  searchInputId: "health-checkup-search",
  filterCities: ["Mumbai", "Chennai", "Pune"],
  showEligibilityCheck: false,
  labels: {
    walkInAction: "Register for Check-up",
    appointmentAction: "Book Appointment",
    registrationDialogTitle: "Register for health check-up",
    registrationDialogDescription: (campTitle) =>
      `Complete this registration to reserve your slot for ${campTitle}.`,
    filterDescription: "Refine the camp list by city and entry type.",
  },
};
