// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const CertificateAPI = baseApi.injectEndpoints({
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
    getCertificateById: builder.query({
      query: (id) => ({
        url: `/certificate-types/${id}`,
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
  useGetCertificateByIdQuery,
  useLazyGetCertificateByIdQuery,
} = CertificateAPI;
