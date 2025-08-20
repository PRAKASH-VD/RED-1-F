import axios from "axios";

// Prefer a runtime-injected value (window.__API_BASE_URL) to avoid baking secrets into the bundle.
// Fallback to empty string for relative requests.
const baseURL =
  typeof window !== "undefined" && window.__API_BASE_URL
    ? window.__API_BASE_URL
    : "";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
