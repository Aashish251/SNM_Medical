import { useMemo, useState, type ReactNode } from "react";
import useDialogState from "@admin/hooks/use-dialog-state";
import type { MasterSearchDialogType, MasterSearchUser } from "../types";
import { MasterSearchContext } from "./master-search-context";

export function MasterSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useDialogState<MasterSearchDialogType>(null);
  const [currentRow, setCurrentRow] = useState<MasterSearchUser | null>(null);

  const value = useMemo(
    () => ({ open, setOpen, currentRow, setCurrentRow }),
    [open, setOpen, currentRow]
  );

  return (
    <MasterSearchContext.Provider value={value}>
      {children}
    </MasterSearchContext.Provider>
  );
}
