import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ==================== BASE CONFIG ====================
export const api = createApi({
  reducerPath: 'api', // name for the slice in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', // your backend base URL
    prepareHeaders: (headers) => {
      // Include JWT token if available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: ['User', 'Dashboard', 'Registration', 'MasterData'], // for cache invalidation

  endpoints: (builder) => ({
    // ===========================================================
    // AUTHENTICATION
    // ===========================================================
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      queryFn: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        return { data: { success: true, message: 'Logged out' } };
      },
    }),

    // ===========================================================
    // REGISTRATION
    // ===========================================================
    getDropdownData: builder.query({
      query: () => '/registration/dropdown-data',
      providesTags: ['Registration'],
    }),

    getCitiesByState: builder.query({
      query: (stateId) => `/registration/cities/${stateId}`,
    }),

    checkEmailAvailability: builder.mutation({
      query: (email) => ({
        url: '/registration/check-email',
        method: 'POST',
        body: { email },
      }),
    }),

    registerUser: builder.mutation({
      query: (formData) => ({
        url: '/registration/register',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Registration'],
    }),

    // ===========================================================
    // DASHBOARD
    // ===========================================================
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),

    getUserProfile: builder.query({
      query: () => '/dashboard/profile',
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/dashboard/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),

    // Upload profile image (multipart/form-data)
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: '/dashboard/profile/image',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // ===========================================================
    // MASTER DATA
    // ===========================================================
    getStates: builder.query({
      query: () => '/master/states',
      providesTags: ['MasterData'],
    }),

    getCitiesByStateId: builder.query({
      query: (stateId) => `/master/cities/${stateId}`,
      providesTags: ['MasterData'],
    }),

    getDepartments: builder.query({
      query: () => '/master/departments',
      providesTags: ['MasterData'],
    }),

    getQualifications: builder.query({
      query: () => '/master/qualifications',
      providesTags: ['MasterData'],
    }),

    // ===========================================================
    // HEALTH CHECK (optional)
    // ===========================================================
    healthCheck: builder.query({
      query: () => '/health',
    }),
  }),
});

// ==================== AUTO-GENERATED HOOKS ====================
export const {
  useLoginMutation,
  useLogoutMutation,

  useGetDropdownDataQuery,
  useGetCitiesByStateQuery,
  useCheckEmailAvailabilityMutation,
  useRegisterUserMutation,

  useGetDashboardStatsQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadProfileImageMutation,

  useGetStatesQuery,
  useGetCitiesByStateIdQuery,
  useGetDepartmentsQuery,
  useGetQualificationsQuery,

  useHealthCheckQuery,
} = api;
