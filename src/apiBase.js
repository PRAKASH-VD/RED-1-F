import axios from "axios";

const api = axios.create({
  baseURL: "", // Use relative path, do not hardcode secret URL
  withCredentials: true,
});

export default api;
