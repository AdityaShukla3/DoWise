// src/components/TechnologyResourcePlanner.js
// AI-Powered Technology Resource Planner Component

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { staggerFadeIn, scrollReveal } from '../utils/animations';
import { useScrollAnimation } from '../utils/useGSAP';
import './TechnologyResourcePlanner.css';

// SVG Icons for Roadmap Milestones
const getStepIcon = (iconName) => {
  switch (iconName) {
    case 'basics':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'state':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case 'advanced':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'deploy':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
          <path d="M12 2L9 9h6l-3-7z" />
          <path d="M9 9c0 3.5 1.5 6.5 3 8 1.5-1.5 3-4.5 3-8H9z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
  }
};

// SVG Platform Brand Logos
const getPlatformIcon = (url, type) => {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return (
      <svg className="platform-icon youtube" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.969.503 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.969 24 12 24 12s0-3.969-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (urlLower.includes('udemy.com')) {
    return (
      <svg className="platform-icon udemy" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
      </svg>
    );
  }
  if (urlLower.includes('coursera.org')) {
    return (
      <svg className="platform-icon coursera" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 14.2h-1.5V7.8h1.5v8.4zm4.1 0h-1.5V7.8h1.5v8.4zm2.5-2.1c-.2.2-.5.3-.8.3s-.6-.1-.8-.3c-.2-.2-.3-.5-.3-.8V7.8h1.5v5c0 .3.1.4.3.4s.3-.1.3-.4V7.8h1.5v5.5c0 .6-.2 1.1-.7 1.4z"/>
      </svg>
    );
  }
  if (urlLower.includes('freecodecamp.org')) {
    return (
      <svg className="platform-icon freecodecamp" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 11.8h-7.6V7.8h1.5v4.5h4.6v1.5zm0-3h-4.6V7.8h1.5v1.5h3.1V9z"/>
      </svg>
    );
  }
  if (urlLower.includes('github.com')) {
    return (
      <svg className="platform-icon github" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    );
  }
  // Default book/globe icon
  return (
    <svg className="platform-icon default" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

export default function TechnologyResourcePlanner({ token, onSelectPlan, onResourceClick }) {
  const [technology, setTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Scroll-triggered GSAP reveal for the whole planner section
  const containerRef = useScrollAnimation(scrollReveal, { duration: 0.8 });
  const resultRef = useRef(null);

  // Curated clickable suggestions
  const exampleChips = ["React", "Python for Data Science", "AWS Cloud Solutions", "Docker & Kubernetes", "Machine Learning"];
  
  // Suggested career goals
  const careerGoals = [
    { title: "Become a Frontend Engineer", query: "Frontend Developer (HTML, CSS, JS, React)" },
    { title: "Master Backend APIs", query: "Backend Engineer (Node.js, Express, databases)" },
    { title: "Transition to DevOps", query: "DevOps Engineer (Docker, Kubernetes, AWS, CI/CD)" },
    { title: "Learn AI & Data Science", query: "Machine Learning Specialist (Python, ML models)" }
  ];

  useEffect(() => {
    if (result && resultRef.current) {
      const resourceCards = resultRef.current.querySelectorAll('.resource-card-premium, .project-card, .timeline-card, .tip-card, .career-card');
      if (resourceCards.length > 0) {
        staggerFadeIn(resourceCards, { stagger: 0.08, delay: 0.2 });
      }
    }
  }, [result]);

  // Get available technologies for autocomplete
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const { data } = await axios.get('/api/resources/technologies');
        setSuggestions(data.technologies || []);
      } catch (err) {
        console.error('Failed to fetch technologies:', err);
      }
    };
    fetchTechnologies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!technology.trim()) {
      setError('Please enter a technology name');
      return;
    }
    await searchTech(technology.trim());
  };

  const handleSuggestionClick = async (query) => {
    setTechnology(query);
    await searchTech(query);
  };

  const searchTech = async (techName) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await axios.post(
        '/api/resources/search',
        { technology: techName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to search resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    if (result && onSelectPlan) {
      // Convert resources or roadmap items to tasks
      const tasks = result.resources.map((resource, index) => ({
        title: resource.title,
        days: parseTimeToDays(resource.time),
        resource: resource.url,
        difficulty: index < 2 ? 'beginner' : index < 4 ? 'intermediate' : 'advanced',
        priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        deadline: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));

      onSelectPlan({
        rawInput: `Learn ${result.technology}`,
        tasks: tasks
      });
    }
  };

  const parseTimeToDays = (timeString) => {
    const lower = timeString.toLowerCase();
    const weekMatch = lower.match(/(\d+)\s*week/);
    if (weekMatch) {
      return parseInt(weekMatch[1]) * 7;
    }
    return 14; // default 2 weeks
  };

  return (
    <div className="technology-resource-planner" ref={containerRef}>
      {/* 1. Hero Section */}
      <div className="planner-header">
        <span className="premium-badge">✨ AI-POWERED DISCOVERY</span>
        <h2 className="planner-title">Design Your AI-Powered Learning Path</h2>
        <p className="planner-subtitle">
          Enter any tech stack, career path, or skill, and let our AI curate a personalized roadmap with real-world resources and projects.
        </p>
      </div>

      {/* 2. Input Section */}
      <form className="planner-search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <div className="input-with-icon">
            <span className="ai-sparkle-icon">✨</span>
            <input
              type="text"
              className="search-input"
              placeholder="What do you want to learn today? e.g., React, Node.js, AWS Cloud Architect..."
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              list="tech-suggestions"
              disabled={loading}
            />
          </div>
          <datalist id="tech-suggestions">
            {suggestions.map((tech, idx) => (
              <option key={idx} value={tech.name} />
            ))}
          </datalist>
          
          <button 
            type="submit" 
            className="search-button-premium"
            disabled={loading || !technology.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Generating...
              </>
            ) : (
              'Generate Roadmap'
            )}
          </button>
        </div>

        {/* Clickablechips/prompts */}
        <div className="chips-container">
          <span className="chips-label">Quick prompts:</span>
          <div className="chips-list">
            {exampleChips.map((chip, idx) => (
              <button 
                key={idx} 
                type="button" 
                className="chip-badge" 
                onClick={() => handleSuggestionClick(chip)}
                disabled={loading}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested career goals */}
        <div className="career-goals-container">
          <span className="chips-label">Career Goals:</span>
          <div className="goals-grid">
            {careerGoals.map((goal, idx) => (
              <button 
                key={idx} 
                type="button" 
                className="goal-card-btn"
                onClick={() => handleSuggestionClick(goal.query)}
                disabled={loading}
              >
                <span className="goal-icon">🎯</span>
                <span className="goal-title-text">{goal.title}</span>
              </button>
            ))}
          </div>
        </div>
      </form>

      {error && (
        <div className="error-message-premium">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="skeleton-loader-container">
          <div className="skeleton-row header pulse"></div>
          <div className="skeleton-row meta pulse"></div>
          <div className="skeleton-roadmap-grid">
            <div className="skeleton-card step pulse"></div>
            <div className="skeleton-card step pulse"></div>
            <div className="skeleton-card step pulse"></div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="resource-result" ref={resultRef}>
          {/* Result Header */}
          <div className="result-header">
            <div className="tech-info">
              <h3 className="tech-name">{result.technology}</h3>
              <div className="tech-meta">
                <span className={`meta-badge difficulty ${result.difficulty.toLowerCase()}`}>
                  📶 {result.difficulty}
                </span>
                <span className="meta-badge time">⏱️ {result.totalTime}</span>
                <span className="meta-badge days">📅 ~{result.totalDays} days</span>
              </div>
            </div>
            <button 
              className="create-plan-button-premium"
              onClick={handleCreatePlan}
            >
              📋 Create Study Plan
            </button>
          </div>
          
          {/* Syllabus/Crux Display */}
          {result.syllabus && result.syllabus.length > 0 && (
            <div className="syllabus-section-premium" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📌 The Crux / Syllabus</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                {result.syllabus.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.prerequisites && result.prerequisites.length > 0 && (
            <div className="prerequisites-container">
              <strong>Prerequisites:</strong>
              <div className="prerequisites-list">
                {result.prerequisites.map((prereq, idx) => (
                  <span key={idx} className="prerequisite-tag">{prereq}</span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Roadmap Section & 4. Timeline Cards */}
          {result.roadmap && result.roadmap.length > 0 && (
            <div className="roadmap-timeline-section">
              <h4 className="section-title-premium">📍 Vertical Roadmap & Study Timeline</h4>
              <div className="roadmap-timeline">
                <div className="roadmap-line"></div>
                {result.roadmap.map((step, idx) => (
                  <div key={idx} className="roadmap-timeline-item">
                    <div className="roadmap-timeline-marker">
                      <div className="roadmap-timeline-icon-circle">
                        {getStepIcon(step.icon)}
                      </div>
                    </div>
                    
                    {/* Consolidated Roadmap / Timeline Card */}
                    <div className="timeline-modern-card">
                      <div className="timeline-card-header">
                        <span className="milestone-badge">Step {idx + 1}</span>
                        <span className={`badge-difficulty ${step.difficulty.toLowerCase()}`}>
                          {step.difficulty}
                        </span>
                      </div>
                      <h5 className="timeline-card-title">{step.title}</h5>
                      <div className="timeline-card-details">
                        <span className="timeline-detail-item">⏱️ {step.duration}</span>
                        <span className="timeline-detail-item">📚 {step.studyHours} hours/day</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Resources */}
          {result.resources && result.resources.length > 0 && (
            <div className="resources-section-premium">
              <h4 className="section-title-premium">📚 Curated Learning Resources</h4>
              <div className="resources-grid-premium">
                {result.resources.map((resource, idx) => (
                  <div key={idx} className="resource-card-premium">
                    <div className="resource-card-header">
                      <div className="platform-icon-box">
                        {getPlatformIcon(resource.url, resource.type)}
                      </div>
                      <span className={`resource-type-tag ${resource.type}`}>
                        {resource.type}
                      </span>
                    </div>
                    <h5 className="resource-title-premium">{resource.title}</h5>
                    <div className="resource-card-footer">
                      <span className="resource-time">⏱️ {resource.time}</span>
                      <a
                        href={onResourceClick ? "#resource" : resource.url}
                        onClick={onResourceClick ? (e) => { e.preventDefault(); onResourceClick(resource.title, resource.url); } : undefined}
                        target={onResourceClick ? undefined : "_blank"}
                        rel={onResourceClick ? undefined : "noopener noreferrer"}
                        className="resource-external-link-btn"
                      >
                        Open Resource →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Projects */}
          {result.projects && result.projects.length > 0 && (
            <div className="projects-section-premium">
              <h4 className="section-title-premium">🚀 Recommended Practice Projects</h4>
              <div className="projects-grid-premium">
                {result.projects.map((project, idx) => (
                  <div key={idx} className="project-card-premium">
                    <div className="project-card-header">
                      <span className={`project-level-badge ${project.difficulty.toLowerCase()}`}>
                        {project.difficulty}
                      </span>
                    </div>
                    <h5 className="project-title">{project.name}</h5>
                    <p className="project-desc">{project.description}</p>
                    {project.skills && project.skills.length > 0 && (
                      <div className="project-skills-list">
                        {project.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="project-skill-badge">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. AI Mentor Tips */}
          {result.mentorTips && result.mentorTips.length > 0 && (
            <div className="mentor-tips-section-premium">
              <h4 className="section-title-premium">💡 AI Mentor Advice</h4>
              <div className="mentor-tips-grid">
                {result.mentorTips.map((tip, idx) => (
                  <div key={idx} className="mentor-tip-callout">
                    <span className="tip-ai-sparkle">✨</span>
                    <p className="tip-content">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Skills Gained */}
          {result.skillsGained && result.skillsGained.length > 0 && (
            <div className="skills-gained-section-premium">
              <h4 className="section-title-premium">🏆 Skills Gained After Completion</h4>
              <div className="skills-badge-list-premium">
                {result.skillsGained.map((skill, idx) => (
                  <div key={idx} className="skill-pill-badge-premium">
                    <span className="skill-badge-icon">🎖️</span>
                    <span className="skill-badge-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. Career Opportunities */}
          {result.careerOpportunities && result.careerOpportunities.length > 0 && (
            <div className="career-opportunities-section-premium">
              <h4 className="section-title-premium">💼 Potential Career Opportunities</h4>
              <div className="careers-grid-premium">
                {result.careerOpportunities.map((career, idx) => (
                  <div key={idx} className="career-opportunity-card">
                    <div className="career-card-header">
                      <h5 className="career-role-title">{career.role}</h5>
                      <span className="career-growth-trend">{career.growth}</span>
                    </div>
                    <div className="career-salary-box">
                      <span className="salary-label">Avg. Salary</span>
                      <span className="salary-amount">{formatSalary(career.salary)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Summary */}
          <div className="learning-summary-premium">
            <div className="summary-col">
              <strong>Total Learning Timeline</strong>
              <span>{result.totalTime}</span>
            </div>
            <div className="summary-col">
              <strong>Target Completion</strong>
              <span>{new Date(result.estimatedCompletion).toLocaleDateString()}</span>
            </div>
            <div className="summary-col">
              <strong>Curation Source</strong>
              <span className="source-curation-badge">{result.source}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatSalary(salaryStr) {
  if (!salaryStr) return "";
  if (salaryStr.includes("₹") || salaryStr.includes("INR")) return salaryStr;

  const numbers = [];
  const regex = /(\d+[\d,]*\s*k?)/gi;
  let match;
  while ((match = regex.exec(salaryStr)) !== null) {
    let numStr = match[0].toLowerCase().replace(/,/g, '').trim();
    let num = 0;
    if (numStr.endsWith('k')) {
      num = parseFloat(numStr) * 1000;
    } else {
      num = parseFloat(numStr);
    }
    if (!isNaN(num) && num > 0) {
      numbers.push(num);
    }
  }

  if (numbers.length === 2) {
    const inrMinStr = convertToLakhs(numbers[0]);
    const inrMaxStr = convertToLakhs(numbers[1]);
    return `${salaryStr} (~₹${inrMinStr} - ₹${inrMaxStr} LPA)`;
  } else if (numbers.length === 1) {
    const inrStr = convertToLakhs(numbers[0]);
    return `${salaryStr} (~₹${inrStr} LPA)`;
  }

  return salaryStr;
}

function convertToLakhs(usdAmount) {
  const inrAmount = usdAmount * 83; // Conversion rate
  if (inrAmount >= 10000000) {
    return `${(inrAmount / 10000000).toFixed(1)}Cr`;
  }
  return `${(inrAmount / 100000).toFixed(0)}L`;
}
