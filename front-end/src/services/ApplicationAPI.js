// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const ApplicationAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getCertificates: builder.query({
    //   query: ({ search, nationality, schoolId }) => ({
    //     url: "/certificates",
    //     params: { search, nationality, schoolId }
    //   }),
    //   providesTags: (result) =>
    //     result
    //       ? result.data.map(({ _id }) => ({ type: "Scholarship", _id }))
    //       : [{ type: "Scholarship", _id: "LIST" }],
    // }),
    getApplicationDetail: builder.query({
      query: (id) => ({
        url: `/applications/${id}`,
      }),
    }),
    createApplication: builder.mutation({
      query: (data) => ({
        url: `/applications`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Application", id: "LIST" }],
    }),
    getAllApplications: builder.query({
      query: () => ({
        url: '/applications/all',
        method: 'GET',
      }),
      providesTags: [{ type: 'Application', id: 'LIST' }],
    }),
  }),
//   overrideExisting: false,
});

export const {
  useCreateApplicationMutation,
  useGetAllApplicationsQuery,
  useGetApplicationDetailQuery,
} = ApplicationAPI;
