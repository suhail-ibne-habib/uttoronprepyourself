import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Request failed"
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(Object.assign(error, { message: getApiError(error) }));
  },
);

export default api;
