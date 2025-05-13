import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: ({ name, email, page, limit }) => ({
        url: `users?name=${name}&email=${email}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    getUserById: builder.query({
      query: ({ userId }) => ({
        url: `users/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserListQuery, useGetUserByIdQuery } = userApi;
