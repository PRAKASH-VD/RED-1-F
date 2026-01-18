import { useEffect, useState } from "react";
import api from "../api";

const badge = (status) => ({
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
}[status]);

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get("/appointments/mine")
      .then(res => setAppointments(res.data.data || []))
      .catch(console.error);
  }, []);

  const cancel = async (id) => {
    await api.put(`/appointments/cancel/${id}`);
    setAppointments(a =>
      a.map(x => x._id === id ? { ...x, status: "Cancelled" } : x)
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {appointments.map(a => (
        <div key={a._id} className="border p-4 rounded mb-3">
          <div className="font-semibold">{a.property?.name}</div>
          <div>{new Date(a.scheduledAt).toLocaleString()}</div>
          <span className={`inline-block px-3 py-1 rounded ${badge(a.status)}`}>
            {a.status}
          </span>

          {a.status === "Pending" && (
            <button
              onClick={() => cancel(a._id)}
              className="ml-4 text-red-600"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerAppointments;
