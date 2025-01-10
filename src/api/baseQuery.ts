import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.setItem("sessionExpired", "true");
    location.reload();
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        body: JSON.stringify({
          refreshToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data.accessToken;
    } else {
      throw new Error("Invalid token response");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.setItem("sessionExpired", "true");
    location.reload();
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  try {
    const response: any = await baseQuery(args, api, extraOptions);

    if (response.error) {
      if (
        response.error?.status === 401 &&
        response.error?.data?.error === "Unauthorized, invalid token"
      ) {
        try {
          const newAccessToken = await refreshAccessToken();
          const newHeaders = new Headers();
          newHeaders.set("Authorization", `Bearer ${newAccessToken}`);

          return await baseQuery(
            { ...args, headers: newHeaders },
            api,
            extraOptions
          );
        } catch (refreshError: any) {
          return {
            error: {
              message: refreshError.message,
              status: refreshError.status || 500,
            },
          };
        }
      }
    }

    return response;
  } catch (error: any) {
    return { error: { message: error.message, status: error.status || 500 } };
  }
};
