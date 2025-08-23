// src/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);
export function useAuth() { return useContext(AuthCtx); }

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("dw_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("dw_token") || "");

  function saveSession(u, t) {
    setUser(u); setToken(t);
    localStorage.setItem("dw_user", JSON.stringify(u));
    localStorage.setItem("dw_token", t);
  }
  function logout() {
    setUser(null); setToken("");
    localStorage.removeItem("dw_user");
    localStorage.removeItem("dw_token");
  }

  return <AuthCtx.Provider value={{ user, token, saveSession, logout }}>{children}</AuthCtx.Provider>;
}
