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
} from "@shared/components/FormInputs";
import DataTablePagination from "@shared/components/DataTable/DataTablePagination";
import { useMasterSearchMutation } from "./services/masterSearchApi";
import { toast } from "@shared/lib/toast";

interface User {
  id: number;
  regId: string;
  name: string;
  contact: string;
  qualification: string;
  sewaLocation: string;
  shiftTime: string;
  department: string;
  email: string;
  birthdate: string;
  passEntry: string;
  isPresent: string;
  userType:string;
  approved: boolean;
}

export default function MasterSearchPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [cities, setCities] = useState([]);
  const [showUserRole, setShowUserRole] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [sortState, setSortState] = useState({
    column: null as string | null,
    direction: "asc" as "asc" | "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(90);
  const [triggerMasterSearch] = useMasterSearchMutation();
  const { data: dropdownOption } = useGetRegistrationDropdownDataQuery();
  const [triggerGetCitiesByState] = useLazyGetCitiesByStateQuery();
  const [users, setUsers] = useState<User[]>([]);

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
  const defaultRoleValues = DUMMY.UserRoleChecks.reduce(
    (acc, role) => ({ ...acc, [role.name]: role.defaultChecked }),
    {}
  );

  const {
    control: roleControl,
    handleSubmit: handleRoleSubmit,
    reset: resetRoleForm,
  } = useForm({
    defaultValues: {
      ...defaultRoleValues,
      sewaLocation: "",
      samagamHeldIn: "",
      remark: "",
    },
  });

  const states = Array.isArray(dropdownOption?.data?.states)
    ? dropdownOption?.data?.states
    : [];
  const qualifications = Array.isArray(dropdownOption?.data?.qualifications)
    ? dropdownOption?.data?.qualifications
    : [];
  const departments = Array.isArray(dropdownOption?.data?.departments)
    ? dropdownOption?.data?.departments
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

  const onSearch = async (data: any) => {
    try {
      const payload = {
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
        sortBy: "full_name",
        sortOrder: "ASC",
      };

      console.log("🔍 Search Payload:", payload);

      // 🧾 Trigger the search with proper toast notifications
      const response = await toast.promise(
        triggerMasterSearch(payload).unwrap(),
        {
          loading: "Searching users...",
          success: "Search completed successfully!",
          error: "Failed to fetch search results.",
        }
      );

      console.log("✅ API Response:", response);

      // ✅ Handle success data
      if (response?.data && Array.isArray(response.data)) {
        setUsers(response.data); // Update your user table or state
      } else {
        toast.error("No users found for the given filters.");
        setUsers([]);
      }
    } catch (error: any) {
      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error — please check your connection.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong while searching.");
      }
    }
  };
  const onExport = () => console.log("Exporting filtered data...");
  const onRoleSubmit = (data: any) => console.log("User Role updated:", data);

  return (
    <main className="container mx-auto px-2 sm:px-4 pt-[120px] md:pt-[90px] lg:pt-[100px]">
      {/* Filter Section */}
      <section className="bg-white rounded-lg shadow-md mb-5 overflow-hidden">
        <Collapsible open={showFilter} onOpenChange={setShowFilter}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="w-full bg-blue-600 text-white p-3 flex justify-between items-center cursor-pointer select-none"
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
                options={DUMMY.SevaLocation}
                labelKey="label"
                valueKey="value"
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full col-span-1"
              >
                Search
              </button>
              <button
                type="button"
                onClick={onExport}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full col-span-1"
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
              className="w-full bg-blue-600 text-white p-3 flex justify-between items-center cursor-pointer select-none"
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
              {DUMMY.UserRoleChecks.map((role) => (
                <CheckboxField
                  key={role.id}
                  control={roleControl}
                  name={role.name}
                  label={role.label}
                />
              ))}

              <SearchableSelect
                control={roleControl}
                name="sewaLocation"
                label=""
                options={DUMMY.SevaLocation}
                labelKey="label"
                valueKey="value"
                placeholder="Select sewa location"
              />

              <Controller
                name="samagamHeldIn"
                control={roleControl}
                rules={{
                  required: "Samagam location is required",
                  minLength: {
                    value: 2,
                    message: "Must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label=""
                    placeholder="Enter Samagam location"
                    {...field}
                  />
                )}
              />

              <Controller
                name="remark"
                control={roleControl}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Remark"
                    className="px-3 py-2 border rounded w-full resize-none h-10 lg:col-span-2"
                  />
                )}
              />

              <button
                type="button"
                onClick={() => resetRoleForm()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full col-span-1"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full col-span-1"
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
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            sortState={sortState}
            onSortChange={(col, dir) =>
              setSortState({ column: col, direction: dir })
            }
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
