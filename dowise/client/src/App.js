// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";
import Revision from "./pages/Revision";
import QuickQuiz from "./pages/QuickQuiz";
import AnimatedRoute from "./components/AnimatedRoute";
import { fadeIn, pageTransition } from "./utils/animations";
import "./App.css";

function Nav({ theme, toggleTheme }) {
  const { user, logout, token } = useAuth();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      fadeIn(navRef.current, { duration: 0.5 });
    }
    if (logoRef.current) {
      fadeIn(logoRef.current, { delay: 0.2 });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user && token && showProfileMenu) {
      axios.get("/api/plans", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const plans = res.data || [];
          const count = plans.filter(p => p.tasks && p.tasks.length > 0 && p.tasks.every(t => t.done)).length;
          setCompletedCount(count);
        })
        .catch(() => {});
    }
  }, [user, token, showProfileMenu]);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
  };

  return (
    <nav className="nav" ref={navRef}>
      <Link to="/" className="nav-logo" ref={logoRef}>DoWise</Link>
      <div className="nav-links">
        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? (
          <div className="profile-menu-container" ref={profileMenuRef}>
            <button 
              className="profile-avatar-btn" 
              onClick={() => setShowProfileMenu(prev => !prev)}
              title="User Menu"
            >
              <span className="profile-avatar-initials">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "US"}
              </span>
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  <span className="profile-dropdown-name">{user.name}</span>
                  <span className="profile-dropdown-email">{user.email || `${user.username || 'user'}@dowise.com`}</span>
                </div>
                <div className="profile-dropdown-divider"></div>
                <Link 
                  to="/history" 
                  onClick={() => setShowProfileMenu(false)}
                  className="profile-dropdown-item history-item"
                >
                  <span className="history-item-title">📋 History</span>
                  <span className="history-item-desc">Completed: <strong>{completedCount} plan{completedCount !== 1 ? 's' : ''}</strong></span>
                </Link>
                <div className="profile-dropdown-divider"></div>
                <button onClick={handleLogout} className="profile-dropdown-item logout-item">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/signup" className="nav-button primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function OAuthSuccess() {
  const { saveSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        
        const user = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role || "user"
        };
        
        saveSession(user, token);
        navigate("/");
      } catch (err) {
        console.error("OAuth token parsing failed:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [location, saveSession, navigate]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "80vh",
      fontSize: "18px",
      fontWeight: "600",
      color: "var(--text-secondary)"
    }}>
      🔄 Setting up your Google session...
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Nav theme={theme} toggleTheme={toggleTheme} />
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <Dashboard />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <History />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/revision/:planId"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <Revision />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/quick-quiz/:topic"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <QuickQuiz />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AnimatedRoute>
                  <Login />
                </AnimatedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AnimatedRoute>
                  <Signup />
                </AnimatedRoute>
              }
            />
            <Route
              path="/oauth-success"
              element={<OAuthSuccess />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
