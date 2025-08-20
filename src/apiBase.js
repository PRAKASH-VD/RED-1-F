import axios from "axios";

const baseURL = import.meta?.env?.VITE_API_BASE_URL || "https://red1-1-0-0.onrender.com/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
