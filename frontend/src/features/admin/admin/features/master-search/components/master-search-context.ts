import { createContext } from "react";
import type { MasterSearchDialogType, MasterSearchUser } from "../types";

export type MasterSearchContextType = {
  open: MasterSearchDialogType | null;
  setOpen: (value: MasterSearchDialogType | null) => void;
  currentRow: MasterSearchUser | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<MasterSearchUser | null>>;
};

export const MasterSearchContext =
  createContext<MasterSearchContextType | null>(null);
