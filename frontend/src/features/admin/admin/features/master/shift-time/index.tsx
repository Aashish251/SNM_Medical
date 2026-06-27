import { EntityListPage } from "@admin/components/entity-list";
import { createMasterConfig } from "../shared/create-master-config";
import { createMasterRecords } from "../shared/status";

const shiftTimeConfig = createMasterConfig({
  title: "Shift Times",
  description: "Manage shift time master records for duty chart and scheduling.",
  nameLabel: "Shift Time Name",
  searchPlaceholder: "Filter shift times...",
  records: createMasterRecords("SFT", [
    "Morning (6 AM - 2 PM)",
    "Afternoon (2 PM - 10 PM)",
    "Night (10 PM - 6 AM)",
    "General Shift",
    "Emergency Shift",
    "On-Call",
  ]),
});

export function MasterShiftTime() {
  return <EntityListPage config={shiftTimeConfig} />;
}
