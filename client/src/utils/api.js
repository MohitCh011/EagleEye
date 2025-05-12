import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Intercept requests to include authentication token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle 403 errors gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Handle forbidden error, redirect to login or show an error toast
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
