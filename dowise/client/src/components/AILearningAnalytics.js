// src/components/AILearningAnalytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AILearningAnalytics({ userId, token, plans }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);

  const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    if (plans && plans.length > 0) {
      generateAnalytics();
    }
  }, [plans]);

  const generateAnalytics = async () => {
    setLoading(true);
    try {
      // Analyze learning patterns
      const totalTasks = plans.reduce((sum, plan) => sum + plan.tasks.length, 0);
      const completedTasks = plans.reduce((sum, plan) => 
        sum + plan.tasks.filter(task => task.done).length, 0
      );
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

      // Calculate learning velocity (tasks completed per day)
      const now = new Date();
      const oldestPlan = plans.reduce((oldest, plan) => 
        new Date(plan.createdAt) < oldest ? new Date(plan.createdAt) : oldest, now
      );
      const daysSinceStart = Math.max(1, Math.ceil((now - oldestPlan) / (1000 * 60 * 60 * 24)));
      const learningVelocity = (completedTasks / daysSinceStart).toFixed(2);

      // Analyze task difficulty distribution
      const difficultyStats = plans.reduce((stats, plan) => {
        plan.tasks.forEach(task => {
          const difficulty = task.difficulty || 'intermediate';
          stats[difficulty] = (stats[difficulty] || 0) + 1;
        });
        return stats;
      }, {});

      // Generate AI insights
      const aiInsights = generateAIInsights({
        completionRate,
        learningVelocity,
        totalTasks,
        completedTasks,
        difficultyStats,
        plans
      });

      // Generate learning trends
      const learningTrends = generateLearningTrends(plans);

      setAnalytics({
        completionRate,
        learningVelocity,
        totalTasks,
        completedTasks,
        difficultyStats,
        daysSinceStart
      });

      setInsights(aiInsights);
      setTrends(learningTrends);

    } catch (error) {
      console.error('Analytics generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = (data) => {
    const insights = [];

    // Completion rate insights
    if (data.completionRate >= 80) {
      insights.push({
        type: 'excellent',
        title: 'Outstanding Progress! 🎉',
        description: `You're completing ${data.completionRate}% of your tasks. You're a learning champion!`,
        actionable: false
      });
    } else if (data.completionRate >= 60) {
      insights.push({
        type: 'good',
        title: 'Good Progress 📈',
        description: `You're completing ${data.completionRate}% of your tasks. Keep up the great work!`,
        actionable: false
      });
    } else {
      insights.push({
        type: 'improvement',
        title: 'Room for Improvement 📚',
        description: `You're completing ${data.completionRate}% of your tasks. Consider breaking down larger goals into smaller, manageable steps.`,
        actionable: true
      });
    }

    // Learning velocity insights
    if (data.learningVelocity >= 2) {
      insights.push({
        type: 'excellent',
        title: 'Fast Learner 🚀',
        description: `You're completing ${data.learningVelocity} tasks per day. Your learning pace is impressive!`,
        actionable: false
      });
    } else if (data.learningVelocity >= 1) {
      insights.push({
        type: 'good',
        title: 'Steady Progress 🐢',
        description: `You're completing ${data.learningVelocity} tasks per day. Consistency is key to mastery.`,
        actionable: false
      });
    } else {
      insights.push({
        type: 'improvement',
        title: 'Build Momentum 💪',
        description: `You're completing ${data.learningVelocity} tasks per day. Try to establish a daily learning routine.`,
        actionable: true
      });
    }

    // Task difficulty insights
    const difficultyCounts = Object.values(data.difficultyStats);
    const totalDifficultyTasks = difficultyCounts.reduce((sum, count) => sum + count, 0);
    
    if (totalDifficultyTasks > 0) {
      const beginnerRatio = (data.difficultyStats.beginner || 0) / totalDifficultyTasks;
      const advancedRatio = (data.difficultyStats.advanced || 0) / totalDifficultyTasks;

      if (beginnerRatio > 0.7) {
        insights.push({
          type: 'recommendation',
          title: 'Ready for Challenge 🎯',
          description: 'You have many beginner tasks. Consider adding some intermediate challenges to grow your skills.',
          actionable: true
        });
      } else if (advancedRatio > 0.5) {
        insights.push({
          type: 'warning',
          title: 'Challenge Level High ⚠️',
          description: 'You have many advanced tasks. Make sure to balance with foundational concepts.',
          actionable: true
        });
      }
    }

    // Learning pattern insights
    if (data.plans.length >= 5) {
      insights.push({
        type: 'achievement',
        title: 'Learning Veteran 🏆',
        description: `You've created ${data.plans.length} learning plans. You're building a strong foundation!`,
        actionable: false
      });
    }

    return insights;
  };

  const generateLearningTrends = (plans) => {
    const trends = [];
    
    // Monthly completion trend
    const monthlyData = plans.reduce((acc, plan) => {
      const month = new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!acc[month]) acc[month] = { plans: 0, tasks: 0, completed: 0 };
      acc[month].plans += 1;
      acc[month].tasks += plan.tasks.length;
      acc[month].completed += plan.tasks.filter(task => task.done).length;
      return acc;
    }, {});

    const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      completionRate: data.tasks > 0 ? ((data.completed / data.tasks) * 100).toFixed(1) : 0,
      plans: data.plans,
      tasks: data.tasks
    }));

    trends.push({
      type: 'monthly',
      title: 'Monthly Learning Trends',
      data: monthlyTrends
    });

    // Learning focus areas
    const focusAreas = plans.reduce((acc, plan) => {
      const area = plan.rawInput.toLowerCase();
      if (area.includes('frontend') || area.includes('ui')) acc.frontend = (acc.frontend || 0) + 1;
      if (area.includes('backend') || area.includes('api')) acc.backend = (acc.backend || 0) + 1;
      if (area.includes('ai') || area.includes('machine')) acc.ai = (acc.ai || 0) + 1;
      if (area.includes('data') || area.includes('analysis')) acc.data = (acc.data || 0) + 1;
      if (area.includes('mobile') || area.includes('app')) acc.mobile = (acc.mobile || 0) + 1;
      return acc;
    }, {});

    trends.push({
      type: 'focus',
      title: 'Learning Focus Areas',
      data: Object.entries(focusAreas).map(([area, count]) => ({
        area: area.charAt(0).toUpperCase() + area.slice(1),
        count,
        percentage: ((count / plans.length) * 100).toFixed(1)
      }))
    });

    return trends;
  };

  if (loading) {
    return (
      <div className="card">
        <h3>🤖 AI Learning Analytics</h3>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>🧠 Analyzing your learning patterns...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="card">
      <h3 style={{ color: 'var(--text-primary)' }}>🤖 AI Learning Analytics</h3>
      
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {analytics.completionRate}%
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Completion Rate</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {analytics.learningVelocity}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Tasks/Day</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {analytics.totalTasks}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Tasks</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '15px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
            {analytics.daysSinceStart}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Days Learning</div>
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: 'var(--text-primary)' }}>🧠 AI-Generated Insights</h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          {insights.map((insight, idx) => {
            const textColor = insight.type === 'excellent' ? '#155724' : 
                              insight.type === 'good' ? '#0c5460' :
                              insight.type === 'improvement' ? '#856404' :
                              insight.type === 'warning' ? '#721c24' :
                              insight.type === 'achievement' ? '#383d41' : 'var(--text-primary)';
            const descColor = insight.type === 'excellent' ? '#1b6d2e' : 
                              insight.type === 'good' ? '#116e7d' :
                              insight.type === 'improvement' ? '#8e6d0a' :
                              insight.type === 'warning' ? '#8c262f' :
                              insight.type === 'achievement' ? '#5a6268' : 'var(--text-secondary)';
            return (
              <div key={idx} style={{
                padding: '12px',
                background: insight.type === 'excellent' ? '#d4edda' : 
                           insight.type === 'good' ? '#d1ecf1' :
                           insight.type === 'improvement' ? '#fff3cd' :
                           insight.type === 'warning' ? '#f8d7da' :
                           insight.type === 'achievement' ? '#e2e3e5' : 'var(--gray-50)',
                border: `1px solid ${
                  insight.type === 'excellent' ? '#c3e6cb' :
                  insight.type === 'good' ? '#bee5eb' :
                  insight.type === 'improvement' ? '#ffeaa7' :
                  insight.type === 'warning' ? '#f5c6cb' :
                  insight.type === 'achievement' ? '#d6d8db' : 'var(--gray-200)'
                }`,
                borderRadius: '8px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px', color: textColor }}>{insight.title}</div>
                <div style={{ fontSize: '14px', color: descColor }}>{insight.description}</div>
                {insight.actionable && (
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '12px', 
                    color: '#007bff',
                    fontStyle: 'italic'
                  }}>
                    💡 Actionable insight
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Trends */}
      <div>
        <h4 style={{ color: 'var(--text-primary)' }}>📊 Learning Trends</h4>
        {trends.map((trend, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>{trend.title}</h5>
            
            {trend.type === 'monthly' && (
              <div style={{ display: 'grid', gap: '10px' }}>
                {trend.data.map((item, itemIdx) => (
                  <div key={itemIdx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '5px'
                  }}>
                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.month}</span>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <span>📚 {item.tasks} tasks</span>
                      <span>📈 {item.completionRate}%</span>
                      <span>📋 {item.plans} plans</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {trend.type === 'focus' && (
              <div style={{ display: 'grid', gap: '8px' }}>
                {trend.data.map((item, itemIdx) => (
                  <div key={itemIdx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '5px'
                  }}>
                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.area}</span>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <span>{item.count} plans</span>
                      <span style={{ color: '#007bff' }}>{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
