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
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({
          property: propertyId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
        }),
      });
      if (res.ok) {
        showToast("Inquiry sent! You will receive an email confirmation.", "success");
        setStatus("Inquiry sent! You will receive an email confirmation.");
        setData({
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          message: "",
          preferredDate: "",
          preferredTime: "",
        });
      } else {
        showToast("Failed to send inquiry.", "error");
        setStatus("Failed to send inquiry.");
      }
    } catch (err) {
      showToast("Error sending inquiry.", "error");
      setStatus("Error sending inquiry.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4">
      <h3 className="text-xl font-semibold mb-3">
        Contact Agent / Schedule Viewing
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Your Name"
          required
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          required
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Phone"
          required
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={data.preferredDate}
          onChange={(e) => setData({ ...data, preferredDate: e.target.value })}
        />
        <input
          type="time"
          className="border p-2 rounded"
          value={data.preferredTime}
          onChange={(e) => setData({ ...data, preferredTime: e.target.value })}
        />
        <textarea
          className="border p-2 rounded md:col-span-2"
          rows="3"
          placeholder="Message"
          required   
          value={data.message}
          onChange={(e) => setData({ ...data, message: e.target.value })}
        />
      </div>
      <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
        Send
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </form>
  );
};

export default PropertyContact;
