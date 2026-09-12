import { useEffect, useState } from "react";
import { DataTable } from "@shared/components/DataTable/DataTable";
import { WidgetErrorBoundary } from "@shared/error";
import { userTableConfig } from "./config";
import DataTablePagination from "@shared/components/DataTable/DataTablePagination";
import { MasterSearchFilters } from "./components/MasterSearchFilters";
import { MasterSearchRolePanel } from "./components/MasterSearchRolePanel";
import {
  useMasterSearchFilters,
  useMasterSearchPagination,
} from "./hooks/useMasterSearchFilters";
import { useMasterSearchActions } from "./hooks/useMasterSearchActions";

export default function MasterSearchPage() {
  const [showFilter, setShowFilter] = useState(true);
  const [showUserRole, setShowUserRole] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const {
    sortState,
    setSortState,
    currentPage,
    setCurrentPage,
    pageLimit,
    setPageLimit,
  } = useMasterSearchPagination();

  const {
    cities,
    departments,
    qualifications,
    sewaLocations,
    states,
    searchTriggered,
    searchPayload,
    setSearchPayload,
    filterControl,
    handleFilterSubmit,
    onSearch,
  } = useMasterSearchFilters(pageLimit, sortState);

  const {
    safeUsers,
    masterSearchData,
    isFetching,
    isUpdatingRole,
    isExporting,
    changeUserStatue,
    onExport,
    roleControl,
    handleRoleSubmit,
    resetRoleForm,
    roleWatch,
    registerRole,
    roleErrors,
    onRoleSubmit,
  } = useMasterSearchActions({
    searchPayload,
    searchTriggered,
    selectedIds,
    onClearSelection: () => setSelectedIds([]),
  });

  useEffect(() => {
    setCurrentPage(1);
    setSearchPayload((prev) => ({
      ...prev,
      sortBy: sortState.column || "regId",
      sortOrder: sortState.direction,
      page: 1,
    }));
  }, [setCurrentPage, setSearchPayload, sortState.column, sortState.direction]);

  useEffect(() => {
    setSearchPayload((prev) => {
      if (prev.page === currentPage && prev.limit === pageLimit) {
        return prev;
      }
      return {
        ...prev,
        page: currentPage,
        limit: pageLimit,
      };
    });
  }, [currentPage, pageLimit, setSearchPayload]);

  const totalRecords =
    masterSearchData?.pagination?.totalRecords ??
    masterSearchData?.total ??
    safeUsers.length;
  const totalPages =
    masterSearchData?.pagination?.total ??
    Math.max(1, Math.ceil(totalRecords / pageLimit));

  return (
    <main className="container mx-auto px-2 sm:px-4 pt-[120px] md:pt-[90px] lg:pt-[100px]">
      <MasterSearchFilters
        open={showFilter}
        onOpenChange={setShowFilter}
        filterControl={filterControl}
        onSubmit={(event) => {
          void handleFilterSubmit(onSearch)(event);
        }}
        onExport={() => {
          void onExport();
        }}
        isFetching={isFetching}
        isExporting={isExporting}
        departments={departments}
        qualifications={qualifications}
        sewaLocations={sewaLocations}
        states={states}
        cities={cities}
      />

      <MasterSearchRolePanel
        open={showUserRole}
        onOpenChange={setShowUserRole}
        roleControl={roleControl}
        registerRole={registerRole}
        roleErrors={roleErrors}
        roleWatch={roleWatch}
        onSubmit={(event) => {
          void handleRoleSubmit(onRoleSubmit)(event);
        }}
        onReset={() => resetRoleForm()}
        isUpdatingRole={isUpdatingRole}
        sewaLocations={sewaLocations}
      />

      <section className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <WidgetErrorBoundary name="master-search-table">
          <div className="overflow-x-auto">
            <DataTable
            data={safeUsers}
            config={userTableConfig}
            changeUserStatue={changeUserStatue}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            sortState={sortState}
            onSortChange={(col, dir) =>
              setSortState({ column: col, direction: dir })
            }
            rowKey="regId"
          />
          </div>
        </WidgetErrorBoundary>
      </section>

      <div className="py-2">
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageLimit={pageLimit}
          totalRecords={totalRecords}
          onLimitChange={(limit) => {
            setPageLimit(limit);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
