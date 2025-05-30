// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const ScholarshipAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScholarships: builder.query({
      query: ({ search, nationality, schoolId, gpa, ielts, sat, toeic }) => ({
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
  useGetScholarshipsQuery,
  useLazyGetScholarshipsQuery,
  useGetScholarshipByIdQuery,
  useLazyGetScholarshipByIdQuery,
} = ScholarshipAPI;
