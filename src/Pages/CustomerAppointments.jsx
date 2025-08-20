// src/pages/CustomerAppointments.jsx
import { useEffect, useState, useContext } from "react";
import api from "../apiBase.js"; // ✅ axios instance
import { AuthContext } from "../Context/AuthContext";

const CustomerAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/my"); // ✅ matches backend
        setAppointments(res.data.data || []);
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
                Date:{" "}
                {appt.scheduledAt
                  ? new Date(appt.scheduledAt).toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-gray-600">
                Agent: {appt.agent?.name || "N/A"}
              </p>
              <p
                className={`font-semibold ${
                  appt.status === "confirmed"
                    ? "text-green-600"
                    : appt.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Status: {appt.status}
              </p>
              {appt.notes && (
                <p className="text-gray-500">Notes: {appt.notes}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          You have no appointments booked yet.
        </p>
      )}
    </div>
  );
};

export default CustomerAppointments;
