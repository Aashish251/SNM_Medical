import { TableConfig } from "@shared/components/DataTable/DataTable";
import { Button } from "@shared/components/ui/button";
import { Link } from "react-router-dom";

export interface User {
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
  approved: boolean;
  certificate: string;
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
      key: "name",
      header: "Name",
      sortable: true,
      render: (user: User) => (
        <Link
          to={`/admin/update-profile/${user.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
        >
          {user.name}
        </Link>
      ),
    },
    { key: "contact", header: "Contact" },
    { key: "qualification", header: "Qualification" },
    { key: "sewaLocation", header: "Sewa Location" },
    { key: "shiftTime", header: "Shift Time" },
    { key: "department", header: "Department", sortable: true },
    { key: "email", header: "Email" },
    { key: "birthdate", header: "Birthdate", sortable: true },
    { key: "passEntry", header: "Pass Entry" },
    { key: "isPresent", header: "Is Present" },
    { key: "sewaLocation", header: "Sewa Location" },
    {
      key: "certificate",
      header: "Certificate",
      render: (user: User) => <span>View</span>,
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
