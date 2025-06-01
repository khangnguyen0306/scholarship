import { baseApi } from "./BaseAPI";

export const CommentAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get comments by blog ID
    getCommentsByBlogId: builder.query({
      query: (blogId) => ({
        url: `/comments/blog/${blogId}`,
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "Comment", _id }))
          : [{ type: "Comment", id: "LIST" }],
    }),

    // Create new comment
    createComment: builder.mutation({
      query: (data) => ({
        url: "/comments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: "Comment", id: "LIST" },
        { type: "Blog", id: blogId },
      ],
    }),

    // Update comment
    updateComment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id, blogId }) => [
        { type: "Comment", id },
        { type: "Blog", id: blogId },
      ],
    }),

    // Delete comment
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id, blogId }) => [
        { type: "Comment", id },
        { type: "Blog", id: blogId },
      ],
    }),
  }),
});

export const {
  useGetCommentsByBlogIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = CommentAPI;
