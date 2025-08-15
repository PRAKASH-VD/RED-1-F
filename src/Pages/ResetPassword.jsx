import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(`http://localhost:3000/api/auth/reset-password/${id}/${token}`, {
        password,
      });
      setMessage("Password reset successful! You can now login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Reset Password
        </button>
        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;