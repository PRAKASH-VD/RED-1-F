import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/ToastContext";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cartItems: cart, setCartItems, fetchCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user]);

  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.property.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cart]);

  const updateQuantity = async (propertyId, change) => {
    const item = cart.find((i) => i.property._id === propertyId);
    if (!item || item.quantity + change < 1) return;

    await axios.put(
      `https://red1-1-0-0.onrender.com/api/cart/update/${propertyId}`,
      { change }
    );

    fetchCart();
    showToast("Cart updated", "success");
  };

  const removeFromCart = async (propertyId) => {
    await axios.delete(
      `https://red1-1-0-0.onrender.com/api/cart/remove/${propertyId}`
    );

    fetchCart();
    showToast("Item removed", "success");
  };

  const placeBooking = async () => {
    if (cart.length === 0) return;

    await axios.post(
      "https://red1-1-0-0.onrender.com/api/booking/create",
      { cartItems: cart }
    );

    setCartItems([]);
    navigate("/booking");
    showToast("Booking placed successfully", "success");
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center">Cart is empty</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cart.map((item) => (
              <div key={item.property._id} className="border p-4 rounded">
                <h2 className="font-semibold">{item.property.name}</h2>
                <p>${item.property.price}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.property._id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.property._id, 1)}>
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.property._id)}
                  className="mt-3 text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <h2 className="text-xl font-bold">Total: ${totalPrice}</h2>
            <button
              onClick={placeBooking}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
            >
              Place Booking
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
