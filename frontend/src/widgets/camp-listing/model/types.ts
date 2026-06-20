export type CampEntryType = "walk-in" | "appointment";

export type Camp = {
  id: string;
  title: string;
  shortDescription: string;
  organizerName: string;
  fullAddress: string;
  landmark: string;
  driveDate: string;
  startTime: string;
  endTime: string;
  phone: string;
  email: string;
  entryType: CampEntryType;
};

export type CampFilters = {
  city: string;
  donationType: string;
};

export type CampListingLabels = {
  walkInAction: string;
  appointmentAction: string;
  registrationDialogTitle: string;
  registrationDialogDescription: (campTitle: string) => string;
  filterDescription: string;
};

export type CampListingConfig = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroHeadingId: string;
  searchTitle: string;
  searchDescription: string;
  searchPlaceholder: string;
  searchInputId: string;
  camps: Camp[];
  filterCities: string[];
  showEligibilityCheck?: boolean;
  labels: CampListingLabels;
};

export const DEFAULT_CAMP_FILTERS: CampFilters = {
  city: "all",
  donationType: "all",
};
