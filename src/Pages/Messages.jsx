import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";

const Messages = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");

  const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

  useEffect(()=>{
    if (!user) return;
    axios.get("http://localhost:3000/api/messages/threads", { headers })
      .then(res => setThreads(res.data.data || []));
  }, [user]);

  const openThread = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/messages/thread/${id}`, { headers });
    setActive(res.data.data);
  };

  const send = async () => {
    if (!active || !message.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3000/api/messages/thread/${active._id}`, { text: message }, { headers });
      setActive({ ...active, messages: res.data.data.messages });
      setMessage("");
      showToast("Message sent!", "success");
    } catch (err) {
      showToast("Failed to send message", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-4">
      <div className="bg-white rounded shadow p-3">
        <div className="font-semibold mb-2">Conversations</div>
        <div className="divide-y">
          {threads.map(t=>(
            <button key={t._id} onClick={()=>openThread(t._id)} className="w-full text-left py-2 hover:bg-gray-50">
              {t.otherParty?.name || "User"} • {t.lastMessagePreview}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow p-3 md:col-span-2 flex flex-col">
        <div className="font-semibold mb-2">Messages</div>
        <div className="flex-1 overflow-auto border rounded p-3 space-y-2">
          {!active ? <div className="text-gray-500">Select a conversation</div> :
            active.messages.map((m, i)=>(
              <div key={i} className={m.sender === user._id ? "text-right" : ""}>
                <div className="inline-block border rounded px-3 py-2">{m.text}</div>
                <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            ))
          }
        </div>
        {active && (
          <div className="mt-3 flex gap-2">
            <input className="border p-2 rounded flex-1" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Type a message..."/>
            <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
