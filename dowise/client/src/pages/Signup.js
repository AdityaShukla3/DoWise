// src/pages/Signup.js
import React, { useState, useEffect, useRef } from "react";
import { authService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { fadeIn, scaleIn, textReveal, shake } from "../utils/animations";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await authService.signup(name, email, password);
      setSuccess(data.message || "OTP sent to email");
      setOtpSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtpSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { data } = await authService.verifyOtp(email, otp);
      saveSession(data.user, data.token);
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card fade-in" ref={cardRef}>
        <div className="signup-header">
          <h1 className="signup-logo" ref={logoRef}>DoWise</h1>
          <p className="signup-subtitle">
            {otpSent ? "Check your email for the OTP" : "Create your account and start your learning journey today."}
          </p>
        </div>
        
        {!otpSent ? (
          <form className="signup-form" ref={formRef} onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  style={{ paddingRight: "40px", width: "100%" }}
                />
                <button 
                  type="button" 
                  className="password-toggle-btn" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                  style={{ color: "var(--text-secondary)" }}
                >
                  {showConfirmPassword ? (
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
                  Sending OTP...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        ) : (
          <form className="signup-form fade-in" ref={formRef} onSubmit={verifyOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                id="otp"
                type="text"
                className="form-input"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {success && (
              <div className="form-success" style={{ color: "var(--success-color)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                <span>✅</span>
                <span style={{ marginLeft: "0.5rem" }}>{success}</span>
              </div>
            )}
            
            {error && (
              <div className="form-error" ref={errorRef}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <button
                type="submit"
                className={`form-button ${loading ? "loading" : ""}`}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner" style={{ marginRight: "8px" }}></span>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
              
              <button
                type="button"
                className="form-button"
                style={{ flex: 1, backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
                onClick={() => submit()}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
        
        <div className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="form-footer-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
