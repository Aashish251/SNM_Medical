import { useMemo, useState } from "react";
import { CalendarDays, FileSpreadsheet, Plus, Printer, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Skeleton } from "@admin/components/ui/skeleton";
import { useGetRegistrationReportQuery, useGetReportMetadataQuery, type RegistrationReportRow } from "../../services/reportsApi";
import { escapeReportHtml, exportHtmlToExcel, printReportHtml } from "../reports-common/reportExportUtils";

const DEFAULT_TITLE = "60 Maharashtra Nirankari Sant Samagam";
const EMPTY_ROWS: RegistrationReportRow[] = [];
const formatDate = (date: string) => date.split("-").reverse().join("-");
const formatNumber = (value: number) => value.toLocaleString();
const rowId = (row: RegistrationReportRow) => row.locationId ?? row.departmentId ?? 0;
const rowLocation = (row: RegistrationReportRow) => row.location ?? row.department ?? "Unassigned";

export function LiveRegistrationReport() {
  const { data: metadataResponse, isLoading: metadataLoading } = useGetReportMetadataQuery();
  const availableDates = metadataResponse?.data.availableDates ?? [];
  const locations = metadataResponse?.data.locations ?? [];
  const defaultDates = useMemo(() => availableDates.slice(0, 3).map(({ date }) => date).reverse(), [availableDates]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [hiddenLocationIds, setHiddenLocationIds] = useState<number[]>([]);
  const [editedCounts, setEditedCounts] = useState<Record<string, number>>({});
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [locationToAdd, setLocationToAdd] = useState("");
  const [customDate, setCustomDate] = useState("");
  const queryDates = selectedDates.length ? selectedDates : defaultDates;
  const { data: response, isLoading, isFetching, isError, refetch } = useGetRegistrationReportQuery(
    { dates: queryDates.join(","), includeEmpty: true },
    { skip: metadataLoading && availableDates.length === 0 },
  );
  const report = response?.data;
  const rows = report?.rows ?? EMPTY_ROWS;
  const visibleRows = useMemo(() => rows.filter((row) => !hiddenLocationIds.includes(rowId(row))), [hiddenLocationIds, rows]);
  const valueFor = (row: RegistrationReportRow, date: string) => editedCounts[`${rowId(row)}::${date}`] ?? row.values[date] ?? 0;
  const totals = useMemo(() => {
    const byDate = Object.fromEntries(queryDates.map((date) => [date, visibleRows.reduce((sum, row) => sum + valueFor(row, date), 0)]));
    return { byDate, grandTotal: Object.values(byDate).reduce((sum, value) => sum + value, 0) };
  }, [editedCounts, queryDates, visibleRows]);
  const addableLocations = locations.filter(({ id }) => !visibleRows.some((row) => rowId(row) === id));
  const reportTitle = title.trim() || report?.title || DEFAULT_TITLE;

  const updateDate = (index: number, date: string) => {
    const next = [...queryDates]; next[index] = date;
    setSelectedDates([...new Set(next.filter(Boolean))]);
  };
  const addCustomDate = () => {
    if (!customDate || queryDates.includes(customDate) || queryDates.length >= 5) return;
    setSelectedDates([...queryDates, customDate]);
    setCustomDate("");
  };
  const addLocation = () => { const id = Number(locationToAdd); if (id) setHiddenLocationIds((current) => current.filter((item) => item !== id)); setLocationToAdd(""); };
  const updateCount = (locationId: number, date: string, rawValue: string) => setEditedCounts((current) => ({ ...current, [`${locationId}::${date}`]: Math.max(0, Math.trunc(Number(rawValue) || 0)) }));
  const reportHtml = () => {
    const headings = queryDates.map((date) => `<th>${escapeReportHtml(formatDate(date))}</th>`).join("");
    const body = visibleRows.map((row) => { const total = queryDates.reduce((sum, date) => sum + valueFor(row, date), 0); return `<tr><td>${escapeReportHtml(rowLocation(row))}</td>${queryDates.map((date) => `<td>${valueFor(row, date)}</td>`).join("")}<td>${total}</td></tr>`; }).join("");
    return `<table><thead><tr><th>Location</th>${headings}<th>Total</th></tr></thead><tbody>${body}</tbody><tfoot><tr><td>Total</td>${queryDates.map((date) => `<td>${totals.byDate[date] ?? 0}</td>`).join("")}<td>${totals.grandTotal}</td></tr></tfoot></table>`;
  };

  return <main className="space-y-4 pb-8"><section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-blue-50 text-blue-700"><FileSpreadsheet className="size-6" /></span><h1 className="text-xl font-bold text-slate-900">Registration Report</h1></div><Button variant="outline" size="icon" onClick={() => void refetch()} disabled={isFetching} aria-label="Refresh report"><RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} /></Button></div>
    <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-end"><label className="w-full max-w-xl space-y-1.5 text-sm font-medium text-slate-700">Report title <span className="text-red-500">*</span><Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} /></label><div className="flex flex-wrap gap-2"><Input aria-label="Custom report date" type="date" className="h-10 w-40" value={customDate} onChange={(event) => setCustomDate(event.target.value)} /><Button variant="outline" onClick={addCustomDate} disabled={!customDate || queryDates.includes(customDate) || queryDates.length >= 5}><Plus className="mr-2 size-4" />Add Date</Button><select aria-label="Location to add" className="h-10 min-w-44 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700" value={locationToAdd} onChange={(event) => setLocationToAdd(event.target.value)} disabled={!addableLocations.length}><option value="">Select location</option>{addableLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select><Button onClick={addLocation} disabled={!locationToAdd}><Plus className="mr-2 size-4" />Add Row</Button><Button variant="outline" onClick={() => printReportHtml(reportTitle, reportHtml())} disabled={!report}><Printer className="mr-2 size-4" />Print</Button><Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50" onClick={() => exportHtmlToExcel("Registration_Report.xls", reportTitle, reportHtml())} disabled={!report}><FileSpreadsheet className="mr-2 size-4" />Export Excel</Button></div></div>
    {isError ? <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load registration data. Please refresh and try again.</p> : isLoading ? <Skeleton className="h-56 w-full" /> : queryDates.length === 0 ? <p className="border-y border-slate-100 py-12 text-center text-sm text-slate-500">No registration dates are available.</p> : <div className="overflow-x-auto rounded-md border border-blue-100"><table className="w-full min-w-[780px] border-collapse text-sm"><thead className="bg-blue-50/80 text-slate-800"><tr><th className="w-56 border-r border-blue-100 px-4 py-4 text-left font-semibold">Location</th>{queryDates.map((date, index) => <th key={date} className="min-w-44 border-r border-blue-100 px-4 py-3 text-center font-semibold"><label className="relative mx-auto flex h-10 max-w-52 items-center"><CalendarDays className="pointer-events-none absolute left-3 size-4 text-blue-600" /><select aria-label={`Report date ${index + 1}`} value={date} onChange={(event) => updateDate(index, event.target.value)} className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm font-normal text-slate-700">{availableDates.map((item) => <option key={item.date} value={item.date} disabled={queryDates.some((selected, selectedIndex) => selected === item.date && selectedIndex !== index)}>{formatDate(item.date)}</option>)}</select></label></th>)}<th className="min-w-28 border-r border-blue-100 px-4 py-4 text-center font-semibold">Total</th><th className="w-36 px-4 py-4 text-center font-semibold">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleRows.length === 0 ? <tr><td colSpan={queryDates.length + 3} className="px-4 py-10 text-center text-sm text-slate-500">No location rows are visible. Add a location row to include one.</td></tr> : visibleRows.map((row) => { const id = rowId(row); const location = rowLocation(row); const rowTotal = queryDates.reduce((sum, date) => sum + valueFor(row, date), 0); return <tr key={id} className="bg-white hover:bg-blue-50/30"><td className="border-r border-slate-100 px-4 py-3 font-medium text-slate-700">{location}</td>{queryDates.map((date) => <td key={date} className="border-r border-slate-100 px-2 py-2"><Input className="mx-auto h-10 max-w-32 text-center tabular-nums" aria-label={`${location}, ${formatDate(date)}`} type="number" min="0" step="1" value={valueFor(row, date)} onChange={(event) => updateCount(id, date, event.target.value)} /></td>)}<td className="border-r border-slate-100 px-4 py-3 text-center font-semibold tabular-nums">{formatNumber(rowTotal)}</td><td className="px-3 py-2 text-center"><Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setHiddenLocationIds((current) => [...current, id])} aria-label={`Remove ${location} from this view`}><Trash2 className="mr-2 size-4" />Delete</Button></td></tr>; })}</tbody><tfoot className="border-t border-blue-100 bg-blue-50/80 font-semibold text-slate-900"><tr><td className="border-r border-blue-100 px-4 py-3 text-center">Total</td>{queryDates.map((date) => <td key={date} className="border-r border-blue-100 px-4 py-3 text-center tabular-nums">{formatNumber(totals.byDate[date] ?? 0)}</td>)}<td className="border-r border-blue-100 px-4 py-3 text-center tabular-nums">{formatNumber(totals.grandTotal)}</td><td /></tr></tfoot></table></div>}
  </section></main>;
}
