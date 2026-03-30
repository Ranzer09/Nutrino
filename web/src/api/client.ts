import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REST_API_ENDPOINT,
  timeout: 12000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Unexpected API error";

    if (error.code === "ECONNABORTED") {
      message = "Request timeout";
    } else if (error.response) {
      message =
        error.response.data?.detail ||
        error.response.data?.message ||
        message;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;