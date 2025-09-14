import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { FaShoppingCart, FaRegCalendarAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";
  const isAgent = role === "agent";
  const isUser = role === "user" || role === "customer";

  // Dummy notifications (replace with API later)
  const notifications = [
    { id: 1, text: "New property listed near you!" },
    { id: 2, text: "Your appointment has been confirmed." },
    { id: 3, text: "Agent updated property details." },
  ];
  const unreadCount = notifications.length;

  // User avatar initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16 flex items-center px-2 sm:px-4 md:px-6">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-bold text-blue-600 flex items-center gap-2"
        >
          <span role="img" aria-label="house">
            🏠
          </span>{" "}
          REAL ESTATE
        </Link>

        {/* Hamburger button (mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none ml-2"
          aria-label="Toggle menu"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Menu items */}
        <div
          className={`$${
            isOpen ? "block space-y-3 mt-4" : "hidden"
          } md:flex md:space-x-6 md:space-y-0 items-center text-gray-700 font-medium bg-white md:bg-transparent absolute md:static top-16 left-0 w-full md:w-auto px-4 md:px-0 py-4 md:py-0 shadow md:shadow-none z-40`}
        >
          <Link to="/" className="hover:text-blue-600 transition duration-300">
            Home
          </Link>

          {/* Admin Routes */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hover:text-blue-600 transition duration-300"
            >
              Admin Panel
            </Link>
          )}

          {/* Agent Routes */}
          {isAgent && (
            <>
              <Link to="/agent" className="hover:text-blue-600 transition duration-300">
                Dashboard
              </Link>
              <Link to="/agent/appointments" className="hover:text-blue-600 transition duration-300">
                Appointments
              </Link>
            </>
          )}

          {/* User Routes */}
          {isUser && (
            <>
              <Link
                to="/cart"
                className="hover:text-blue-600 transition duration-300 flex items-center gap-1"
              >
                <FaShoppingCart style={{ fontSize: '1.2em', lineHeight: 1 }} />
                <span>Cart</span>
              </Link>
              <Link
                to="/booking"
                className="hover:text-blue-600 transition duration-300 flex items-center gap-1"
              >
                <FaRegCalendarAlt style={{ fontSize: '1.2em', lineHeight: 1 }} />
                <span>Booking</span>
              </Link>
              <Link
                to="/appointments"
                className="hover:text-blue-600 transition duration-300"
              >
                Appointments
              </Link>
            </>
          )}

          {/* Auth Buttons / Profile Dropdown */}
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-4 relative mt-2 md:mt-0">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative text-gray-600 hover:text-blue-600 focus:outline-none text-xl"
                  aria-label="Notifications"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 md:right-12 mt-2 w-64 bg-white rounded-md shadow-lg z-50 py-2 border">
                    <p className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                      Notifications
                    </p>
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <p
                          key={n.id}
                          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                          {n.text}
                        </p>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-400">
                        No new notifications
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar Dropdown */}
              <div
                  className="relative inline-block text-left"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white font-bold focus:outline-none text-base sm:text-lg"
                    aria-label="User menu"
                  >
                    {getInitials(user?.name || "User")}
                  </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-2 border">
                    <p className="px-4 py-2 text-sm text-gray-600 border-b">
                      {user?.name || "User"} <br />
                      <span className="text-xs text-gray-400 capitalize">
                        {role}
                      </span>
                    </p>
                    
                    {/* Role-specific dashboard */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {isAgent && (
                      <Link
                        to="/agent"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Agent Dashboard
                      </Link>
                    )}
                    {isUser && (
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-600 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
