import axios from "axios";

// Use the production API URL when provided by Vite,
// otherwise use the local backend during development
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// Create a shared Axios instance for all API requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the JWT to authenticated requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  // Attach the token only when the user is logged in
  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;