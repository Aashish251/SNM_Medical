import { EntityListPage } from "@admin/components/entity-list";
import { createMasterConfig } from "../shared/create-master-config";
import { createMasterRecords } from "../shared/status";

const availabilityConfig = createMasterConfig({
  title: "Availability",
  description: "Manage availability master records for staff scheduling.",
  nameLabel: "Availability Name",
  searchPlaceholder: "Filter availability options...",
  records: createMasterRecords("AVL", [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Weekends Only",
  ]),
});

export function MasterAvailability() {
  return <EntityListPage config={availabilityConfig} />;
}
