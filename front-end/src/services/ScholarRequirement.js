// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const ScholarshipRequirementAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScholarshipRequirements: builder.query({
      query: ({ search, nationality, schoolId, gpa, ielts, sat, toeic } = {}) => ({
        url: "/scholarship-requirements",
        params: { search, nationality, schoolId, gpa, ielts, sat, toeic }
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "ScholarshipRequirement", _id }))
          : [{ type: "ScholarshipRequirement", _id: "LIST" }],
    }),
    getScholarshipRequirementsById: builder.query({
      query: (id) => ({
        url: `/scholarship-requirements/${id}`,
      }),
    }),
    createScholarshipRequirements: builder.mutation({
      query: (data) => ({
        url: `/scholarship-requirements`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "ScholarshipRequirement", id: "LIST" }],
    }),
    updateScholarshipRequirements: builder.mutation({
      query: (data) => ({
        url: `scholarship-requirements/${data.id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: [{ type: "ScholarshipRequirement", id: "LIST" }],
    }),
    deleteScholarshipRequirements: builder.mutation({
      query: (id) => ({
        url: `scholarship-requirements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ScholarshipRequirement", id: "LIST" }],
    }),
  }),
//   overrideExisting: false,
});

export const {
  useGetScholarshipRequirementsQuery,
  useLazyGetScholarshipRequirementsQuery,
  useGetScholarshipRequirementsByIdQuery,
  useLazyGetScholarshipRequirementsByIdQuery,
  useCreateScholarshipRequirementsMutation,
  useUpdateScholarshipRequirementsMutation,
  useDeleteScholarshipRequirementsMutation,
} = ScholarshipRequirementAPI;
