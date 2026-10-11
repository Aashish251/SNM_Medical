import { MasterTablePage } from "../shared/master-table-page";

export function MasterDepartment() {
  return (
    <MasterTablePage
      module="department"
      title="Departments"
      description="Departments currently stored in the database."
    />
  );
}
