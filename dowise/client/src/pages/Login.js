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
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ paddingRight: "40px", width: "100%" }}
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{ color: "var(--text-secondary)" }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
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
        
        <div className="oauth-divider" style={{ 
          margin: "20px 0", 
          textAlign: "center", 
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span style={{ 
            background: "var(--bg-primary)", 
            padding: "0 10px", 
            color: "var(--text-secondary)", 
            fontSize: "14px",
            zIndex: 1
          }}>or</span>
          <div style={{ 
            position: "absolute", 
            top: "50%", 
            left: 0, 
            right: 0, 
            height: "1px", 
            background: "var(--gray-200)", 
            zIndex: 0 
          }}></div>
        </div>

        <a href="http://localhost:5000/api/auth/google" className="google-btn" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          width: "100%",
          padding: "12px",
          background: "#ffffff",
          border: "1px solid #dadce0",
          borderRadius: "6px",
          color: "#3c4043",
          fontFamily: "Roboto, arial, sans-serif",
          fontSize: "15px",
          fontWeight: "500",
          textDecoration: "none",
          cursor: "pointer",
          transition: "background-color .218s, border-color .218s, box-shadow .218s",
          boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
          e.currentTarget.style.borderColor = "#d2e3fc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ffffff";
          e.currentTarget.style.borderColor = "#dadce0";
        }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </a>

        <div className="form-footer" style={{ marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link to="/signup" className="form-footer-link">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}