import { useEffect, useState } from "react";
import api from "../api";

const AgentAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get("/appointments/agent/my")
      .then(res => setAppointments(res.data.data || []));
  }, []);

  const update = async (id, status) => {
    await api.put(`/appointments/agent/${id}`, { status });
    setAppointments(a =>
      a.map(x => x._id === id ? { ...x, status } : x)
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Agent Appointments</h2>

      {appointments.map(a => (
        <div key={a._id} className="border p-4 rounded mb-3">
          <div><b>Customer:</b> {a.user?.name}</div>
          <div><b>Property:</b> {a.property?.name}</div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => update(a._id, "Approved")}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Approve
            </button>
            <button
              onClick={() => update(a._id, "Cancelled")}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentAppointments;
