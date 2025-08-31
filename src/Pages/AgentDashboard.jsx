import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import API_BASE_URL from "../apiBase.js";

const empty = { name:"", price:"", type:"", size:"", rooms:"", location:"", image:"", descriptions:"" };

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [mine, setMine] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(()=> {
    if (!user || user.role?.toLowerCase() !== "agent") return;
    const headers = { Authorization: `Bearer ${user.token}` };
    Promise.all([
      axios.get(`${API_BASE_URL}/properties/mine`, { headers }),
      axios.get(`${API_BASE_URL}/appointments/mine`, { headers })
    ]).then(([pRes, aRes])=>{
      setMine(pRes.data.data || []);
      setAppointments(aRes.data.data || []);
    }).catch(()=>{});
  }, [user]);

  const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

  const save = async () => {
    if (editId) {
      const { data } = await axios.put(`https://red1-1-0-0.onrender.com/api/properties/update/${editId}`, form, { headers });
      setMine(mine.map(m => m._id === editId ? data.data : m));
      setEditId(null); setForm(empty);
    } else {
      const { data } = await axios.post("https://red1-1-0-0.onrender.com/api/properties/create", form, { headers });
      setMine([...mine, data.data || data]);
      setForm(empty);
    }
  };

  const del = async (id) => {
    await axios.delete(`https://red1-1-0-0.onrender.com/api/properties/delete/${id}`, { headers });
    setMine(mine.filter(m => m._id !== id));
  };

  const confirmAppointment = async (id, status) => {
    await axios.put(`https://red1-1-0-0.onrender.com/api/appointments/${id}`, { status }, { headers });
    setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">{editId ? "Edit Property" : "Add Property"}</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {["name","type","location","price","size","rooms","image"].map(k=>(
            <input key={k} className="border p-2 rounded" placeholder={k}
              value={form[k]||""}
              onChange={(e)=>setForm({...form, [k]: e.target.value})}/>
          ))}
          <textarea className="border p-2 rounded md:col-span-3" placeholder="description"
            value={form.descriptions} onChange={(e)=>setForm({...form, descriptions:e.target.value})}/>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button onClick={()=>{setEditId(null); setForm(empty);}}
              className="border px-4 py-2 rounded">Cancel</button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">My Listings</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {mine.map(m=>(
          <div key={m._id} className="bg-white rounded shadow p-3">
            <img src={m.image} alt={m.name} className="w-full h-32 object-cover rounded"/>
            <div className="mt-2 font-semibold">{m.name}</div>
            <div className="text-sm text-gray-600">{m.type} • {m.location}</div>
            <div className="text-blue-600 font-bold">${m.price}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>{setEditId(m._id); setForm({
                name:m.name, price:m.price, type:m.type, size:m.size, rooms:m.rooms,
                location:m.location, image:m.image, descriptions: m.descriptions || m.description
              });}}
                className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={()=>del(m._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Appointments</h2>
      <div className="bg-white rounded shadow divide-y">
        {appointments.length===0 && <div className="p-3 text-gray-500">No appointments yet.</div>}
        {appointments.map(a=>(
          <div key={a._id} className="p-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-semibold">{a.user?.name} • {a.user?.email}</div>
              <div className="text-sm text-gray-600">{a.property?.name} • {a.date} {a.time}</div>
              <div className="text-sm">Status: {a.status}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>confirmAppointment(a._id, "Confirmed")} className="border px-3 py-1 rounded">Confirm</button>
              <button onClick={()=>confirmAppointment(a._id, "Cancelled")} className="border px-3 py-1 rounded">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentDashboard;
