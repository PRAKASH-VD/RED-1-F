import axios from "axios";

const api = axios.create({
  baseURL: "https://red1-1-0-0.onrender.com/api",
  withCredentials: true,
});

export default api;

