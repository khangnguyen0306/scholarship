// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const ScholarshipAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScholarships: builder.query({
      query: ({ search, nationality, schoolId, gpa, ielts, sat, toeic } = {}) => ({
        url: "/scholarships",
        params: { search, nationality, schoolId, gpa, ielts, sat, toeic }
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "Scholarship", _id }))
          : [{ type: "Scholarship", _id: "LIST" }],
    }),
    getScholarshipById: builder.query({
      query: (id) => ({
        url: `/scholarships/${id}`,
      }),
    }),
    createScholarship: builder.mutation({
      query: (data) => ({
        url: `scholarships`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Scholarship", id: "LIST" }],
    }),
    updateScholarship: builder.mutation({
      query: (data) => ({
        url: `scholarships/${data.id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: [{ type: "Scholarship", id: "LIST" }],
    }),
    deleteScholarship: builder.mutation({
      query: (id) => ({
        url: `scholarships/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Scholarship", id: "LIST" }],
    }),
  }),
//   overrideExisting: false,
});

export const {
  useGetScholarshipsQuery,
  useLazyGetScholarshipsQuery,
  useGetScholarshipByIdQuery,
  useLazyGetScholarshipByIdQuery,
  useCreateScholarshipMutation,
  useUpdateScholarshipMutation,
  useDeleteScholarshipMutation,
} = ScholarshipAPI;
