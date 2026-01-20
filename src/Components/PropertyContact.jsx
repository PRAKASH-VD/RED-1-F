import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";

const PropertyContact = ({ propertyId }) => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [data, setData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!propertyId) {
      showToast("Invalid property", "error");
      return;
    }

    try {
      const res = await fetch("https://red1-1-0-0.onrender.com/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token && {
            Authorization: `Bearer ${user.token}`,
          }),
        },
        body: JSON.stringify({
          property: propertyId,
          ...data,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      showToast("Inquiry sent successfully!", "success");

      setData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        message: "",
        preferredDate: "",
        preferredTime: "",
      });

    } catch (error) {
      console.error(error.message);
      showToast(error.message || "Server error", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4">
      <h3 className="text-xl font-semibold mb-3">
        Contact Agent / Schedule Viewing
      </h3>

      <div className="grid md:grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="Name" required
          value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />

        <input className="border p-2 rounded" placeholder="Email" required
          value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />

        <input className="border p-2 rounded" placeholder="Phone"
          value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />

        <input type="date" className="border p-2 rounded"
          value={data.preferredDate} onChange={e => setData({ ...data, preferredDate: e.target.value })} />

        <input type="time" className="border p-2 rounded"
          value={data.preferredTime} onChange={e => setData({ ...data, preferredTime: e.target.value })} />

        <textarea className="border p-2 rounded md:col-span-2" rows="3"
          placeholder="Message" required
          value={data.message} onChange={e => setData({ ...data, message: e.target.value })} />
      </div>

      <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
        Send
      </button>
    </form>
  );
};

export default PropertyContact;
