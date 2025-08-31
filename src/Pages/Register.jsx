import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userData.name || !userData.email || !userData.password) {
      alert("Please fill all fields");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/auth/register", userData);
      alert("Registration Successful please proceed to login");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error in Registering User");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleRegister}
        className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-10 w-full max-w-md border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />

        <label className="block text-sm text-gray-600 mb-2">
          Register as
        </label>
        <select
          value={userData.role}
          onChange={(e) =>
            setUserData({ ...userData, role: e.target.value })
          }
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg"
        >
          <option value="user">User</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;