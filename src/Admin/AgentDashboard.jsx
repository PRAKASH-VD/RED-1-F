import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "agent") return;

    const fetchData = async () => {
      try {
        const propRes = await axios.get("http://localhost:3000/api/properties/agent", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProperties(propRes.data.data || []);

        const bookRes = await axios.get("http://localhost:3000/api/booking/agent", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(bookRes.data.data || []);
      } catch (err) {
        alert("Error fetching agent data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || user.role?.toLowerCase() !== "agent") {
    return (
      <div className="text-center mt-10 text-red-500 font-bold">
        Access Denied: Only agents can view this dashboard.
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Agent Dashboard
      </h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Properties</h2>
        {properties.length === 0 ? (
          <p className="text-gray-600">No properties listed yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">{property.name}</h3>
                <p className="text-gray-700 mb-1">Price: ${property.price}</p>
                <p className="text-gray-600">{property.description}</p>
                <p className="text-sm text-gray-500">Stock: {property.stock}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Property</th>
                  <th className="py-2 px-4 border-b">Customer</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="py-2 px-4 border-b">{booking.property?.name}</td>
                    <td className="py-2 px-4 border-b">{booking.user?.name}</td>
                    <td className="py-2 px-4 border-b">{booking.status}</td>
                    <td className="py-2 px-4 border-b">{new Date(booking.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AgentDashboard;