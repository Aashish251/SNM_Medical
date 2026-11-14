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
import { useGetMasterRecordsQuery } from "../master/services/masterDataApi";
import { TableSearchableSelect } from "../reports-common/TableSearchableSelect";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Button } from "@admin/components/ui/button";

interface RegRow {
  id: string;
  department: string; // holds the Sewa Location name
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
  const { data: masterLocations } = useGetMasterRecordsQuery({
    module: "sewalocation",
    search: "",
  });
  const { data: metaResponse } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];

  // Dynamic Sewa Locations loaded directly from the database table
  const sewaLocations = useMemo(() => {
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
    return list;
  }, [masterLocations, metaResponse]);

  const [title, setTitle] = useState("60 Maharashtra Nirankari Sant Samagam");
  const [d1, setD1] = useState(availableDates[0]?.date || "2025-01-24");
  const [d2, setD2] = useState(availableDates[1]?.date || "2025-01-25");
  const [d3, setD3] = useState(availableDates[2]?.date || "2025-01-26");

  const [rows, setRows] = useState<RegRow[]>([
    { id: "row-1", department: "", v1: 0, v2: 0, v3: 0 },
  ]);

  // Sync initial row with loaded sewaLocations if empty
  useEffect(() => {
    if (sewaLocations.length > 0) {
      setRows((prev) => {
        if (prev.length === 1 && !prev[0].department) {
          return [{ ...prev[0], department: sewaLocations[0] }];
        }
        return prev;
      });
    }
  }, [sewaLocations]);

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
          sewaLocations[i % (sewaLocations.length || 1)] ||
          `Location ${i + 1}`;
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
  }, [reportResponse, d1, d2, d3, sewaLocations]);

  // Add row
  const addRow = () => {
    const newRow: RegRow = {
      id: `row-${Date.now()}-${Math.random()}`,
      department: sewaLocations[0] || "",
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

  // Update department / location
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
      <h2 style="text-align:center; font-weight:bold; font-family:Arial, sans-serif; font-size:18px;">${title}</h2>
      <table border="1" style="border-collapse:collapse; width:100%; font-family:Arial, sans-serif; text-align:center; margin-top:15px;">
        <tr style="background:#f2f2f2; font-weight:bold;">
          <th style="padding:8px; border:1px solid #000; text-align:left;">Sewa Location</th>
          <th style="padding:8px; border:1px solid #000;">${date1Formatted}</th>
          <th style="padding:8px; border:1px solid #000;">${date2Formatted}</th>
          <th style="padding:8px; border:1px solid #000;">${date3Formatted}</th>
        </tr>
    `;

    rows.forEach((r) => {
      html += `
        <tr>
          <td style="padding:8px; border:1px solid #000; text-align:left;">${r.department}</td>
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
          <td colspan="4" style="padding:8px; border:1px solid #000; font-weight:bold; text-align:left;">Grand Total: ${grandTotal}</td>
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
          th { background: #f2f2f2; font-weight: bold; }
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
            <h2 className="text-2xl font-bold tracking-tight">Patient Registration Report</h2>
            <p className="text-muted-foreground">
              Sewa location–wise patient registration data with date-wise columns.
            </p>
          </div>
        </div>

      <style>{`
        @media print {
          .reg-print-hide {
            display: none !important;
          }
          body {
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
          }
          .reg-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .reg-table th, .reg-table td {
            border: 1px solid #000 !important;
            padding: 6px !important;
            font-size: 11px !important;
          }
          .reg-table input,
          .reg-table select,
          .table-searchable-trigger {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            text-align: left !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
          .table-searchable-trigger svg {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Controls Bar: Title & Buttons */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/50 p-3 sm:p-4 rounded-lg border border-border reg-print-hide">
          {/* Title Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
              <Building2 className="size-4 text-primary shrink-0" />
              Title:
            </label>
            <input
              type="text"
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Report Title"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={printReport}
            >
              <Printer className="size-3.5" />
              Print
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={exportExcel}
            >
              <FileSpreadsheet className="size-3.5" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Full-Width Responsive Table */}
        <div className="w-full overflow-x-auto rounded-lg border border-border shadow-sm">
          <table className="reg-table w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-muted text-foreground border-b border-border">
                <th className="border border-slate-300 px-3 py-2.5 text-left font-bold w-[28%] min-w-[170px]">
                  Sewa Location
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center font-bold w-[20%] min-w-[130px]">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="size-3.5 text-blue-600 shrink-0" />
                    <input
                      type="date"
                      className="w-full max-w-[130px] rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-center"
                      value={d1}
                      onChange={(e) => setD1(e.target.value)}
                    />
                  </div>
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center font-bold w-[20%] min-w-[130px]">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="size-3.5 text-blue-600 shrink-0" />
                    <input
                      type="date"
                      className="w-full max-w-[130px] rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-center"
                      value={d2}
                      onChange={(e) => setD2(e.target.value)}
                    />
                  </div>
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center font-bold w-[20%] min-w-[130px]">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="size-3.5 text-blue-600 shrink-0" />
                    <input
                      type="date"
                      className="w-full max-w-[130px] rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-center"
                      value={d3}
                      onChange={(e) => setD3(e.target.value)}
                    />
                  </div>
                </th>
                <th className="reg-print-hide border border-slate-300 px-3 py-2.5 text-center font-bold w-[12%] min-w-[90px]">
                  Actions
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
                    <TableSearchableSelect
                      value={row.department}
                      options={sewaLocations}
                      onChange={(val) => updateDepartment(row.id, val)}
                      placeholder="Select Sewa Location"
                      searchPlaceholder="Search sewa location..."
                    />
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
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-primary/10 hover:bg-primary/20 text-primary p-1.5 transition-all active:scale-95 cursor-pointer"
                        onClick={addRow}
                        title="Add new row"
                      >
                        <Plus className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive p-1.5 transition-all active:scale-95 cursor-pointer"
                        onClick={() => deleteRow(row.id)}
                        title="Delete this row"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              {/* Totals Row */}
              <tr className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-400">
                <td className="border border-slate-300 px-3 py-2 text-left font-bold">
                  Total
                </td>
                <td className="border border-slate-300 px-2 py-2 text-center tabular-nums font-extrabold">
                  {t1.toLocaleString()}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-center tabular-nums font-extrabold">
                  {t2.toLocaleString()}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-center tabular-nums font-extrabold">
                  {t3.toLocaleString()}
                </td>
                <td className="reg-print-hide border border-slate-300" />
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-blue-50/80 border-t border-blue-200">
                <td
                  colSpan={5}
                  className="border border-slate-300 text-left font-bold px-4 py-2.5 text-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-600 font-bold">
                      Grand Total
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-blue-700 tabular-nums">
                      {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Main>
    </>
  );
}
