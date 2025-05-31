// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const SchoolAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchools: builder.query({
      query: ({ search, nationality } = {}) => ({
        url: "/schools",
        params: { search, nationality }
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "School", _id }))
          : [{ type: "School", _id: "LIST" }],
    }),
    getSchoolById: builder.query({
      query: (id) => ({
        url: `/schools/${id}`,
      }),
    }),
    createSchool: builder.mutation({
      query: (data) => ({
        url: `schools`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "School", id: "LIST" }],
    }),
    updateSchool: builder.mutation({
      query: (data) => ({
        url: `schools/${data.id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: [{ type: "School", id: "LIST" }],
    }),
    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `schools/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "School", id: "LIST" }],
    }),
  }),
//   overrideExisting: false,
});

export const {
  useGetSchoolsQuery,
  useLazyGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useLazyGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} = SchoolAPI;
