import { useMemo, useState } from "react";
import { CalendarDays, FileSpreadsheet, Plus, Printer, RefreshCw, Trash2, Users } from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Skeleton } from "@admin/components/ui/skeleton";
import {
  useGetDailyReportQuery,
  useGetReportMetadataQuery,
} from "../../services/reportsApi";
import {
  escapeReportHtml,
  exportHtmlToExcel,
  printReportHtml,
} from "../reports-common/reportExportUtils";

const NO_AVAILABLE_DATES: { date: string; count: number; label: string }[] = [];
const NO_DEPARTMENTS: { id: number; name: string }[] = [];
const NO_LOCATIONS: { id: number; name: string }[] = [];
const NO_REPORT_ROWS: { department: string; values: Record<string, number>; total: number }[] = [];
const DEFAULT_TITLE = "60TH MAHARASHTRA NIRANKARI SANT SAMAGAM";
const formatNumber = (value: number) => value.toLocaleString();
const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

type AddedDepartmentRow = { id: number; departmentId: string };

export function LiveDailyReport() {
  const { data: metadataResponse, isLoading: isMetadataLoading } = useGetReportMetadataQuery();
  const availableDates = metadataResponse?.data?.availableDates ?? NO_AVAILABLE_DATES;
  const departments = metadataResponse?.data?.departments ?? NO_DEPARTMENTS;
  const knownLocations = metadataResponse?.data?.locations ?? NO_LOCATIONS;
  const defaultDate = availableDates[0]?.date ?? "";
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [hiddenDepartments, setHiddenDepartments] = useState<string[]>([]);
  const [addedRows, setAddedRows] = useState<AddedDepartmentRow[]>([]);
  const [editedDepartments, setEditedDepartments] = useState<Record<string, string>>({});
  const [editedCounts, setEditedCounts] = useState<Record<string, number>>({});
  const queryDate = selectedDate || defaultDate;
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDailyReportQuery(
    { date: queryDate, includeEmpty: false },
    { skip: isMetadataLoading && availableDates.length === 0 },
  );

  const report = response?.data;
  const reportRows = report?.rows ?? NO_REPORT_ROWS;
  const locationColumns = useMemo(() => {
    const masterLocationNames = new Set(knownLocations.map(({ name }) => name.toLowerCase()));
    return (report?.columns ?? []).filter((column) => masterLocationNames.has(column.label.toLowerCase()));
  }, [knownLocations, report?.columns]);
  const departmentByName = useMemo(
    () => new Map(departments.map((department) => [department.name.toLowerCase(), department])),
    [departments],
  );
  const visibleRows = useMemo(
    () => reportRows.filter((row) => !hiddenDepartments.includes(row.department)),
    [hiddenDepartments, reportRows],
  );
  const displayRows = useMemo(() => [
    ...visibleRows.map((row) => {
      const id = `report-${row.department}`;
      return {
        id,
        department: editedDepartments[id] ?? row.department,
        values: Object.fromEntries(locationColumns.map((column) => [
          column.key,
          editedCounts[`${queryDate}::${id}::${column.key}`] ?? row.values[column.key] ?? 0,
        ])),
      };
    }),
    ...addedRows.map((row) => {
      const departmentName = departments.find(({ id }) => id === Number(row.departmentId))?.name ?? "";
      const sourceRow = reportRows.find((item) => item.department.toLowerCase() === departmentName.toLowerCase());
      const id = `added-${row.id}`;
      return {
        id,
        department: editedDepartments[id] ?? departmentName,
        values: Object.fromEntries(locationColumns.map((column) => [
          column.key,
          editedCounts[`${queryDate}::${id}::${column.key}`] ?? sourceRow?.values[column.key] ?? 0,
        ])),
      };
    }),
  ], [addedRows, departments, editedCounts, editedDepartments, locationColumns, queryDate, reportRows, visibleRows]);
  const totalsByLocation = useMemo(
    () => Object.fromEntries(locationColumns.map((column) => [
      column.key,
      displayRows.reduce((sum, row) => sum + (row.values[column.key] ?? 0), 0),
    ])),
    [displayRows, locationColumns],
  );
  const grandTotal = Object.values(totalsByLocation).reduce((sum, value) => sum + value, 0);
  const reportTitle = title || report?.title || DEFAULT_TITLE;

  const addRow = () => {
    setAddedRows((current) => [...current, { id: Date.now() + current.length, departmentId: "" }]);
  };

  const setAddedDepartment = (rowId: number, departmentId: string) => {
    setAddedRows((current) => current.map((row) => row.id === rowId ? { ...row, departmentId } : row));
  };

  const setRowDepartment = (rowId: string, department: string) => {
    if (rowId.startsWith("added-")) {
      const rowIdValue = Number(rowId.slice("added-".length));
      const departmentId = String(departments.find((item) => item.name === department)?.id ?? "");
      setAddedDepartment(rowIdValue, departmentId);
      return;
    }
    setEditedDepartments((current) => ({ ...current, [rowId]: department }));
  };

  const setCellValue = (rowId: string, locationKey: string, rawValue: string) => {
    const value = Math.max(0, Math.trunc(Number(rawValue) || 0));
    setEditedCounts((current) => ({ ...current, [`${queryDate}::${rowId}::${locationKey}`]: value }));
  };

  const removeRow = (id: string) => {
    if (id.startsWith("added-")) {
      const rowId = Number(id.slice("added-".length));
      setAddedRows((current) => current.filter((row) => row.id !== rowId));
      return;
    }
    const department = id.slice("report-".length);
    setHiddenDepartments((current) => current.includes(department) ? current : [...current, department]);
  };

  const reportHtml = () => {
    const headers = locationColumns.map((column) => `<th>${escapeReportHtml(column.label)}</th>`).join("");
    const body = displayRows.map((row) =>
      `<tr><td>${escapeReportHtml(row.department || "Select Department")}</td>${locationColumns.map((column) => `<td>${row.values[column.key] ?? 0}</td>`).join("")}</tr>`,
    ).join("");
    const totals = locationColumns.map((column) => `<td>${totalsByLocation[column.key] ?? 0}</td>`).join("");
    return `<h2>${escapeReportHtml(report?.reportTitle || "DAILY REPORT CHART")}</h2><table><thead><tr><th>Department</th>${headers}</tr></thead><tbody>${body}</tbody><tfoot><tr><td>TOTAL</td>${totals}</tr></tfoot></table><p>Grand Total: ${grandTotal}</p>`;
  };

  return (
    <main className="space-y-4 pb-8">
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-blue-50 text-blue-700"><FileSpreadsheet className="size-6" /></span>
            <h1 className="text-xl font-bold text-slate-900">Daily Report</h1>
          </div>
          <Button variant="outline" size="icon" onClick={() => void refetch()} disabled={isFetching} aria-label="Refresh report" title="Refresh report">
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="mb-7 grid gap-4 xl:grid-cols-[minmax(280px,1fr)_minmax(220px,0.7fr)_auto] xl:items-end">
          <label className="space-y-1.5 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-md bg-blue-50 text-blue-600"><Users className="size-4" /></span>Samagam Name</span>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} />
          </label>
          <label className="space-y-1.5 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-md bg-violet-50 text-violet-600"><CalendarDays className="size-4" /></span>Report Date</span>
            <Input type="date" value={queryDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Button onClick={() => printReportHtml(reportTitle, reportHtml())} disabled={!report}>
              <Printer className="mr-2 size-4" />Print Report
            </Button>
            <Button variant="outline" className="border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white" onClick={() => exportHtmlToExcel(`Daily_Report_${queryDate || ""}.xls`, reportTitle, reportHtml())} disabled={!report}>
              <FileSpreadsheet className="mr-2 size-4" />Export to Excel
            </Button>
          </div>
        </div>

        <div className="mb-6 py-2 text-center">
          <h2 className="text-xl font-bold text-blue-950 sm:text-2xl">{reportTitle}</h2>
          <p className="mt-1 text-base font-medium text-slate-500 sm:text-lg">DAILY REPORT CHART{queryDate ? ` - ${formatDate(queryDate)}` : ""}</p>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-blue-500" />
        </div>

        {isError ? (
          <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load daily report data. Please refresh and try again.</p>
        ) : isLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : locationColumns.length === 0 ? (
          <p className="border-y border-slate-100 py-12 text-center text-sm text-slate-500">No service locations are available for this report.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-blue-200">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead className="bg-blue-50/90 text-blue-950">
                <tr>
                  <th className="min-w-56 border-r border-blue-200 px-4 py-4 text-center font-bold">Department</th>
                  {locationColumns.map((column) => <th key={column.key} className="min-w-32 border-r border-blue-200 px-3 py-4 text-center font-bold">{column.label}</th>)}
                  <th className="min-w-40 px-3 py-4 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayRows.length === 0 ? (
                  <tr><td colSpan={locationColumns.length + 2} className="px-4 py-10 text-center text-sm text-slate-500">No department rows for this date. Add a row to select a department.</td></tr>
                ) : displayRows.map((row) => {
                  const addedRowId = row.id.startsWith("added-") ? Number(row.id.slice("added-".length)) : null;
                  const selectableDepartments = departments.filter((department) =>
                    !displayRows.some((other) => other.id !== row.id && other.department.toLowerCase() === department.name.toLowerCase()),
                  );
                  const existingMasterDepartment = departmentByName.get(row.department.toLowerCase());
                  return (
                    <tr key={row.id} className="bg-white hover:bg-blue-50/30">
                      <td className="border-r border-slate-100 px-3 py-2">
                        <select
                          aria-label="Select department"
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-slate-700"
                          value={existingMasterDepartment?.name ?? ""}
                          onChange={(event) => setRowDepartment(row.id, event.target.value)}
                        >
                          <option value="">Select Department</option>
                          {selectableDepartments.map((department) => <option key={department.id} value={department.name}>{department.name}</option>)}
                        </select>
                      </td>
                      {locationColumns.map((column) => <td key={column.key} className="border-r border-slate-100 px-2 py-2"><Input className="mx-auto h-10 max-w-28 text-center tabular-nums" aria-label={`${row.department || "Department"}, ${column.label}`} type="number" min="0" step="1" value={row.values[column.key] ?? 0} onChange={(event) => setCellValue(row.id, column.key, event.target.value)} /></td>)}
                      <td className="px-2 py-2">
                        <div className="flex justify-center gap-2">
                          {addedRowId === null && <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={addRow}><Plus className="mr-1.5 size-4" />Add New</Button>}
                          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => removeRow(row.id)} aria-label={`Remove ${row.department || "department"}`}>
                            <Trash2 className="mr-1.5 size-4" />Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {addedRows.length === 0 && displayRows.length === 0 && (
                  <tr><td colSpan={locationColumns.length + 2} className="py-3 text-center"><Button size="sm" onClick={addRow}><Plus className="mr-2 size-4" />Add New</Button></td></tr>
                )}
                {addedRows.length > 0 && (
                  <tr><td colSpan={locationColumns.length + 2} className="py-3 text-center"><Button variant="outline" size="sm" onClick={addRow}><Plus className="mr-2 size-4" />Add New Department Row</Button></td></tr>
                )}
              </tbody>
              <tfoot className="border-t border-blue-200 bg-blue-50/90 font-bold text-blue-950">
                <tr>
                  <td className="border-r border-blue-200 px-4 py-4 text-center">TOTAL</td>
                  {locationColumns.map((column) => <td key={column.key} className="border-r border-blue-200 px-3 py-4 text-center tabular-nums">{formatNumber(totalsByLocation[column.key] ?? 0)}</td>)}
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}