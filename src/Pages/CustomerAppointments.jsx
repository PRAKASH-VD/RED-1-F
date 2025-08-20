// src/pages/CustomerAppointments.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import API_BASE_URL from "../apiBase.js"; 


const CustomerAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/appointments/mine`, { withCredentials: true });
        if (res.data.status !== "success") {
          throw new Error("Failed to fetch appointments");
        }
        setAppointments(res.data.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchAppointments();
    }
  }, [user]);

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        My Appointments
      </h2>

      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className="p-4 border rounded-md shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg font-semibold">
                Property: {appt.property?.title || "N/A"}
              </p>
              <p className="text-gray-600">
                Date: {new Date(appt.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Time: {appt.time}
              </p>
              <p className="text-gray-600">
                Agent: {appt.agent?.name || "N/A"}
              </p>
              <p className={`font-semibold ${appt.status === "confirmed" ? "text-green-600" : "text-yellow-600"}`}>
                Status: {appt.status}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You have no appointments booked yet.</p>
      )}
    </div>
  );
};

export default CustomerAppointments;
