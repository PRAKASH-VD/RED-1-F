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
        "https://red1-1-0-0.onrender.com/api/booking/success",
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
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successfull</h1>
      <p className="mt-2">Your Booking has placed successfully...</p>
      <p className="mt-2">Redirecting to bookings....</p>
    </div>
  );
};

export default Success;