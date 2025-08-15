import React, { useContext, useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import Booking from "./Pages/Booking";
import AdminDashboard from "./Admin/AdminDashboard";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
import NotFound from "./Pages/NotFound";
import { AuthContext } from "./Context/AuthContext";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

const App = () => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    console.log("User Data From AuthContext:", user);
  }, [user]);
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/booking" element={<Booking />} />
        <Route
          path="/admin"
          element={
            user && user.role?.toLowerCase() === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
