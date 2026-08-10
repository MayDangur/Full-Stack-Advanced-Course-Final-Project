import axios from "axios";

// Create a shared Axios instance for all API requests
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the JWT to authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Attach the token only when the user is logged in
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;