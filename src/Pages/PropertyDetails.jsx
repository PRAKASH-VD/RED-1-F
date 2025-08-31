import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import PropertyMap from "../Components/PropertyMap";
import PropertyContact from "../Components/PropertyContact";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    axios.get(`http://localhost:3000/api/properties/byid/${id}`)
      .then(res => setProperty(res.data.data))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return navigate("/login");
    await axios.post("http://localhost:3000/api/cart/add",
      { propertyId: property._id, quantity: 1 },
      { headers: { Authorization: `Bearer ${user.token}` }});
    alert("Added to cart");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!property) return <div className="p-6">Property not found.</div>;

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={property.image} alt={property.name} className="w-full h-80 object-cover rounded"/>
        <div>
          <h1 className="text-3xl font-bold">{property.name}</h1>
          <p className="text-gray-600">{property.type} • {property.location}</p>
          <p className="text-blue-600 font-extrabold text-2xl mt-2">${property.price}</p>
          <p className="mt-3">{property.description}</p>
          <p className="mt-2 text-sm text-gray-600">{property.size} sqft • {property.rooms} rooms</p>

          <button onClick={addToCart}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-8">
        <PropertyMap locationText={property.location} />
      </div>

      <div className="mt-8">
        <PropertyContact propertyId={property._id} />
      </div>
    </div>
  );
};

export default PropertyDetails;
