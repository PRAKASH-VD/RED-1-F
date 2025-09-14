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
      .get("http://localhost:3000/api/properties/getproperties", { params: filters })
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-2 sm:px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-8 md:mb-10">
        Explore Our <span className="text-blue-600">Properties</span>
      </h1>
      <div className="max-w-6xl mx-auto">
        <PropertyFilters onChange={setFilters} />
        {visible.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">No Properties match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 mt-6">
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
    </div>
  );
};

export default Home;