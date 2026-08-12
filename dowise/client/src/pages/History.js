import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./History.css";

export default function History() {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const loadPlans = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/plans", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlans(data);
    } catch (err) {
      console.error("Failed to load plans history:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Calculations
  const processedPlans = plans.map(p => {
    const totalTasks = p.tasks?.length || 0;
    const completedTasks = p.tasks?.filter(t => t.done).length || 0;
    const isCompleted = p.completed || (totalTasks > 0 && completedTasks === totalTasks);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Started on
    const startedOn = new Date(p.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Completed on (fallback to updatedAt when completed)
    const completedOn = isCompleted
      ? new Date(p.updatedAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : null;

    return {
      ...p,
      totalTasks,
      completedTasks,
      isCompleted,
      progress,
      startedOn,
      completedOn
    };
  });

  const totalCount = processedPlans.length;
  const completedCount = processedPlans.filter(p => p.isCompleted).length;
  const ongoingCount = totalCount - completedCount;

  // Filtered list
  const filteredPlans = processedPlans.filter(p => {
    if (activeTab === "completed") return p.isCompleted;
    if (activeTab === "ongoing") return !p.isCompleted;
    return true;
  });

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="history-title-box">
          <h1 className="history-title">🎓 Learning History</h1>
          <p className="history-subtitle">Track your completed and ongoing learning paths</p>
        </div>
        <Link to="/" className="back-btn-premium">
          ← Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="history-stats-grid">
            <div className="history-stat-card total">
              <span className="history-stat-label">Total Courses</span>
              <span className="history-stat-val">{totalCount}</span>
            </div>
            <div className="history-stat-card completed">
              <span className="history-stat-label">Completed Courses</span>
              <span className="history-stat-val">{completedCount}</span>
            </div>
            <div className="history-stat-card ongoing">
              <span className="history-stat-label">Ongoing Courses</span>
              <span className="history-stat-val">{ongoingCount}</span>
            </div>
          </div>

          {/* Navigation Filter Tabs */}
          <div className="history-tabs">
            <button 
              className={`history-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Courses ({totalCount})
            </button>
            <button 
              className={`history-tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed ({completedCount})
            </button>
            <button 
              className={`history-tab-btn ${activeTab === "ongoing" ? "active" : ""}`}
              onClick={() => setActiveTab("ongoing")}
            >
              Ongoing ({ongoingCount})
            </button>
          </div>

          {/* History List */}
          {filteredPlans.length === 0 ? (
            <div className="history-empty">
              <h3>No courses found</h3>
              <p>There are no courses matching this category.</p>
            </div>
          ) : (
            <div className="history-list">
              {filteredPlans.map(plan => (
                <div key={plan._id} className="history-course-card">
                  <div className="course-card-header">
                    <h3 className="course-title">{plan.rawInput}</h3>
                    <span className={`course-badge ${plan.isCompleted ? "completed" : "ongoing"}`}>
                      {plan.isCompleted ? "Completed" : "Ongoing"}
                    </span>
                  </div>

                  <div className="course-details-grid">
                    <div className="course-detail-item">
                      <span className="course-detail-label">Started On</span>
                      <span className="course-detail-value">{plan.startedOn}</span>
                    </div>
                    {plan.isCompleted && (
                      <div className="course-detail-item">
                        <span className="course-detail-label">Completed On</span>
                        <span className="course-detail-value">{plan.completedOn}</span>
                      </div>
                    )}
                    <div className="course-detail-item">
                      <span className="course-detail-label">Total Tasks</span>
                      <span className="course-detail-value">{plan.totalTasks}</span>
                    </div>
                    <div className="course-detail-item">
                      <span className="course-detail-label">Goal Target</span>
                      <span className="course-detail-value">{plan.goal}</span>
                    </div>
                  </div>

                  <div className="course-progress-container">
                    <div className="course-progress-meta">
                      <span>Course Progress</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <div className="course-progress-bar">
                      <div 
                        className={`course-progress-fill ${plan.isCompleted ? "completed" : "ongoing"}`}
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
