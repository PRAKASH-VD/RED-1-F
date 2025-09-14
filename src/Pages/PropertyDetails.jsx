import api from "../api";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";
import PropertyMap from "../Components/PropertyMap";
import PropertyContact from "../Components/PropertyContact";
import Spinner from "../Components/Spinner";
import Skeleton from "../Components/Skeleton";
import ErrorMessage from "../Components/ErrorMessage";
import DOMPurify from '../utils/sanitize';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(()=> {
    setError("");
    api.get(`/properties/byid/${id}`)
      .then(res => setProperty(res.data.data))
      .catch((err)=>{
        setError("Failed to load property details.");
        showToast("Failed to load property details.", "error");
      })
      .finally(()=>setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post("/cart/add",
        { propertyId: property._id, quantity: 1 });
      showToast("Added to cart!", "success");
    } catch (err) {
      showToast("Failed to add to cart", "error");
    }
  };

  if (loading) return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton height={320} className="w-full mb-4" />
        <div>
          <Skeleton height={32} width="60%" className="mb-2" />
          <Skeleton height={20} width="40%" className="mb-2" />
          <Skeleton height={28} width="30%" className="mb-4" />
          <Skeleton height={16} width="100%" className="mb-2" />
          <Skeleton height={16} width="80%" className="mb-2" />
          <Skeleton height={40} width="120px" className="mt-4" />
        </div>
      </div>
      <div className="mt-8">
        <Skeleton height={200} />
      </div>
    </div>
  );
  if (error) return <ErrorMessage message={error} />;
  if (!property) return <ErrorMessage message="Property not found." />;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={property.image} alt={property.name} className="w-full h-60 sm:h-80 object-cover rounded-lg shadow"/>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.name}</h1>
            <p className="text-gray-600 text-base sm:text-lg mb-1">{property.type} • {property.location}</p>
            <p className="text-blue-600 font-extrabold text-xl sm:text-2xl mt-2 mb-2">${property.price}</p>
            <p className="mt-3 text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(property.description) }} />
            <p className="mt-2 text-sm text-gray-600">{property.size} sqft • {property.rooms} rooms</p>
          </div>
          <button onClick={addToCart}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto">
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-8">
        <PropertyMap properties={[property]} />
      </div>

      <div className="mt-8">
        <PropertyContact propertyId={property._id} />
      </div>
    </div>
  );
};

export default PropertyDetails;
