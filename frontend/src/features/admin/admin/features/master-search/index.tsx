import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { normalizeApiError } from "@shared/api/errors";
import { MasterSearchDialogs } from "./components/master-search-dialogs";
import { MasterSearchPrimaryButtons } from "./components/master-search-primary-buttons";
import { MasterSearchProvider } from "./components/master-search-provider";
import { MasterSearchTable } from "./components/master-search-table";
import { useAdminMasterSearchActions } from "./hooks/use-admin-master-search-actions";
import {
  useAdminMasterSearchFilters,
  useAdminMasterSearchPagination,
} from "./hooks/use-admin-master-search-filters";

export function MasterSearch() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const {
    sortState,
    setSortState,
    currentPage,
    setCurrentPage,
    pageLimit,
    setPageLimit,
  } = useAdminMasterSearchPagination();

  const {
    form: filterForm,
    searchPayload,
    setSearchPayload,
    toolbarSearch,
    setToolbarSearch,
    onAdvancedSearch,
    departmentOptions,
    qualificationOptions,
    sewaLocationOptions,
    stateOptions,
    cityOptions,
  } = useAdminMasterSearchFilters(pageLimit, sortState);

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  );

  const {
    users,
    totalRecords,
    isFetching,
    isError,
    error,
    isApproving,
    isUpdatingRole,
    isExporting,
    approveUser,
    onExport,
    roleForm,
    onRoleSubmit,
    isDeleteSelected,
  } = useAdminMasterSearchActions({
    searchPayload,
    selectedIds,
    onClearSelection: () => setRowSelection({}),
  });

  useEffect(() => {
    setSearchPayload((prev) => ({
      ...prev,
      sortBy: sortState.column || "fullName",
      sortOrder: sortState.direction,
      page: 1,
    }));
    setCurrentPage(1);
  }, [setCurrentPage, setSearchPayload, sortState.column, sortState.direction]);

  useEffect(() => {
    setSearchPayload((prev) => ({
      ...prev,
      page: currentPage,
      limit: pageLimit,
    }));
  }, [currentPage, pageLimit, setSearchPayload]);

  useEffect(() => {
    if (searchPayload.page === 1 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, searchPayload.page, setCurrentPage]);

  useEffect(() => {
    if (isError && error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [error, isError]);

  return (
    <MasterSearchProvider>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Master Search</h2>
            <p className="text-muted-foreground">
              Search users and manage status in bulk.
            </p>
          </div>
          <MasterSearchPrimaryButtons
            onExport={() => {
              void onExport();
            }}
            isExporting={isExporting}
            isFetching={isFetching}
          />
        </div>

        <MasterSearchTable
          data={users}
          totalRecords={totalRecords}
          currentPage={currentPage}
          pageLimit={pageLimit}
          onPageChange={setCurrentPage}
          onPageLimitChange={(limit) => {
            setPageLimit(limit);
            setCurrentPage(1);
          }}
          sortState={sortState}
          onSortChange={setSortState}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onApprove={(regId) => {
            void approveUser(regId);
          }}
          isApproving={isApproving}
          isFetching={isFetching}
          toolbarSearch={toolbarSearch}
          onToolbarSearchChange={setToolbarSearch}
        />
      </Main>

      <MasterSearchDialogs
        filterForm={filterForm}
        onFilterSubmit={(values) => {
          onAdvancedSearch(values);
          setCurrentPage(1);
          setRowSelection({});
        }}
        isFetching={isFetching}
        departmentOptions={departmentOptions}
        qualificationOptions={qualificationOptions}
        sewaLocationOptions={sewaLocationOptions}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
        roleForm={roleForm}
        onRoleSubmit={onRoleSubmit}
        isUpdatingRole={isUpdatingRole}
        selectedCount={selectedIds.length}
        isDeleteSelected={isDeleteSelected}
      />
    </MasterSearchProvider>
  );
}
