// Centralized API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Export it for reuse
export default API_BASE_URL;
