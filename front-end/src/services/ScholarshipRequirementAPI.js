// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const ScholarshipRequirementAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getScholarships: builder.query({
    //   query: ({ search, nationality, schoolId }) => ({
    //     url: "/scholarships",
    //     params: { search, nationality, schoolId }
    //   }),
    //   providesTags: (result) =>
    //     result
    //       ? result.data.map(({ _id }) => ({ type: "Scholarship", _id }))
    //       : [{ type: "Scholarship", _id: "LIST" }],
    // }),
    getScholarshipRequirements: builder.query({
      query: (id) => ({
        url: `/scholarship-requirements/${id}`,
      }),
    }),
    // createDateNofitication: builder.mutation({
    //   query: (data) => ({
    //     url: `configs/update/${data.configId}`,
    //     method: "POST",
    //     body: {
    //       key: data.key,
    //       value: data.value
    //     }
    //   }),
    //   invalidatesTags: [{ type: "Config", id: "LIST" }],
    // }),
  }),
//   overrideExisting: false,
});

export const {
  useGetScholarshipRequirementsQuery,
  useLazyGetScholarshipRequirementsQuery,
} = ScholarshipRequirementAPI;
