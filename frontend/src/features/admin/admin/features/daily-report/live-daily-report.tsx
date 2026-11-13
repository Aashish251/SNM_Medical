import React, { useState, useMemo, useEffect } from "react";
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

  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

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
    <div className="daily-report-wrapper w-full p-2 sm:p-5 bg-[#f4f4f4] min-h-screen text-slate-800">
      <style>{`
        .daily-report-container {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }
        .daily-report-container h2 {
          text-align: center;
          margin: 5px;
          font-weight: bold;
          font-size: 18px;
        }
        .daily-top-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .daily-input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .daily-input-group input {
          padding: 8px;
          font-size: 14px;
          min-width: 250px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
        }
        .daily-button-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .daily-btn {
          padding: 8px 14px;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .daily-btn:hover {
          opacity: 0.9;
        }
        .daily-print-btn {
          background: #0066cc;
        }
        .daily-excel-btn {
          background: #28a745;
        }
        .daily-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          font-size: 13px;
        }
        .daily-table th, .daily-table td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }
        .daily-table th {
          background: #d9d9d9;
          font-weight: bold;
        }
        .daily-table select,
        .daily-table input[type="number"] {
          width: 100%;
          padding: 5px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 3px;
          text-align: center;
          background: #fff;
        }
        .daily-table select:focus,
        .daily-table input[type="number"]:focus {
          outline: 1px solid #0066cc;
          border-color: #0066cc;
        }
        .daily-table input[type="number"]:disabled {
          background: #f9f9f9;
          cursor: not-allowed;
          color: #888;
        }
        .daily-total-row {
          background: #efefef;
          font-weight: bold;
        }
        .daily-action-col {
          white-space: nowrap;
        }
        .daily-add-btn {
          background: #0275d8;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          margin-right: 5px;
        }
        .daily-remove-btn {
          background: #d9534f;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        @media print {
          @page {
            size: landscape;
            margin: 10mm;
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
          }
          .daily-table thead th {
            font-size: 13px !important;
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
          }
          .daily-table input::-webkit-outer-spin-button,
          .daily-table input::-webkit-inner-spin-button {
            display: none;
          }
        }
      `}</style>

      <div className="daily-report-container max-w-6xl mx-auto">
        {/* Top Control Section */}
        <div className="daily-top-section">
          <div className="daily-input-group">
            <label>
              <strong>Samagam Name</strong>
            </label>
            <input
              type="text"
              value={samagamName}
              onChange={(e) => setSamagamName(e.target.value)}
              placeholder="Enter Samagam Name"
            />
          </div>

          <div className="daily-input-group">
            <label>
              <strong>Report Date</strong>
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
            />
          </div>

          <div className="daily-button-group">
            <button
              type="button"
              className="daily-btn daily-print-btn"
              onClick={preparePrint}
            >
              Print Report
            </button>
            <button
              type="button"
              className="daily-btn daily-excel-btn"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Dynamic Titles */}
        <h2>{samagamName}</h2>
        <h2>{dateTitle}</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="daily-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Dispensary-1</th>
                <th>Dispensary-2</th>
                <th>Dispensary-3</th>
                <th>Langar-1</th>
                <th>Langar-2</th>
                <th>Langar-3</th>
                <th className="daily-action-col">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => {
                const isDeptSelected = Boolean(row.department);
                return (
                  <tr key={row.id}>
                    <td>
                      <select
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
                      <td key={valIdx}>
                        <input
                          type="number"
                          min="0"
                          disabled={!isDeptSelected}
                          value={row.values[valIdx] === 0 ? "" : row.values[valIdx]}
                          placeholder={isDeptSelected ? "0" : ""}
                          onChange={(e) =>
                            handleValueChange(row.id, valIdx, e.target.value)
                          }
                        />
                      </td>
                    ))}

                    <td className="daily-action-col">
                      <button
                        type="button"
                        className="daily-add-btn"
                        onClick={() => addRow(idx)}
                      >
                        Add New
                      </button>
                      <button
                        type="button"
                        className="daily-remove-btn"
                        onClick={() => removeRow(row.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="daily-total-row">
                <td>TOTAL</td>
                {totals.map((t, i) => (
                  <td key={i}>{t}</td>
                ))}
                <td className="daily-action-col">
                  {rows.length === 0 && (
                    <button
                      type="button"
                      className="daily-add-btn"
                      onClick={() => addRow()}
                    >
                      Add New
                    </button>
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
