import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getDocumentList: builder.query({
      query: ({ title, status }) => ({
        url: `documents?title=${title}&status=${status}`,
        method: "GET",
      }),
      //@ts-ignore
      providesTags: ["GET_DOCUMENT_LIST"],
    }),
    updateDocumentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `documents?id=${id}`,
        method: "PATCH",
        body: { status },
      }),
      //@ts-ignore
      invalidatesTags: ["GET_DOCUMENT_LIST"],
    }),
  }),
});

export const { useGetDocumentListQuery, useUpdateDocumentStatusMutation } =
  documentApi;
