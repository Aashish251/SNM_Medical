import { EntityListPage } from "@admin/components/entity-list";
import { masterReportConfig } from "./config";

export function MasterReport() {
  return <EntityListPage config={masterReportConfig} />;
}
