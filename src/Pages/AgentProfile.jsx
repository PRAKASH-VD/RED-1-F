import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const AgentProfile = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    axios.get(`http://localhost:3000/api/agents/${id}`)
      .then(res => setAgent(res.data.data))
      .finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!agent) return <div className="p-6">Agent not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center gap-4">
          <img src={agent.avatar} alt={agent.name}
               className="w-20 h-20 rounded-full object-cover"/>
          <div>
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <p className="text-gray-600">{agent.email} • {agent.phone}</p>
            <p className="text-gray-600">{agent.bio}</p>
          </div>
        </div>
        <h2 className="mt-6 text-xl font-semibold">Properties by {agent.name}</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          {(agent.properties || []).map((p) => (
            <Link key={p._id} to={`/property/${p._id}`} className="border rounded p-3 hover:shadow">
              <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded"/>
              <div className="mt-2 font-semibold">{p.name}</div>
              <div className="text-blue-600">${p.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
