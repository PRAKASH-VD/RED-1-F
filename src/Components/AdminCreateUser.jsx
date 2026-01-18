import api from "../api";
import { useState } from "react";

const AdminCreateUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });

  const submit = async () => {
    await api.post("/auth/register-role", form);
    alert("User created");
  };

  return (
    <>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})} />
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})} />
      <input placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})} />

      <select onChange={e=>setForm({...form,role:e.target.value})}>
        <option value="agent">Agent</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={submit}>Create User</button>
    </>
  );
};

export default AdminCreateUser;
