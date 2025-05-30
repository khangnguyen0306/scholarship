// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const SchoolAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchools: builder.query({
      query: ({ search, nationality }) => ({
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
  useGetSchoolsQuery,
  useLazyGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useLazyGetSchoolByIdQuery,
} = SchoolAPI;
