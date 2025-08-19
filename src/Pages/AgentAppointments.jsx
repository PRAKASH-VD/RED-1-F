import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const AgentAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://red1-1-0-0.onrender.com/api/appointments/agent/my",
          { withCredentials: true }
        );
        setAppointments(data.data);
      } catch (error) {
        console.error("Error fetching agent appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role?.toLowerCase() === "agent") {
      fetchAppointments();
    }
  }, [user]);

  if (loading) return <p className="text-center py-6">Loading...</p>;

  if (!appointments.length)
    return <p className="text-center py-6">No appointments assigned yet.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        My Appointments (Agent)
      </h2>

      <div className="grid gap-4">
        {appointments.map((appt) => (
          <div
            key={appt._id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Property: {appt.property?.title || "N/A"}
            </h3>
            <p className="text-gray-600">
              <span className="font-medium">Customer:</span>{" "}
              {appt.user?.name} ({appt.user?.email})
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span>{" "}
              {new Date(appt.scheduledAt).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Notes:</span>{" "}
              {appt.notes || "N/A"}
            </p>
            <p
              className={`mt-2 font-medium ${
                appt.status === "Approved"
                  ? "text-green-600"
                  : appt.status === "Cancelled"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              Status: {appt.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentAppointments;
