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
  useGetRegistrationReportQuery,
  useGetReportMetadataQuery,
} from "../../services/reportsApi";

const DEFAULT_DEPARTMENTS = [
  "Desp-1",
  "Desp-2",
  "Desp-3",
  "Langar-1",
  "Langar-2",
  "Langar-3",
];

interface RegRow {
  id: string;
  department: string;
  v1: number;
  v2: number;
  v3: number;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
}

export function LiveRegistrationReport() {
  const { data: metaResponse } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];
  const metaLocations = metaResponse?.data?.locations || [];

  const allDepts = useMemo(() => {
    const list = [...DEFAULT_DEPARTMENTS];
    metaLocations.forEach((loc) => {
      if (!list.includes(loc.name)) {
        list.push(loc.name);
      }
    });
    return list;
  }, [metaLocations]);

  const [title, setTitle] = useState("60 Maharashtra Nirankari Sant Samagam");
  const [d1, setD1] = useState(availableDates[0]?.date || "2025-01-24");
  const [d2, setD2] = useState(availableDates[1]?.date || "2025-01-25");
  const [d3, setD3] = useState(availableDates[2]?.date || "2025-01-26");

  const [rows, setRows] = useState<RegRow[]>([
    { id: "row-1", department: DEFAULT_DEPARTMENTS[0], v1: 0, v2: 0, v3: 0 },
  ]);

  // Optional backend data fetching
  const queryDatesStr = [d1, d2, d3].filter(Boolean).join(",");
  const { data: reportResponse } = useGetRegistrationReportQuery(
    { dates: queryDatesStr, includeEmpty: true },
    { skip: !queryDatesStr }
  );

  useEffect(() => {
    if (reportResponse?.data?.rows && reportResponse.data.rows.length > 0) {
      const backendRows: RegRow[] = reportResponse.data.rows.map((r, i) => {
        const name =
          r.location ||
          r.department ||
          DEFAULT_DEPARTMENTS[i % DEFAULT_DEPARTMENTS.length];
        return {
          id: `backend-${i}`,
          department: name,
          v1: r.values[d1] ?? 0,
          v2: r.values[d2] ?? 0,
          v3: r.values[d3] ?? 0,
        };
      });
      if (backendRows.length > 0) {
        setRows(backendRows);
      }
    }
  }, [reportResponse, d1, d2, d3]);

  // Add row
  const addRow = () => {
    const newRow: RegRow = {
      id: `row-${Date.now()}-${Math.random()}`,
      department: DEFAULT_DEPARTMENTS[0],
      v1: 0,
      v2: 0,
      v3: 0,
    };
    setRows((prev) => [...prev, newRow]);
  };

  // Delete row
  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Update department
  const updateDepartment = (id: string, department: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, department } : r))
    );
  };

  // Update cell value
  const updateVal = (
    id: string,
    field: "v1" | "v2" | "v3",
    rawVal: string
  ) => {
    const num = Math.max(0, parseInt(rawVal, 10) || 0);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: num } : r))
    );
  };

  // Totals
  const { t1, t2, t3, grandTotal } = useMemo(() => {
    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    rows.forEach((r) => {
      sum1 += r.v1 || 0;
      sum2 += r.v2 || 0;
      sum3 += r.v3 || 0;
    });
    return {
      t1: sum1,
      t2: sum2,
      t3: sum3,
      grandTotal: sum1 + sum2 + sum3,
    };
  }, [rows]);

  // Generate clean HTML for print & Excel
  const generateCleanReportHTML = () => {
    const date1Formatted = formatDate(d1);
    const date2Formatted = formatDate(d2);
    const date3Formatted = formatDate(d3);

    let html = `
      <h2 style="text-align:center; font-weight:bold; font-family:Arial, sans-serif;">${title}</h2>
      <table border="1" style="border-collapse:collapse; width:100%; font-family:Arial, sans-serif; text-align:center;">
        <tr style="background:#f2f2f2;">
          <th style="padding:8px; border:1px solid #000;">Department</th>
          <th style="padding:8px; border:1px solid #000;">${date1Formatted}</th>
          <th style="padding:8px; border:1px solid #000;">${date2Formatted}</th>
          <th style="padding:8px; border:1px solid #000;">${date3Formatted}</th>
        </tr>
    `;

    rows.forEach((r) => {
      html += `
        <tr>
          <td style="padding:8px; border:1px solid #000;">${r.department}</td>
          <td style="padding:8px; border:1px solid #000;">${r.v1}</td>
          <td style="padding:8px; border:1px solid #000;">${r.v2}</td>
          <td style="padding:8px; border:1px solid #000;">${r.v3}</td>
        </tr>
      `;
    });

    html += `
        <tr style="font-weight:bold; background:#fafafa;">
          <td style="padding:8px; border:1px solid #000;"><b>Total</b></td>
          <td style="padding:8px; border:1px solid #000;"><b>${t1}</b></td>
          <td style="padding:8px; border:1px solid #000;"><b>${t2}</b></td>
          <td style="padding:8px; border:1px solid #000;"><b>${t3}</b></td>
        </tr>
        <tr>
          <td colspan="4" style="padding:8px; border:1px solid #000; font-weight:bold;">Grand Total: ${grandTotal}</td>
        </tr>
      </table>
    `;

    return html;
  };

  // Print function matching RegistrationReport.html
  const printReport = () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Registration Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; font-weight: bold; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; text-align: center; }
          th { background: #f2f2f2; }
        </style>
      </head>
      <body>
        ${generateCleanReportHTML()}
      </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  };

  // Export Excel matching RegistrationReport.html
  const exportExcel = () => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
          th, td { border: 1px solid black; padding: 8px; text-align: center; font-size: 12px; }
          th { font-weight: bold; background: #f2f2f2; }
          h2 { text-align: center; font-weight: bold; }
        </style>
      </head>
      <body>
        ${generateCleanReportHTML()}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Dispensary_Report.xls";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  return (
    <div className="registration-report-wrapper w-full p-3 sm:p-6 bg-slate-50/60 min-h-screen text-slate-900 font-sans">
      <style>{`
        @media print {
          .reg-print-hide {
            display: none !important;
          }
          body, .registration-report-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
          }
          .reg-report-container {
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .reg-table th, .reg-table td {
            border: 1px solid #000 !important;
            padding: 6px !important;
            font-size: 11px !important;
          }
          .reg-table input,
          .reg-table select {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            text-align: center !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
        }
      `}</style>

      <div className="reg-report-container max-w-4xl mx-auto rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        {/* Centered Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Registration Report
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* Title Input */}
        <div className="mb-5 flex flex-wrap items-center gap-3 reg-print-hide">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap flex items-center gap-1.5">
            <Building2 className="size-3.5 text-blue-600" />
            Title:
          </label>
          <input
            type="text"
            className="flex-1 max-w-lg rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5 reg-print-hide">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
            onClick={addRow}
          >
            <Plus className="size-3.5 text-blue-600" />
            Add Row
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0066cc] hover:bg-[#0052a3] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            onClick={printReport}
          >
            <Printer className="size-3.5" />
            Print
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            onClick={exportExcel}
          >
            <FileSpreadsheet className="size-3.5" />
            Export Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-2xs">
          <table className="reg-table w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                <th className="border border-slate-300 px-3 py-3 text-left font-bold min-w-40">
                  Department
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center font-bold min-w-36">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="size-3.5 text-blue-600 shrink-0" />
                    <input
                      type="date"
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      value={d1}
                      onChange={(e) => setD1(e.target.value)}
                    />
                  </div>
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center font-bold min-w-36">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="size-3.5 text-blue-600 shrink-0" />
                    <input
                      type="date"
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      value={d2}
                      onChange={(e) => setD2(e.target.value)}
                    />
                  </div>
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center font-bold min-w-36">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="size-3.5 text-blue-600 shrink-0" />
                    <input
                      type="date"
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      value={d3}
                      onChange={(e) => setD3(e.target.value)}
                    />
                  </div>
                </th>
                <th className="reg-print-hide border border-slate-300 px-3 py-3 text-center font-bold w-24">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="border border-slate-300 p-2">
                    <select
                      className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                      value={row.department}
                      onChange={(e) =>
                        updateDepartment(row.id, e.target.value)
                      }
                    >
                      {allDepts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="border border-slate-300 p-1.5">
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-center text-xs tabular-nums text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={row.v1 === 0 ? "" : row.v1}
                      placeholder="0"
                      onChange={(e) =>
                        updateVal(row.id, "v1", e.target.value)
                      }
                    />
                  </td>

                  <td className="border border-slate-300 p-1.5">
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-center text-xs tabular-nums text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={row.v2 === 0 ? "" : row.v2}
                      placeholder="0"
                      onChange={(e) =>
                        updateVal(row.id, "v2", e.target.value)
                      }
                    />
                  </td>

                  <td className="border border-slate-300 p-1.5">
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-center text-xs tabular-nums text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={row.v3 === 0 ? "" : row.v3}
                      placeholder="0"
                      onChange={(e) =>
                        updateVal(row.id, "v3", e.target.value)
                      }
                    />
                  </td>

                  <td className="reg-print-hide border border-slate-300 p-2 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md bg-[#d9534f] hover:bg-[#c9302c] text-white px-3 py-1 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                      onClick={() => deleteRow(row.id)}
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-400">
                <td className="border border-slate-300 px-3 py-2.5 text-left font-bold">
                  Total
                </td>
                <td className="border border-slate-300 px-2 py-2.5 text-center tabular-nums font-extrabold">
                  {t1.toLocaleString()}
                </td>
                <td className="border border-slate-300 px-2 py-2.5 text-center tabular-nums font-extrabold">
                  {t2.toLocaleString()}
                </td>
                <td className="border border-slate-300 px-2 py-2.5 text-center tabular-nums font-extrabold">
                  {t3.toLocaleString()}
                </td>
                <td className="reg-print-hide border border-slate-300" />
              </tr>
              <tr className="bg-slate-50">
                <td
                  colSpan={5}
                  className="border border-slate-300 text-left font-bold px-4 py-3 text-slate-900"
                >
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mr-2">
                    Grand Total:
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-blue-700 tabular-nums">
                    {grandTotal.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
