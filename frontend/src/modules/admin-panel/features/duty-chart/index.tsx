import { EntityListPage } from "@admin-panel/components/entity-list";
import { dutyChartConfig } from "./config";

export function DutyChart() {
  return <EntityListPage config={dutyChartConfig} />;
}
