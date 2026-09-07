// src/api.js

const API_URL = process.env.REACT_APP_API_URL;

// Prevent multiple refresh requests at the same time
let isRefreshing = false;
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Refresh token expired or invalid");
      }

      return true;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};



export const apiFetch = async (url, options = {}) => {
  const requestOptions = {
    ...options,
    credentials: "include",
  };

  let response = await fetch(url, requestOptions);

  // Don't try to refresh while logging out
  const isLogoutRequest = url.includes("/auth/logout");

  if (response.status === 401 && !isLogoutRequest) {
    try {
      await refreshAccessToken();

      response = await fetch(url, requestOptions);
    } catch (error) {
      console.error("Token refresh failed:", error);

      localStorage.removeItem("user");
      window.location.href = "/login";

      throw error;
    }
  }

  return response;
};