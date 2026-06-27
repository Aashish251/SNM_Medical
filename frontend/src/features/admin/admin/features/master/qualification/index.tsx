import { EntityListPage } from "@admin/components/entity-list";
import { createMasterConfig } from "../shared/create-master-config";
import { createMasterRecords } from "../shared/status";

const qualificationConfig = createMasterConfig({
  title: "Qualifications",
  description: "Manage qualification master records for staff registration.",
  nameLabel: "Qualification Name",
  searchPlaceholder: "Filter qualifications...",
  records: createMasterRecords("QLF", [
    "MBBS",
    "MD",
    "MS",
    "BDS",
    "BAMS",
    "BHMS",
    "BSc Nursing",
    "DNB",
  ]),
});

export function MasterQualification() {
  return <EntityListPage config={qualificationConfig} />;
}
