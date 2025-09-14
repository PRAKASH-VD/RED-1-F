import React, { lazy, Suspense, useContext, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Spinner from "./Components/Spinner";
import { AuthContext } from "./Context/AuthContext";

const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Cart = lazy(() => import("./Pages/Cart"));
const Booking = lazy(() => import("./Pages/Booking"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const Success = lazy(() => import("./Pages/Success"));
const Cancel = lazy(() => import("./Pages/Cancel"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const PropertyDetails = lazy(() => import("./Pages/PropertyDetails"));
const AgentProfile = lazy(() => import("./Pages/AgentProfile"));
const AgentDashboard = lazy(() => import("./Pages/AgentDashboard"));
const Messages = lazy(() => import("./Pages/Messages"));
const AdminReports = lazy(() => import("./Pages/AdminReports"));
const CustomerAppointments = lazy(() => import("./Pages/CustomerAppointments"));
const AgentAppointments = lazy(() => import("./Pages/AgentAppointments"));
const Profile = lazy(() => import("./Pages/Profile"));
const PropertyComparison = lazy(() => import("./Pages/PropertyComparison"));

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
        <Suspense fallback={<Spinner />}>
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
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
