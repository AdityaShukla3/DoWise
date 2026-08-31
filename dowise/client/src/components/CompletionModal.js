import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import api from '../services/api';

export default function CompletionModal({ plan, onClose }) {
  const { width, height } = useWindowSize();
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const { data } = await api.get(`/api/ai/similar?technology=${encodeURIComponent(plan.rawInput)}`);
        setSimilar(data.similar || []);
      } catch (err) {
        console.error("Failed to fetch similar technologies", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSimilar();
  }, [plan.rawInput]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
      
      <div style={{
        background: 'var(--bg-card)',
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.5s ease-out'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          🎉 Congratulations! 🎉
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          You have successfully completed <strong>{plan.rawInput}</strong>! Keep up the great work!
        </p>

        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Similar Technologies to Explore Next:
          </h3>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : similar.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {similar.map((tech, idx) => (
                <li key={idx} style={{ 
                  background: 'var(--bg-secondary)', 
                  margin: '0.5rem 0', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)' 
                }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                    {tech.name}
                  </strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{tech.reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No similar technologies found.</p>
          )}
        </div>

        <button 
          onClick={onClose}
          style={{
            padding: '12px 30px',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1.1rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'opacity 0.2s'
          }}
        >
          Close & Return to Dashboard
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
