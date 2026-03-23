import axios from "axios";
const directUrl = import.meta.env.VITE_REST_API_ENDPOINT;

console.log(directUrl)
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: directUrl, 
  timeout: 12000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (API_KEY) {
      config.headers['api-key'] = API_KEY;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ??
      error?.response?.data?.message ??
      error?.message ??
      'Unexpected API error';

    return Promise.reject(new Error(message));
  },
);

export default api

