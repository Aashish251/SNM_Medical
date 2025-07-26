'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Logo from '@/public/snmlogo.jpeg';

export default function MasterSearchPage() {
  const [showUserRole, setShowUserRole] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    department: 'Department',
    qualification: 'Qualification',
    sewaLocation: 'Sewa Location',
    state: 'State',
    city: 'City',
    isPresent: 'IsPresent',
    passEntry: 'PassEntry'
  });

  // Sample data - in a real app, this would come from an API
  const [users, ] = useState([
    {
      id: 1,
      regId: '1',
      name: 'Pratik Kanaujiya',
      contact: '8965747851',
      qualification: 'IT',
      sewaLocation: 'D1',
      shiftTime: 'All',
      department: 'Admin',
      email: 'p.k@gmail.com',
      birthdate: '15/10/1988',
      passEntry: 'Yes',
      isPresent: 'Yes'
    },
    {
      id: 2,
      regId: '2',
      name: 'Sandeep Suthar',
      contact: '9876567865',
      qualification: 'IT',
      sewaLocation: 'D1',
      shiftTime: 'All',
      department: 'Admin',
      email: 's.s@gmail.com',
      birthdate: '18/02/1990',
      passEntry: 'Yes',
      isPresent: 'Yes'
    }
  ]);

  const [userRoleForm, setUserRoleForm] = useState({
    isPresent: true,
    passEntry: true,
    isAdmin: true,
    isActive: true,
    sewaLocation: 'Sewa Location',
    samagamHeldIn: 'Samagam Held In',
    remark: ''
  });

  const toggleUserRolePanel = () => {
    setShowUserRole(!showUserRole);
  };

  const toggleAllCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(users.map(user => user.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowCheckbox = (userId: number) => {
    setSelectedRows(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSearchParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setUserRoleForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setUserRoleForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetUserRoleForm = () => {
    setUserRoleForm({
      isPresent: true,
      passEntry: true,
      isAdmin: true,
      isActive: true,
      sewaLocation: 'Sewa Location',
      samagamHeldIn: 'Samagam Held In',
      remark: ''
    });
  };

  const submitUserRoleForm = () => {
    // In a real app, this would send data to an API
    console.log('Updating user roles:', {
      userIds: selectedRows,
      ...userRoleForm
    });
    alert(`User roles updated for ${selectedRows.length} users`);
    setSelectedRows([]);
  };

  const handleSearch = () => {
    // In a real app, this would call an API with search parameters
    console.log('Searching with:', searchParams);
  };

  const handleExport = () => {
    // In a real app, this would generate/download an export file
    console.log('Exporting data');
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white py-3 px-5">
        <div className="container mx-auto flex justify-between items-center flex-wrap">
          <Image src={Logo} alt="Sant Nirankari Mission Logo" height={50} className="h-12 w-auto" />
          <div className="text-lg font-bold">
            Dhan Nirankar <span className="text-red-500">Pratik</span> Ji Welcome to{' '}
            <span className="text-yellow-400">Master Search</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 text-white py-2 px-5">
        <div className="container mx-auto flex flex-wrap gap-2">
          <a href="#" className="bg-red-600 px-3 py-1 rounded text-sm">
            Home
          </a>
          <a href="#" className="hover:bg-gray-800 px-3 py-1 rounded text-sm">
            Update Profile
          </a>
          <a href="#" className="hover:bg-gray-800 px-3 py-1 rounded text-sm">
            Master Search
          </a>
          <a href="#" className="hover:bg-gray-800 px-3 py-1 rounded text-sm">
            Duty Chart
          </a>
          <a href="#" className="hover:bg-gray-800 px-3 py-1 rounded text-sm">
            Daily Report
          </a>
          <a href="#" className="hover:bg-gray-800 px-3 py-1 rounded text-sm">
            Registration Report
          </a>
          <a href="#" className="hover:bg-gray-800 px-3 py-1 rounded text-sm">
            Master Report
          </a>
          <a href="#" className="hover:bg-gray-800 px-3 py-1 rounded text-sm">
            Sign Out
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-5 px-4">
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
                <div>
                  <label className="flex items-center gap-2">
                    Is Present
                    <input
                      type="checkbox"
                      name="isPresent"
                      checked={userRoleForm.isPresent}
                      onChange={handleUserRoleChange}
                      className="h-4 w-4"
                    />
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    Pass Entry
                    <input
                      type="checkbox"
                      name="passEntry"
                      checked={userRoleForm.passEntry}
                      onChange={handleUserRoleChange}
                      className="h-4 w-4"
                    />
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    Is Admin
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={userRoleForm.isAdmin}
                      onChange={handleUserRoleChange}
                      className="h-4 w-4"
                    />
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    Is Active
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={userRoleForm.isActive}
                      onChange={handleUserRoleChange}
                      className="h-4 w-4"
                    />
                  </label>
                </div>

                <div>
                  <select
                    className="px-3 py-1 border rounded"
                    name="sewaLocation"
                    value={userRoleForm.sewaLocation}
                    onChange={handleUserRoleChange}
                  >
                    <option>Sewa Location</option>
                    <option>D1</option>
                    <option>D2</option>
                    <option>D3</option>
                  </select>
                </div>

                <div>
                  <select
                    className="px-3 py-1 border rounded"
                    name="samagamHeldIn"
                    value={userRoleForm.samagamHeldIn}
                    onChange={handleUserRoleChange}
                  >
                    <option>Samagam Held In</option>
                    <option>Delhi</option>
                    <option>Ahmedabad</option>
                    <option>Mumbai</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
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
                  <th className="p-2 text-center">Reg_id</th>
                  <th className="p-2 text-center">Name</th>
                  <th className="p-2 text-center">Contact</th>
                  <th className="p-2 text-center">Qualification</th>
                  <th className="p-2 text-center">Sewa Location</th>
                  <th className="p-2 text-center">Shift Time</th>
                  <th className="p-2 text-center">Department</th>
                  <th className="p-2 text-center">Email</th>
                  <th className="p-2 text-center">Birthdate</th>
                  <th className="p-2 text-center">Pass Entry</th>
                  <th className="p-2 text-center">Is Present</th>
                  <th className="p-2 text-center">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id}
                    className={`border-b hover:bg-gray-100 ${
                      selectedRows.includes(user.id) ? 'bg-blue-50' : ''
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
    </div>
  );
}