import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";
import api from "../api";

const Profile = () => {
  const { user, login, logout } = useContext(AuthContext);
  const { showToast } = useToast();

  const [avatar, setAvatar] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.data?.name || "",
    age: user?.data?.age || "",
    phone: user?.data?.phone || "",
    email: user?.data?.email || "",
  });

  if (!user) return <div className="p-6">No user data.</div>;

  // 🔹 handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 handle avatar file select
  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  // ✅ CORRECT PROFILE UPDATE
  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("phone", formData.phone);

      if (avatar) {
        data.append("avatar", avatar); // 🔥 CRITICAL
      }

      const res = await api.put("/users/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = {
        ...user,
        data: res.data.data,
      };

      login(updatedUser);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* AVATAR */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            user?.data?.avatar
              ? `https://red1-1-0-0.onrender.com${user.data.avatar}`
              : "/default-avatar.png"
          }
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </div>

      <div className="space-y-4">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <label>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          disabled
          className="w-full border px-4 py-2 rounded bg-gray-100"
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
