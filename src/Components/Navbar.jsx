import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { FaShoppingCart, FaRegCalendarAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
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
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16 flex items-center px-4">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🏠 REAL ESTATE
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        <div
          className={`${
            isOpen ? "block mt-4 space-y-3" : "hidden"
          } md:flex md:space-x-6 md:space-y-0 items-center absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent px-4 md:px-0 py-4 md:py-0`}
        >
          <Link to="/">Home</Link>

          {isAdmin && <Link to="/admin">Admin Panel</Link>}

          {isAgent && (
            <>
              <Link to="/agent">Dashboard</Link>
              <Link to="/agent/appointments">Appointments</Link>
            </>
          )}

          {isUser && (
            <>
              <Link to="/cart" className="relative flex items-center gap-1">
                <FaShoppingCart />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link to="/booking" className="flex items-center gap-1">
                <FaRegCalendarAlt />
                Booking
              </Link>

              <Link to="/appointments">Appointment's</Link>
            </>
          )}

          

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold"
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded">
                  <Link to="/profile" className="block px-4 py-2">
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
