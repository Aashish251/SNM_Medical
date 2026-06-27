import { EntityListPage } from "@admin/components/entity-list";
import { createMasterConfig } from "../shared/create-master-config";
import { createMasterRecords } from "../shared/status";

const stateConfig = createMasterConfig({
  title: "States",
  description: "Manage state master records for location-based workflows.",
  nameLabel: "State Name",
  searchPlaceholder: "Filter states...",
  records: createMasterRecords("ST", [
    "Maharashtra",
    "Tamil Nadu",
    "Karnataka",
    "Delhi",
    "Gujarat",
    "Rajasthan",
    "West Bengal",
    "Uttar Pradesh",
  ]),
});

export function MasterState() {
  return <EntityListPage config={stateConfig} />;
}
