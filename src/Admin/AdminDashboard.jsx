import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProperty, setNewProperty] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("Access denied ! Redirecting...");
      navigate("/");
      return;
    }

    Promise.all([
      axios.get("http://localhost:3000/api/properties/getproperties", {
        headers: { Authorization: `Bearer ${user.token}` },
      }),
      axios.get("http://localhost:3000/api/booking/allbookings", {
        headers: { Authorization: `Bearer ${user.token}` },
      }),
    ])
      .then(([propertiesRes, bookingRes]) => {
        setProperties(propertiesRes.data.data || []);
        setBookings(bookingRes.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user, navigate]);

  //Adding the property
  const handleAddProperty = async () => {
    await axios
      .post("http://localhost:3000/api/properties/create", newProperty, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setProperties([...properties, res.data]);
        setNewProperty({ name: "", price: "", description: "", stock: "" });
        alert("Properties Added Successfully");
        window.location.reload();
      })
      .catch(() => alert("Error in adding property"));
  };

  //getting details of the property
  const handleEdit = (property) => {
    setEditId(property._id);
    setNewProperty({
      name: property.name,
      price: property.price,
      description: property.description,
      stock: property.stock,
    });
  };

  //edit property
  const handleUpdateProperty = async () => {
    await axios
      .put(`http://localhost:3000/api/properties/update/${editId}`, newProperty, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        const updated = properties.map((p) =>
          p._id === editId ? res.data.data : p
        );
        setProperties(updated);
        setEditId(null);
        setNewProperty({ name: "", price: "", description: "", stock: "" });
        alert("Property Updated");
      })
      .catch(() => alert("Error in Updating property"));
  };

  //delete property
  const handleDeleteProperty = async (id) => {
    if (confirm("Are you you want to delete this property ?")) {
      await axios
        .delete(`http://localhost:3000/api/properties/delete/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then(() => {
          const filtered = properties.filter((p) => p._id !== id);
          setProperties(filtered);
          alert("Property Deleted");
        })
        .catch(() => alert("Failed to delete the property"));
    }
  };

  //update status
  const handleStatusChange = async (bookingId, newStatus) => {
    await axios
      .put(
        `http://localhost:3000/api/booking/update/${bookingId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((res) => {
        const updatedBookings = bookings.map((o) =>
          o._id === bookingId ? res.data.data : o
        );
        setBookings(updatedBookings);
        alert("Booking status Updated");
      })
      .catch(() => alert("Failed to update the booking"));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🔧 Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Add Property Form */}
          <div className="bg-white shadow-md rounded p-5 mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editId ? "✏️ Edit Property" : "➕ Add New Property"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Property Name"
                value={newProperty.name}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, name: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProperty.price}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, price: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Size"
                value={newProperty.size}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, size: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="Rooms"
                value={newProperty.rooms}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, rooms: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="Location"
                value={newProperty.location}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, location: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newProperty.descriptions}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, descriptions: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProperty.image}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, image: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProperty.stock}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, stock: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>

            {editId ? (
              <div className="mt-4">
                <button
                  onClick={handleUpdateProperty}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setNewProperty({
                      name: "",
                      price: "",
                      descriptions: "",
                      stock: "",
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddProperty}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Property
              </button>
            )}
          </div>

          {/* Property List */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Properties
          </h2>
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white p-4 shadow rounded border"
              >
                <h3 className="text-lg font-semibold">{property.name}</h3>
                <p className="text-blue-600 font-bold">${property.price}</p>
                <p className="text-gray-700">{property.descriptions}</p>
                <p className="text-gray-700">Stock: {property.stock}</p>
                <p className="text-gray-700">Size: {property.size}</p>
                <p className="text-gray-700">Rooms: {property.rooms}</p>
                <p className="text-gray-700">Location: {property.location}</p>
                <img
                  src={property.image}
                  alt={property.name}
                  className="mt-2 w-full h-48 object-cover rounded"
                />
                <div className="mt-3">
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* booking */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bookings</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-4 shadow rounded border"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  Booking ID: <span className="text-sm">{booking._id}</span>
                </h3>
                <p className="text-gray-700">Status: {booking.status}</p>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  }
                  className="border p-2 mt-2 rounded w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Booked</option>
                  <option value="Delivered">Buyed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;