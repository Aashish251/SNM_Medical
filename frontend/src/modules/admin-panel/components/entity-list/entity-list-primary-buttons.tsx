import { Button } from "@admin-panel/components/ui/button";
import type { EntityListModuleConfig } from "./types";
import { useEntityList } from "./entity-list-provider";

type EntityListPrimaryButtonsProps<T extends { id: string }> = {
  config: Pick<
    EntityListModuleConfig<T>,
    "secondaryAction" | "primaryAction"
  >;
};

export function EntityListPrimaryButtons<T extends { id: string }>({
  config,
}: EntityListPrimaryButtonsProps<T>) {
  const { setOpen } = useEntityList<T>();
  const SecondaryIcon = config.secondaryAction.icon;
  const PrimaryIcon = config.primaryAction.icon;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen("secondary")}
      >
        <span>{config.secondaryAction.label}</span>
        <SecondaryIcon size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>{config.primaryAction.label}</span>
        <PrimaryIcon size={18} />
      </Button>
    </div>
  );
}
