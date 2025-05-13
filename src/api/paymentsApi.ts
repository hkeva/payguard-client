import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getPaymentList: builder.query({
      query: ({ title, status, amount, page, limit }) => ({
        url: `payments?title=${title}&status=${status}&amount=${amount}&page=${page}&limit=${limit}`,
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
    createPayment: builder.mutation({
      query: (details: { title: string; amount: string }) => ({
        url: "stripe-payment",
        method: "POST",
        body: details,
      }),
      //@ts-ignore
      invalidatesTags: ["GET_PAYMENT_LIST_BY_USER"],
    }),
    // get payments by useId
    getPaymentByUser: builder.query({
      query: ({ userId }) => ({
        url: `payments/${userId}`,
        method: "GET",
      }),
      //@ts-ignore
      providesTags: ["GET_PAYMENT_LIST_BY_USER"],
    }),

    deletePayment: builder.mutation({
      query: ({ id }) => ({
        url: `payments?id=${id}`,
        method: "DELETE",
      }),
      //@ts-ignore
      invalidatesTags: ["GET_PAYMENT_LIST"],
    }),
  }),
});

export const {
  useGetPaymentListQuery,
  useUpdatePaymentStatusMutation,
  useCreatePaymentMutation,
  useGetPaymentByUserQuery,
  useDeletePaymentMutation,
} = paymentApi;
