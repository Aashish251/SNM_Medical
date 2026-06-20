import { EntityListPage } from "@admin-panel/components/entity-list";
import { createMasterConfig } from "../shared/create-master-config";
import { createMasterRecords } from "../shared/status";

const departmentConfig = createMasterConfig({
  title: "Departments",
  description: "Manage department master records for duty and registration modules.",
  nameLabel: "Department Name",
  searchPlaceholder: "Filter departments...",
  records: createMasterRecords("DEP", [
    "Pediatrics",
    "Cardiology",
    "Orthopedics",
    "General Medicine",
    "Neurology",
    "Dermatology",
    "ENT",
    "Oncology",
  ]),
});

export function MasterDepartment() {
  return <EntityListPage config={departmentConfig} />;
}
