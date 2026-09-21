import { useContext } from "react";
import { MasterSearchContext } from "./master-search-context";

export function useMasterSearchDialogs() {
  const context = useContext(MasterSearchContext);
  if (!context) {
    throw new Error(
      "useMasterSearchDialogs must be used within MasterSearchProvider"
    );
  }
  return context;
}
