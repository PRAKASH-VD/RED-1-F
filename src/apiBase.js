import axios from "axios";

// Do NOT embed secret host here. Use relative requests by default.
// If you need a remote base at runtime, populate window.__API_BASE_URL before app loads.
const baseURL = ""; // empty = relative origin. Avoid using import.meta.env here to prevent baking secrets into the bundle.

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
