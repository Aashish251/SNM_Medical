// userTableConfig.ts
import { Button } from "@shared/components/ui/button";
import { Link } from "react-router-dom";
import type { TableConfig } from "@shared/components/DataTable/DataTable";
import { User } from "@shared/types/CommonType";

export const userTableConfig: TableConfig<User> = {
  showCheckbox: true,
  showActions: true,
  actions: {
    render: (user, helpers) => (
      <>
        {user.isDeleted ? (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-600">
            Inactive
          </span>
        ) : (
          /* 🔵 If user is NOT approved → show Approve button */
          !user.isApproved && (
            <Button
              onClick={() => helpers?.changeUserStatue?.(user.regId)}
              className="text-white bg-blue-500 hover:bg-blue-600"
            >
              Approve
            </Button>
          )
        )}
      </>
    ),
  },
  columns: [
    {
      key: "fullName",
      header: "Full Name",
      sortable: true,
      render: (user: User) => (
        <Link
          to={`/${user?.userType}/update-profile/${user.regId}`}
          className="text-blue-600 font-medium underline underline-offset-2"
        >
          {user.title} {user.fullName}
        </Link>
      ),
    },
    { key: "mobileNo", header: "Contact" },
    { key: "qualificationName", header: "Qualification" },
    { key: "departmentName", header: "Department", sortable: true },
    { key: "sewalocationName", header: "Sewa Location" },
    {
      key: "passEntry",
      header: "Pass Entry",
      render: (user: User) => (user?.passEntry == 1 ? "Yes" : "No"),
    },
    {
      key: "onduty",
      header: "On Duty",
      render: (user: User) => (user?.onduty),
    },
    {
      key: "isPresent",
      header: "Is Present",
      sortable: true,
      render: (user: User) => (user?.isPresent === 1 ? "Yes" : "No"),
    },
    { key: "stateName", header: "State" },
    { key: "cityName", header: "City" },
    {
      key: "certificateDocPath",
      header: "Certificate",
      render: (user: User) =>
        user.certificateDocPath ? (
          <Link
            to={`${import.meta.env?.VITE_API_BASE_URL}${user.certificateDocPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
          >
            View
          </Link>
        ) : (
          <span className="text-gray-400">No File</span>
        ),
    },
    { key: "shifttime", header: "Shift Time", afterStatus: true },
    { key: "email", header: "Email", afterStatus: true },
  ],
  statusColumn: {
    key: "approved",
    render: (user: User) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium  ${user.isDeleted == 1 || user.isDeleted == "1"
          ? "text-red-700"
          : user.isApproved
            ? "text-green-700"
            : "text-red-700"
          }`}
      >
        {user.isDeleted == 1 || user.isDeleted == "1"
          ? "Deleted"
          : user.isApproved
            ? "Approved"
            : "Pending"}
      </span>
    ),
  },
};

// Dummy options for dropdowns (unchanged)
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
    { id: 1, label: "Yes", value: 1 },
    { id: 2, label: "No", value: 0 },
  ],
  IsPresent: [
    { id: 1, label: "Yes", value: 1 },
    { id: 2, label: "No", value: 0 },
  ],
  isAdmin: [
    { id: 1, label: "Yes", value: 1 },
    { id: 2, label: "No", value: 0 },
  ],
  isDelete: [
    { id: 1, label: "Yes", value: 1 },
    { id: 2, label: "No", value: 0 },
  ],
  onDuty: [
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
