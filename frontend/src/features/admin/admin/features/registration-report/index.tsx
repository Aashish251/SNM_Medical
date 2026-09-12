import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { EntityListPage } from "@admin/components/entity-list";
import { normalizeApiError } from "@shared/api/errors";
import { useGetRegistrationReportQuery } from "../../services/reportsApi";
import { registrationReportConfig } from "./config";
import type { RegistrationRecord } from "./data/records";

export function RegistrationReport() {
  const { data: response, isError, error } = useGetRegistrationReportQuery({ includeEmpty: true });

  useEffect(() => {
    if (isError && error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [error, isError]);

  const config = useMemo(() => {
    if (!response?.data) return registrationReportConfig;

    const reportData = response.data;
    const records: RegistrationRecord[] = [];

    if (Array.isArray(reportData.rows) && reportData.rows.length > 0) {
      reportData.rows.forEach((row, index) => {
        records.push({
          id: `REG-${String(row.departmentId || index + 1).padStart(3, "0")}`,
          patientName: `${row.department} Registration Summary`,
          registrationDate: reportData.dates?.join(", ") || new Date().toISOString().slice(0, 10),
          department: row.department ? row.department.toLowerCase().replace(/\s+/g, "-") : "general-medicine",
          status: row.total > 0 ? "approved" : "pending",
        });
      });
    }

    return {
      ...registrationReportConfig,
      data: records.length > 0 ? records : registrationReportConfig.data,
    };
  }, [response]);

  return <EntityListPage config={config} />;
}
