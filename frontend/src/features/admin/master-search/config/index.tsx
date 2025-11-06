import { TableConfig } from "@shared/components/DataTable/DataTable";
import { Button } from "@shared/components/ui/button";
import { Link } from "react-router-dom";

export interface User {
  id: number;
  regId: string;
  fullName: string;
  mobileNo: string;
  qualificationName: string;
  sewalocationName: string;
  shifttime: string;
  departmentName: string;
  email: string;
  dob: string;
  passEntry: string;
  isPresent: string;
  approved: boolean;
  userType:string;
  certificateDocPath: string;
}

export const userTableConfig: TableConfig<User> = {
  showCheckbox: true,
  showActions: true,
  actions: {
    render: (user: User) =>
      user.approved ? (
        <Button className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 transition">
          Disapprove
        </Button>
      ) : (
        <Button className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200 transition">
          Approve
        </Button>
      ),
  },
  columns: [
    {
      key: "fullName",
      header: "Full Name",
      sortable: true,
      render: (user: User) => (
        <Link
          to={`/${user?.userType}/update-profile/${user.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
        >
          {user.fullName}
        </Link>
      ),
    },
    { key: "mobileNo", header: "Contact" },
    { key: "qualificationName", header: "Qualification" },
    { key: "sewalocationName", header: "Sewa Location" },
    { key: "shifttime", header: "Shift Time" },
    { key: "departmentName", header: "Department", sortable: true },
    { key: "email", header: "Email" },
    { key: "dob", header: "Birthdate", sortable: true },
    { key: "passEntry", header: "Pass Entry" },
    { key: "isPresent", header: "Is Present" },
    {
      key: "certificateDocPath",
      header: "Certificate",
      render: (user: User) =>
        user.certificateDocPath ? (
          <a
            href={`${import.meta.env?.VITE_API_BACKEND_URL}${user.certificateDocPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
          >
            View
          </a>
        ) : (
          <span className="text-gray-400">No File</span>
        ),
    },
  ],
  statusColumn: {
    key: "approved",
    render: (user: User) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          user.approved ? "text-green-700" : "text-yellow-700"
        }`}
      >
        {user.approved ? "Approved" : "Pending"}
      </span>
    ),
  },
};

// Dummy options for dropdowns
export const DUMMY = {
  SevaLocation: [
    { id: 1, label: "D1", value: "D1" },
    { id: 2, label: "D2", value: "D2" },
    { id: 3, label: "D3", value: "D3" },
  ],
  availabilities: [
    { id: 1, label: "Yes", value: "Yes" },
    { id: 2, label: "No", value: "No" },
    { id: 3, label: "Maybe", value: "Maybe" },
  ],
  PassEntry: [
    { id: 1, label: "Yes", value: "Yes" },
    { id: 2, label: "No", value: "No" },
  ],
  IsPresent: [
    { id: 1, label: "Yes", value: "Yes" },
    { id: 2, label: "No", value: "No" },
  ],
  UserRoleChecks: [
    { id: 1, name: "isPresent", label: "Is Present", defaultChecked: true },
    { id: 2, name: "passEntry", label: "Pass Entry", defaultChecked: true },
    { id: 3, name: "isAdmin", label: "Is Admin", defaultChecked: false },
    { id: 4, name: "isDelete", label: "Is Delete", defaultChecked: true },
  ],
  SamagamHeldIn: [
    { id: 1, label: "Delhi", value: "Delhi" },
    { id: 2, label: "Ahmedabad", value: "Ahmedabad" },
    { id: 3, label: "Mumbai", value: "Mumbai" },
  ],
};
