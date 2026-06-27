import { EntityListPage } from "@admin/components/entity-list";
import { masterSearchConfig } from "./config";

export function MasterSearch() {
  return <EntityListPage config={masterSearchConfig} />;
}
