import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@shared/components/ui";
import { DataTable } from "@shared/components/DataTable/DataTable";
import { columns, DUMMY } from "./config";
import { useForm, Controller } from "react-hook-form";
import { SearchableSelect } from "@shared/components/FormInputs/SearchableSelect";
import { useGetRegistrationDropdownDataQuery } from "@features/register/services";
import { SelectField,CheckboxField } from "@shared/components/FormInputs";

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
}

export default function MasterSearchPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [showUserRole, setShowUserRole] = useState(false);

  const { data: dropdownOption } = useGetRegistrationDropdownDataQuery();

  // ✅ Filter Form
  const {
    control: filterControl,
    handleSubmit: handleFilterSubmit,
    reset: resetFilter,
  } = useForm({
    defaultValues: {
      searchTerm: "",
      departmentId: "",
      qualificationId: "",
      sewaLocation: "",
      stateId: "",
      cityId: "",
      availabilityId: "",
      passEntry: "",
    },
  });

  // ✅ User Role Form
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

  const [users] = useState<User[]>([
    {
      id: 1,
      regId: "1",
      name: "Pratik Kanaujiya",
      contact: "8965747851",
      qualification: "IT",
      sewaLocation: "D1",
      shiftTime: "All",
      department: "Admin",
      email: "p.k@gmail.com",
      birthdate: "15/10/1988",
      passEntry: "Yes",
      isPresent: "Yes",
    },
  ]);

  // Handlers
  const onSearch = (data: any) => console.log("Filter data submitted:", data);
  const onExport = () => console.log("Exporting filtered data...");
  const onRoleSubmit = (data: any) => console.log("User Role updated:", data);

  return (
    <main className="container mx-auto px-4 pt-[120px] md:pt-[90px] lg:pt-[100px]">
      {/* 🔍 Filter Section */}
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
                label="Department"
                options={dropdownOption?.data?.departments}
                labelKey="department_name"
                valueKey="id"
                placeholder="Select department"
              />

              <SearchableSelect
                control={filterControl}
                name="qualificationId"
                label="Qualification"
                options={dropdownOption?.data?.qualifications}
                labelKey="qualification_name"
                valueKey="id"
                placeholder="Select qualification"
              />

              <SearchableSelect
                control={filterControl}
                name="sewaLocation"
                label="Sewa Location"
                options={DUMMY.SevaLocation}
                labelKey="label"
                valueKey="value"
                placeholder="Select sewa location"
              />

              <SelectField
                control={filterControl}
                name="passEntry"
                label="Pass Entry"
                options={DUMMY.PassEntry}
                labelKey="label"
                valueKey="value"
                placeholder="Select pass entry"
              />

              <SelectField
                control={filterControl}
                name="availabilityId"
                label="Availability"
                options={DUMMY.availabilities}
                labelKey="label"
                valueKey="value"
                placeholder="Select availability"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
              >
                Search
              </button>

              <button
                type="button"
                onClick={onExport}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full"
              >
                Export
              </button>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* 🧍‍♂️ User Role Section */}
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
              {/* Multi-checkbox */}
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
                label="Sewa Location"
                options={DUMMY.SevaLocation}
                labelKey="label"
                valueKey="value"
                placeholder="Select sewa location"
              />

              <SelectField
                control={roleControl}
                name="samagamHeldIn"
                label="Samagam Held In"
                options={DUMMY.SamagamHeldIn}
                labelKey="label"
                valueKey="value"
                placeholder="Select samagam location"
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
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
              >
                Reset
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
              >
                Submit
              </button>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* 📋 Users Table */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={users} />
        </div>
      </section>
    </main>
  );
}
