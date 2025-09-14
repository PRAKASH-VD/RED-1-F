import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/ToastContext";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    axios
      .get("https://red1-1-0-0.onrender.com/api/cart/view", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setCart(res.data.data.items || []);
        calculateTotal(res.data.data.items || []);
      })
      .catch((err) => console.log("Unable to retrieve cart", err));
  }, [user, navigate]);

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.property.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const updateQuantity = async (propertyId, change) => {
    if (
      cart.find((item) => item.property._id === propertyId)?.quantity + change <
      1
    )
      return;
    await axios
      .put(
        `https://red1-1-0-0.onrender.com/api/cart/update/${propertyId}`,
        { change },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        const updatedCart = cart.map((item) =>
          item.property._id === propertyId
            ? { ...item, quantity: item.quantity + change }
            : item
        );
        setCart(updatedCart);
        calculateTotal(updatedCart);
        showToast("Cart updated!", "success");
      })
      .catch(() => showToast("Error in updating Quantity", "error"));
  };

  const removeFromCart = async (propertyId) => {
    await axios
      .delete(`https://red1-1-0-0.onrender.com/api/cart/remove/${propertyId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {
        const updatedCart = cart.filter(
          (item) => item.property._id !== propertyId
        );
        setCart(updatedCart);
        calculateTotal(updatedCart);
        showToast("Item removed from cart!", "success");
      })
      .catch(() => showToast("Error in removing items from cart", "error"));
  };

  const placebooking = async () => {
    if (cart.length === 0) {
      showToast("Cart is empty, cannot place booking", "error");
      return;
    }
    await axios
      .post(
        "https://red1-1-0-0.onrender.com/api/booking/create",
        { cartItems: cart },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        showToast("Booking placed successfully!", "success");
        setCart([]);
        navigate("/booking");
      })
      .catch(() => showToast("Error placing booking!", "error"));
  };
  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        🛍️Your Cart
      </h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600 mt-8">Cart is Empty</p>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {cart.map((item) => {
              return (
                <div
                  key={item.property._id}
                  className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between h-full"
                >
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                      {item.property.name}
                    </h2>
                    <p className="text-blue-600 font-bold mt-1">
                      ${item.property.price}
                    </p>
                  </div>
                  <div className="flex items-center mt-3">
                    <button
                      onClick={() => updateQuantity(item.property._id, -1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-l focus:outline-none"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.property._id, 1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-r focus:outline-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => removeFromCart(item.property._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Total Price: ${totalPrice}
            </h2>
            <button
              onClick={placebooking}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded text-base sm:text-lg shadow transition"
            >
              Place Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;