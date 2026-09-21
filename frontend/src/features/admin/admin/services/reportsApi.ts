import { baseApi } from "@shared/api/baseApi";

// Metadata types
export interface AvailableDate {
  date: string;
  count: number;
  label: string;
}

export interface ReportMetadata {
  availableDates: AvailableDate[];
  departments: Array<{ id: number; name: string }>;
  locations: Array<{ id: number; name: string }>;
  summary: {
    totalRecords: number;
    totalDates: number;
    totalDepartments: number;
    totalLocations: number;
    latestDate: string;
  };
}

export interface ReportMetadataResponse {
  success: boolean;
  message: string;
  data: ReportMetadata;
  timestamp?: string;
}

// Registration Report API types
export interface RegistrationReportQueryParams {
  dates?: string;
  date1?: string;
  date2?: string;
  date3?: string;
  title?: string;
  includeEmpty?: boolean | string;
  includeRecords?: boolean | string;
}

export interface RegistrationReportRow {
  departmentId: number;
  department: string;
  values: Record<string, number>;
  total: number;
}

export interface RegistrationRecordDetail {
  id: number;
  fullName: string;
  mobileNo: string;
  gender?: string;
  department: string;
  location: string;
  createdAt: string;
}

export interface RegistrationReportData {
  title: string;
  dates: string[];
  columns: Array<{ key: string; label: string }>;
  rows: RegistrationReportRow[];
  totals: {
    byDate: Record<string, number>;
    grandTotal: number;
  };
  records?: RegistrationRecordDetail[];
  generatedAt: string;
}

export interface RegistrationReportResponse {
  success: boolean;
  message: string;
  data: RegistrationReportData;
  timestamp?: string;
}

// Daily Report API types
export interface DailyReportQueryParams {
  date?: string;
  title?: string;
  departments?: string;
  locations?: string;
  includeEmpty?: boolean | string;
}

export interface DailyReportRow {
  department: string;
  values: Record<string, number>;
  total: number;
}

export interface DailyReportData {
  title: string;
  date: string;
  dateLabel: string;
  reportTitle: string;
  columns: Array<{ key: string; label: string }>;
  rows: DailyReportRow[];
  totals: {
    byLocation: Record<string, number>;
    grandTotal: number;
  };
  generatedAt: string;
}

export interface DailyReportResponse {
  success: boolean;
  message: string;
  data: DailyReportData;
  timestamp?: string;
}

// Master Report API types
export interface MasterReportQueryParams {
  dates?: string;
  date1?: string;
  date2?: string;
  date3?: string;
  locations?: string;
  title?: string;
  includeEmpty?: boolean | string;
}

export interface MasterReportDateWiseItem {
  date: string;
  label: string;
  rows: Array<{ label: string; opd: number; ipd: number; total: number }>;
  totals: { opd: number; ipd: number; total: number };
}

export interface MasterReportLocationWiseItem {
  location: string;
  rows: Array<{ date: string; label: string; opd: number; ipd: number; total: number }>;
  totals: { opd: number; ipd: number; total: number };
}

export interface MasterReportData {
  title: string;
  dates: string[];
  columns: Array<{ key: string; label: string }>;
  locations: string[];
  dateWise: MasterReportDateWiseItem[];
  locationWise: MasterReportLocationWiseItem[];
  totals: { opd: number; ipd: number; total: number };
  generatedAt: string;
}

export interface MasterReportResponse {
  success: boolean;
  message: string;
  data: MasterReportData;
  timestamp?: string;
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportMetadata: builder.query<ReportMetadataResponse, void>({
      query: () => ({
        url: "/api/reports/metadata",
        method: "GET",
      }),
      providesTags: [{ type: "Reports", id: "METADATA" }],
    }),

    getRegistrationReport: builder.query<
      RegistrationReportResponse,
      RegistrationReportQueryParams | void
    >({
      query: (params) => {
        const p = (params || {}) as RegistrationReportQueryParams;
        const queryParams = new URLSearchParams();

        if (p.dates) queryParams.set("dates", p.dates);
        if (p.date1) queryParams.set("date1", p.date1);
        if (p.date2) queryParams.set("date2", p.date2);
        if (p.date3) queryParams.set("date3", p.date3);
        if (p.title) queryParams.set("title", p.title);
        if (p.includeEmpty !== undefined) {
          queryParams.set("includeEmpty", String(p.includeEmpty));
        }
        if (p.includeRecords !== undefined) {
          queryParams.set("includeRecords", String(p.includeRecords));
        }

        const queryString = queryParams.toString();
        return {
          url: queryString ? `/api/reports/registration?${queryString}` : "/api/reports/registration",
          method: "GET",
        };
      },
      providesTags: [{ type: "Reports", id: "REGISTRATION" }],
    }),

    getDailyReport: builder.query<
      DailyReportResponse,
      DailyReportQueryParams | void
    >({
      query: (params) => {
        const p = (params || {}) as DailyReportQueryParams;
        const queryParams = new URLSearchParams();

        if (p.date) queryParams.set("date", p.date);
        if (p.title) queryParams.set("title", p.title);
        if (p.departments) queryParams.set("departments", p.departments);
        if (p.locations) queryParams.set("locations", p.locations);
        if (p.includeEmpty !== undefined) {
          queryParams.set("includeEmpty", String(p.includeEmpty));
        }

        const queryString = queryParams.toString();
        return {
          url: queryString ? `/api/reports/daily?${queryString}` : "/api/reports/daily",
          method: "GET",
        };
      },
      providesTags: [{ type: "Reports", id: "DAILY" }],
    }),

    getMasterReport: builder.query<
      MasterReportResponse,
      MasterReportQueryParams | void
    >({
      query: (params) => {
        const p = (params || {}) as MasterReportQueryParams;
        const queryParams = new URLSearchParams();
        if (p.dates) queryParams.set("dates", p.dates);
        if (p.date1) queryParams.set("date1", p.date1);
        if (p.date2) queryParams.set("date2", p.date2);
        if (p.date3) queryParams.set("date3", p.date3);
        if (p.locations) queryParams.set("locations", p.locations);
        if (p.title) queryParams.set("title", p.title);
        if (p.includeEmpty !== undefined) {
          queryParams.set("includeEmpty", String(p.includeEmpty));
        }

        const queryString = queryParams.toString();
        return {
          url: queryString ? `/api/reports/master?${queryString}` : "/api/reports/master",
          method: "GET",
        };
      },
      providesTags: [{ type: "Reports", id: "MASTER" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReportMetadataQuery,
  useGetRegistrationReportQuery,
  useGetDailyReportQuery,
  useGetMasterReportQuery,
} = reportsApi;
