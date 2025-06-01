import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config/config";




export const authApi = createApi({
  reducerPath: "authManagement",
  baseQuery: fetchBaseQuery({ baseUrl: BE_API_LOCAL }),
  endpoints: (builder) => ({


    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: `users/login`,
        method: "POST",
        body: { email, password },
      }),
    }),

    registerUser: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `users/register`,
          body: body,
        }
      },
      invalidatesTags: [{ type: " UserList ", id: " LIST " }],
    }),

    verifyOtp: builder.mutation({
      query: ({ email, otp }) => {
        return {
          method: "POST",
          url: `forgot-password/verify-otp/${email}`,
          body: { otp },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ email, newPassword}) => {
        return {
          method: "POST",
          url: `forgot-password/change-password/${email}?resetToken=${token}`,
          body: { new_password: newPassword, confirm_password: newPassword },
        };
      },
    }),
    changePassword: builder.mutation({
      query: ({ email, newPassword, oldPassword }) => {
        return {
          method: "POST",
          url: `users/change-password`,
          body: { email, newPassword, oldPassword },
        };
      },
    }),
    // refreshToken: builder.mutation({
    //   query: ({ refreshToken }) => ({
    //     url: `users/refresh-token`,
    //     method: "POST",
    //     body: { refreshToken: refreshToken }, // pass the refresh token in the body
    //   }),
    // }),
    verifyEmail: builder.mutation({
      query: ( token ) => ({
        url: `users/verify-email/${token}`,
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `users/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),
    registerMentor: builder.mutation({
      query: (body) => ({
        url: `users/register-mentor`,
        method: "POST",
        body,
      }),
    }),

  
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useRegisterMentorMutation,

  //   useVerifyMailMutation,
  //   useVerifyOtpMutation,
  //   useRefreshTokenMutation,
} = authApi;
