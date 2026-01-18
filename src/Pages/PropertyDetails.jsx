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
import DOMPurify from "../utils/sanitize";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Appointment states
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch property
  useEffect(() => {
    setError("");
    api
      .get(`/properties/byid/${id}`)
      .then((res) => setProperty(res.data.data))
      .catch(() => {
        setError("Failed to load property details.");
        showToast("Failed to load property details.", "error");
      })
      .finally(() => setLoading(false));
  }, [id, showToast]);

  // Add to cart
  const addToCart = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post("/cart/add", {
        propertyId: property._id,
        quantity: 1,
      });
      showToast("Added to cart!", "success");
    } catch {
      showToast("Failed to add to cart", "error");
    }
  };

  // ✅ CREATE APPOINTMENT (CRITICAL FIX)
  const bookAppointment = async (e) => {
    e.preventDefault();

    if (!user) return navigate("/login");

    if (!scheduledAt) {
      showToast("Please select date and time", "error");
      return;
    }

    try {
      setBookingLoading(true);

      await api.post("/appointments", {
        propertyId: property._id,
        scheduledAt,
        notes,
      });

      showToast("Appointment booked successfully", "success");
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      showToast("Failed to book appointment", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton height={320} />
          <Skeleton height={320} />
        </div>
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} />;
  if (!property) return <ErrorMessage message="Property not found." />;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto">
      {/* PROPERTY DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-60 sm:h-80 object-cover rounded-lg shadow"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {property.name}
            </h1>
            <p className="text-gray-600">
              {property.type} • {property.location}
            </p>
            <p className="text-blue-600 font-extrabold text-xl mt-2">
              ${property.price}
            </p>

            <p
              className="mt-3 text-base"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(property.description),
              }}
            />

            <p className="mt-2 text-sm text-gray-600">
              {property.size} sqft • {property.rooms} rooms
            </p>
          </div>

          <button
            onClick={addToCart}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* BOOK APPOINTMENT (NEW) */}
      <div className="mt-10 p-6 bg-white shadow rounded-lg max-w-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Book Appointment
        </h2>

        <form onSubmit={bookAppointment} className="space-y-4">
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={bookingLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {bookingLoading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>

      {/* MAP */}
      <div className="mt-8">
        <PropertyMap properties={[property]} />
      </div>

      {/* CONTACT */}
      <div className="mt-8">
        <PropertyContact propertyId={property._id} />
      </div>
    </div>
  );
};

export default PropertyDetails;
