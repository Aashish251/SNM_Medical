import React, { useState, useMemo, useEffect } from "react";
import {
  Printer,
  FileSpreadsheet,
  Plus,
  Trash2,
  Calendar,
  Building2,
} from "lucide-react";
import {
  useGetReportMetadataQuery,
} from "../../services/reportsApi";
import { useGetMasterRecordsQuery } from "../master/services/masterDataApi";
import { TableSearchableSelect } from "../reports-common/TableSearchableSelect";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Button } from "@admin/components/ui/button";

const FALLBACK_LOCATIONS = [
  "Dispensary-1",
  "Dispensary-2",
  "Dispensary-3",
  "Langar-1",
  "Langar-2",
  "Langar-3",
];

interface DailyRow {
  id: string;
  department: string;
  values: number[];
  locationValues?: Record<string, number>;
}

const LS_KEY_DAILY = "report_daily";

interface StoredDaily {
  createdAt: number;
  data: {
    samagamName: string;
    reportDate: string;
    rows: DailyRow[];
    savedLocations?: string[];
  };
}

const getStoredDaily = (): StoredDaily | null => {
  try {
    const raw = localStorage.getItem(LS_KEY_DAILY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.createdAt || !parsed?.data) {
      localStorage.removeItem(LS_KEY_DAILY);
      return null;
    }
    // Auto-delete if older than 24 hours
    if (Date.now() - parsed.createdAt >= 24 * 60 * 60 * 1000) {
      localStorage.removeItem(LS_KEY_DAILY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(LS_KEY_DAILY);
    return null;
  }
};

export function LiveDailyReport() {
  const { data: masterDepts } = useGetMasterRecordsQuery({
    module: "department",
    search: "",
  });
  const { data: masterLocations, isLoading: isLoadingLocations } = useGetMasterRecordsQuery({
    module: "sewalocation",
    search: "",
  });
  const { data: metaResponse } = useGetReportMetadataQuery();

  // Restore persisted inputs from localStorage on load immediately
  const storedDaily = useMemo(() => getStoredDaily(), []);

  // Dynamic Departments loaded directly from database table
  const allDepartments = useMemo(() => {
    const list: string[] = [];
    if (masterDepts?.data?.items) {
      masterDepts.data.items.forEach((d) => {
        const val = String(d.value || "").trim();
        if (val && !list.includes(val)) {
          list.push(val);
        }
      });
    }
    if (metaResponse?.data?.departments) {
      metaResponse.data.departments.forEach((d) => {
        const val = String(d.name || "").trim();
        if (val && !list.includes(val)) {
          list.push(val);
        }
      });
    }
    return list;
  }, [masterDepts, metaResponse]);

  // Dynamic Locations loaded directly from database table
  // If masterLocations is still loading on refresh, use savedLocations from localStorage to avoid truncating!
  const locationColumns = useMemo(() => {
    const list: string[] = [];
    if (masterLocations?.data?.items) {
      masterLocations.data.items.forEach((item) => {
        const val = String(item.value || "").trim();
        if (val && !list.includes(val)) {
          list.push(val);
        }
      });
    }
    if (metaResponse?.data?.locations) {
      metaResponse.data.locations.forEach((loc) => {
        const val = String(loc.name || "").trim();
        if (val && !list.includes(val)) {
          list.push(val);
        }
      });
    }
    if (list.length > 0) return list;
    if (storedDaily?.data?.savedLocations && storedDaily.data.savedLocations.length > 0) {
      return storedDaily.data.savedLocations;
    }
    return FALLBACK_LOCATIONS;
  }, [masterLocations, metaResponse, storedDaily]);

  const [samagamName, setSamagamName] = useState(
    () => storedDaily?.data?.samagamName || "60TH MAHARASHTRA NIRANKARI SANT SAMAGAM"
  );
  const [reportDate, setReportDate] = useState(
    () => storedDaily?.data?.reportDate || ""
  );
  const [rows, setRows] = useState<DailyRow[]>(() => {
    if (storedDaily?.data?.rows && storedDaily.data.rows.length > 0) {
      return storedDaily.data.rows;
    }
    return [{ id: "row-1", department: "", values: [] }];
  });

  // Auto-save to localStorage on every change (inputs only, not totals)
  useEffect(() => {
    try {
      const existingRaw = localStorage.getItem(LS_KEY_DAILY);
      let createdAt = Date.now();
      if (existingRaw) {
        try {
          const parsed = JSON.parse(existingRaw);
          if (parsed?.createdAt && Date.now() - parsed.createdAt < 24 * 60 * 60 * 1000) {
            createdAt = parsed.createdAt;
          }
        } catch {}
      }
      localStorage.setItem(
        LS_KEY_DAILY,
        JSON.stringify({
          createdAt,
          data: {
            samagamName,
            reportDate,
            rows,
            savedLocations: locationColumns,
          },
        })
      );
    } catch (e) {
      console.error("Failed to save daily report to localStorage", e);
    }
  }, [samagamName, reportDate, rows, locationColumns]);

  // Auto-delete saved data after 24 hours (checked once a minute)
  useEffect(() => {
    const checkExpiry = () => {
      const raw = localStorage.getItem(LS_KEY_DAILY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.createdAt && Date.now() - parsed.createdAt >= 24 * 60 * 60 * 1000) {
            localStorage.removeItem(LS_KEY_DAILY);
          }
        } catch {
          localStorage.removeItem(LS_KEY_DAILY);
        }
      }
    };
    const timer = setInterval(checkExpiry, 60000);
    return () => clearInterval(timer);
  }, []);

  // Ensure rows have values initialized to match locationColumns length WITHOUT truncating
  useEffect(() => {
    if (isLoadingLocations) return;
    const targetLen = locationColumns.length;
    setRows((prev) =>
      prev.map((r) => {
        // Only expand if values is shorter than targetLen; NEVER truncate longer arrays!
        if (!r.values || r.values.length < targetLen) {
          const newVals = new Array(targetLen).fill(0);
          if (Array.isArray(r.values)) {
            r.values.forEach((v, i) => {
              newVals[i] = Number(v) || 0;
            });
          }
          if (r.locationValues) {
            locationColumns.forEach((loc, i) => {
              if (r.locationValues?.[loc] !== undefined) {
                newVals[i] = r.locationValues[loc];
              }
            });
          }
          return { ...r, values: newVals };
        }
        return r;
      })
    );
  }, [locationColumns, isLoadingLocations]);

  // Date Title formatted as en-GB (DD/MM/YYYY)
  const dateTitle = useMemo(() => {
    if (!reportDate) return "DAILY REPORT CHART";
    try {
      const formatted = new Date(reportDate).toLocaleDateString("en-GB");
      return `DAILY REPORT CHART - ${formatted}`;
    } catch {
      return "DAILY REPORT CHART";
    }
  }, [reportDate]);

  // Add new row
  const addRow = (index?: number) => {
    const newRow: DailyRow = {
      id: `row-${Date.now()}-${Math.random()}`,
      department: "",
      values: new Array(locationColumns.length).fill(0),
      locationValues: {},
    };
    if (typeof index === "number") {
      const updated = [...rows];
      updated.splice(index + 1, 0, newRow);
      setRows(updated);
    } else {
      setRows((prev) => [...prev, newRow]);
    }
  };

  // Remove row
  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Update department
  const handleDepartmentChange = (id: string, department: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            department,
            values: department ? r.values : new Array(locationColumns.length).fill(0),
          };
        }
        return r;
      })
    );
  };

  // Update number value (stores in both indexed array and by location name)
  const handleValueChange = (
    id: string,
    valIdx: number,
    locName: string,
    rawVal: string
  ) => {
    const num = Math.max(0, parseInt(rawVal, 10) || 0);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const targetLen = Math.max(locationColumns.length, r.values?.length || 0, valIdx + 1);
          const newVals = new Array(targetLen).fill(0);
          if (Array.isArray(r.values)) {
            r.values.forEach((v, i) => {
              newVals[i] = Number(v) || 0;
            });
          }
          newVals[valIdx] = num;

          const newLocValues = { ...(r.locationValues || {}) };
          if (locName) {
            newLocValues[locName] = num;
          }
          return { ...r, values: newVals, locationValues: newLocValues };
        }
        return r;
      })
    );
  };

  // Column totals
  const totals = useMemo(() => {
    const numCols = locationColumns.length || 1;
    const t = new Array(numCols).fill(0);
    rows.forEach((r) => {
      if (r.department) {
        locationColumns.forEach((loc, idx) => {
          const val = r.locationValues?.[loc] !== undefined
            ? r.locationValues[loc]
            : r.values?.[idx];
          t[idx] += Number(val) || 0;
        });
      }
    });
    return t;
  }, [rows, locationColumns]);

  const grandTotal = useMemo(() => {
    return totals.reduce((sum, v) => sum + v, 0);
  }, [totals]);

  // Print function matching DailyReport.html
  const preparePrint = () => {
    window.print();
  };

  // Excel Export matching DailyReport.html
  const exportToExcel = () => {
    let html = "<table border='1'>";
    html += `
      <tr>
        <th colspan="${locationColumns.length + 1}">${samagamName}</th>
      </tr>
      <tr>
        <th colspan="${locationColumns.length + 1}">${dateTitle}</th>
      </tr>
      <tr>
        <th>Department</th>
        ${locationColumns.map((loc) => `<th>${loc}</th>`).join("")}
      </tr>
    `;

    rows.forEach((r) => {
      if (r.department) {
        html += `
          <tr>
            <td>${r.department}</td>
            ${locationColumns.map((loc, idx) => {
              const val = r.locationValues?.[loc] !== undefined ? r.locationValues[loc] : r.values?.[idx];
              return `<td>${val || 0}</td>`;
            }).join("")}
          </tr>
        `;
      }
    });

    html += `
      <tr>
        <td><b>TOTAL</b></td>
        ${totals.map((t) => `<td>${t}</td>`).join("")}
      </tr>
    </table>`;

    const blob = new Blob(["\ufeff", html], {
      type: "application/vnd.ms-excel",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Daily_Report.xls";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  return (
    <>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        {/* Page heading */}
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Patient Daily Report</h2>
            <p className="text-muted-foreground">
              Department-wise daily footfall cross-tabulation across all dispensary locations.
            </p>
          </div>
        </div>

      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 8mm;
          }
          .daily-top-section,
          .daily-action-col,
          .print-hide {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .daily-card {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .daily-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .daily-table th, .daily-table td {
            text-align: center !important;
            vertical-align: middle !important;
            border: 1px solid #000 !important;
            padding: 6px !important;
            font-size: 11px !important;
          }
          .daily-table thead th {
            background: #d9d9d9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .daily-table input,
          .daily-table select,
          .table-searchable-trigger {
            border: none !important;
            background: transparent !important;
            text-align: center !important;
            box-shadow: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            font-size: 11px !important;
          }
          .table-searchable-trigger svg {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Control Bar */}
      <div className="daily-top-section mb-5 flex flex-wrap items-end justify-between gap-3 bg-muted/50 p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex flex-wrap items-end gap-3 flex-1 min-w-[280px]">
            {/* Samagam Name */}
            <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                Samagam Name
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={samagamName}
                onChange={(e) => setSamagamName(e.target.value)}
                placeholder="Enter Samagam Name"
              />
            </div>

            {/* Report Date */}
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[170px]">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                Report Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={preparePrint}
            >
              <Printer className="size-3.5" />
              Print Report
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={exportToExcel}
            >
              <FileSpreadsheet className="size-3.5" />
              Export to Excel
            </Button>
          </div>
        </div>

        {/* Dynamic Titles */}
        <div className="mb-5 text-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {samagamName}
          </h2>
          <h3 className="mt-1 text-sm sm:text-base font-semibold tracking-wide text-primary">
            {dateTitle}
          </h3>
        </div>

        {/* Full-Width Responsive Table */}
        <div className="w-full overflow-x-auto rounded-lg border border-border shadow-sm">
          <table className="daily-table w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-muted text-foreground">
                <th className="border border-slate-400/80 px-3 py-2.5 text-center font-bold min-w-[160px]">
                  Department
                </th>
                {locationColumns.map((loc) => (
                  <th
                    key={loc}
                    className="border border-slate-400/80 px-2 py-2.5 text-center font-bold min-w-[85px]"
                  >
                    {loc}
                  </th>
                ))}
                <th className="daily-action-col border border-slate-400/80 px-3 py-2.5 text-center font-bold w-[18%] min-w-[170px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {rows.map((row, idx) => {
                const isDeptSelected = Boolean(row.department);
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="border border-slate-300 p-2">
                      <TableSearchableSelect
                        value={row.department}
                        options={allDepartments}
                        onChange={(val) => handleDepartmentChange(row.id, val)}
                        placeholder="Select Department"
                        searchPlaceholder="Search department..."
                      />
                    </td>

                    {locationColumns.map((loc, valIdx) => {
                      const curVal = row.locationValues?.[loc] !== undefined
                        ? row.locationValues[loc]
                        : row.values?.[valIdx];
                      const displayVal = curVal === 0 || curVal === undefined ? "" : curVal;

                      return (
                        <td key={valIdx} className="border border-slate-300 p-1">
                          <input
                            type="number"
                            min="0"
                            disabled={!isDeptSelected}
                            className="w-full rounded-md border border-slate-300 bg-white px-1.5 py-1.5 text-center text-xs tabular-nums text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                            value={displayVal}
                            placeholder={isDeptSelected ? "0" : "—"}
                            onChange={(e) =>
                              handleValueChange(row.id, valIdx, loc, e.target.value)
                            }
                          />
                        </td>
                      );
                    })}

                    <td className="daily-action-col border border-slate-300 p-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md bg-primary/10 hover:bg-primary/20 text-primary p-1.5 transition-all active:scale-95 cursor-pointer"
                          onClick={() => addRow(idx)}
                          title="Add new row below"
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive p-1.5 transition-all active:scale-95 cursor-pointer"
                          onClick={() => removeRow(row.id)}
                          title="Remove this row"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-400">
                <td className="border border-slate-300 px-3 py-2 text-center font-bold">
                  TOTAL
                </td>
                {totals.map((t, i) => (
                  <td
                    key={i}
                    className="border border-slate-300 px-1 py-2 text-center tabular-nums text-slate-900 font-extrabold"
                  >
                    {t.toLocaleString()}
                  </td>
                ))}
                <td className="daily-action-col border border-slate-300 p-2 text-center">
                  {rows.length === 0 && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-primary/10 hover:bg-primary/20 text-primary p-1.5 transition-all active:scale-95 cursor-pointer"
                      onClick={() => addRow()}
                      title="Add new row"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  )}
                </td>
              </tr>
              {rows.length > 0 && (
                <tr className="bg-slate-200/90 text-slate-900 font-bold border-t border-slate-300">
                  <td
                    colSpan={locationColumns.length + 2}
                    className="border border-slate-300 px-4 py-2 text-left text-xs sm:text-sm font-extrabold"
                  >
                    Grand Total:{" "}
                    <span className="text-blue-700">
                      {grandTotal.toLocaleString()}
                    </span>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </Main>
    </>
  );
}
