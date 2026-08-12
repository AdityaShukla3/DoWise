// src/pages/Login.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { fadeIn, scaleIn, textReveal, shake } from "../utils/animations";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveSession } = useAuth();
  const nav = useNavigate();
  
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    // Animate card entrance
    if (cardRef.current) {
      scaleIn(cardRef.current, { delay: 0.2 });
    }
    
    // Animate logo
    if (logoRef.current) {
      textReveal(logoRef.current, { duration: 1.2, delay: 0.4 });
    }
    
    // Animate form
    if (formRef.current) {
      fadeIn(formRef.current, { delay: 0.6 });
    }
  }, []);

  useEffect(() => {
    // Shake animation on error
    if (error && errorRef.current) {
      shake(errorRef.current);
    }
  }, [error]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      saveSession(data.user, data.token);
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card fade-in" ref={cardRef}>
        <div className="login-header">
          <h1 className="login-logo" ref={logoRef}>DoWise</h1>
          <p className="login-subtitle">Welcome back! Sign in to continue your learning journey.</p>
        </div>
        
        <form className="login-form" ref={formRef} onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="form-error" ref={errorRef}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <button
            type="submit"
            className={`form-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ marginRight: "8px" }}></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="form-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="form-footer-link">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}
