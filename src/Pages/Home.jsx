import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties  ] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    //fetch properties
    axios
      .get("http://localhost:3000/api/properties/getproperties")
      .then((res) => setProperties(res.data.data || []))
      .catch((err) => console.log("Unable to retrieve", err));

    //fetch cart (only if user logged in)
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
        return;
      }
      axios
        .get("http://localhost:3000/api/cart/view", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setCartItems(res.data.data.items || []))
        .catch((err) => console.log("Unable to retrieve cart", err));
    }
  }, [user, navigate]);

  //Add to cart
  const addToCart = async (propertyId) => {
    if (!user) {
      alert("Please login to add items to the cart");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    await axios
      .post(
        "http://localhost:3000/api/cart/add",
        { propertyId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        setCartItems([...cartItems, { property: { _id: propertyId } }]);
      })
      .catch(() => alert("Error in adding items to cart"));
  };

  //Remove from cart

  const removeFromCart = async (propertyId) => {
    await axios
      .delete(`http://localhost:3000/api/cart/remove/${propertyId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {
        setCartItems(
          cartItems.filter((item) => item.property._id !== propertyId)
        );
      })
      .catch(() => alert("Error in removing items to cart"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from=[#f8fafc] to-[#e2e8f0] px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        Explore Our <span className="text-blue-600">Properties</span>
      </h1>
      {properties.length === 0 ? (
        <p className="text-center text-gray-600">No Properties Available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((property) => {
            const inCart = cartItems.some(
              (item) => item.property._id === property._id
            );
            return (
              <div key={property._id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between transition-transform hover:scale-105 "
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{property.name}</h2>
                  <p className="text-blue-600 font-bold mt-1">${property.price}</p>
                  <p className="text-sm text-gray-500 mt-2">{property.description}</p>
                </div>
                {inCart ? (
                  <button onClick={() => removeFromCart(property._id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button onClick={() => addToCart(property._id)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
                    Add to cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;