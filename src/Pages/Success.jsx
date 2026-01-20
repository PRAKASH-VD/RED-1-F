import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Success = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    //mark booking as paid in backend
    axios
      .post(
        "http://localhost:3000/api/booking/success",
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        setTimeout(() => {
          navigate("/booking");
        }, 3000);
      })
      .catch((err) => console.log(err));
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
        <p className="mt-2 text-gray-700">Your booking has been placed successfully.</p>
        <p className="mt-2 text-gray-500">Redirecting to bookings...</p>
      </div>
    </div>
  );
};

export default Success;