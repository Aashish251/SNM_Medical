import { baseApi } from "@shared/api/baseApi";
import { GetUserProfileResponse } from "../type";

type UpdateProfileResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export const UpdateProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation<UpdateProfileResponse, { id: string | number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/user/update-profile/${id}`,
        method: "PUT",
        body: formData,
        headers: {
          "x-is-form-data": "true",
        },
      }),
    }),
    getUserDetailsQuery: builder.query<GetUserProfileResponse, number>({
      keepUnusedDataFor: 0,
      query: (id) => ({
        url: `/api/user/update-profile/${id}`,
        method: "GET",
      }),
      providesTags: ["UserDetails"],
    }),
  }),
  overrideExisting: false,
});

export const { useUpdateUserProfileMutation, useGetUserDetailsQueryQuery } =
  UpdateProfileApi;

export const useRegisterUserMutation = useUpdateUserProfileMutation;
