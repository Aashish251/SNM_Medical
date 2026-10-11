import type { Table } from "@tanstack/react-table";
import { Printer, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@admin/components/ui/button";
import {
  escapeReportHtml,
  exportHtmlToExcel,
  printReportHtml,
} from "@admin/features/reports-common/reportExportUtils";
import type { DutyChartEntry } from "../services/dutyChartApi";

interface DutyChartExportActionsProps {
  table: Table<DutyChartEntry>;
  entries: DutyChartEntry[];
}

export function DutyChartExportActions({
  table,
  entries,
}: DutyChartExportActionsProps) {
  const getSelectedOrAllItems = (): DutyChartEntry[] => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      return selectedRows.map((r) => r.original);
    }
    const filteredRows = table.getFilteredRowModel().rows;
    if (filteredRows.length > 0) {
      return filteredRows.map((r) => r.original);
    }
    return entries;
  };

  const handlePrint = () => {
    const items = getSelectedOrAllItems();
    if (!items.length) {
      toast.error("No duties available to print");
      return;
    }

    const tableRows = items
      .map(
        (item, index) => `
      <tr>
        <td style="text-align: center;">${index + 1}</td>
        <td>${escapeReportHtml(item.name || "—")}</td>
        <td>${escapeReportHtml(item.department || "—")}</td>
        <td style="text-align: center;">${escapeReportHtml(item.date || "—")}</td>
        <td>${escapeReportHtml(item.shift || "—")}</td>
        <td style="text-align: center;">${escapeReportHtml(item.contact || "—")}</td>
        <td style="text-align: center; text-transform: capitalize;">${escapeReportHtml(item.status || "assigned")}</td>
      </tr>`
      )
      .join("");

    const content = `
      <div style="margin-bottom: 14px; font-size: 13px; color: #555; display: flex; justify-content: space-between;">
        <span>Generated on: ${new Date().toLocaleString()}</span>
        <span>Total Duty Records: ${items.length}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 50px; text-align: center;">Sr. No.</th>
            <th style="text-align: left;">Staff Name</th>
            <th style="text-align: left;">Department</th>
            <th style="text-align: center;">Date</th>
            <th style="text-align: left;">Shift</th>
            <th style="text-align: center;">Contact Number</th>
            <th style="text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    printReportHtml("DUTY CHART LIST", content);
  };

  const handleExportExcel = () => {
    const items = getSelectedOrAllItems();
    if (!items.length) {
      toast.error("No duties available to export");
      return;
    }

    const tableRows = items
      .map(
        (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeReportHtml(item.name || "")}</td>
        <td>${escapeReportHtml(item.department || "")}</td>
        <td>${escapeReportHtml(item.date || "")}</td>
        <td>${escapeReportHtml(item.shift || "")}</td>
        <td>${escapeReportHtml(item.contact || "")}</td>
        <td>${escapeReportHtml(item.status || "assigned")}</td>
      </tr>`
      )
      .join("");

    const content = `
      <table>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Staff Name</th>
            <th>Department</th>
            <th>Date</th>
            <th>Shift</th>
            <th>Contact Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    const dateStr = new Date().toISOString().slice(0, 10);
    exportHtmlToExcel(`Duty_Chart_${dateStr}.xls`, "DUTY CHART LIST", content);
    toast.success("Duty chart exported to Excel successfully");
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="h-8 gap-1.5 text-xs font-medium"
        title="Print duty chart list"
      >
        <Printer className="h-3.5 w-3.5" />
        <span>Print</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className="h-8 gap-1.5 text-xs font-medium"
        title="Export duty chart list to Excel"
      >
        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Export to Excel</span>
      </Button>
    </div>
  );
}
