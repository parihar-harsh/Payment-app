import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("payment_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && sessionStorage.getItem("payment_token")) {
      window.dispatchEvent(new Event("payment:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export const getApiError = (error, fallback = "Something went wrong") => {
  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. Try again.";
  }

  if (!error.response) {
    return "Unable to reach the server. Check that the backend is running.";
  }

  return error.response.data?.error?.message
    || error.response.data?.message
    || fallback;
};

export default api;
