import type { Camp, CampEntryType } from "@widgets/camp-listing";

export type CampType = "health-checkup" | "blood-donation";

export type CampStatus = "draft" | "published";

export type CampAdminRecord = Camp & {
  campType: CampType;
  status: CampStatus;
  createdAt: string;
  updatedAt: string;
};

export type CampFormValues = {
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
  status: CampStatus;
};
