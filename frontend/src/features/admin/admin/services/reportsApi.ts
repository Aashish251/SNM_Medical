import { baseApi } from "@shared/api/baseApi";

// Registration Report API types
export interface RegistrationReportQueryParams {
  dates?: string;
  date1?: string;
  date2?: string;
  date3?: string;
  title?: string;
  includeEmpty?: boolean | string;
}

export interface RegistrationReportRow {
  departmentId: number;
  department: string;
  values: Record<string, number>;
  total: number;
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
    getRegistrationReport: builder.query<
      RegistrationReportResponse,
      RegistrationReportQueryParams | void
    >({
      query: (params) => {
        const p = (params || {}) as RegistrationReportQueryParams;
        const today = new Date().toISOString().slice(0, 10);
        const queryParams = new URLSearchParams();

        const datesParam = p.dates || p.date1 || today;
        queryParams.set("dates", datesParam);
        if (p.title) queryParams.set("title", p.title);
        if (p.includeEmpty !== undefined) {
          queryParams.set("includeEmpty", String(p.includeEmpty));
        }

        return {
          url: `/api/reports/registration?${queryParams.toString()}`,
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
        const today = new Date().toISOString().slice(0, 10);
        const queryParams = new URLSearchParams();

        const dateParam = p.date || today;
        queryParams.set("date", dateParam);
        if (p.title) queryParams.set("title", p.title);
        if (p.departments) queryParams.set("departments", p.departments);
        if (p.locations) queryParams.set("locations", p.locations);
        if (p.includeEmpty !== undefined) {
          queryParams.set("includeEmpty", String(p.includeEmpty));
        }

        return {
          url: `/api/reports/daily?${queryParams.toString()}`,
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
  useGetRegistrationReportQuery,
  useGetDailyReportQuery,
  useGetMasterReportQuery,
} = reportsApi;
