import type { EntityFormField } from "@admin-panel/components/entity-list";
import { campEntryTypeOptions, campStatusOptions } from "./status";

const emailPattern = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "Enter a valid email address.",
};

export const campFormFields: EntityFormField[] = [
  {
    name: "title",
    label: "Title",
    placeholder: "Camp title",
  },
  {
    name: "shortDescription",
    label: "Short Description",
    type: "textarea",
    placeholder: "Brief description shown on camp cards",
  },
  {
    name: "organizerName",
    label: "Organizer",
    placeholder: "Organizer name",
  },
  {
    name: "fullAddress",
    label: "Full Address",
    placeholder: "Street, area, city, state, pincode",
  },
  {
    name: "landmark",
    label: "Landmark",
    placeholder: "Nearby landmark",
  },
  {
    name: "driveDate",
    label: "Camp Date",
    placeholder: "e.g. Friday, June 28, 2026",
  },
  {
    name: "startTime",
    label: "Start Time",
    placeholder: "e.g. 9:00 AM",
  },
  {
    name: "endTime",
    label: "End Time",
    placeholder: "e.g. 3:00 PM",
  },
  {
    name: "phone",
    label: "Contact Phone",
    placeholder: "Contact phone number",
  },
  {
    name: "email",
    label: "Contact Email",
    type: "email",
    placeholder: "contact@example.com",
    rules: {
      required: "Contact Email is required.",
      pattern: emailPattern,
    },
  },
  {
    name: "entryType",
    label: "Entry Type",
    type: "select",
    options: campEntryTypeOptions,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: campStatusOptions,
  },
];
