import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToast();

  if (!user) return <div className="p-6">No user data.</div>;

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "success");
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="space-y-2">
        <div><span className="font-semibold">Name:</span> {user.name || '-'}</div>
        <div><span className="font-semibold">Age:</span> {user.age || '-'}</div>
        <div><span className="font-semibold">Gmail:</span> {user.email || '-'}</div>
        <div><span className="font-semibold">Role:</span> {user.role || '-'}</div>
        <div><span className="font-semibold">Contact No:</span> {user.phone || user.contactNo || '-'}</div>
      </div>

      <div className="mt-6">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  );
};

export default Profile;
