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

function fmtDisplay(k: string) {
  if (!k) return "";
  const parts = k.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${+d}/${+m}/${y}`;
  }
  return k;
}

const LS_KEY_MASTER = "report_master";

interface StoredMaster {
  createdAt: number;
  data: {
    reportTitle: string;
    data: Record<string, Record<string, { opd: number; ipd: number }>>;
    activeDates: string[];
    dateRows: Record<string, string[]>;
    activeDepts: string[];
    deptCardDates: Record<string, string[]>;
  };
}

const getStoredMaster = (): StoredMaster | null => {
  try {
    const raw = localStorage.getItem(LS_KEY_MASTER);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.createdAt || !parsed?.data) {
      localStorage.removeItem(LS_KEY_MASTER);
      return null;
    }
    // Auto-delete if older than 24 hours
    if (Date.now() - parsed.createdAt >= 24 * 60 * 60 * 1000) {
      localStorage.removeItem(LS_KEY_MASTER);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(LS_KEY_MASTER);
    return null;
  }
};

export function LiveMasterReport() {
  const { data: masterLocations } = useGetMasterRecordsQuery({
    module: "sewalocation",
    search: "",
  });
  const { data: metaResponse } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];

  // Dynamic Locations loaded directly from the database table
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

  // Restore persisted inputs from localStorage on load
  const storedMaster = useMemo(() => getStoredMaster(), []);

  const [reportTitle, setReportTitle] = useState(
    () => storedMaster?.data?.reportTitle || "58th Maharashtra Samagam Dispensary Master Report"
  );

  // Single source of truth for (dateKey, location) -> { opd, ipd }
  const [data, setData] = useState<
    Record<string, Record<string, { opd: number; ipd: number }>>
  >(() => storedMaster?.data?.data || {});

  // Active dates
  const [activeDates, setActiveDates] = useState<string[]>(
    () => (storedMaster?.data?.activeDates && storedMaster.data.activeDates.length > 0)
      ? storedMaster.data.activeDates
      : ["2025-01-24", "2025-01-25", "2025-01-26"]
  );

  // dateRows[dateKey] = [ dept1, dept2, ... ]
  const [dateRows, setDateRows] = useState<Record<string, string[]>>(
    () => storedMaster?.data?.dateRows || {}
  );

  // Active locations shown in location-wise section
  const [activeDepts, setActiveDepts] = useState<string[]>(
    () => storedMaster?.data?.activeDepts || []
  );

  // deptCardDates[dept] = [ date1, date2, ... ]
  const [deptCardDates, setDeptCardDates] = useState<Record<string, string[]>>(
    () => storedMaster?.data?.deptCardDates || {}
  );

  // Auto-save to localStorage on every change (inputs only, not totals)
  useEffect(() => {
    try {
      const existingRaw = localStorage.getItem(LS_KEY_MASTER);
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
        LS_KEY_MASTER,
        JSON.stringify({
          createdAt,
          data: { reportTitle, data, activeDates, dateRows, activeDepts, deptCardDates },
        })
      );
    } catch (e) {
      console.error("Failed to save master report to localStorage", e);
    }
  }, [reportTitle, data, activeDates, dateRows, activeDepts, deptCardDates]);

  // Auto-delete saved data after 24 hours (checked once a minute)
  useEffect(() => {
    const checkExpiry = () => {
      const raw = localStorage.getItem(LS_KEY_MASTER);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.createdAt && Date.now() - parsed.createdAt >= 24 * 60 * 60 * 1000) {
            localStorage.removeItem(LS_KEY_MASTER);
          }
        } catch {
          localStorage.removeItem(LS_KEY_MASTER);
        }
      }
    };
    const timer = setInterval(checkExpiry, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync with dynamic database locations once loaded
  useEffect(() => {
    if (sewaLocations.length > 0) {
      setActiveDepts((prev) => (prev.length === 0 ? sewaLocations : prev));
      setDateRows((prev) => {
        const next = { ...prev };
        activeDates.forEach((dk) => {
          if (!next[dk] || next[dk].length === 0) {
            next[dk] = [...sewaLocations];
          }
        });
        return next;
      });
      setDeptCardDates((prev) => {
        const next = { ...prev };
        sewaLocations.forEach((loc) => {
          if (!next[loc]) {
            next[loc] = [...activeDates];
          }
        });
        return next;
      });
    }
  }, [sewaLocations, activeDates]);

  const [newDateInput, setNewDateInput] = useState("");
  const [newDeptInput, setNewDeptInput] = useState("");

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
      [newDateInput]: prev[newDateInput] || [...sewaLocations],
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
      next[newVal] = next[old] || [...sewaLocations];
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
    const next =
      sewaLocations.find((d) => !current.includes(d)) ||
      sewaLocations[0] ||
      "Location";
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
            <h2 className="text-2xl font-bold tracking-tight">Patient Master Report</h2>
            <p className="text-muted-foreground">
              Consolidated OPD and IPD footfall across dispensary centres and samagam dates.
            </p>
          </div>
        </div>

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
        {/* Top Control Bar */}
        <div className="master-top-bar flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5 sm:p-4 shadow-sm">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
              <Building2 className="size-4 text-primary shrink-0" />
              Report Title:
            </label>
            <input
              type="text"
              className="flex-1 max-w-2xl rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => window.print()}
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

        {/* Polished Banner (Full Width) */}
        <div className="master-banner rounded-lg bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 border border-amber-400/80 p-3 sm:p-3.5 text-center text-amber-950 font-bold text-base sm:text-lg tracking-wide shadow-sm">
          {reportTitle}
        </div>

        {/* ── Date-wise Control Bar ── */}
        <div className="master-date-bar flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/50 p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Calendar className="size-3.5 text-primary" />
              Select Date:
            </label>
            <input
              type="date"
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
            />
            <Button
              type="button"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={addDate}
            >
              <Plus className="size-3" />
              Add Date
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-border pt-2 sm:pt-0 sm:pl-3 flex-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Active dates:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeDates.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm"
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
          <div className="master-section-title text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Calendar className="size-4 text-primary" />
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
                              <TableSearchableSelect
                                value={dept}
                                options={sewaLocations}
                                onChange={(val) =>
                                  changeDateRowLocation(dateKey, ri, val)
                                }
                                placeholder="Select Location"
                                searchPlaceholder="Search location..."
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
        <div className="master-dept-ctrl-bar flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/50 p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" />
              Select Location:
            </label>
            <select
              className="rounded-lg border border-[#8aabcc] bg-white px-2.5 py-1 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
              value={newDeptInput}
              onChange={(e) => setNewDeptInput(e.target.value)}
            >
              <option value="">-- Select --</option>
              {sewaLocations.filter((d) => !activeDepts.includes(d)).map((d) => (
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

          <div className="flex flex-wrap items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-border pt-2 sm:pt-0 sm:pl-3 flex-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Active Location:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeDepts.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm"
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
          <div className="master-section-title text-sm font-semibold text-foreground flex items-center gap-1.5">
            <MapPin className="size-4 text-primary" />
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
                    <TableSearchableSelect
                      value={dept}
                      options={sewaLocations}
                      onChange={(val) => changeDeptCardLocation(ci, val)}
                      placeholder="Select Location"
                      searchPlaceholder="Search location..."
                      className="bg-white/85 border-[#8aabcc] text-[#1a3a5c] font-bold"
                    />
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
      </Main>
    </>
  );
}
