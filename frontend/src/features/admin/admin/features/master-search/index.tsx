import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Button } from "@admin/components/ui/button";
import { ROUTE_ADMIN_DASHBOARD } from "@admin/constants/routePaths";
import { normalizeApiError } from "@shared/api/errors";
import { MasterSearchProvider } from "./components/master-search-provider";
import { MasterSearchStats } from "./components/master-search-stats";
import { MasterSearchFilterCard } from "./components/master-search-filter-card";
import { MasterSearchRoleCard } from "./components/master-search-role-card";
import { MasterSearchTable } from "./components/master-search-table";
import { MasterSearchDialogs } from "./components/master-search-dialogs";
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
    onAdvancedSearch,
    resetFilters,
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

  // Calculate dynamic stat counts
  const { activeCount, pendingCount } = useMemo(() => {
    if (!users.length) return { activeCount: 0, pendingCount: 0 };
    const approvedInPage = users.filter(
      (u) =>
        u.status === "approved" ||
        u.isApproved === 1 ||
        u.isApproved === ("1" as unknown)
    ).length;

    const ratio = approvedInPage / users.length;
    const active =
      totalRecords <= users.length
        ? approvedInPage
        : Math.round(totalRecords * ratio);
    const pending = Math.max(0, totalRecords - active);

    return {
      activeCount: active,
      pendingCount: pending,
    };
  }, [users, totalRecords]);

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
    if (isError && error) {
      toast.error(normalizeApiError(error).message);
    }
  }, [error, isError]);

  return (
    <MasterSearchProvider>
      {/* Top Navigation Bar matching Figma UI */}
      <Header fixed className="border-b border-slate-100 dark:border-slate-800">
        <Search className="me-auto max-w-md" />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell with Red Badge */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              3
            </span>
          </Button>

          {/* Theme Switcher */}
          <ThemeSwitch />

          {/* User Profile Summary */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2.5 dark:border-slate-700">
            <ProfileDropdown />
          </div>
        </div>
      </Header>

      {/* Main Content Area */}
      <Main hideBreadcrumbs className="flex flex-1 flex-col gap-5 p-4 sm:p-6 lg:p-7">
        {/* Breadcrumb & Page Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              to={ROUTE_ADMIN_DASHBOARD}
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              Admin
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold dark:text-blue-400">
              Master Search
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-2 mt-0.5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Master Search
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search, filter and manage all registered users in one place.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Stat Summary Cards & Quote Banner */}
        <MasterSearchStats
          totalUsers={totalRecords}
          activeUsers={activeCount}
          pendingUsers={pendingCount}
        />

        {/* 2. Inline Collapsible "Filter User" Card */}
        <MasterSearchFilterCard
          form={filterForm}
          onSubmit={(values) => {
            onAdvancedSearch(values);
            setCurrentPage(1);
            setRowSelection({});
          }}
          onReset={() => {
            resetFilters();
            setCurrentPage(1);
            setRowSelection({});
          }}
          isFetching={isFetching}
          departmentOptions={departmentOptions}
          qualificationOptions={qualificationOptions}
          sewaLocationOptions={sewaLocationOptions}
          stateOptions={stateOptions}
          cityOptions={cityOptions}
        />

        {/* 3. Inline Collapsible "Add User Role" Card */}
        <MasterSearchRoleCard
          form={roleForm}
          onSubmit={onRoleSubmit}
          isUpdatingRole={isUpdatingRole}
          selectedCount={selectedIds.length}
          isDeleteSelected={isDeleteSelected}
          sewaLocationOptions={sewaLocationOptions}
        />

        {/* 4. "User List" Table / Card View Section */}
        <MasterSearchTable
          data={users}
          totalRecords={totalRecords}
          currentPage={currentPage}
          pageLimit={pageLimit}
          onPageChange={(page) => {
            setCurrentPage(page);
            setRowSelection({});
          }}
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
          onExport={() => {
            void onExport();
          }}
          isExporting={isExporting}
        />

        {/* Fallback dialogs for modal triggers if invoked via shortcuts */}
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
      </Main>
    </MasterSearchProvider>
  );
}

export default MasterSearch;
