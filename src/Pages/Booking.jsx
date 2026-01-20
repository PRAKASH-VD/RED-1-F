import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/ToastContext";

const Booking = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }
    axios
      .get("https://red1-1-0-0.onrender.com/api/booking/mybookings", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        const fetchedBookings = res.data.data || [];
        setBookings(fetchedBookings);
        setLoading(false);

        let combinedItems = [];
        let total = 0;
        fetchedBookings.forEach((booking) => {
          combinedItems = [...combinedItems, ...booking.properties];
          total += booking.totalPrice;
        });
        setAllItems(combinedItems);
        setTotalAmount(total);
      })
      .catch((err) => {
        console.log(err);
        showToast("Error in fetching bookings", "error");
        setLoading(false);
      });
  }, [user, navigate]);

  const proceedToPayment = async () => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }
    await axios
      .post(
        "https://red1-1-0-0.onrender.com/api/payments/checkout",
        {
          items: allItems,
          amount: totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((res) => {
        showToast("Redirecting to payment...", "success");
        window.location.href = res.data.url;
      })
      .catch((err) => {
        console.log(err);
        showToast("Error in processing payment", "error");
      });
  };

  const handleBooking = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ propertyId }),
      });
      if (res.ok) {
        alert("Booking successful!");
      } else {
        alert("Booking failed.");
      }
    } catch {
      alert("Error booking property.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-2 sm:px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Your Bookings
      </h1>
      {loading ? (
        <p className="text-center mt-8">Loading Bookings....</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No bookings placed yet.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              return (
                <div
                  key={booking._id}
                  className="bg-white shadow-md rounded-lg p-4 sm:p-5 mb-6 flex flex-col justify-between h-full"
                >
                  <div>
                    <h2 className="text-base sm:text-xl font-semibold mb-2">
                      Booking Id:{" "}
                      <span className="text-blue-500 break-all">{booking._id}</span>
                    </h2>
                    <p>
                      <strong>Status:</strong>
                      <span className="text-yellow-500 ml-1">{booking.status}</span>
                    </p>
                    <p>
                      <strong>Total Price:</strong>
                      <span className="text-green-500 ml-1">${booking.totalPrice}</span>
                    </p>
                    <h3 className="text-sm sm:text-lg font-semibold mt-4 mb-2">🛍️Items:</h3>
                    {(booking.properties ?? []).map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="border rounded p-2 mb-2 flex justify-between items-center text-xs sm:text-base"
                        >
                          <span>{item?.property?.name || "Property Not Found"}</span>
                          <span>
                            {item?.property?.price || 0} ❌ {item.quantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {bookings.some((booking) => booking.status === "Pending") && (
            <button
              onClick={proceedToPayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow mt-4 mb-4 transition"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Booking;