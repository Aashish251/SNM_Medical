import React, { useState, useMemo, useEffect } from "react";
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
    // also update deptCardDates
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
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 5px; text-align: center; font-size: 11px; }
          .banner { background: #FFFF00; font-size: 14px; font-weight: bold; text-align: center; }
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
    <div className="master-report-page w-full p-2 sm:p-4 bg-white text-slate-800">
      <style>{`
        .master-top-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .master-top-bar label {
          font-weight: bold;
          white-space: nowrap;
          font-size: 13px;
        }
        .master-top-bar input[type="text"] {
          border: 1px solid #aaa;
          padding: 4px 8px;
          font-size: 13px;
          width: 320px;
          border-radius: 2px;
        }
        .master-top-bar button {
          padding: 4px 14px;
          font-size: 13px;
          border: 1px solid #aaa;
          background: #f0f0f0;
          cursor: pointer;
          border-radius: 2px;
        }
        .master-top-bar button:hover {
          background: #ddd;
        }
        .master-banner {
          background: yellow;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          padding: 10px;
          margin-bottom: 14px;
          border: 1px solid #ccc;
          color: #000;
        }
        .master-date-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          padding: 8px 12px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          flex-wrap: wrap;
        }
        .master-date-bar label {
          font-weight: bold;
          white-space: nowrap;
          font-size: 13px;
        }
        .master-date-bar input[type="date"] {
          border: 1px solid #aaa;
          padding: 4px 6px;
          font-size: 13px;
          cursor: pointer;
        }
        .master-btn-add {
          padding: 4px 12px;
          font-size: 13px;
          background: #1a6aab;
          color: #fff;
          border: none;
          cursor: pointer;
          border-radius: 3px;
        }
        .master-btn-add:hover {
          background: #155090;
        }
        .master-dept-ctrl-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          padding: 8px 12px;
          background: #edf4fb;
          border: 1px solid #b0cce0;
          flex-wrap: wrap;
        }
        .master-dept-ctrl-bar label {
          font-weight: bold;
          white-space: nowrap;
          color: #1a3a5c;
          font-size: 13px;
        }
        .master-dept-ctrl-bar select {
          border: 1px solid #8aabcc;
          padding: 4px 6px;
          font-size: 13px;
          cursor: pointer;
          border-radius: 3px;
          background: #fff;
        }
        .master-tags-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }
        .master-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #e0eaf5;
          border: 1px solid #aac4e0;
          border-radius: 12px;
          padding: 2px 10px;
          font-size: 12px;
          font-weight: bold;
          color: #1a3a5c;
        }
        .master-tag .tag-x {
          cursor: pointer;
          color: #c0392b;
          font-weight: bold;
          font-size: 14px;
          line-height: 1;
          margin-left: 4px;
        }
        .master-tag .tag-x:hover {
          color: #7b0000;
        }
        .master-section-title {
          font-weight: bold;
          font-size: 13px;
          color: #333;
          margin-bottom: 6px;
          padding-left: 2px;
        }
        .master-grid-3 {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }
        @media (min-width: 768px) {
          .master-grid-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1100px) {
          .master-grid-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .master-table-card {
          border: 1px solid #ccc;
          background: #fff;
        }
        .master-table-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 10px;
          font-weight: bold;
          font-size: 13px;
        }
        .master-table-header.date-header {
          background: #e8d8b8;
        }
        .master-table-header.dept-header {
          background: #b0cce0;
          color: #1a3a5c;
        }
        .master-table-header input[type="date"] {
          border: 1px solid #8aabcc;
          border-radius: 3px;
          padding: 2px 5px;
          font-size: 12px;
          font-weight: bold;
          background: rgba(255,255,255,0.65);
          cursor: pointer;
          color: #1a3a5c;
        }
        .master-table-header select {
          border: 1px solid #8aabcc;
          border-radius: 3px;
          padding: 3px 8px;
          font-size: 12px;
          font-weight: bold;
          background: rgba(255,255,255,0.65);
          color: #1a3a5c;
          cursor: pointer;
        }
        .master-table-card table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .master-table-card table th,
        .master-table-card table td {
          border: 1px solid #ddd;
          padding: 3px 5px;
          text-align: center;
        }
        .master-table-card table th {
          background: #f5f5f5;
          font-weight: bold;
          font-size: 12px;
        }
        .master-table-card table td:first-child {
          text-align: left;
        }
        .master-table-card table tr.total-row td {
          font-weight: bold;
          background: #eef4fb;
          color: #1a3a5c;
        }
        .master-num-input {
          width: 58px;
          border: 1px solid transparent;
          border-radius: 3px;
          padding: 2px 4px;
          font-size: 12px;
          text-align: center;
          background: transparent;
          color: #333;
          transition: border-color 0.15s, background 0.15s;
        }
        .master-num-input:hover {
          border-color: #bbb;
          background: #fff;
        }
        .master-num-input:focus {
          border-color: #1a6aab;
          background: #fff;
          outline: none;
          box-shadow: 0 0 0 2px #c8dff5;
        }
        .master-date-cell {
          border: 1px solid transparent;
          border-radius: 3px;
          padding: 2px 4px;
          font-size: 12px;
          background: transparent;
          color: #333;
          cursor: pointer;
          width: 110px;
        }
        .master-date-cell:hover {
          border-color: #bbb;
          background: #fff;
        }
        .master-dept-select {
          width: 100%;
          border: 1px solid #bbb;
          border-radius: 3px;
          padding: 2px 4px;
          font-size: 12px;
          background: #fff;
          cursor: pointer;
          color: #333;
        }
        .master-total-cell {
          font-weight: bold;
          color: #1a3a5c;
        }
        .master-zero {
          color: red;
        }
        .master-remove-row-btn {
          background: none;
          border: none;
          color: #c0392b;
          font-size: 15px;
          cursor: pointer;
          padding: 0 3px;
          line-height: 1;
          font-weight: bold;
        }
        .master-remove-row-btn:hover {
          color: #7b0000;
        }
        .master-add-row-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
          padding: 5px;
          border: 1px dashed #aaa;
          background: #fafafa;
          cursor: pointer;
          font-size: 12px;
          color: #1a6aab;
          font-weight: bold;
        }
        .master-add-row-btn:hover {
          background: #eef4fb;
          border-color: #1a6aab;
        }
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          .master-top-bar,
          .master-date-bar,
          .master-dept-ctrl-bar,
          .master-remove-row-btn,
          .master-add-row-btn,
          .master-section-title {
            display: none !important;
          }
          body, .master-report-page {
            padding: 0 !important;
            font-size: 9px !important;
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
          }
          .master-table-header.date-header {
            background: #e8d8b8 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .master-table-header.dept-header {
            background: #b0cce0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .master-num-input,
          .master-date-cell,
          .master-dept-select,
          .master-table-header input,
          .master-table-header select {
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
          .master-table-card table th:last-child,
          .master-table-card table td:last-child {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Bar */}
      <div className="master-top-bar">
        <label>Report Title:</label>
        <input
          type="text"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
        />
        <button type="button" onClick={() => window.print()}>
          Print Report
        </button>
        <button
          type="button"
          onClick={exportToExcel}
          style={{
            background: "#1d6f42",
            color: "#fff",
            border: "1px solid #155534",
            padding: "4px 14px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          ⬇ Export to Excel
        </button>
      </div>

      {/* Yellow Banner */}
      <div className="master-banner">{reportTitle}</div>

      {/* Date-wise Control Bar */}
      <div className="master-date-bar">
        <label>Select Date:</label>
        <input
          type="date"
          value={newDateInput}
          onChange={(e) => setNewDateInput(e.target.value)}
        />
        <button type="button" className="master-btn-add" onClick={addDate}>
          + Add Date
        </button>
        <span style={{ color: "#888", fontSize: "12px" }}>Active dates:</span>
        <div className="master-tags-row">
          {activeDates.map((d) => (
            <span key={d} className="master-tag">
              {fmtDisplay(d)}
              <span className="tag-x" onClick={() => removeDate(d)}>
                &#x2715;
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Date-wise Summary */}
      <div className="master-section-title">Date-wise Summary</div>
      <div className="master-grid-3">
        {activeDates.map((dateKey, di) => {
          const rows = dateRows[dateKey] || [];
          let grandOpd = 0;
          let grandIpd = 0;

          return (
            <div key={dateKey} className="master-table-card">
              <div className="master-table-header date-header">
                <input
                  type="date"
                  value={dateKey}
                  onChange={(e) => changeDate(di, e.target.value)}
                />
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>OPD</th>
                    <th>IPD</th>
                    <th>Total</th>
                    <th style={{ width: "22px" }} />
                  </tr>
                </thead>

                <tbody>
                  {rows.map((dept, ri) => {
                    const opd = getVal(dateKey, dept, "opd");
                    const ipd = getVal(dateKey, dept, "ipd");
                    const total = opd + ipd;
                    grandOpd += opd;
                    grandIpd += ipd;

                    return (
                      <tr key={ri}>
                        <td style={{ padding: "2px 4px" }}>
                          <select
                            className="master-dept-select"
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

                        <td>
                          <input
                            type="number"
                            min="0"
                            className="master-num-input"
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

                        <td>
                          <input
                            type="number"
                            min="0"
                            className="master-num-input"
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
                          className={`master-total-cell ${
                            total === 0 ? "master-zero" : ""
                          }`}
                        >
                          {total}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="master-remove-row-btn"
                            onClick={() =>
                              removeLocationRowFromDate(dateKey, ri)
                            }
                          >
                            &#x2715;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr className="total-row">
                    <td>Total</td>
                    <td className={grandOpd === 0 ? "master-zero" : ""}>
                      {grandOpd}
                    </td>
                    <td className={grandIpd === 0 ? "master-zero" : ""}>
                      {grandIpd}
                    </td>
                    <td className="master-total-cell">{grandOpd + grandIpd}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>

              <button
                type="button"
                className="master-add-row-btn"
                onClick={() => addLocationRowToDate(dateKey)}
              >
                &#43; Add Location Row
              </button>
            </div>
          );
        })}
      </div>

      {/* Dept-wise Control Bar */}
      <div className="master-dept-ctrl-bar">
        <label>Select Location:</label>
        <select
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
        <button type="button" className="master-btn-add" onClick={addDeptCard}>
          + Add Location
        </button>
        <span style={{ color: "#5a7a9a", fontSize: "12px" }}>
          Active Location:
        </span>
        <div className="master-tags-row">
          {activeDepts.map((d) => (
            <span key={d} className="master-tag">
              {d}
              <span className="tag-x" onClick={() => removeDeptCard(d)}>
                &#x2715;
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Location-wise Summary */}
      <div className="master-section-title">Location-wise Summary</div>
      <div className="master-grid-3">
        {activeDepts.map((dept, ci) => {
          const dates = deptCardDates[dept] || activeDates;
          let grandOpd = 0;
          let grandIpd = 0;

          return (
            <div key={dept} className="master-table-card">
              <div className="master-table-header dept-header">
                <select
                  value={dept}
                  onChange={(e) => changeDeptCardLocation(ci, e.target.value)}
                >
                  {ALL_DEPTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>OPD</th>
                    <th>IPD</th>
                    <th>Total</th>
                    <th style={{ width: "22px" }} />
                  </tr>
                </thead>

                <tbody>
                  {dates.map((dateKey, di) => {
                    const opd = getVal(dateKey, dept, "opd");
                    const ipd = getVal(dateKey, dept, "ipd");
                    const total = opd + ipd;
                    grandOpd += opd;
                    grandIpd += ipd;

                    return (
                      <tr key={di}>
                        <td style={{ padding: "2px 3px" }}>
                          <input
                            type="date"
                            className="master-date-cell"
                            value={dateKey}
                            onChange={(e) =>
                              changeDeptCardDateVal(dept, di, e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            min="0"
                            className="master-num-input"
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

                        <td>
                          <input
                            type="number"
                            min="0"
                            className="master-num-input"
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
                          className={`master-total-cell ${
                            total === 0 ? "master-zero" : ""
                          }`}
                        >
                          {total}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="master-remove-row-btn"
                            onClick={() =>
                              removeDateRowFromDeptCard(dept, di)
                            }
                          >
                            &#x2715;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr className="total-row">
                    <td>Total</td>
                    <td className={grandOpd === 0 ? "master-zero" : ""}>
                      {grandOpd}
                    </td>
                    <td className={grandIpd === 0 ? "master-zero" : ""}>
                      {grandIpd}
                    </td>
                    <td className="master-total-cell">{grandOpd + grandIpd}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>

              <button
                type="button"
                className="master-add-row-btn"
                onClick={() => addDateRowToDeptCard(dept)}
              >
                &#43; Add Date Row
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
