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

  // First request
  let response = await fetch(url, requestOptions);

  // If access token expired
  if (response.status === 401) {
    try {
      // Refresh access token
      await refreshAccessToken();

      // Retry original request
      response = await fetch(url, requestOptions);
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Refresh token also expired
      localStorage.removeItem("user");

      window.location.href = "/login";

      throw error;
    }
  }

  return response;
};