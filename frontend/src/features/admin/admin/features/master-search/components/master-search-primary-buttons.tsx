import { Download, Search } from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { useMasterSearchDialogs } from "./use-master-search-dialogs";

type MasterSearchPrimaryButtonsProps = {
  onExport: () => void;
  isExporting: boolean;
  isFetching: boolean;
};

export function MasterSearchPrimaryButtons({
  onExport,
  isExporting,
  isFetching,
}: MasterSearchPrimaryButtonsProps) {
  const { setOpen } = useMasterSearchDialogs();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen("filters")}
        disabled={isFetching}
      >
        <span>Advanced Search</span>
        <Search size={18} />
      </Button>
      <Button
        className="space-x-1"
        onClick={onExport}
        disabled={isExporting || isFetching}
      >
        <span>{isExporting ? "Exporting..." : "Export"}</span>
        <Download size={18} />
      </Button>
    </div>
  );
}
