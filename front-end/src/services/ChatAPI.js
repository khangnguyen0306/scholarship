// ConfigAPI.js

import { baseApi } from "./BaseAPI";


export const ChatAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all chat rooms
    getChatRooms: builder.query({
      query: () => ({
        url: "/chat-rooms"
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "ChatRoom", _id }))
          : [{ type: "ChatRoom", _id: "LIST" }],
    }),

    // Get chat room by ID
    getChatRoomById: builder.query({
      query: (id) => ({
        url: `/chat-rooms/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "ChatRoom", id }],
    }),

    // Get chat inbox
    getChatInbox: builder.query({
      query: (id) => ({
        url: `/chat-rooms/${id}/messages`,
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ _id }) => ({ type: "Message", _id }))
          : [{ type: "Message", _id: "LIST" }],
    }),
    
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/chat-rooms/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Message", id }],
    }),

    // Create new chat room
    createChatRoom: builder.mutation({
      query: (data) => ({
        url: "/chat-rooms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ChatRoom", id: "LIST" }],
    }),

    // Update chat room
    updateChatRoom: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/chat-rooms/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ChatRoom", id }],
    }),

    // Delete blog
    deleteChatRoom: builder.mutation({
      query: (id) => ({
        url: `/chat-rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "ChatRoom", id }],
    }),
  }),
//   overrideExisting: false,
});

export const {
  useGetChatRoomsQuery,
  useGetChatRoomByIdQuery,
  useCreateChatRoomMutation,
  useUpdateChatRoomMutation,
  useDeleteChatRoomMutation,
  useLazyGetChatRoomsQuery,
  useLazyGetChatRoomByIdQuery,  
  useGetChatInboxQuery,
  useLazyGetChatInboxQuery,
  useMarkAsReadMutation,

} = ChatAPI;
