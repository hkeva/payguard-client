import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: ({ id, name, email }) => ({
        url: `users?id=${id}&name=${name}&email=${email}`,
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
