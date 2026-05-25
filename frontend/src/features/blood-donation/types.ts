export type BloodDonationType = "walk-in" | "appointment";

export type BloodDonationCamp = {
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
  entryType: BloodDonationType;
};

export type BloodDonationFilters = {
  city: string;
  donationType: string;
};
