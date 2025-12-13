import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@shared/components/ui";
import { DataTable } from "@shared/components/DataTable/DataTable";
import { DUMMY, userTableConfig } from "./config";
import { useForm, Controller } from "react-hook-form";
import { SearchableSelect } from "@shared/components/FormInputs/SearchableSelect";
import {
  useGetRegistrationDropdownDataQuery,
  useLazyGetCitiesByStateQuery,
} from "@shared/services/commonApi";
import {
  SelectField,
  CheckboxField,
  TextField,
  TextareaField,
} from "@shared/components/FormInputs";
import DataTablePagination from "@shared/components/DataTable/DataTablePagination";
import {
  useGetChangeStatusMutation,
  useGetChangeUsersRoleMutation,
  useMasterSearchQuery,
} from "./services/masterSearchApi";
import { toast } from "@shared/lib/toast";
import { User } from "@shared/types/CommonType";

export default function MasterSearchPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [cities, setCities] = useState([]);
  const [showUserRole, setShowUserRole] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [sortState, setSortState] = useState({
    column: "fullName" as string | null,
    direction: "ASC" as "ASC" | "DESC",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(90);
  const { data: dropdownOption } = useGetRegistrationDropdownDataQuery();
  const [triggerGetCitiesByState] = useLazyGetCitiesByStateQuery();
  const [triggerGetChangeStatus] = useGetChangeStatusMutation();
  const [triggerChangeUsersRole] = useGetChangeUsersRoleMutation();
  const [searchPayload, setSearchPayload] = useState({
    searchKey: "",
    departmentId: null,
    qualificationId: null,
    sewaLocationId: null,
    cityId: null,
    stateId: null,
    isPresent: null,
    passEntry: null,
    limit: pageLimit,
    page: currentPage,
    sortBy: "fullName",
    sortOrder: "ASC",
  });

  const { data: masterSearchData, refetch: triggerMasterSearch } =
    useMasterSearchQuery(searchPayload);
  const [users, setUsers] = useState<User[]>([]);

  // console.log(searchPayload)

  // Update users when masterSearchData changes
  useEffect(() => {
    if (masterSearchData?.data && Array.isArray(masterSearchData.data)) {
      setUsers(masterSearchData.data);
    }
  }, [masterSearchData]);

  // Update searchPayload when sortState changes to trigger API sort
  useEffect(() => {
    setSearchPayload(prev => ({
      ...prev,
      sortBy: sortState.column || "fullName",
      sortOrder: sortState.direction,
    }));
  }, [sortState.column, sortState.direction]);

  const totalPages = Math.max(1, Math.ceil(users.length / pageLimit));
  const pagedUsers = users.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  // Filter Form
  const {
    control: filterControl,
    handleSubmit: handleFilterSubmit,
    reset: resetFilter,
    setValue: setValueFilter,
    watch: watchFilter,
  } = useForm({
    defaultValues: {
      searchTerm: "",
      departmentId: "",
      qualificationId: "",
      sewaLocation: "",
      stateId: "",
      cityId: "",
      passEntry: "",
      isPresent: "",
    },
  });

  const stateId = watchFilter("stateId");

  // User-role Form
  const {
    control: roleControl,
    handleSubmit: handleRoleSubmit,
    reset: resetRoleForm,
    watch: roleWatch,
    register: registerRole,
    formState: { errors: roleErrors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      isPresent: null,
      passEntry: null,
      isAdmin: null,
      isDeleted: null,
      sewaLocation: "",
      samagamHeldIn: "",
      remark: "",
    },
  });

  const idDeleted = roleWatch("isDeleted");
  const isDeleteSelected =
    String(idDeleted) === "1" || idDeleted === 1 || idDeleted === true;

  const states = Array.isArray(dropdownOption?.data?.states)
    ? dropdownOption?.data?.states
    : [];
  const qualifications = Array.isArray(dropdownOption?.data?.qualifications)
    ? dropdownOption?.data?.qualifications
    : [];
  const departments = Array.isArray(dropdownOption?.data?.departments)
    ? dropdownOption?.data?.departments
    : [];

  const sewaLocations = Array.isArray(dropdownOption?.data?.sewaLocations)
    ? dropdownOption?.data?.sewaLocations
    : [];

  const handleFilterCity = async (id: number) => {
    try {
      const result = await triggerGetCitiesByState({ stateId: id }).unwrap();
      setCities(result?.data?.cities || []);
    } catch (error) {
      console.error("Failed to fetch cities", error);
      setCities([]);
    }
  };

  useEffect(() => {
    const id = Number(stateId);
    if (id) handleFilterCity(id);
    else {
      setCities([]);
      setValueFilter("cityId", "");
    }
  }, [stateId]);

  const changeUserStatue = async (regId: number) => {
    try {
      await toast.promise(triggerGetChangeStatus({ regId }).unwrap(), {
        loading: "Updating status...",
        success: "User approved successfully",
        error: "Failed to update status",
      });
      // Force a refetch with current search payload
      await triggerMasterSearch();
    } catch (err: any) {
      console.error(err);
      if (err?.status === "FETCH_ERROR") {
        toast.error("Network error — please check your connection.");
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong while updating status.");
      }
    }
  };

  const onSearch = async (data: any) => {
    try {
      const newPayload = {
        searchKey: data?.searchTerm?.trim() || "",
        departmentId: data?.departmentId || null,
        qualificationId: data?.qualificationId || null,
        sewaLocationId: data?.sewaLocation || null,
        cityId: data?.cityId || null,
        stateId: data?.stateId || null,
        isPresent: data?.isPresent || null,
        passEntry: data?.passEntry || null,
        limit: pageLimit,
        page: currentPage,
        sortBy: sortState.column,
        sortOrder: sortState.direction,
      };

      console.log("🔍 Search Payload:", newPayload);

      // Update the search payload which will trigger a new search
      setSearchPayload(newPayload);

      // Show loading toast
      toast.promise(
        new Promise((resolve) => {
          // Wait for the next render cycle when masterSearchData will be updated
          setTimeout(resolve, 100);
        }),
        {
          loading: "Searching users...",
          success: "Search completed successfully!",
          error: "Failed to fetch search results.",
        }
      );
    } catch (error: any) {
      console.error("Search error:", error);
      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error — please check your connection.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error(error.message || "Something went wrong while searching.");
      }
      setUsers([]);
    }
  };

  const onExport = () => console.log("Exporting filtered data...");

  const onRoleSubmit = async (data: any) => {
    try {
      if (!selectedIds.length) {
        toast.error("Please select at least one user to update roles.");
        return;
      }
      const numericFields = ["isPresent", "passEntry", "isAdmin", "isDeleted"];

      const normalized = { ...data };

      numericFields.forEach((key) => {
        const val = normalized[key];

        // treat empty string or undefined as null
        if (val === "" || val === undefined || val === null) {
          normalized[key] = null;
          return;
        }

        // if already a number, keep it
        if (typeof val === "number" && !isNaN(val)) {
          return;
        }

        // try to coerce numeric strings to numbers
        const num = Number(val);
        normalized[key] = Number.isNaN(num) ? val : num;
      });

      // ---- Build payload ----
      const payload = {
        ...normalized,
        regId: selectedIds.join(","),
      };
      // console.log(payload);

      await toast.promise(triggerChangeUsersRole(payload).unwrap(), {
        loading: "Updating users' roles...",
        success: "User roles updated successfully!",
        error: "Failed to update user roles. Please try again.",
      });

      // Force a refetch with current search payload
      await triggerMasterSearch();

      // Reset selections and form
      setSelectedIds([]);
      resetRoleForm();
    } catch (error: any) {
      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error — please check your connection.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong while updating user roles.");
      }
    }
  };

  return (
    <main className="container mx-auto px-2 sm:px-4 pt-[120px] md:pt-[90px] lg:pt-[100px]">
      {/* Filter Section */}
      <section className="bg-white rounded-lg shadow-md mb-5 overflow-hidden">
        <Collapsible open={showFilter} onOpenChange={setShowFilter}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="w-full bg-to-two-right-theme-gradient text-white p-3 flex justify-between items-center cursor-pointer select-none"
            >
              <h2 className="font-bold">Filter User</h2>
              {showFilter ? (
                <IoIosArrowUp className="w-6 h-6" />
              ) : (
                <IoIosArrowDown className="w-6 h-6" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border-t">
            <form
              onSubmit={handleFilterSubmit(onSearch)}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center"
            >
              <Controller
                name="searchTerm"
                control={filterControl}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Reg_id, Name, Contact, Email"
                    className="px-3 py-2 border rounded w-full"
                  />
                )}
              />

              <SearchableSelect
                control={filterControl}
                name="departmentId"
                label=""
                options={departments ?? []}
                labelKey="department_name"
                valueKey="id"
                placeholder="Select department"
              />

              <SearchableSelect
                control={filterControl}
                name="qualificationId"
                label=""
                options={qualifications ?? []}
                labelKey="qualification_name"
                valueKey="id"
                placeholder="Select qualification"
              />

              <SearchableSelect
                control={filterControl}
                name="sewaLocation"
                label=""
                options={sewaLocations ?? []}
                labelKey="sewalocation_name"
                valueKey="id"
                placeholder="Select sewa location"
              />

              <SearchableSelect
                control={filterControl}
                name="stateId"
                label=""
                options={states ?? []}
                labelKey="state_name"
                valueKey="id"
                placeholder="Select state"
              />

              <SearchableSelect
                control={filterControl}
                name="cityId"
                label=""
                options={cities ?? []}
                labelKey="city_name"
                valueKey="id"
                placeholder="Select city"
              />

              <SelectField
                control={filterControl}
                name="passEntry"
                label=""
                options={DUMMY.PassEntry}
                labelKey="label"
                valueKey="value"
                placeholder="Select pass entry"
              />

              <SelectField
                control={filterControl}
                name="isPresent"
                label=""
                options={DUMMY.IsPresent}
                labelKey="label"
                valueKey="value"
                placeholder="Select is present"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-2xl font-bold hover:bg-blue-700 w-full col-span-1"
              >
                Search
              </button>
              <button
                type="button"
                onClick={onExport}
                className="px-4 py-2 bg-gray-600 text-white rounded-2xl font-bold hover:bg-gray-700 w-full col-span-1"
              >
                Export
              </button>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* User Role Section */}
      <section className="bg-white rounded-lg shadow-md mb-5 overflow-hidden">
        <Collapsible open={showUserRole} onOpenChange={setShowUserRole}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="w-full bg-to-two-right-theme-gradient text-white p-3 flex justify-between items-center cursor-pointer select-none"
            >
              <h2 className="font-bold">Add User Role</h2>
              {showUserRole ? (
                <IoIosArrowUp className="w-6 h-6" />
              ) : (
                <IoIosArrowDown className="w-6 h-6" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border-t">
            <form
              onSubmit={handleRoleSubmit(onRoleSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center"
            >
              <SelectField
                control={roleControl}
                name="isPresent"
                label=""
                options={DUMMY.IsPresent}
                labelKey="label"
                valueKey="value"
                defaultValue={null}
                placeholder="Select isPresent"
              />

              <SelectField
                control={roleControl}
                name="passEntry"
                label=""
                options={DUMMY.PassEntry}
                labelKey="label"
                valueKey="value"
                defaultValue={null}
                placeholder="Select pass entry"
              />

              <SelectField
                control={roleControl}
                name="isAdmin"
                label=""
                options={DUMMY.isAdmin}
                labelKey="label"
                valueKey="value"
                defaultValue={null}
                placeholder="Select isAdmin"
              />

              <SelectField
                control={roleControl}
                name="isDeleted"
                label=""
                options={DUMMY.isDelete}
                labelKey="label"
                valueKey="value"
                defaultValue={null}
                placeholder="Select isDelete"
              />

              <SearchableSelect
                control={roleControl} // use roleControl
                name="sewaLocation"
                label=""
                options={sewaLocations ?? []}
                labelKey="sewalocation_name"
                valueKey="id"
                placeholder="Select sewa location"
              />

              <TextField
                label=""
                register={registerRole("samagamHeldIn")}
                placeholder="Enter samagam location"
              />

              <TextareaField
                label=""
                placeholder="Enter remark message"
                register={registerRole("remark", {
                  validate: (value) => {
                    if (isDeleteSelected) {
                      if (!value || String(value).trim().length === 0) {
                        return "Please enter the remark.";
                      }
                    }
                    return true;
                  },
                })}
                rows={1}
                className="w-full resize-none lg:col-span-2"
                error={roleErrors.remark}
              />

              <button
                type="button"
                onClick={() => resetRoleForm()}
                className="px-4 py-2 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 w-full col-span-1"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 w-full col-span-1"
              >
                Submit
              </button>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* Users Table */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <DataTable
            data={pagedUsers}
            config={userTableConfig}
            changeUserStatue={changeUserStatue}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            sortState={sortState}
            onSortChange={(col, dir) =>
              setSortState({ column: col, direction: dir })
            }
            rowKey="regId" // optional - default is "regId"
          />
        </div>
      </section>

      {/* Pagination */}
      <div className="py-2">
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageLimit={pageLimit}
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
