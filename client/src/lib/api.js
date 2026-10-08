import axios from "axios";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${apiOrigin}/api`,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

function errorText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return errorText(value.message) || errorText(value.code);
  return String(value);
}

export function getApiError(error) {
  return (
    errorText(error?.response?.data?.message) ||
    errorText(error?.response?.data?.error) ||
    errorText(error?.message) ||
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
