import React, { useState } from "react";
import useDialogState from "@admin-panel/hooks/use-dialog-state";
import type { EntityListHandlers } from "./types";

export type EntityDialogType =
  | "secondary"
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "download";

type EntityListContextType<T extends { id: string }> = {
  open: EntityDialogType | null;
  setOpen: (value: EntityDialogType | null) => void;
  currentRow: T | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<T | null>>;
  handlers: EntityListHandlers<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EntityListContext = React.createContext<EntityListContextType<any> | null>(
  null
);

export function EntityListProvider<T extends { id: string }>({
  children,
  handlers = {},
}: {
  children: React.ReactNode;
  handlers?: EntityListHandlers<T>;
}) {
  const [open, setOpen] = useDialogState<EntityDialogType>(null);
  const [currentRow, setCurrentRow] = useState<T | null>(null);

  return (
    <EntityListContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow, handlers }}
    >
      {children}
    </EntityListContext.Provider>
  );
}

export function useEntityList<T extends { id: string }>() {
  const context = React.useContext(EntityListContext);
  if (!context) {
    throw new Error("useEntityList must be used within EntityListProvider");
  }
  return context as EntityListContextType<T>;
}
