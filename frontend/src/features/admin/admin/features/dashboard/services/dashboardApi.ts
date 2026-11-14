import { baseApi } from "@shared/api/baseApi";

export interface DepartmentStatItem {
  title: string;
  value: number;
  color: string;
  image?: string;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  recentRegistrations: number;
  presentUsers: number;
  usersWithPass: number;
  adminUsers: number;
  medicalStaff: number;
  lastUpdated?: string;
}

export interface DashboardStatsData {
  totalUsers: number;
  recentRegistrations: number;
  stats?: DepartmentStatItem[];
  departmentStats?: DepartmentStatItem[];
  lastUpdated?: string;
  fetchedBy?: number | string;
}

export interface PatientRegistrationItem {
  id: number;
  regnNo: string;
  date?: string;
  patientName: string;
  guardianName?: string;
  age?: number | null;
  gender?: string;
  mobileNumber?: string;
  disease?: string;
  createdAt?: string;
}

export interface PatientListResponse {
  items: PatientRegistrationItem[];
  count: number;
}

export interface BloodDriveItem {
  id?: number;
  organizerName: string;
  address: string;
  landmark?: string;
  driveDate: string;
  startTime: string;
  endTime: string;
  phone?: string;
  email?: string;
  entryType?: string;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSummary: builder.query<{ success: boolean; data: AdminDashboardSummary }, void>({
      query: () => ({
        url: "/api/dashboard/summary",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
      // Keep fresh for 30s
      keepUnusedDataFor: 30,
    }),
    getDashboardStats: builder.query<{ success: boolean; data: DashboardStatsData }, void>({
      query: () => ({
        url: "/api/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
      keepUnusedDataFor: 30,
    }),
    getRecentPatients: builder.query<{ success: boolean; data: PatientListResponse }, void>({
      query: () => ({
        url: "/api/patients",
        method: "GET",
      }),
      providesTags: ["Patients"],
      keepUnusedDataFor: 60,
    }),
    getBloodDrivesList: builder.query<{ success: boolean; data: BloodDriveItem[] | { items: BloodDriveItem[] } }, void>({
      query: () => ({
        url: "/api/community/blood-drives",
        method: "GET",
      }),
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminSummaryQuery,
  useGetDashboardStatsQuery,
  useGetRecentPatientsQuery,
  useGetBloodDrivesListQuery,
  useLazyGetAdminSummaryQuery,
  useLazyGetDashboardStatsQuery,
} = dashboardApi;

