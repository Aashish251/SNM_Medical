import { EntityListPage } from "@admin-panel/components/entity-list";
import { registrationReportConfig } from "./config";

export function RegistrationReport() {
  return <EntityListPage config={registrationReportConfig} />;
}
