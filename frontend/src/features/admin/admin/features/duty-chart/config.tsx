import { CalendarPlus } from "lucide-react";
import {
  EntityDeleteDialog,
  EntityViewDialog,
  type EntityListModuleConfig,
} from "@admin/components/entity-list";
import {
  dutyStatusMap,
  dutyStatusOptions,
  shiftOptions,
} from "./data/records";
import { dutyChartColumns } from "./data/columns";
import { DutyChartDialog } from "./components/DutyChartDialog";
import { DutyChartExportActions } from "./components/DutyChartExportActions";
import type { DutyChartEntry } from "./services/dutyChartApi";
import type { DutyDepartmentOption, DutyStaffOption } from "./services/dutyChartApi";

export interface DutyChartHandlers {
  onCreate: (values: Record<string, string>) => void | Promise<void>;
  onUpdate: (row: DutyChartEntry, values: Record<string, string>) => void | Promise<void>;
  onDelete: (row: DutyChartEntry) => void | Promise<void>;
}

export function createDutyChartConfig(
  data: DutyChartEntry[],
  handlers: DutyChartHandlers,
  departmentOptions: DutyDepartmentOption[] = [],
  staffOptions: DutyStaffOption[] = []
): EntityListModuleConfig<DutyChartEntry> {
  return {
    title: "Duty Chart",
    description: "Manage and monitor staff duty assignments.",
    searchPlaceholder: "Filter duties by name...",
    searchKey: "name",
    primaryAction: { label: "Add Duty", icon: CalendarPlus },
    rowActions: "default",
    deleteConfirmKey: "name",
    deleteConfirmMessage: (row) =>
      `This will permanently delete duty assignment for ${row.name}.`,
    statusBadgeMap: dutyStatusMap,
    filters: [
      { columnId: "status", title: "Status", options: dutyStatusOptions },
      { columnId: "shift", title: "Shift", options: shiftOptions },
      { columnId: "department", title: "Department", options: departmentOptions },
    ],
    formFields: [
      {
        name: "title",
        label: "Samagam Title",
        placeholder: "e.g., 58TH MAHARASHTRA NIRANKARI SANT SAMAGAM",
      },
      {
        name: "date",
        label: "Date",
        type: "date",
      },
      {
        name: "shift",
        label: "Shift",
        type: "select",
        options: shiftOptions,
      },
      {
        name: "department",
        label: "Department",
        type: "searchable-select",
        options: departmentOptions,
      },
      {
        name: "name",
        label: "Staff Name",
        type: "searchable-select",
        options: staffOptions,
      },
      {
        name: "contact",
        label: "Contact Number",
        placeholder: "10-digit mobile number",
      },
    ],
    columns: dutyChartColumns,
    data,
    extraToolbarActions: (table) => (
      <DutyChartExportActions table={table} entries={data} />
    ),
    renderDialogs: ({ open, setOpen, currentRow }) => {
      return (
        <>
          <DutyChartDialog
            open={open === "add"}
            onOpenChange={(state) => setOpen(state ? "add" : null)}
            mode="add"
            departmentOptions={departmentOptions}
            staffOptions={staffOptions}
            onSubmit={handlers.onCreate}
          />
          <DutyChartDialog
            open={open === "edit" && currentRow !== null}
            onOpenChange={(state) => setOpen(state ? "edit" : null)}
            mode="edit"
            currentRow={currentRow ?? undefined}
            departmentOptions={departmentOptions}
            staffOptions={staffOptions}
            onSubmit={
              currentRow
                ? (values) => handlers.onUpdate?.(currentRow, values)
                : () => {}
            }
          />
          {currentRow && (
            <>
              <EntityDeleteDialog
                open={open === "delete"}
                onOpenChange={(state) => setOpen(state ? "delete" : null)}
                currentRow={currentRow}
                confirmKey="name"
                message={`This will permanently delete duty assignment for ${currentRow.name}.`}
                onDelete={() => handlers.onDelete?.(currentRow)}
              />
              <EntityViewDialog
                open={open === "view"}
                onOpenChange={(state) => setOpen(state ? "view" : null)}
                title="View Duty"
                row={currentRow}
                labels={{
                  title: "Samagam Title",
                  date: "Date",
                  shift: "Shift",
                  department: "Department",
                  name: "Staff Name",
                  contact: "Contact Number",
                  status: "Status",
                }}
              />
            </>
          )}
        </>
      );
    },
    onCreate: handlers.onCreate,
    onUpdate: handlers.onUpdate,
    onDelete: handlers.onDelete,
  };
}
