import React, { useState, useMemo, useEffect } from "react";
import {
  Printer,
  FileSpreadsheet,
  Plus,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";
import {
  useGetMasterReportQuery,
  useGetReportMetadataQuery,
} from "../../services/reportsApi";

const ALL_DEPTS = [
  "Dispensary 1",
  "Dispensary 2",
  "Dispensary 3",
  "Langar 1",
  "Langar 2",
  "Langar 3",
];

const INITIAL_DATA: Record<
  string,
  Record<string, { opd: number; ipd: number }>
> = {
  "2025-01-24": {
    "Dispensary 1": { opd: 2537, ipd: 54 },
    "Dispensary 2": { opd: 2918, ipd: 0 },
    "Dispensary 3": { opd: 0, ipd: 0 },
    "Langar 1": { opd: 481, ipd: 0 },
    "Langar 2": { opd: 0, ipd: 0 },
    "Langar 3": { opd: 231, ipd: 0 },
  },
  "2025-01-25": {
    "Dispensary 1": { opd: 3495, ipd: 77 },
    "Dispensary 2": { opd: 3264, ipd: 32 },
    "Dispensary 3": { opd: 0, ipd: 0 },
    "Langar 1": { opd: 602, ipd: 0 },
    "Langar 2": { opd: 0, ipd: 0 },
    "Langar 3": { opd: 477, ipd: 0 },
  },
  "2025-01-26": {
    "Dispensary 1": { opd: 2100, ipd: 30 },
    "Dispensary 2": { opd: 1800, ipd: 12 },
    "Dispensary 3": { opd: 250, ipd: 0 },
    "Langar 1": { opd: 200, ipd: 0 },
    "Langar 2": { opd: 100, ipd: 0 },
    "Langar 3": { opd: 50, ipd: 0 },
  },
};

function fmtDisplay(k: string) {
  if (!k) return "";
  const parts = k.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${+d}/${+m}/${y}`;
  }
  return k;
}

export function LiveMasterReport() {
  const { data: metaResponse } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];

  const [reportTitle, setReportTitle] = useState(
    "58th Maharashtra Samagam Dispensary Master Report"
  );

  // Single source of truth for (dateKey, location) -> { opd, ipd }
  const [data, setData] = useState<
    Record<string, Record<string, { opd: number; ipd: number }>>
  >(INITIAL_DATA);

  // Active dates
  const [activeDates, setActiveDates] = useState<string[]>([
    "2025-01-24",
    "2025-01-25",
    "2025-01-26",
  ]);

  // dateRows[dateKey] = [ dept1, dept2, ... ]
  const [dateRows, setDateRows] = useState<Record<string, string[]>>({
    "2025-01-24": [...ALL_DEPTS],
    "2025-01-25": [...ALL_DEPTS],
    "2025-01-26": [...ALL_DEPTS],
  });

  // Active locations shown in location-wise section
  const [activeDepts, setActiveDepts] = useState<string[]>([...ALL_DEPTS]);

  // deptCardDates[dept] = [ date1, date2, ... ]
  const [deptCardDates, setDeptCardDates] = useState<Record<string, string[]>>({
    "Dispensary 1": ["2025-01-24", "2025-01-25", "2025-01-26"],
    "Dispensary 2": ["2025-01-24", "2025-01-25", "2025-01-26"],
    "Dispensary 3": ["2025-01-24", "2025-01-25", "2025-01-26"],
    "Langar 1": ["2025-01-24", "2025-01-25", "2025-01-26"],
    "Langar 2": ["2025-01-24", "2025-01-25", "2025-01-26"],
    "Langar 3": ["2025-01-24", "2025-01-25", "2025-01-26"],
  });

  const [newDateInput, setNewDateInput] = useState("");
  const [newDeptInput, setNewDeptInput] = useState("");

  // Backend query
  const queryDatesStr = activeDates.join(",");
  const { data: apiResponse } = useGetMasterReportQuery(
    { dates: queryDatesStr, includeEmpty: true },
    { skip: !queryDatesStr }
  );

  // Merge API data if it has entries for dates
  useEffect(() => {
    if (apiResponse?.data?.dateWise && apiResponse.data.dateWise.length > 0) {
      setData((prev) => {
        const next = { ...prev };
        apiResponse.data.dateWise.forEach((dw) => {
          if (!next[dw.date]) next[dw.date] = {};
          dw.rows.forEach((r) => {
            if (!next[dw.date][r.label]) {
              next[dw.date][r.label] = { opd: r.opd, ipd: r.ipd };
            }
          });
        });
        return next;
      });
    }
  }, [apiResponse]);

  const getVal = (dateKey: string, dept: string, field: "opd" | "ipd") => {
    return data[dateKey]?.[dept]?.[field] ?? 0;
  };

  const setCellVal = (
    dateKey: string,
    dept: string,
    field: "opd" | "ipd",
    val: number
  ) => {
    setData((prev) => {
      const prevDate = prev[dateKey] || {};
      const prevDept = prevDate[dept] || { opd: 0, ipd: 0 };
      return {
        ...prev,
        [dateKey]: {
          ...prevDate,
          [dept]: {
            ...prevDept,
            [field]: isNaN(val) ? 0 : val,
          },
        },
      };
    });
  };

  // ── Date-wise actions ──
  const addDate = () => {
    if (!newDateInput) {
      alert("Please select a date first.");
      return;
    }
    if (activeDates.includes(newDateInput)) {
      alert("This date is already added.");
      return;
    }
    const nextDates = [...activeDates, newDateInput].sort();
    setActiveDates(nextDates);
    setDateRows((prev) => ({
      ...prev,
      [newDateInput]: prev[newDateInput] || [...ALL_DEPTS],
    }));
    setDeptCardDates((prev) => {
      const updated: Record<string, string[]> = {};
      Object.keys(prev).forEach((dept) => {
        if (!prev[dept].includes(newDateInput)) {
          updated[dept] = [...prev[dept], newDateInput].sort();
        } else {
          updated[dept] = prev[dept];
        }
      });
      return updated;
    });
    setNewDateInput("");
  };

  const removeDate = (dateKey: string) => {
    setActiveDates((prev) => prev.filter((d) => d !== dateKey));
    setDeptCardDates((prev) => {
      const updated: Record<string, string[]> = {};
      Object.keys(prev).forEach((dept) => {
        updated[dept] = prev[dept].filter((d) => d !== dateKey);
      });
      return updated;
    });
  };

  const changeDate = (idx: number, newVal: string) => {
    if (!newVal) return;
    const old = activeDates[idx];
    if (activeDates.includes(newVal) && old !== newVal) {
      alert("Date already in report.");
      return;
    }
    setActiveDates((prev) => {
      const next = [...prev];
      next[idx] = newVal;
      return next.sort();
    });
    setDateRows((prev) => {
      const next = { ...prev };
      next[newVal] = next[old] || [...ALL_DEPTS];
      delete next[old];
      return next;
    });
    setData((prev) => {
      const next = { ...prev };
      if (next[old]) {
        next[newVal] = next[old];
        delete next[old];
      }
      return next;
    });
    setDeptCardDates((prev) => {
      const updated: Record<string, string[]> = {};
      Object.keys(prev).forEach((dept) => {
        updated[dept] = prev[dept].map((d) => (d === old ? newVal : d)).sort();
      });
      return updated;
    });
  };

  const addLocationRowToDate = (dateKey: string) => {
    const current = dateRows[dateKey] || [];
    const next = ALL_DEPTS.find((d) => !current.includes(d)) || ALL_DEPTS[0];
    setDateRows((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), next],
    }));
  };

  const removeLocationRowFromDate = (dateKey: string, rowIdx: number) => {
    if ((dateRows[dateKey] || []).length <= 1) {
      alert("At least one row is required.");
      return;
    }
    setDateRows((prev) => {
      const updated = [...(prev[dateKey] || [])];
      updated.splice(rowIdx, 1);
      return { ...prev, [dateKey]: updated };
    });
  };

  const changeDateRowLocation = (
    dateKey: string,
    rowIdx: number,
    newDept: string
  ) => {
    if (!newDept) return;
    setDateRows((prev) => {
      const updated = [...(prev[dateKey] || [])];
      updated[rowIdx] = newDept;
      return { ...prev, [dateKey]: updated };
    });
  };

  // ── Location-wise actions ──
  const addDeptCard = () => {
    if (!newDeptInput) {
      alert("Please select a location first.");
      return;
    }
    if (activeDepts.includes(newDeptInput)) {
      alert("This location is already shown.");
      return;
    }
    setActiveDepts((prev) => [...prev, newDeptInput]);
    setDeptCardDates((prev) => ({
      ...prev,
      [newDeptInput]: [...activeDates],
    }));
    setNewDeptInput("");
  };

  const removeDeptCard = (dept: string) => {
    if (activeDepts.length <= 1) {
      alert("At least one location is required.");
      return;
    }
    setActiveDepts((prev) => prev.filter((d) => d !== dept));
  };

  const changeDeptCardLocation = (ci: number, newDept: string) => {
    if (!newDept) return;
    const oldDept = activeDepts[ci];
    setActiveDepts((prev) => {
      const next = [...prev];
      next[ci] = newDept;
      return next;
    });
    setDeptCardDates((prev) => {
      const next = { ...prev };
      next[newDept] = next[oldDept] || [...activeDates];
      delete next[oldDept];
      return next;
    });
  };

  const addDateRowToDeptCard = (dept: string) => {
    const current = deptCardDates[dept] || [];
    const next = activeDates.find((d) => !current.includes(d));
    const fallbackDate = activeDates[0] || new Date().toISOString().slice(0, 10);
    setDeptCardDates((prev) => ({
      ...prev,
      [dept]: [...(prev[dept] || []), next || fallbackDate].sort(),
    }));
  };

  const removeDateRowFromDeptCard = (dept: string, di: number) => {
    if ((deptCardDates[dept] || []).length <= 1) {
      alert("At least one date row is required.");
      return;
    }
    setDeptCardDates((prev) => {
      const updated = [...(prev[dept] || [])];
      updated.splice(di, 1);
      return { ...prev, [dept]: updated };
    });
  };

  const changeDeptCardDateVal = (
    dept: string,
    di: number,
    newDate: string
  ) => {
    if (!newDate) return;
    setDeptCardDates((prev) => {
      const updated = [...(prev[dept] || [])];
      updated[di] = newDate;
      return { ...prev, [dept]: updated };
    });
  };

  // ── Excel Export matching MasterReport.html ──
  const exportToExcel = () => {
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; font-family: Arial, sans-serif; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 11px; }
          .banner { background: #FFFF00; font-size: 14px; font-weight: bold; text-align: center; padding: 10px; }
          .date-header { background: #E8D8B8; font-weight: bold; font-size: 12px; }
          .dept-header { background: #B0CCE0; font-weight: bold; font-size: 12px; }
          .col-header { background: #F5F5F5; font-weight: bold; }
          .total-row { background: #EEF4FB; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <th colspan="4" class="banner">${reportTitle}</th>
          </tr>
        </table>
    `;

    // Date-wise section
    html += `<h3>Date-wise Summary</h3>`;
    activeDates.forEach((dateKey) => {
      const rows = dateRows[dateKey] || [];
      let sumOpd = 0;
      let sumIpd = 0;
      html += `
        <table>
          <tr><th colspan="4" class="date-header">${fmtDisplay(dateKey)}</th></tr>
          <tr class="col-header">
            <th>Location</th><th>OPD</th><th>IPD</th><th>Total</th>
          </tr>
      `;
      rows.forEach((dept) => {
        const opd = getVal(dateKey, dept, "opd");
        const ipd = getVal(dateKey, dept, "ipd");
        sumOpd += opd;
        sumIpd += ipd;
        html += `
          <tr>
            <td style="text-align:left;">${dept}</td>
            <td>${opd}</td>
            <td>${ipd}</td>
            <td><b>${opd + ipd}</b></td>
          </tr>
        `;
      });
      html += `
          <tr class="total-row">
            <td><b>Total</b></td>
            <td>${sumOpd}</td>
            <td>${sumIpd}</td>
            <td><b>${sumOpd + sumIpd}</b></td>
          </tr>
        </table>
      `;
    });

    // Location-wise section
    html += `<h3>Location-wise Summary</h3>`;
    activeDepts.forEach((dept) => {
      const dates = deptCardDates[dept] || activeDates;
      let sumOpd = 0;
      let sumIpd = 0;
      html += `
        <table>
          <tr><th colspan="4" class="dept-header">${dept}</th></tr>
          <tr class="col-header">
            <th>Date</th><th>OPD</th><th>IPD</th><th>Total</th>
          </tr>
      `;
      dates.forEach((dateKey) => {
        const opd = getVal(dateKey, dept, "opd");
        const ipd = getVal(dateKey, dept, "ipd");
        sumOpd += opd;
        sumIpd += ipd;
        html += `
          <tr>
            <td>${fmtDisplay(dateKey)}</td>
            <td>${opd}</td>
            <td>${ipd}</td>
            <td><b>${opd + ipd}</b></td>
          </tr>
        `;
      });
      html += `
          <tr class="total-row">
            <td><b>Total</b></td>
            <td>${sumOpd}</td>
            <td>${sumIpd}</td>
            <td><b>${sumOpd + sumIpd}</b></td>
          </tr>
        </table>
      `;
    });

    html += `</body></html>`;

    const blob = new Blob(["\ufeff", html], {
      type: "application/vnd.ms-excel",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Master_Report.xls";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  return (
    <div className="w-full space-y-4">
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          .master-top-bar,
          .master-date-bar,
          .master-dept-ctrl-bar,
          .master-remove-btn,
          .master-add-row-btn,
          .master-section-title {
            display: none !important;
          }
          body {
            padding: 0 !important;
            background: #fff !important;
            color: #000 !important;
          }
          .master-banner {
            margin-bottom: 16px !important;
            padding: 8px !important;
            font-size: 13px !important;
            border: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .master-grid-3 {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 10px !important;
            margin-bottom: 20px !important;
          }
          .master-table-card {
            border: 1px solid #999 !important;
            box-shadow: none !important;
          }
          .date-header {
            background: #e8d8b8 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .dept-header {
            background: #b0cce0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .master-num-input,
          .master-date-cell,
          .master-dept-select,
          .date-header input,
          .dept-header select {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            text-align: center !important;
            font-size: 9px !important;
            font-weight: bold !important;
            pointer-events: none !important;
          }
          .master-table-card table th,
          .master-table-card table td {
            text-align: center !important;
            padding: 4px 5px !important;
            border: 1px solid #aaa !important;
            font-size: 9px !important;
          }
          .master-table-card table tr.total-row td {
            background: #e8f0fb !important;
            font-weight: bold !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .master-action-col {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Full-Width Wrapper */}
      <div className="w-full space-y-4">
        {/* Top Control Bar (Full Width, Zero Wasted Space) */}
        <div className="master-top-bar flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap flex items-center gap-1.5">
              <Building2 className="size-4 text-blue-600 shrink-0" />
              Report Title:
            </label>
            <input
              type="text"
              className="flex-1 max-w-2xl rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              onClick={() => window.print()}
            >
              <Printer className="size-3.5 text-slate-500" />
              Print Report
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1d6f42] hover:bg-[#155534] text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              onClick={exportToExcel}
            >
              <FileSpreadsheet className="size-3.5" />
              ⬇ Export to Excel
            </button>
          </div>
        </div>

        {/* Polished Yellow Banner (Full Width) */}
        <div className="master-banner rounded-xl bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 border border-amber-400/80 p-3 sm:p-3.5 text-center text-amber-950 font-extrabold text-base sm:text-lg tracking-wide shadow-xs">
          {reportTitle}
        </div>

        {/* ── Date-wise Control Bar ── */}
        <div className="master-date-bar flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
              <Calendar className="size-3.5 text-blue-600" />
              Select Date:
            </label>
            <input
              type="date"
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
            />
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg bg-[#1a6aab] hover:bg-[#155090] text-white px-3 py-1 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              onClick={addDate}
            >
              <Plus className="size-3" />
              Add Date
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 flex-1">
            <span className="text-xs font-semibold text-slate-500">
              Active dates:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeDates.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/90 px-2.5 py-0.5 text-xs font-bold text-blue-900 shadow-2xs"
                >
                  {fmtDisplay(d)}
                  <button
                    type="button"
                    className="ml-1 text-rose-500 hover:text-rose-700 rounded-full size-3.5 flex items-center justify-center text-[10px] transition-colors"
                    onClick={() => removeDate(d)}
                    title="Remove date"
                  >
                    &#x2715;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Date-wise Summary ── */}
        <div className="space-y-2">
          <div className="master-section-title text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="size-4 text-blue-600" />
            Date-wise Summary
          </div>

          <div className="master-grid-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {activeDates.map((dateKey, di) => {
              const rows = dateRows[dateKey] || [];
              let grandOpd = 0;
              let grandIpd = 0;

              return (
                <div
                  key={dateKey}
                  className="master-table-card rounded-xl border border-slate-300/80 bg-white shadow-2xs overflow-hidden transition-all hover:shadow-sm"
                >
                  {/* Beige Date Header */}
                  <div className="date-header bg-[#e8d8b8] border-b border-[#dacab0] px-3 py-1.5 flex items-center justify-center">
                    <input
                      type="date"
                      className="rounded border border-[#c4b396] bg-white/80 px-2 py-0.5 text-xs font-bold text-[#443825] shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-700"
                      value={dateKey}
                      onChange={(e) => changeDate(di, e.target.value)}
                    />
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="px-2 py-1.5 text-left">Location</th>
                        <th className="px-2 py-1.5 text-center">OPD</th>
                        <th className="px-2 py-1.5 text-center">IPD</th>
                        <th className="px-2 py-1.5 text-center">Total</th>
                        <th className="master-action-col w-5 px-1" />
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {rows.map((dept, ri) => {
                        const opd = getVal(dateKey, dept, "opd");
                        const ipd = getVal(dateKey, dept, "ipd");
                        const total = opd + ipd;
                        grandOpd += opd;
                        grandIpd += ipd;

                        return (
                          <tr
                            key={ri}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-1">
                              <select
                                className="master-dept-select w-full rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-800 shadow-2xs cursor-pointer font-medium"
                                value={dept}
                                onChange={(e) =>
                                  changeDateRowLocation(
                                    dateKey,
                                    ri,
                                    e.target.value
                                  )
                                }
                              >
                                {ALL_DEPTS.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="p-1 text-center">
                              <input
                                type="number"
                                min="0"
                                className="master-num-input w-full max-w-[55px] rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white bg-transparent px-1 py-0.5 text-center text-xs tabular-nums text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={opd}
                                onChange={(e) =>
                                  setCellVal(
                                    dateKey,
                                    dept,
                                    "opd",
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                              />
                            </td>

                            <td className="p-1 text-center">
                              <input
                                type="number"
                                min="0"
                                className="master-num-input w-full max-w-[55px] rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white bg-transparent px-1 py-0.5 text-center text-xs tabular-nums text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={ipd}
                                onChange={(e) =>
                                  setCellVal(
                                    dateKey,
                                    dept,
                                    "ipd",
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                              />
                            </td>

                            <td
                              className={`p-1 text-center font-bold tabular-nums ${
                                total === 0 ? "text-rose-600" : "text-blue-900"
                              }`}
                            >
                              {total}
                            </td>

                            <td className="master-action-col p-1 text-center">
                              <button
                                type="button"
                                className="text-rose-500 hover:text-rose-700 p-0.5 rounded transition-colors text-xs font-bold"
                                onClick={() =>
                                  removeLocationRowFromDate(dateKey, ri)
                                }
                                title="Remove row"
                              >
                                &#x2715;
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    <tfoot>
                      <tr className="total-row bg-[#eef4fb] text-[#1a3a5c] font-bold border-t border-slate-200">
                        <td className="px-2 py-1 text-left">Total</td>
                        <td
                          className={`px-2 py-1 text-center tabular-nums ${
                            grandOpd === 0 ? "text-rose-600" : ""
                          }`}
                        >
                          {grandOpd}
                        </td>
                        <td
                          className={`px-2 py-1 text-center tabular-nums ${
                            grandIpd === 0 ? "text-rose-600" : ""
                          }`}
                        >
                          {grandIpd}
                        </td>
                        <td className="px-2 py-1 text-center tabular-nums font-extrabold text-[#1a3a5c]">
                          {grandOpd + grandIpd}
                        </td>
                        <td className="master-action-col" />
                      </tr>
                    </tfoot>
                  </table>

                  <button
                    type="button"
                    className="w-full py-1.5 bg-slate-50/70 hover:bg-blue-50/60 border-t border-dashed border-slate-200 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    onClick={() => addLocationRowToDate(dateKey)}
                  >
                    <Plus className="size-3" /> Add Location Row
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Location-wise Control Bar ── */}
        <div className="master-dept-ctrl-bar flex flex-wrap items-center gap-3 rounded-xl border border-blue-200/90 bg-[#edf4fb] p-3 sm:p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#1a3a5c] whitespace-nowrap flex items-center gap-1">
              <MapPin className="size-3.5 text-blue-600" />
              Select Location:
            </label>
            <select
              className="rounded-lg border border-[#8aabcc] bg-white px-2.5 py-1 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
              value={newDeptInput}
              onChange={(e) => setNewDeptInput(e.target.value)}
            >
              <option value="">-- Select --</option>
              {ALL_DEPTS.filter((d) => !activeDepts.includes(d)).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg bg-[#1a6aab] hover:bg-[#155090] text-white px-3 py-1 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              onClick={addDeptCard}
            >
              <Plus className="size-3" />
              Add Location
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-blue-200 pt-2 sm:pt-0 sm:pl-3 flex-1">
            <span className="text-xs font-semibold text-[#5a7a9a]">
              Active Location:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeDepts.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-white px-2.5 py-0.5 text-xs font-bold text-[#1a3a5c] shadow-2xs"
                >
                  {d}
                  <button
                    type="button"
                    className="ml-1 text-rose-500 hover:text-rose-700 rounded-full size-3.5 flex items-center justify-center text-[10px] transition-colors"
                    onClick={() => removeDeptCard(d)}
                    title="Remove location"
                  >
                    &#x2715;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Location-wise Summary ── */}
        <div className="space-y-2">
          <div className="master-section-title text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="size-4 text-blue-600" />
            Location-wise Summary
          </div>

          <div className="master-grid-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {activeDepts.map((dept, ci) => {
              const dates = deptCardDates[dept] || activeDates;
              let grandOpd = 0;
              let grandIpd = 0;

              return (
                <div
                  key={dept}
                  className="master-table-card rounded-xl border border-slate-300/80 bg-white shadow-2xs overflow-hidden transition-all hover:shadow-sm"
                >
                  {/* Blue Location Header */}
                  <div className="dept-header bg-[#b0cce0] border-b border-[#9ec0d8] px-3 py-1.5 flex items-center justify-center">
                    <select
                      className="rounded border border-[#8aabcc] bg-white/85 px-2 py-0.5 text-xs font-bold text-[#1a3a5c] shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-700"
                      value={dept}
                      onChange={(e) =>
                        changeDeptCardLocation(ci, e.target.value)
                      }
                    >
                      {ALL_DEPTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="px-2 py-1.5 text-left">Date</th>
                        <th className="px-2 py-1.5 text-center">OPD</th>
                        <th className="px-2 py-1.5 text-center">IPD</th>
                        <th className="px-2 py-1.5 text-center">Total</th>
                        <th className="master-action-col w-5 px-1" />
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {dates.map((dateKey, di) => {
                        const opd = getVal(dateKey, dept, "opd");
                        const ipd = getVal(dateKey, dept, "ipd");
                        const total = opd + ipd;
                        grandOpd += opd;
                        grandIpd += ipd;

                        return (
                          <tr
                            key={di}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-1">
                              <input
                                type="date"
                                className="master-date-cell rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white bg-transparent px-1 py-0.5 text-xs text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                                value={dateKey}
                                onChange={(e) =>
                                  changeDeptCardDateVal(
                                    dept,
                                    di,
                                    e.target.value
                                  )
                                }
                              />
                            </td>

                            <td className="p-1 text-center">
                              <input
                                type="number"
                                min="0"
                                className="master-num-input w-full max-w-[55px] rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white bg-transparent px-1 py-0.5 text-center text-xs tabular-nums text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={opd}
                                onChange={(e) =>
                                  setCellVal(
                                    dateKey,
                                    dept,
                                    "opd",
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                              />
                            </td>

                            <td className="p-1 text-center">
                              <input
                                type="number"
                                min="0"
                                className="master-num-input w-full max-w-[55px] rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white bg-transparent px-1 py-0.5 text-center text-xs tabular-nums text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={ipd}
                                onChange={(e) =>
                                  setCellVal(
                                    dateKey,
                                    dept,
                                    "ipd",
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                              />
                            </td>

                            <td
                              className={`p-1 text-center font-bold tabular-nums ${
                                total === 0 ? "text-rose-600" : "text-blue-900"
                              }`}
                            >
                              {total}
                            </td>

                            <td className="master-action-col p-1 text-center">
                              <button
                                type="button"
                                className="text-rose-500 hover:text-rose-700 p-0.5 rounded transition-colors text-xs font-bold"
                                onClick={() =>
                                  removeDateRowFromDeptCard(dept, di)
                                }
                                title="Remove row"
                              >
                                &#x2715;
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    <tfoot>
                      <tr className="total-row bg-[#eef4fb] text-[#1a3a5c] font-bold border-t border-slate-200">
                        <td className="px-2 py-1 text-left">Total</td>
                        <td
                          className={`px-2 py-1 text-center tabular-nums ${
                            grandOpd === 0 ? "text-rose-600" : ""
                          }`}
                        >
                          {grandOpd}
                        </td>
                        <td
                          className={`px-2 py-1 text-center tabular-nums ${
                            grandIpd === 0 ? "text-rose-600" : ""
                          }`}
                        >
                          {grandIpd}
                        </td>
                        <td className="px-2 py-1 text-center tabular-nums font-extrabold text-[#1a3a5c]">
                          {grandOpd + grandIpd}
                        </td>
                        <td className="master-action-col" />
                      </tr>
                    </tfoot>
                  </table>

                  <button
                    type="button"
                    className="w-full py-1.5 bg-slate-50/70 hover:bg-blue-50/60 border-t border-dashed border-slate-200 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    onClick={() => addDateRowToDeptCard(dept)}
                  >
                    <Plus className="size-3" /> Add Date Row
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
