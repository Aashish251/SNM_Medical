import { useMemo } from "react";
import { toast } from "sonner";
import {
  createCamp,
  deleteCamp,
  toggleCampPublish,
  updateCamp,
  useAdminCamps,
  type CampAdminRecord,
  type CampFormValues,
  type CampType,
} from "@entities/camp";
import { EntityListPage } from "@admin-panel/components/entity-list";
import { createCampConfig } from "./create-camp-config";

type CampListPageProps = {
  campType: CampType;
};

function toFormValues(values: Record<string, string>): CampFormValues {
  return {
    title: values.title,
    shortDescription: values.shortDescription,
    organizerName: values.organizerName,
    fullAddress: values.fullAddress,
    landmark: values.landmark,
    driveDate: values.driveDate,
    startTime: values.startTime,
    endTime: values.endTime,
    phone: values.phone,
    email: values.email,
    entryType: values.entryType as CampFormValues["entryType"],
    status: values.status as CampFormValues["status"],
  };
}

export function CampListPage({ campType }: CampListPageProps) {
  const records = useAdminCamps(campType);

  const config = useMemo(
    () =>
      createCampConfig({
        campType,
        records,
        onCreate: (values) => {
          createCamp(campType, toFormValues(values));
          toast.success("Camp created successfully.");
        },
        onUpdate: (row, values) => {
          updateCamp(row.id, toFormValues(values));
          toast.success("Camp updated successfully.");
        },
        onDelete: (row) => {
          deleteCamp(row.id);
          toast.success("Camp deleted successfully.");
        },
        onPublishToggle: (row: CampAdminRecord) => {
          const updated = toggleCampPublish(row.id);
          if (!updated) return;
          toast.success(
            updated.status === "published"
              ? "Camp published successfully."
              : "Camp unpublished successfully."
          );
        },
      }),
    [campType, records]
  );

  return <EntityListPage config={config} />;
}
