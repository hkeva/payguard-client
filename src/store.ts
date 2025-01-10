import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { paymentApi } from "./api/paymentsApi";
import { userApi } from "./api/userApi";
import { documentApi } from "./api/documentApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(paymentApi.middleware)
      .concat(userApi.middleware)
      .concat(documentApi.middleware),
});
