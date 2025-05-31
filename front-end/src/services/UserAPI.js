// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const UserAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users/all",
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "User", _id }))
          : [{ type: "User", _id: "LIST" }],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/users/update-profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),

    editUser: builder.mutation({
      query: (data) => ({
        url: `/users/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: `/users`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/block`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
  //   overrideExisting: false,
});

export const {
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useEditUserMutation,
  useCreateUserMutation,
  useBlockUserMutation,
} = UserAPI;
