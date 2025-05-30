// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const UserAPI = baseApi.injectEndpoints({
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
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
      }),
    }),
    // createApplication: builder.mutation({
    //   query: (data) => ({
    //     url: `/applications`,
    //     method: "POST",
    //     body: data
    //   }),
    //   invalidatesTags: [{ type: "Application", id: "LIST" }],
    // }),
  }),
//   overrideExisting: false,
});

export const {
  useGetUserByIdQuery,
} = UserAPI;
