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
    // getScholarshipById: builder.query({
    //   query: (id) => ({
    //     url: `/scholarships/${id}`,
    //   }),
    // }),
    // createScholarship: builder.mutation({
    //   query: (data) => ({
    //     url: `scholarships`,
    //     method: "POST",
    //     body: data
    //   }),
    //   invalidatesTags: [{ type: "Scholarship", id: "LIST" }],
    // }),
    // updateScholarship: builder.mutation({
    //   query: (data) => ({
    //     url: `scholarships/${data.id}`,
    //     method: "PUT",
    //     body: data
    //   }),
    //   invalidatesTags: [{ type: "Scholarship", id: "LIST" }],
    // }),
    // deleteScholarship: builder.mutation({
    //   query: (id) => ({
    //     url: `scholarships/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [{ type: "Scholarship", id: "LIST" }],
    // }),
  }),
//   overrideExisting: false,
});

export const {
  useGetScholarshipRequirementsQuery,
  useLazyGetScholarshipRequirementsQuery,
  // useGetScholarshipByIdQuery,
  // useLazyGetScholarshipByIdQuery,
  // useCreateScholarshipMutation,
  // useUpdateScholarshipMutation,
  // useDeleteScholarshipMutation,
} = ScholarshipRequirementAPI;
