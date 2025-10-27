import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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
  const [showUserRole, setShowUserRole] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    department: "Department",
    qualification: "Qualification",
    sewaLocation: "Sewa Location",
    state: "State",
    city: "City",
    isPresent: "IsPresent",
    passEntry: "PassEntry",
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
    {
      id: 2,
      regId: "2",
      name: "Sandeep Suthar",
      contact: "9876567865",
      qualification: "IT",
      sewaLocation: "D1",
      shiftTime: "All",
      department: "Admin",
      email: "s.s@gmail.com",
      birthdate: "18/02/1990",
      passEntry: "Yes",
      isPresent: "Yes",
    },
  ]);

  const [userRoleForm, setUserRoleForm] = useState({
    isPresent: true,
    passEntry: true,
    isAdmin: true,
    isActive: true,
    sewaLocation: "Sewa Location",
    samagamHeldIn: "Samagam Held In",
    remark: "",
  });

  const toggleUserRolePanel = () => setShowUserRole(!showUserRole);

  const toggleAllCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(users.map((user) => user.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowCheckbox = (userId: number) => {
    setSelectedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSearchParamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserRoleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setUserRoleForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setUserRoleForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetUserRoleForm = () => {
    setUserRoleForm({
      isPresent: true,
      passEntry: true,
      isAdmin: true,
      isActive: true,
      sewaLocation: "Sewa Location",
      samagamHeldIn: "Samagam Held In",
      remark: "",
    });
  };

  const submitUserRoleForm = () => {
    console.log("Updating user roles:", { userIds: selectedRows, ...userRoleForm });
    alert(`User roles updated for ${selectedRows.length} users`);
    setSelectedRows([]);
  };

  const handleSearch = () => {
    console.log("Searching with:", searchParams);
  };

  const handleExport = () => {
    console.log("Exporting data");
    alert("Export functionality would be implemented here");
  };

  return (
    <main className="container mx-auto px-4 pt-[120px] md:pt-[90px] lg:pt-[100px]">
      {/* Search Section */}
      <section className="bg-white p-5 rounded-lg shadow-md mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Reg_id, Name, Contact, Email"
            className="px-3 py-2 border rounded min-w-[180px]"
            name="searchTerm"
            value={searchParams.searchTerm}
            onChange={handleSearchParamChange}
          />

          {/* Department */}
          <select
            className="px-3 py-2 border rounded min-w-[180px]"
            name="department"
            value={searchParams.department}
            onChange={handleSearchParamChange}
          >
            <option>Department</option>
            <option>Admin</option>
            <option>IT</option>
            <option>HR</option>
          </select>

          {/* Qualification */}
          <select
            className="px-3 py-2 border rounded min-w-[180px]"
            name="qualification"
            value={searchParams.qualification}
            onChange={handleSearchParamChange}
          >
            <option>Qualification</option>
            <option>IT</option>
            <option>B.Com</option>
            <option>MBA</option>
          </select>

          {/* Sewa Location */}
          <select
            className="px-3 py-2 border rounded min-w-[180px]"
            name="sewaLocation"
            value={searchParams.sewaLocation}
            onChange={handleSearchParamChange}
          >
            <option>Sewa Location</option>
            <option>D1</option>
            <option>D2</option>
          </select>

          {/* State */}
          <select
            className="px-3 py-2 border rounded min-w-[180px]"
            name="state"
            value={searchParams.state}
            onChange={handleSearchParamChange}
          >
            <option>State</option>
            <option>Delhi</option>
            <option>Gujarat</option>
          </select>

          {/* City */}
          <select
            className="px-3 py-2 border rounded min-w-[180px]"
            name="city"
            value={searchParams.city}
            onChange={handleSearchParamChange}
          >
            <option>City</option>
            <option>Delhi</option>
            <option>Ahmedabad</option>
          </select>

          {/* Is Present */}
          <select
            className="px-3 py-2 border rounded min-w-[180px]"
            name="isPresent"
            value={searchParams.isPresent}
            onChange={handleSearchParamChange}
          >
            <option>IsPresent</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          {/* Pass Entry */}
          <select
            className="px-3 py-2 border rounded min-w-[180px]"
            name="passEntry"
            value={searchParams.passEntry}
            onChange={handleSearchParamChange}
          >
            <option>PassEntry</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSearch}
          >
            Search
          </button>

          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </section>

      {/* Add User Role Section */}
      <section className="bg-white rounded-lg shadow-md mb-5 overflow-hidden">
        <div
          className="bg-blue-600 text-white p-3 flex justify-between items-center cursor-pointer"
          onClick={toggleUserRolePanel}
        >
          <h2 className="font-bold">Add User Role</h2>
          {showUserRole ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>

        {showUserRole && (
          <div className="p-4 border-t">
            <div className="flex flex-wrap gap-5 items-center">
              {/* Checkboxes */}
              {["isPresent", "passEntry", "isAdmin", "isActive"].map((key) => (
                <label key={key} className="flex items-center gap-2">
                  {key.replace(/([A-Z])/g, " $1")}
                  <input
                    type="checkbox"
                    name={key}
                    checked={(userRoleForm as any)[key]}
                    onChange={handleUserRoleChange}
                    className="h-4 w-4"
                  />
                </label>
              ))}

              {/* Selects */}
              {["sewaLocation", "samagamHeldIn"].map((key) => (
                <select
                  key={key}
                  className="px-3 py-1 border rounded"
                  name={key}
                  value={(userRoleForm as any)[key]}
                  onChange={handleUserRoleChange}
                >
                  <option>{key === "sewaLocation" ? "Sewa Location" : "Samagam Held In"}</option>
                  <option>Delhi</option>
                  <option>Ahmedabad</option>
                  <option>Mumbai</option>
                </select>
              ))}

              {/* Remark */}
              <textarea
                placeholder="Remark"
                className="px-3 py-1 border rounded h-10 w-48"
                name="remark"
                value={userRoleForm.remark}
                onChange={handleUserRoleChange}
              />

              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={resetUserRoleForm}
              >
                Reset
              </button>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={submitUserRoleForm}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Users Table */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2 text-center">
                  <input
                    type="checkbox"
                    onChange={toggleAllCheckboxes}
                    checked={selectedRows.length === users.length && users.length > 0}
                    className="h-4 w-4"
                  />
                </th>
                {[
                  "Reg_id",
                  "Name",
                  "Contact",
                  "Qualification",
                  "Sewa Location",
                  "Shift Time",
                  "Department",
                  "Email",
                  "Birthdate",
                  "Pass Entry",
                  "Is Present",
                  "Certificate",
                ].map((header) => (
                  <th key={header} className="p-2 text-center">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b hover:bg-gray-100 ${
                    selectedRows.includes(user.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(user.id)}
                      onChange={() => toggleRowCheckbox(user.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-2 text-center">{user.regId}</td>
                  <td className="p-2 text-center">{user.name}</td>
                  <td className="p-2 text-center">{user.contact}</td>
                  <td className="p-2 text-center">{user.qualification}</td>
                  <td className="p-2 text-center">{user.sewaLocation}</td>
                  <td className="p-2 text-center">{user.shiftTime}</td>
                  <td className="p-2 text-center">{user.department}</td>
                  <td className="p-2 text-center">{user.email}</td>
                  <td className="p-2 text-center">{user.birthdate}</td>
                  <td className="p-2 text-center">{user.passEntry}</td>
                  <td className="p-2 text-center">{user.isPresent}</td>
                  <td className="p-2 text-center">
                    <a href="#" className="text-blue-600 hover:underline">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
