import React, { useState, useMemo, useEffect } from "react";
import {
  Printer,
  FileSpreadsheet,
  Plus,
  Trash2,
  Calendar,
  Building2,
  CheckCircle2,
} from "lucide-react";
import {
  useGetDailyReportQuery,
  useGetReportMetadataQuery,
} from "../../services/reportsApi";

const DEFAULT_DEPARTMENTS = [
  "Registration",
  "OPD",
  "INDOOR",
  "Homeopathy",
  "Accupressure",
  "Physiotherapy",
  "Dental",
  "Eye",
  "ENT",
  "ECG",
  "Pediatric",
  "ICU",
  "Injection",
  "Dressing",
  "Pathology",
];

const LOCATIONS = [
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
  values: number[]; // 6 values corresponding to LOCATIONS
}

export function LiveDailyReport() {
  const { data: metaResponse } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];
  const metaDepartments = metaResponse?.data?.departments || [];

  const allDepartments = useMemo(() => {
    const list = [...DEFAULT_DEPARTMENTS];
    metaDepartments.forEach((d) => {
      if (!list.includes(d.name)) {
        list.push(d.name);
      }
    });
    return list;
  }, [metaDepartments]);

  const [samagamName, setSamagamName] = useState(
    "60TH MAHARASHTRA NIRANKARI SANT SAMAGAM"
  );
  const [reportDate, setReportDate] = useState("");
  const [rows, setRows] = useState<DailyRow[]>([
    { id: "row-1", department: "", values: [0, 0, 0, 0, 0, 0] },
  ]);

  // Query backend data if available for date
  const { data: reportResponse } = useGetDailyReportQuery(
    { date: reportDate, includeEmpty: false },
    { skip: !reportDate }
  );

  // If backend returns rows for this date, populate them
  useEffect(() => {
    if (reportResponse?.data?.rows && reportResponse.data.rows.length > 0) {
      const backendRows: DailyRow[] = reportResponse.data.rows.map(
        (r, idx) => ({
          id: `backend-${idx}`,
          department: r.department,
          values: LOCATIONS.map((loc) => {
            const locKey = loc.toLowerCase().replace("-", " ");
            const locKeyAlt = loc.toLowerCase().replace("-", "");
            return (
              r.values[loc] ??
              r.values[locKey] ??
              r.values[locKeyAlt] ??
              0
            );
          }),
        })
      );
      setRows(backendRows);
    }
  }, [reportResponse]);

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
      values: [0, 0, 0, 0, 0, 0],
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
            values: department ? r.values : [0, 0, 0, 0, 0, 0],
          };
        }
        return r;
      })
    );
  };

  // Update number value
  const handleValueChange = (
    id: string,
    valIdx: number,
    rawVal: string
  ) => {
    const num = Math.max(0, parseInt(rawVal, 10) || 0);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newVals = [...r.values];
          newVals[valIdx] = num;
          return { ...r, values: newVals };
        }
        return r;
      })
    );
  };

  // Column totals
  const totals = useMemo(() => {
    const t = [0, 0, 0, 0, 0, 0];
    rows.forEach((r) => {
      if (r.department) {
        r.values.forEach((v, idx) => {
          t[idx] += v;
        });
      }
    });
    return t;
  }, [rows]);

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
        <th colspan="7">${samagamName}</th>
      </tr>
      <tr>
        <th colspan="7">${dateTitle}</th>
      </tr>
      <tr>
        <th>Department</th>
        ${LOCATIONS.map((loc) => `<th>${loc}</th>`).join("")}
      </tr>
    `;

    rows.forEach((r) => {
      if (r.department) {
        html += `
          <tr>
            <td>${r.department}</td>
            ${r.values.map((v) => `<td>${v || 0}</td>`).join("")}
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
    <div className="daily-report-wrapper w-full p-3 sm:p-6 bg-slate-50/60 min-h-screen text-slate-800 font-sans">
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
          body, .daily-report-wrapper {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .daily-report-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
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
          .daily-table select {
            border: none !important;
            background: transparent !important;
            text-align: center !important;
            box-shadow: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      <div className="daily-report-container max-w-6xl mx-auto rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        {/* Top Control Section */}
        <div className="daily-top-section mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-end gap-4 w-full md:w-auto flex-1">
            {/* Samagam Name */}
            <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 min-w-[260px]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Building2 className="size-3.5 text-blue-600" />
                Samagam Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={samagamName}
                onChange={(e) => setSamagamName(e.target.value)}
                placeholder="Enter Samagam Name"
              />
            </div>

            {/* Report Date */}
            <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[190px]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-blue-600" />
                Report Date
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0066cc] hover:bg-[#0052a3] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              onClick={preparePrint}
            >
              <Printer className="size-3.5" />
              Print Report
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              onClick={exportToExcel}
            >
              <FileSpreadsheet className="size-3.5" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Dynamic Titles */}
        <div className="mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {samagamName}
          </h2>
          <h3 className="mt-1 text-sm sm:text-base font-bold tracking-wide text-blue-700">
            {dateTitle}
          </h3>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* Table Container with Smooth Horizontal Scrolling */}
        <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-2xs">
          <table className="daily-table w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-200/90 text-slate-900">
                <th className="border border-slate-400/80 px-3 py-3 text-center font-bold min-w-44">
                  Department
                </th>
                {LOCATIONS.map((loc) => (
                  <th
                    key={loc}
                    className="border border-slate-400/80 px-2 py-3 text-center font-bold min-w-28"
                  >
                    {loc}
                  </th>
                ))}
                <th className="daily-action-col border border-slate-400/80 px-3 py-3 text-center font-bold w-36">
                  Action
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
                      <select
                        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                        value={row.department}
                        onChange={(e) =>
                          handleDepartmentChange(row.id, e.target.value)
                        }
                      >
                        <option value="">Select Department</option>
                        {allDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </td>

                    {LOCATIONS.map((_, valIdx) => (
                      <td key={valIdx} className="border border-slate-300 p-1.5">
                        <input
                          type="number"
                          min="0"
                          disabled={!isDeptSelected}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-center text-xs tabular-nums text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          value={row.values[valIdx] === 0 ? "" : row.values[valIdx]}
                          placeholder={isDeptSelected ? "0" : "—"}
                          onChange={(e) =>
                            handleValueChange(row.id, valIdx, e.target.value)
                          }
                        />
                      </td>
                    ))}

                    <td className="daily-action-col border border-slate-300 p-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-[#0275d8] hover:bg-[#025aa5] text-white px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95"
                          onClick={() => addRow(idx)}
                        >
                          <Plus className="size-3" />
                          Add New
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-[#d9534f] hover:bg-[#c9302c] text-white px-2.5 py-1 text-xs font-medium shadow-2xs transition-all active:scale-95"
                          onClick={() => removeRow(row.id)}
                        >
                          <Trash2 className="size-3" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-400">
                <td className="border border-slate-300 px-3 py-3 text-center">
                  TOTAL
                </td>
                {totals.map((t, i) => (
                  <td
                    key={i}
                    className="border border-slate-300 px-2 py-3 text-center tabular-nums text-slate-900 font-extrabold"
                  >
                    {t.toLocaleString()}
                  </td>
                ))}
                <td className="daily-action-col border border-slate-300 p-2 text-center">
                  {rows.length === 0 && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md bg-[#0275d8] hover:bg-[#025aa5] text-white px-3 py-1.5 text-xs font-semibold shadow-2xs"
                      onClick={() => addRow()}
                    >
                      <Plus className="size-3.5" />
                      Add New
                    </button>
                  )}
                  {rows.length > 0 && (
                    <span className="text-[11px] font-semibold text-slate-600">
                      Grand: {grandTotal.toLocaleString()}
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
