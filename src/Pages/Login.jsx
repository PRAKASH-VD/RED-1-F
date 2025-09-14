import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import Spinner from "../Components/Spinner";
import ErrorMessage from "../Components/ErrorMessage";
import { useToast } from "../Context/ToastContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("https://red1-1-0-0.onrender.com/api/auth/login", {
        email,
        password,
      });
      // If backend returns only token/role, fetch full profile after login
      let userData = { ...res.data };
      if (!userData.name || !userData.age || !userData.phone) {
        // Try to fetch profile (adjust endpoint as needed)
        try {
          const profileRes = await axios.get("https://red1-1-0-0.onrender.com/api/auth/profile", {
            headers: { Authorization: `Bearer ${userData.token}` },
          });
          userData = { ...userData, ...profileRes.data };
        } catch (profileErr) {
          // Profile fetch failed, fallback to login data
        }
      }
      login(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      showToast("Login successful!", "success");
      navigate(userData.role?.toLowerCase() === "admin" ? "/admin" : "/");
    } catch (error) {
      setError("Invalid Credentials");
      const msg = error?.response?.data?.message || "Invalid Credentials";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Validation state
  const [errors, setErrors] = useState({});

  // Email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSubmitWithValidation}
        className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-10 w-full max-w-md border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back!
        </h2>
        {error && <ErrorMessage message={error} />}
        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <div className="text-red-500 text-sm mb-2">{errors.email}</div>
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.password && (
          <div className="text-red-500 text-sm mb-2">{errors.password}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </a>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline font-medium"
          >
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
