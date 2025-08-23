// src/pages/Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const { saveSession } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/signup", { name, email, password });
      saveSession(data.user, data.token);
      nav("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Signup</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Signup</button>
    </form>
  );
}
