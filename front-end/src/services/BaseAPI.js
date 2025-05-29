// baseApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BE_API_LOCAL } from '../config/config';
import { message } from 'antd';
import { logOut, selectTokens } from '../slices/authSlice';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BE_API_LOCAL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectTokens(getState());
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQueryWithAuth(args, api, extraOptions);

    if (result.error) {
      const status = result.error.status;

      if (status === 401) {
        // Khi token hết hạn → logout & về login
        api.dispatch(logOut());
        setTimeout(() => {
          // message.error('Phiên đã hết hạn, vui lòng đăng nhập lại!');
          window.location.href = '/login';
        }, 500);
      }
      else if (status === 403) {
        // Khi không tìm thấy → chuyển về trang 404
        setTimeout(() => {
          message.error('Không tìm thấy trang yêu cầu!');
          window.location.href = '/404';
        }, 300);
      }
      else if (status >= 500) {
        // Lỗi server
        // message.error('Lỗi server, vui lòng thử lại sau!');
      }
    }

    return result;
  },
  tagTypes: ['USER'],
  endpoints: () => ({}),
});
