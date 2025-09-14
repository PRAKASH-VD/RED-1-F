import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { useToast } from "../Context/ToastContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup
    .string()
    .required("Contact No is required")
    .matches(/^[0-9]{10,15}$/, "Contact No must be 10-15 digits"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  role: yup.string().required("Role is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      age: "",
      role: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("https://red1-1-0-0.onrender.com/api/auth/register", data);
      showToast("Registration Successful! Please proceed to login.", "success");
      navigate("/login");
    } catch (error) {
      // Show backend error message if available
      const msg = error?.response?.data?.message || "Error in Registering User";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-6 sm:p-8 md:p-10 w-full max-w-md md:max-w-lg border border-white/40"
        noValidate
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>
  {/* Toast notifications are now used for errors/success */}
        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full p-2 sm:p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
          {...register("name")}
        />
        {errors.name && (
          <div className="text-red-500 text-sm mb-2">{errors.name.message}</div>
        )}
        <input
          type="email"
          placeholder="Enter Your Email"
          className="w-full p-2 sm:p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
          {...register("email")}
        />
        {errors.email && (
          <div className="text-red-500 text-sm mb-2">{errors.email.message}</div>
        )}
        <input
          type="text"
          placeholder="Enter Your Contact No"
          className="w-full p-2 sm:p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
          {...register("phone")}
        />
        {errors.phone && (
          <div className="text-red-500 text-sm mb-2">{errors.phone.message}</div>
        )}
        <input
          type="number"
          placeholder="Enter Your Age"
          className="w-full p-2 sm:p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
          {...register("age")}
        />
        {errors.age && (
          <div className="text-red-500 text-sm mb-2">{errors.age.message}</div>
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            className="w-full p-2 sm:p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg pr-10"
            {...register("password")}
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
          <div className="text-red-500 text-sm mb-2">{errors.password.message}</div>
        )}

        <label className="block text-sm text-gray-600 mb-2">
          Register as
        </label>
        <select
          {...register("role")}
          className="w-full p-2 sm:p-3 mb-2 border border-gray-300 rounded-lg text-base sm:text-lg"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="user">User</option>
        </select>
        {errors.role && (
          <div className="text-red-500 text-sm mb-2">{errors.role.message}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition duration-300 text-base sm:text-lg"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Register"}
        </button>

        <p className="text-center text-sm sm:text-base text-gray-600 mt-4">
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