import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../Components/PropertyCard";
import PropertyFilters from "../Components/PropertyFilters";


const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties  ] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    //fetch properties
    axios
      .get("https://red1-1-0-0.onrender.com/api/properties/getproperties", { params: filters })
      .then((res) => setProperties(res.data.data || []))
      .catch((err) => console.log("Unable to retrieve", err));

    //fetch cart (only if user logged in)
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
        return;
      }
      axios
        .get("https://red1-1-0-0.onrender.com/api/cart/view", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setCartItems(res.data.data.items || []))
        .catch((err) => console.log("Unable to retrieve cart", err));
    }
  }, [user, navigate, filters]);

  //Add to cart
  const addToCart = async (propertyId) => {
    if (!user) {
      alert("Please login to add items to the cart");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    await axios
      .post(
        "https://red1-1-0-0.onrender.com/api/cart/add",
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
      .delete(`https://red1-1-0-0.onrender.com/api/cart/remove/${propertyId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {
        setCartItems(
          cartItems.filter((item) => item.property._id !== propertyId)
        );
      })
      .catch(() => alert("Error in removing items to cart"));
  };

// client-side fallback filter (if backend isn’t ready):
const visible = properties.filter(p => {
  const q = (filters.q || "").toLowerCase();
  const matchQ = !q || [p.name, p.description, p.location].some(v => (v||"").toLowerCase().includes(q));
  const matchLoc = !filters.location || (p.location||"").toLowerCase().includes(filters.location.toLowerCase());
  const price = Number(p.price || 0);
  const matchMin = !filters.minPrice || price >= Number(filters.minPrice);
  const matchMax = !filters.maxPrice || price <= Number(filters.maxPrice);
  const matchType = !filters.type || p.type === filters.type;
  const matchRooms = !filters.rooms || Number(p.rooms||0) >= Number(filters.rooms);
  return matchQ && matchLoc && matchMin && matchMax && matchType && matchRooms;
});

  return (
    <div className="min-h-screen bg-gradient-to-br from=[#f8fafc] to-[#e2e8f0] px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        Explore Our <span className="text-blue-600">Properties</span>
      </h1>
       <PropertyFilters onChange={setFilters} />

      {visible.length === 0 ? (
        <p className="text-center text-gray-600">No Properties match your filters.</p>
      ) : (
        // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        //   {properties.map((property) => {
        //     const inCart = cartItems.some(
        //       (item) => item.property._id === property._id
        //     );
        //     return (
        //       <div key={property._id}
        //       className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between transition-transform hover:scale-105 "
        //       >
        //         <div>
        //           <h2 className="text-xl font-semibold text-gray-800">{property.name}</h2>
        //           <p className="text-blue-600 font-bold mt-1">${property.price}</p>
        //           <p className="text-sm text-gray-500 mt-2">{property.description}</p>
        //         </div>
        //         {inCart ? (
        //           <button onClick={() => removeFromCart(property._id)}
        //           className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
        //           >
        //             Remove from Cart
        //           </button>
        //         ) : (
        //           <button onClick={() => addToCart(property._id)}
        //           className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
        //             Add to cart
        //           </button>
        //         )}
        //       </div>
        //     );
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visible.map((property) => {
          const inCart = cartItems.some((item) => item.property._id === property._id);
          return (
            <PropertyCard
              key={property._id}
              property={property}
              inCart={inCart}
              onAdd={() => addToCart(property._id)}
              onRemove={() => removeFromCart(property._id)}
              onView={() => navigate(`/property/${property._id}`)}
            />
          );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;