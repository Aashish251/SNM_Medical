import { EntityListPage } from "@admin-panel/components/entity-list";
import { createMasterConfig } from "../shared/create-master-config";
import { createMasterRecords } from "../shared/status";

const cityConfig = createMasterConfig({
  title: "Cities",
  description: "Manage city master records used across registration and reporting.",
  nameLabel: "City Name",
  searchPlaceholder: "Filter cities...",
  records: createMasterRecords("CTY", [
    "Mumbai",
    "Pune",
    "Chennai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Kolkata",
    "Ahmedabad",
  ]),
});

export function MasterCity() {
  return <EntityListPage config={cityConfig} />;
}
