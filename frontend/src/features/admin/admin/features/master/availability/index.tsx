import { MasterTablePage } from "../shared/master-table-page";

export function MasterAvailability() {
  return (
    <MasterTablePage
      module="availableday"
      title="Availability"
      description="Availability values currently stored in the database."
    />
  );
}
