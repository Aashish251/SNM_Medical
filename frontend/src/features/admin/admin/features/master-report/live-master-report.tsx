import { useMemo, useState } from "react";
import {
  CalendarDays,
  FileSpreadsheet,
  MapPin,
  Plus,
  Printer,
  RefreshCw,
  X,
} from "lucide-react";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Skeleton } from "@admin/components/ui/skeleton";
import {
  useGetMasterReportQuery,
  useGetReportMetadataQuery,
  type MasterReportDateWiseItem,
  type MasterReportLocationWiseItem,
} from "../../services/reportsApi";
import {
  escapeReportHtml,
  exportHtmlToExcel,
  printReportHtml,
} from "../reports-common/reportExportUtils";

const DEFAULT_TITLE = "58th Maharashtra Samagam Dispensary Master Report";
const NO_AVAILABLE_DATES: { date: string; count: number; label: string }[] = [];
const formatNumber = (value: number) => value.toLocaleString();
const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

function buildReportHtml(
  title: string,
  dateWise: MasterReportDateWiseItem[],
  locationWise: MasterReportLocationWiseItem[],
) {
  const dateTables = dateWise.map((day) => {
    const rows = day.rows.map((row) =>
      `<tr><td>${escapeReportHtml(row.label)}</td><td>${row.opd}</td><td>${row.ipd}</td><td>${row.total}</td></tr>`,
    ).join("");
    return `<h2>${escapeReportHtml(formatDate(day.date))}</h2><table><thead><tr><th>Location</th><th>OPD</th><th>IPD</th><th>Total</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td>Total</td><td>${day.totals.opd}</td><td>${day.totals.ipd}</td><td>${day.totals.total}</td></tr></tfoot></table>`;
  }).join("");
  const locationTables = locationWise.map((location) => {
    const rows = location.rows.map((row) =>
      `<tr><td>${escapeReportHtml(formatDate(row.date))}</td><td>${row.opd}</td><td>${row.ipd}</td><td>${row.total}</td></tr>`,
    ).join("");
    return `<h2>${escapeReportHtml(location.location)}</h2><table><thead><tr><th>Date</th><th>OPD</th><th>IPD</th><th>Total</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td>Total</td><td>${location.totals.opd}</td><td>${location.totals.ipd}</td><td>${location.totals.total}</td></tr></tfoot></table>`;
  }).join("");
  return `<h2>Date-wise Summary</h2>${dateTables}<h2>Location-wise Summary</h2>${locationTables}`;
}

export function LiveMasterReport() {
  const { data: metadataResponse, isLoading: isMetadataLoading } = useGetReportMetadataQuery();
  const availableDates = metadataResponse?.data?.availableDates ?? NO_AVAILABLE_DATES;
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [hideZeroRows, setHideZeroRows] = useState(true);
  const [editedCounts, setEditedCounts] = useState<Record<string, { opd: number; ipd: number }>>({});
  const [extraLocationsByDate, setExtraLocationsByDate] = useState<Record<string, string[]>>({});
  const [extraDatesByLocation, setExtraDatesByLocation] = useState<Record<string, string[]>>({});

  const queryDates = useMemo(
    () => selectedDates.length > 0
      ? selectedDates
      : availableDates.slice(0, 3).map(({ date }) => date),
    [availableDates, selectedDates],
  );
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMasterReportQuery(
    { dates: queryDates.join(","), includeEmpty: !hideZeroRows },
    { skip: isMetadataLoading && availableDates.length === 0 },
  );

  const report = response?.data;
  const dateWise = report?.dateWise ?? [];
  const allLocationWise = report?.locationWise ?? [];
  const locationWise = selectedLocations.length === 0
    ? allLocationWise
    : allLocationWise.filter(({ location }) => selectedLocations.includes(location));
  const title = report?.title || DEFAULT_TITLE;
  const withEdits = (date: string, location: string, source?: { opd: number; ipd: number }) => {
    const edited = editedCounts[`${date}::${location}`];
    const opd = edited?.opd ?? source?.opd ?? 0;
    const ipd = edited?.ipd ?? source?.ipd ?? 0;
    return { opd, ipd, total: opd + ipd };
  };
  const dateWiseWithAddedRows = dateWise.map((day) => {
    const addedLocations = extraLocationsByDate[day.date] ?? [];
    const sourceRows = [
      ...day.rows,
      ...addedLocations
        .filter((location) => !day.rows.some((row) => row.label === location))
        .map((label) => ({ label, opd: 0, ipd: 0, total: 0 })),
    ];
    const rows = sourceRows.map((row) => ({
      ...row,
      ...withEdits(day.date, row.label, row),
    }));
    const totals = rows.reduce((sum, row) => ({
      opd: sum.opd + row.opd,
      ipd: sum.ipd + row.ipd,
      total: sum.total + row.total,
    }), { opd: 0, ipd: 0, total: 0 });
    return { ...day, rows, totals };
  });
  const locationWiseWithAddedRows = locationWise.map((location) => {
    const addedDates = extraDatesByLocation[location.location] ?? [];
    const rowsByDate = new Map(location.rows.map((row) => [row.date, row]));
    return {
      ...location,
      rows: (report?.dates ?? [])
        .filter((date) => rowsByDate.has(date) || addedDates.includes(date))
        .map((date) => {
          const row = rowsByDate.get(date);
          return {
            date,
            label: row?.label ?? formatDate(date),
            ...withEdits(date, location.location, row),
          };
        }),
    };
  });
  locationWiseWithAddedRows.forEach((location) => {
    location.totals = location.rows.reduce((sum, row) => ({
      opd: sum.opd + row.opd,
      ipd: sum.ipd + row.ipd,
      total: sum.total + row.total,
    }), { opd: 0, ipd: 0, total: 0 });
  });
  const reportHtml = () => buildReportHtml(title, dateWiseWithAddedRows, locationWiseWithAddedRows);

  const toggleDate = (date: string) => {
    const activeDates = queryDates;
    const nextDates = activeDates.includes(date)
      ? activeDates.filter((activeDate) => activeDate !== date)
      : [...activeDates, date].slice(-5);
    setSelectedDates(nextDates.length ? nextDates : []);
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((current) => current.includes(location)
      ? current.filter((item) => item !== location)
      : [...current, location]);
  };

  const addLocationRow = (date: string, existingLocations: string[]) => {
    const addedLocations = extraLocationsByDate[date] ?? [];
    const nextLocation = report?.locations.find(
      (location) => !existingLocations.includes(location) && !addedLocations.includes(location),
    );
    if (!nextLocation) return;
    setExtraLocationsByDate((current) => ({
      ...current,
      [date]: [...(current[date] ?? []), nextLocation],
    }));
  };

  const addDateRow = (location: string, existingDates: string[]) => {
    const addedDates = extraDatesByLocation[location] ?? [];
    const nextDate = report?.dates.find(
      (date) => !existingDates.includes(date) && !addedDates.includes(date),
    );
    if (!nextDate) return;
    setExtraDatesByLocation((current) => ({
      ...current,
      [location]: [...(current[location] ?? []), nextDate],
    }));
  };

  const updateCount = (date: string, location: string, field: "opd" | "ipd", rawValue: string) => {
    const value = Math.max(0, Math.trunc(Number(rawValue) || 0));
    const key = `${date}::${location}`;
    const sourceRow = dateWise.find((day) => day.date === date)?.rows.find((row) => row.label === location);
    setEditedCounts((current) => ({
      ...current,
      [key]: {
        opd: current[key]?.opd ?? sourceRow?.opd ?? 0,
        ipd: current[key]?.ipd ?? sourceRow?.ipd ?? 0,
        [field]: value,
      },
    }));
  };

  return (
    <main className="space-y-4 pb-8">
      <header className="flex flex-col justify-between gap-3 rounded-md bg-[#12345a] px-5 py-4 text-white sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="size-6 shrink-0 text-sky-300" />
          <div>
            <h1 className="text-lg font-semibold leading-tight">{title}</h1>
            <p className="mt-1 text-xs text-sky-100/80">Live registration summary by date and service location</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => printReportHtml(title, reportHtml())} disabled={!report}>
            <Printer className="mr-2 size-4" />Print Report
          </Button>
          <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => exportHtmlToExcel("Dispensary_Master_Report.xls", title, reportHtml())} disabled={!report}>
            <FileSpreadsheet className="mr-2 size-4" />Export to Excel
          </Button>
        </div>
      </header>

      <section aria-label="Report filters" className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
              <CalendarDays className="size-4 text-blue-600" />Select report dates
              <Badge variant="outline" className="ml-1 font-normal">Up to 5 dates</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableDates.slice(0, 10).map((item) => {
                const active = queryDates.includes(item.date);
                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => toggleDate(item.date)}
                    aria-pressed={active}
                    className={`inline-flex h-8 items-center gap-2 rounded border px-2.5 text-xs font-medium transition-colors ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"}`}
                  >
                    {formatDate(item.date)}
                    <span className={active ? "text-blue-100" : "text-slate-400"}>{formatNumber(item.count)}</span>
                    {active && <X className="size-3" />}
                  </button>
                );
              })}
              {!isMetadataLoading && availableDates.length === 0 && (
                <span className="text-sm text-slate-500">No registration dates are available.</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
            <Button variant="outline" size="sm" onClick={() => setHideZeroRows((current) => !current)} aria-pressed={!hideZeroRows}>
              {hideZeroRows ? "Show Zero Rows" : "Hide Zero Rows"}
            </Button>
            <Button variant="outline" size="icon" onClick={() => void refetch()} disabled={isFetching} aria-label="Refresh report" title="Refresh report">
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="date-summary-heading" className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <h2 id="date-summary-heading" className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <CalendarDays className="size-5 text-blue-600" />Date-wise Summary
          </h2>
          <span className="text-xs text-slate-500">{dateWise.length} dates</span>
        </div>
        {isError ? (
          <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load Master Report data. Please refresh and try again.</p>
        ) : isLoading ? (
          <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">{[0, 1, 2].map((key) => <Skeleton key={key} className="h-56" />)}</div>
        ) : dateWise.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No report data found for the selected dates.</p>
        ) : (
          <div className="grid items-start gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {dateWiseWithAddedRows.map((day) => {
              const addedLocations = extraLocationsByDate[day.date] ?? [];
              const rows = [
                ...day.rows,
                ...addedLocations
                  .filter((location) => !day.rows.some((row) => row.label === location))
                  .map((label) => ({ label, opd: 0, ipd: 0, total: 0 })),
              ];
              return (
              <article key={day.date} className="overflow-hidden rounded border border-slate-200">
                <div className="flex items-center justify-between bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-950">
                  <span className="flex items-center gap-2"><CalendarDays className="size-4 text-blue-600" />{formatDate(day.date)}</span>
                  <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-600">Total <strong className="ml-1 text-blue-900">{formatNumber(day.totals.total)}</strong></span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[340px] border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="px-2 py-2 text-left font-semibold">Location</th><th className="px-2 py-2 text-right font-semibold">OPD</th><th className="px-2 py-2 text-right font-semibold">IPD</th><th className="px-2 py-2 text-right font-semibold">Total</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.label} className="hover:bg-blue-50/60"><td className="px-2 py-1.5 font-medium text-slate-700">{row.label}</td><td className="px-1 py-1"><Input className="h-8 min-w-16 px-1 text-right tabular-nums" aria-label={`${row.label}, ${formatDate(day.date)}, OPD`} type="number" min="0" step="1" value={row.opd} onChange={(event) => updateCount(day.date, row.label, "opd", event.target.value)} /></td><td className="px-1 py-1"><Input className="h-8 min-w-16 px-1 text-right tabular-nums" aria-label={`${row.label}, ${formatDate(day.date)}, IPD`} type="number" min="0" step="1" value={row.ipd} onChange={(event) => updateCount(day.date, row.label, "ipd", event.target.value)} /></td><td className="px-2 py-1.5 text-right font-semibold text-slate-900 tabular-nums">{formatNumber(row.total)}</td></tr>)}</tbody>
                    <tfoot className="bg-sky-100/80 font-semibold text-blue-950"><tr><td className="px-2 py-2">Total</td><td className="px-2 py-2 text-right tabular-nums">{formatNumber(day.totals.opd)}</td><td className="px-2 py-2 text-right tabular-nums">{formatNumber(day.totals.ipd)}</td><td className="px-2 py-2 text-right tabular-nums">{formatNumber(day.totals.total)}</td></tr></tfoot>
                  </table>
                </div>
                <div className="border-t border-slate-100 px-2 py-1 text-center">
                  <button type="button" onClick={() => addLocationRow(day.date, rows.map((row) => row.label))} disabled={!report?.locations.some((location) => !rows.some((row) => row.label === location))} className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-400">
                    <Plus className="size-3.5" />Add Location Row
                  </button>
                </div>
              </article>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="location-summary-heading" className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-3 flex flex-col gap-3 px-1 xl:flex-row xl:items-center xl:justify-between">
          <h2 id="location-summary-heading" className="flex shrink-0 items-center gap-2 text-base font-semibold text-slate-900">
            <MapPin className="size-5 text-blue-600" />Location-wise Summary
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {report?.locations.map((location) => {
              const active = selectedLocations.length === 0 || selectedLocations.includes(location);
              return (
                <button
                  key={location}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleLocation(location)}
                  className={`inline-flex h-7 items-center gap-1.5 rounded border px-2 text-xs transition-colors ${active ? "border-blue-200 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-500"}`}
                >
                  {location}{active && selectedLocations.length > 0 && <X className="size-3" />}
                </button>
              );
            })}
            {selectedLocations.length > 0 && <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setSelectedLocations([])}>All locations</Button>}
          </div>
        </div>
        {isLoading ? (
          <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">{[0, 1, 2].map((key) => <Skeleton key={key} className="h-44" />)}</div>
        ) : locationWise.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No locations match the current report filters.</p>
        ) : (
          <div className="grid items-start gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {locationWiseWithAddedRows.map((location) => {
              const addedDates = extraDatesByLocation[location.location] ?? [];
              const rowsByDate = new Map(location.rows.map((row) => [row.date, row]));
              const rows = report?.dates
                .filter((date) => rowsByDate.has(date) || addedDates.includes(date))
                .map((date) => rowsByDate.get(date) ?? ({ date, label: formatDate(date), opd: 0, ipd: 0, total: 0 })) ?? [];
              return (
              <article key={location.location} className="overflow-hidden rounded border border-slate-200">
                <div className="flex items-center justify-between bg-sky-50 px-3 py-2 text-sm font-semibold text-slate-900">
                  <span className="flex items-center gap-2"><MapPin className="size-4 text-sky-700" />{location.location}</span>
                  <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-600">Total <strong className="ml-1 text-slate-900">{formatNumber(location.totals.total)}</strong></span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[340px] border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="px-2 py-2 text-left font-semibold">Date</th><th className="px-2 py-2 text-right font-semibold">OPD</th><th className="px-2 py-2 text-right font-semibold">IPD</th><th className="px-2 py-2 text-right font-semibold">Total</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.date} className="hover:bg-blue-50/60"><td className="px-2 py-1.5 font-medium text-slate-700">{formatDate(row.date)}</td><td className="px-1 py-1"><Input className="h-8 min-w-16 px-1 text-right tabular-nums" aria-label={`${location.location}, ${formatDate(row.date)}, OPD`} type="number" min="0" step="1" value={row.opd} onChange={(event) => updateCount(row.date, location.location, "opd", event.target.value)} /></td><td className="px-1 py-1"><Input className="h-8 min-w-16 px-1 text-right tabular-nums" aria-label={`${location.location}, ${formatDate(row.date)}, IPD`} type="number" min="0" step="1" value={row.ipd} onChange={(event) => updateCount(row.date, location.location, "ipd", event.target.value)} /></td><td className="px-2 py-1.5 text-right font-semibold text-slate-900 tabular-nums">{formatNumber(row.total)}</td></tr>)}</tbody>
                    <tfoot className="bg-sky-100/80 font-semibold text-blue-950"><tr><td className="px-2 py-2">Total</td><td className="px-2 py-2 text-right tabular-nums">{formatNumber(location.totals.opd)}</td><td className="px-2 py-2 text-right tabular-nums">{formatNumber(location.totals.ipd)}</td><td className="px-2 py-2 text-right tabular-nums">{formatNumber(location.totals.total)}</td></tr></tfoot>
                  </table>
                </div>
                <div className="border-t border-slate-100 px-2 py-1 text-center">
                  <button type="button" onClick={() => addDateRow(location.location, rows.map((row) => row.date))} disabled={!report?.dates.some((date) => !rows.some((row) => row.date === date))} className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-400">
                    <Plus className="size-3.5" />Add Date Row
                  </button>
                </div>
              </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}