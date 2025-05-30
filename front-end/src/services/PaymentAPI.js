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
  }),
});

export const {
  useCreatePayOSPaymentMutation,
} = PaymentAPI; 