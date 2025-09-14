import React, { useState } from "react";
import { useToast } from "../Context/ToastContext";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import ErrorMessage from "../Components/ErrorMessage";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await axios.post(`https://red1-1-0-0.onrender.com/api/auth/reset-password/${id}/${token}`, {
        password,
      });
      setMessage("Password reset successful! You can now login.");
      showToast("Password reset successful! You can now login.", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError("Error resetting password. Please try again.");
      const msg = error?.response?.data?.message || "Error resetting password. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Validation state
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSubmit(e);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmitWithValidation}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Reset Password</h2>
        {error && <ErrorMessage message={error} />}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
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
          {loading ? <Spinner /> : "Reset Password"}
        </button>
        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;