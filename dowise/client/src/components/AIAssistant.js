// src/components/AIAssistant.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AIAssistant({ userId, token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState('learning'); // learning, motivation, technical

  const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });

  // Pre-defined AI conversation starters
  const conversationStarters = [
    "I'm feeling stuck with my learning progress",
    "Help me create a study schedule",
    "What should I learn next?",
    "I need motivation to continue",
    "Explain a technical concept",
    "Help me break down a complex goal"
  ];

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'ai',
          content: "Hello! I'm your AI Learning Assistant. I can help you with:\n\n🎯 **Learning Path Design** - Create personalized study plans\n🧠 **Progress Analysis** - Understand your learning patterns\n💡 **Smart Recommendations** - Discover what to learn next\n🚀 **Motivation & Support** - Stay on track with your goals\n\nHow can I help you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Enhanced AI response based on mode and content
      let aiResponse = '';
      
      if (content.toLowerCase().includes('schedule') || content.toLowerCase().includes('plan')) {
        aiResponse = "I'll help you create a personalized learning schedule! Let me analyze your current goals and suggest an optimal timeline. What's your main learning objective and how much time can you dedicate daily?";
      } else if (content.toLowerCase().includes('motivation') || content.toLowerCase().includes('stuck')) {
        aiResponse = "Learning plateaus are completely normal! Remember why you started this journey. Let's break down your goal into smaller, achievable milestones. What's one small step you can take today?";
      } else if (content.toLowerCase().includes('next') || content.toLowerCase().includes('learn')) {
        aiResponse = "Great question! Based on your learning patterns, I'd recommend focusing on areas that build upon your current knowledge. What skills do you want to develop, and what's your current proficiency level?";
      } else if (content.toLowerCase().includes('technical') || content.toLowerCase().includes('explain')) {
        aiResponse = "I'd be happy to explain technical concepts! To give you the most helpful explanation, could you tell me your current understanding level and what specific aspect you'd like me to clarify?";
      } else {
        // Generic helpful response
        aiResponse = "That's an interesting question! I'm here to support your learning journey. Could you tell me more about what you're working on and how I can best assist you?";
      }

      // Add AI response with slight delay for natural feel
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleQuickStart = (starter) => {
    sendMessage(starter);
  };

  const toggleMode = (mode) => {
    setAiMode(mode);
    setMessages([]); // Clear messages when switching modes
  };

  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🤖
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '600px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>🤖 AI Learning Assistant</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>Your personal learning coach</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Mode Selector */}
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        gap: '10px'
      }}>
        {['learning', 'motivation', 'technical'].map(mode => (
          <button
            key={mode}
            onClick={() => toggleMode(mode)}
            style={{
              background: aiMode === mode ? '#007bff' : '#f8f9fa',
              color: aiMode === mode ? 'white' : '#666',
              border: '1px solid #dee2e6',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '18px',
              background: message.type === 'user' ? '#007bff' : '#f8f9fa',
              color: message.type === 'user' ? 'white' : '#333',
              fontSize: '14px',
              lineHeight: '1.4',
              whiteSpace: 'pre-line'
            }}>
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px',
              background: '#f8f9fa',
              color: '#666',
              fontSize: '14px'
            }}>
              🤔 Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Quick Starters */}
      {messages.length === 1 && (
        <div style={{
          padding: '15px',
          borderTop: '1px solid #eee'
        }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0' }}>Quick starters:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {conversationStarters.slice(0, 4).map((starter, index) => (
              <button
                key={index}
                onClick={() => handleQuickStart(starter)}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '15px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask me anything about learning..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #dee2e6',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
