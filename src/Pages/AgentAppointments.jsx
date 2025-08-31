import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiBase.js";
import { AuthContext } from "../Context/AuthContext";


const AgentAppointments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get(
          "/appointments/agent/my",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        setAppointments(data.data || []);
      } catch (error) {
        console.error("Error fetching agent appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }

    if (user?.role?.toLowerCase() !== "agent") {
      setLoading(false);
      navigate("/");
      return;
    }

    fetchAppointments();
  }, [user, navigate]);

  async function sendBookingEmail(booking) {
    try {
      if (!booking) throw new Error("sendBookingEmail called without booking");

      const propertyId = booking.propertyId || booking.property?._id;
      const recipient = booking.user?.email;
      if (!recipient) throw new Error("Booking has no recipient email");

      const html = `<p>Your booking for property ${propertyId} was received.</p>`;
      await transporter.sendMail({
        to: recipient,
        subject: "Booking confirmation",
        html
      });

      console.log("✅ Email sent successfully");
    } catch (err) {
      console.error("Email sending failed:", err?.message || err);
    }
  }

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
