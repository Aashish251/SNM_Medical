import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { EntityListPage } from "@admin/components/entity-list";
import { normalizeApiError } from "@shared/api/errors";
import { useGetMasterReportQuery } from "../../services/reportsApi";
import { masterReportConfig } from "./config";
import type { MasterReportRecord } from "./data/records";

export function MasterReport() {
  const { data: response, isError, error } = useGetMasterReportQuery({ includeEmpty: true });

  useEffect(() => {
    if (isError && error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [error, isError]);

  const config = useMemo(() => {
    if (!response?.data) return masterReportConfig;

    const reportData = response.data;
    const records: MasterReportRecord[] = [];

    if (Array.isArray(reportData.dateWise) && reportData.dateWise.length > 0) {
      reportData.dateWise.forEach((item, index) => {
        records.push({
          id: `MR${String(index + 1).padStart(3, "0")}`,
          reportName: `Dispensary Master Report (${item.label})`,
          createdBy: "Admin",
          createdDate: item.date,
          type: "summary",
          status: item.totals?.total > 0 ? "generated" : "pending",
        });
      });
    } else if (Array.isArray(reportData.locationWise) && reportData.locationWise.length > 0) {
      reportData.locationWise.forEach((item, index) => {
        records.push({
          id: `MR${String(index + 1).padStart(3, "0")}`,
          reportName: `${item.location} Master Report`,
          createdBy: "Admin",
          createdDate: reportData.dates?.[0] || new Date().toISOString().slice(0, 10),
          type: "operational",
          status: item.totals?.total > 0 ? "generated" : "pending",
        });
      });
    }

    return {
      ...masterReportConfig,
      data: records.length > 0 ? records : masterReportConfig.data,
    };
  }, [response]);

  return <EntityListPage config={config} />;
}
