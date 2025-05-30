import { baseApi } from "./BaseAPI";

export const PaymentAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayOSPayment: builder.mutation({
      query: (data) => ({
        url: "/payments/payos/create",
        method: "POST",
        body: data
      }),
    }),
    getPayOSPayment: builder.query({
      query: ({ code, orderCode, status }) => ({
        url: "/payments/payos/return",
        params: { code, orderCode, status },
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreatePayOSPaymentMutation,
  useGetPayOSPaymentQuery,
  useLazyGetPayOSPaymentQuery,
} = PaymentAPI; 