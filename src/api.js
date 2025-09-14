import axios from 'axios';

const api = axios.create({
  baseURL: 'https://red1-1-0-0.onrender.com/api',
});

// Add a request interceptor to include token if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
