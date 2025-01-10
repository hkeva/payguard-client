import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getPaymentList: builder.query({
      query: ({ title, status, amount }) => ({
        url: `payments?title=${title}&status=${status}&amount=${amount}`,
        method: "GET",
      }),
      //@ts-ignore
      providesTags: ["GET_PAYMENT_LIST"],
    }),
    updatePaymentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `payments?id=${id}`,
        method: "PATCH",
        body: { status },
      }),
      //@ts-ignore
      invalidatesTags: ["GET_PAYMENT_LIST"],
    }),
  }),
});

export const { useGetPaymentListQuery, useUpdatePaymentStatusMutation } =
  paymentApi;
