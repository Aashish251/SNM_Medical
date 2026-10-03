import { useState, type FormEvent } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search as HeaderSearch } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import { normalizeApiError } from "@shared/api/errors";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@admin/components/ui/table";
import {
  type MasterModule,
  useCreateMasterRecordMutation,
  useGetMasterRecordsQuery,
} from "../services/masterDataApi";

type MasterTablePageProps = {
  module: MasterModule;
  title: string;
  description: string;
};

export function MasterTablePage({
  module,
  title,
  description,
}: MasterTablePageProps) {
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [value, setValue] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [createMasterRecord, { isLoading: isCreating }] =
    useCreateMasterRecordMutation();
  const {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetMasterRecordsQuery({ module, search });
  const { data: statesData, isLoading: areStatesLoading } =
    useGetMasterRecordsQuery(
      { module: "state", search: "" },
      { skip: module !== "city" }
    );
  const records = data?.data?.items ?? [];
  const states = statesData?.data?.items ?? [];
  const singularTitle: Record<MasterModule, string> = {
    city: "City",
    state: "State",
    qualification: "Qualification",
    department: "Department",
    sewalocation: "Location",
    availableday: "Availability",
    shifttime: "Shift Time",
  };
  const recordTitle = singularTitle[module];
  const errorMessage = isError
    ? normalizeApiError(error).message
    : "";

  const closeAddDialog = (open: boolean) => {
    setAddDialogOpen(open);
    if (!open) {
      setValue("");
      setCountryId("");
      setStateId("");
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createMasterRecord({
        module,
        value: value.trim(),
        ...(module === "state" ? { countryId: Number(countryId) } : {}),
        ...(module === "city" ? { stateId: Number(stateId) } : {}),
      }).unwrap();
      toast.success(`${recordTitle} added successfully.`);
      closeAddDialog(false);
    } catch (createError) {
      toast.error(normalizeApiError(createError).message);
    }
  };

  return (
    <>
      <Header fixed>
        <HeaderSearch className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setAddDialogOpen(true)}>
              <Plus className="me-2 h-4 w-4" />
              Add {recordTitle}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`me-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            aria-label={`Search ${title.toLowerCase()}`}
            className="ps-9"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="admin-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>{recordTitle} Name</TableHead>
                {(module === "city" || module === "state") && (
                  <TableHead>
                    {module === "city" ? "State ID" : "Country ID"}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={module === "city" || module === "state" ? 3 : 2}
                    className="h-24 text-center"
                  >
                    Loading {title.toLowerCase()}...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={module === "city" || module === "state" ? 3 : 2}
                    className="h-24 text-center text-destructive"
                  >
                    Could not load {title.toLowerCase()}: {errorMessage}
                  </TableCell>
                </TableRow>
              ) : records.length ? (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.id}</TableCell>
                    <TableCell>{record.value}</TableCell>
                    {(module === "city" || module === "state") && (
                      <TableCell className="font-mono">
                        {module === "city" ? record.state_id : record.country_id}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={module === "city" || module === "state" ? 3 : 2}
                    className="text-muted-foreground h-24 text-center"
                  >
                    No {title.toLowerCase()} found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
      <Dialog open={addDialogOpen} onOpenChange={closeAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {recordTitle}</DialogTitle>
            <DialogDescription>
              Save this value directly to the database master table.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              void handleCreate(event);
            }}
          >
            <div className="space-y-2">
              <label htmlFor="master-value" className="text-sm font-medium">
                {recordTitle} name
              </label>
              <Input
                id="master-value"
                maxLength={100}
                required
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={`Enter ${recordTitle.toLowerCase()} name`}
              />
            </div>
            {module === "state" && (
              <div className="space-y-2">
                <label htmlFor="master-country-id" className="text-sm font-medium">
                  Country ID
                </label>
                <Input
                  id="master-country-id"
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={countryId}
                  onChange={(event) => setCountryId(event.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  Use the country ID configured in the database.
                </p>
              </div>
            )}
            {module === "city" && (
              <div className="space-y-2">
                <label htmlFor="master-state-id" className="text-sm font-medium">
                  State
                </label>
                <select
                  id="master-state-id"
                  required
                  value={stateId}
                  onChange={(event) => setStateId(event.target.value)}
                  disabled={areStatesLoading || states.length === 0}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {areStatesLoading ? "Loading states..." : "Select a state"}
                  </option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.value}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => closeAddDialog(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isCreating ||
                  !value.trim() ||
                  (module === "state" && !countryId) ||
                  (module === "city" && !stateId)
                }
              >
                {isCreating ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
