import React, { useContext, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import PropertyDetails from "./Pages/PropertyDetails";
import AgentProfile from "./Pages/AgentProfile";
import AgentDashboard from "./Pages/AgentDashboard";
import Messages from "./Pages/Messages";
import AdminReports from "./Pages/AdminReports";
import CustomerAppointments from "./Pages/CustomerAppointments";
import AgentAppointments from "./Pages/AgentAppointments";
import Profile from "./Pages/Profile";
import PropertyComparison from "./Pages/PropertyComparison";

const App = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("User Data From AuthContext:", user);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-16 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/appointments" element={<CustomerAppointments />} />

          <Route path="/compare" element={<PropertyComparison />} />
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
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/agent/:id" element={<AgentProfile />} />

          <Route
            path="/agent/appointments"
            element={
              user && user.role?.toLowerCase() === "agent" ? (
                <AgentAppointments />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/agent"
            element={
              user && user.role?.toLowerCase() === "agent" ? (
                <AgentDashboard />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/admin/reports"
            element={
              user && user.role?.toLowerCase() === "admin" ? (
                <AdminReports />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          <Route
            path="/messages"
            element={user ? <Messages /> : <Navigate to={"/login"} />}
          />

          {/* redirect /profile to current user's profile and support /profile/:id */}
          <Route
            path="/profile"
            element={
              user ? (
                <Navigate to={`/profile/${user.id}`} />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route path="/profile/:id" element={<Profile />} />

          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />

          {/* catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
