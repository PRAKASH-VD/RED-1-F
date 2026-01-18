import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useToast } from "../Context/ToastContext";

const CreateAppointment = ({ propertyId }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scheduledAt) {
      showToast("Please select date & time", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/appointments", {
        propertyId,
        scheduledAt,
        notes,
      });

      showToast("Appointment booked successfully", "success");
      navigate("/appointments"); // go to My Appointments
    } catch (error) {
      console.error(error);
      showToast("Failed to book appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 border rounded space-y-4"
    >
      <h3 className="text-lg font-semibold">Book Appointment</h3>

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
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
};

export default CreateAppointment;
