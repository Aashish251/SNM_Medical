import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { EntityListPage } from "@admin/components/entity-list";
import { normalizeApiError } from "@shared/api/errors";
import { useGetDailyReportQuery } from "../../services/reportsApi";
import { dailyReportConfig } from "./config";
import type { DailyReportRecord } from "./data/records";

export function DailyReport() {
  const { data: response, isError, error } = useGetDailyReportQuery({ includeEmpty: true });

  useEffect(() => {
    if (isError && error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [error, isError]);

  const config = useMemo(() => {
    if (!response?.data) return dailyReportConfig;

    const reportData = response.data;
    const records: DailyReportRecord[] = [];

    if (Array.isArray(reportData.rows) && reportData.rows.length > 0) {
      reportData.rows.forEach((row, index) => {
        records.push({
          id: `DR${String(index + 1).padStart(3, "0")}`,
          reportName: `${row.department} Daily Operational Report`,
          date: reportData.date || new Date().toISOString().slice(0, 10),
          totalPatients: row.total || 0,
          type: row.department ? row.department.toLowerCase().replace(/\s+/g, "-") : "opd",
          status: row.total > 0 ? "completed" : "draft",
        });
      });
    }

    return {
      ...dailyReportConfig,
      data: records.length > 0 ? records : dailyReportConfig.data,
    };
  }, [response]);

  return <EntityListPage config={config} />;
}
