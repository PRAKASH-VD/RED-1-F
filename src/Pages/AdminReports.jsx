import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

const AdminReports = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ users:0, agents:0, properties:0, bookings:0, inquiries:0 });

  useEffect(()=> {
    const headers = { Authorization: `Bearer ${user.token}` };
    axios.get("http://localhost:3000/api/admin/stats", { headers })
      .then(res => setStats(res.data.data || {}))
      .catch(()=>{});
  }, [user]);

  const card = (title, value) => (
    <div className="bg-white rounded shadow p-6 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-gray-600 mt-1">{title}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Reports</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {card("Total Users", stats.users)}
        {card("Total Agents", stats.agents)}
        {card("Properties", stats.properties)}
        {card("Bookings", stats.bookings)}
        {card("Inquiries", stats.inquiries)}
      </div>
    </div>
  );
};

export default AdminReports;
