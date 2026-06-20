import { EntityListPage } from "@admin-panel/components/entity-list";
import { dailyReportConfig } from "./config";

export function DailyReport() {
  return <EntityListPage config={dailyReportConfig} />;
}
