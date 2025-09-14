import React, { useState } from "react";
import axios from "axios";
import Spinner from "../Components/Spinner";
import ErrorMessage from "../Components/ErrorMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (error) {
      setError("Error sending reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Validation state
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
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
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Forgot Password</h2>
        {error && <ErrorMessage message={error} />}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <div className="text-red-500 text-sm mb-2">{errors.email}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Send Reset Link"}
        </button>
        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;