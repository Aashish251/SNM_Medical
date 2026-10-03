import { MasterTablePage } from "../shared/master-table-page";

export function MasterLocation() {
  return (
    <MasterTablePage
      module="sewalocation"
      title="Locations"
      description="Locations currently stored in the database."
    />
  );
}
