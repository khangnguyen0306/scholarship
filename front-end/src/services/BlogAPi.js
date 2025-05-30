// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const BlogAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all blogs
    getBlogs: builder.query({
      query: () => ({
        url: "/blogs"
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "Blog", _id }))
          : [{ type: "Blog", _id: "LIST" }],
    }),

    // Get blog by ID
    getBlogById: builder.query({
      query: (id) => ({
        url: `/blogs/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Create new blog
    createBlog: builder.mutation({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),

    // Update blog
    updateBlog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),

    // Delete blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Blog", id }],
    }),
  }),
//   overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = BlogAPI;
