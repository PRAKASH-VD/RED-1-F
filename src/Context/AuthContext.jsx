import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const logoutTimer = useRef(null);

  // Helper: Check if JWT is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return true;
      // exp is in seconds, Date.now() in ms
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Helper: Set auto-logout timer for token expiry
  const setAutoLogout = (token) => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return;
      const expiresIn = decoded.exp * 1000 - Date.now();
      if (expiresIn > 0) {
        logoutTimer.current = setTimeout(() => {
          logout();
        }, expiresIn);
      }
    } catch {}
  };

  // Call backend refresh token endpoint
  const refreshToken = async () => {
    // Check expiry before attempting refresh
    if (user?.token && isTokenExpired(user.token)) {
      logout();
      return null;
    }
    try {
      const res = await axios.post("/api/auth/refresh-token", { refreshToken: user?.refreshToken }, { withCredentials: true });
      
      const token = res.data.token;
      if (user) {
        const updatedUser = { ...user, token };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return token;
    } catch (error) {
      console.error("Refresh token error:", error?.response || error);
      logout();
      return null;
    }
  };

  // On app load, check token expiry and logout if expired. Also set auto-logout timer.
  useEffect(() => {
    if (user?.token && isTokenExpired(user.token)) {
      logout();
    } else if (user?.token) {
      setAutoLogout(user.token);
    } else if (!user) {
      refreshToken();
    }
    // Cleanup timer on unmount
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [user]);

  // Setup axios interceptors to attach token and retry on 401 once
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      // Check token expiry before each request
      if (user?.token) {
        if (isTokenExpired(user.token)) {
          logout();
          return Promise.reject(new Error("Token expired"));
        }
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setAutoLogout(userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
