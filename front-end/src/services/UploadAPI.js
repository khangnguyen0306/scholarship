import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config/config";




export const uploadApi = createApi({
  reducerPath: "uploadManagement",
  baseQuery: fetchBaseQuery({ baseUrl: BE_API_LOCAL }),
  endpoints: (builder) => ({


    uploadFile: builder.mutation({
      query: (formData) => ({
        url: `upload/local-upload`,
        method: "POST",
        body: formData,
      }),
    }),

    uploadFileCloudinary: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `upload/`,
          body: body,
        }
      },
    }),

    getFile: builder.mutation({
      query: ({ fileUrl, originalName }) => {
        const urlParts = fileUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        return {
          method: "GET",
          url: `upload/local-file/${filename}`,
          params: {
            originalName: originalName,
          },
          responseHandler: (response) => response.blob(),
        };
      },
    }),
    // resetPassword: builder.mutation({
    //   query: ({ email, newPassword}) => {
    //     return {
    //       method: "POST",
    //       url: `forgot-password/change-password/${email}?resetToken=${token}`,
    //       body: { new_password: newPassword, confirm_password: newPassword },
    //     };
    //   },
    // }),
    // changePassword: builder.mutation({
    //   query: ({ email, newPassword, oldPassword }) => {
    //     return {
    //       method: "POST",
    //       url: `users/change-password`,
    //       body: { email, newPassword, oldPassword },
    //     };
    //   },
    // }),
    // // refreshToken: builder.mutation({
    // //   query: ({ refreshToken }) => ({
    // //     url: `users/refresh-token`,
    // //     method: "POST",
    // //     body: { refreshToken: refreshToken }, // pass the refresh token in the body
    // //   }),
    // // }),
    // verifyEmail: builder.mutation({
    //   query: ( token ) => ({
    //     url: `users/verify-email/${token}`,
    //     method: "GET",
    //   }),
    // }),
    // forgotPassword: builder.mutation({
    //   query: (email) => ({
    //     url: `users/forgot-password`,
    //     method: "POST",
    //     body: { email },
    //   }),
    // }),
    // registerMentor: builder.mutation({
    //   query: (body) => ({
    //     url: `users/register-mentor`,
    //     method: "POST",
    //     body,
    //   }),
    // }),

  
  }),
});

export const {
  useUploadFileMutation,
  useUploadFileCloudinaryMutation,
  useGetFileMutation,

} = uploadApi;
