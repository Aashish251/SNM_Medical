import { useEntityList } from "./entity-list-provider";
import { EntityDeleteDialog } from "./entity-delete-dialog";
import { EntityFormDialog } from "./entity-form-dialog";
import { EntityViewDialog } from "./entity-view-dialog";
import type { EntityListModuleConfig } from "./types";

type EntityListDialogsProps<T extends { id: string }> = {
  config: EntityListModuleConfig<T>;
};

export function EntityListDialogs<T extends { id: string }>({
  config,
}: EntityListDialogsProps<T>) {
  const { open, setOpen, currentRow } = useEntityList<T>();

  const viewLabels = config.formFields.reduce<Partial<Record<keyof T, string>>>(
    (acc, field) => {
      acc[field.name as keyof T] = field.label;
      return acc;
    },
    { id: "ID" } as Partial<Record<keyof T, string>>
  );

  return (
    <>
      <EntityFormDialog
        open={open === "add"}
        onOpenChange={(state) => setOpen(state ? "add" : null)}
        title={`Add ${config.title.replace(/ List$/, "")}`}
        description={`Create a new ${config.title.toLowerCase()} record.`}
        fields={config.formFields}
        onSubmit={config.onCreate}
      />
      <EntityFormDialog
        open={open === "edit" && currentRow !== null}
        onOpenChange={(state) => setOpen(state ? "edit" : null)}
        title={`Edit ${config.title.replace(/ List$/, "")}`}
        description={`Update the selected ${config.title.toLowerCase()} record.`}
        fields={config.formFields}
        currentRow={currentRow ?? undefined}
        onSubmit={
          currentRow && config.onUpdate
            ? (values) => config.onUpdate?.(currentRow, values)
            : undefined
        }
      />
      <EntityFormDialog
        open={open === "secondary"}
        onOpenChange={(state) => setOpen(state ? "secondary" : null)}
        title={config.secondaryDialogTitle}
        description={config.secondaryDialogDescription}
        fields={config.secondaryFormFields}
      />
      {currentRow && (
        <>
          <EntityDeleteDialog
            open={open === "delete"}
            onOpenChange={(state) => setOpen(state ? "delete" : null)}
            currentRow={currentRow}
            confirmKey={config.deleteConfirmKey}
            message={config.deleteConfirmMessage(currentRow)}
            onDelete={
              config.onDelete ? () => config.onDelete?.(currentRow) : undefined
            }
          />
          <EntityViewDialog
            open={open === "view"}
            onOpenChange={(state) => setOpen(state ? "view" : null)}
            title={`View ${config.title.replace(/ List$/, "")}`}
            row={currentRow}
            labels={viewLabels}
          />
        </>
      )}
    </>
  );
}
