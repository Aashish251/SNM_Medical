import React, { useState, useMemo, useEffect } from "react";
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
        const name = r.location || r.department || DEFAULT_DEPARTMENTS[i % DEFAULT_DEPARTMENTS.length];
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
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; text-align: center; }
          th { font-weight: bold; background: #f2f2f2; }
          h2 { text-align: center; }
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
    <div className="registration-report-wrapper w-full p-4 sm:p-6 bg-white min-h-screen text-slate-900 font-sans">
      <style>{`
        .reg-report-container {
          max-width: 900px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        .reg-report-container h2 {
          text-align: center;
          font-weight: bold;
          font-size: 22px;
          margin-bottom: 20px;
        }
        .reg-title-input {
          width: 450px;
          max-width: 100%;
          padding: 6px 10px;
          border: 1px solid #aaa;
          border-radius: 2px;
          font-size: 14px;
        }
        .reg-btn {
          padding: 8px 14px;
          margin: 5px 6px 5px 0;
          border: 1px solid #aaa;
          background: #f0f0f0;
          cursor: pointer;
          font-size: 13px;
          border-radius: 3px;
          font-weight: 500;
        }
        .reg-btn:hover {
          background: #e0e0e0;
        }
        .reg-delete-btn {
          background: red;
          color: white;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 3px;
          font-size: 13px;
          font-weight: 500;
        }
        .reg-delete-btn:hover {
          background: #cc0000;
        }
        .reg-table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
          font-size: 13px;
        }
        .reg-table th, .reg-table td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }
        .reg-table th {
          background: #f2f2f2;
          font-weight: bold;
        }
        .reg-table input[type="date"],
        .reg-table select,
        .reg-table input[type="number"] {
          padding: 4px;
          font-size: 13px;
          text-align: center;
          border: 1px solid #ccc;
          border-radius: 2px;
          width: 100%;
          box-sizing: border-box;
          background: #fff;
        }
        @media print {
          .reg-print-hide {
            display: none !important;
          }
          body, .registration-report-wrapper {
            padding: 0 !important;
            margin: 0 !important;
          }
          .reg-table th, .reg-table td {
            border: 1px solid #000 !important;
          }
          .reg-table input,
          .reg-table select {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            text-align: center !important;
          }
        }
      `}</style>

      <div className="reg-report-container">
        {/* Centered Heading */}
        <h2>Registration Report</h2>

        {/* Title Input */}
        <div className="mb-4 flex flex-wrap items-center gap-2 reg-print-hide">
          <label className="font-bold text-sm">Title:</label>
          <input
            type="text"
            className="reg-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="mb-4 reg-print-hide">
          <button type="button" className="reg-btn" onClick={addRow}>
            Add Row
          </button>
          <button type="button" className="reg-btn" onClick={printReport}>
            Print
          </button>
          <button type="button" className="reg-btn" onClick={exportExcel}>
            Export Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="reg-table">
            <thead>
              <tr>
                <th className="min-w-40">Department</th>
                <th className="min-w-36">
                  <input
                    type="date"
                    value={d1}
                    onChange={(e) => setD1(e.target.value)}
                  />
                </th>
                <th className="min-w-36">
                  <input
                    type="date"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                  />
                </th>
                <th className="min-w-36">
                  <input
                    type="date"
                    value={d3}
                    onChange={(e) => setD3(e.target.value)}
                  />
                </th>
                <th className="w-24 reg-print-hide">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <select
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
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.v1}
                      onChange={(e) =>
                        updateVal(row.id, "v1", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.v2}
                      onChange={(e) =>
                        updateVal(row.id, "v2", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.v3}
                      onChange={(e) =>
                        updateVal(row.id, "v3", e.target.value)
                      }
                    />
                  </td>
                  <td className="reg-print-hide">
                    <button
                      type="button"
                      className="reg-delete-btn"
                      onClick={() => deleteRow(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr style={{ background: "#f2f2f2", fontWeight: "bold" }}>
                <td>
                  <b>Total</b>
                </td>
                <td>{t1}</td>
                <td>{t2}</td>
                <td>{t3}</td>
                <td className="reg-print-hide" />
              </tr>
              <tr>
                <td colSpan={5} className="text-left font-bold py-2.5">
                  <b>Grand Total: {grandTotal}</b>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
