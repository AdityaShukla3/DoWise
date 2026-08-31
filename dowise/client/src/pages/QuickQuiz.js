import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Revision.css"; // Reuse the revision styles
import { fadeIn } from "../utils/animations";

export default function QuickQuiz() {
  const { topic } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [quizState, setQuizState] = useState("intro"); // intro, loading_quiz, active, evaluating, finished
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluation, setEvaluation] = useState(null);

  const containerRef = useRef(null);

  const api = useMemo(() => {
    return axios.create({ headers: { Authorization: `Bearer ${token}` } });
  }, [token]);

  useEffect(() => {
    if (containerRef.current) {
      fadeIn(containerRef.current, { duration: 0.6 });
    }
  }, [quizState]);

  const startQuiz = async () => {
    setQuizState("loading_quiz");
    setError(null);
    try {
      const { data } = await api.get(`/api/ai/quick-quiz?topic=${encodeURIComponent(topic)}`);
      setQuiz(data.quiz || []);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setQuizState("active");
    } catch (err) {
      console.error("Quiz generation failed", err);
      setError(err?.response?.data?.message || "Failed to generate quiz. Please check that this is a valid technology.");
      setQuizState("intro");
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setQuizState("evaluating");
    try {
      const answersArray = quiz.map((_, i) => answers[i] !== undefined ? answers[i] : -1);
      const { data } = await api.post(`/api/ai/quick-quiz/evaluate`, {
        answers: answersArray,
        quiz,
        topic
      });
      setEvaluation(data);
      setQuizState("finished");
    } catch (err) {
      console.error("Quiz evaluation failed", err);
      setError("Failed to evaluate quiz.");
      setQuizState("active");
    }
  };

  return (
    <div className="revision-container" ref={containerRef} style={{ padding: "2rem" }}>
      <header className="revision-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Dashboard</button>
        <h1 className="revision-title">Curated Quick Quiz: <span>{topic}</span></h1>
      </header>

      <main className="revision-main">
        {error && (
          <div className="error-card" style={{ marginBottom: "2rem", border: "1px solid var(--error)", background: "rgba(239, 68, 68, 0.05)" }}>
            <h2>Topic Validation Error</h2>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="btn-secondary" style={{ marginTop: "1rem" }}>Clear Error</button>
          </div>
        )}

        {quizState === "intro" && (
          <div className="intro-card fade-in">
            <h2>AI Technology Revision & Quiz</h2>
            <p className="intro-desc">
              Test your knowledge on <strong>{topic}</strong>. Our AI technical evaluator will validate this technology and generate 25 multiple-choice questions to test your skills.
            </p>
            
            <div className="topics-preview" style={{ padding: "1.5rem" }}>
              <h3>⚡ Quick Revision Details</h3>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                This is a curated quick assessment designed to check your memory, understanding of best practices, and core syntax of {topic}.
              </p>
            </div>

            <button className="btn-primary start-btn" onClick={startQuiz}>
              🚀 Start AI Assessment
            </button>
          </div>
        )}

        {quizState === "loading_quiz" && (
          <div className="loading-card fade-in">
            <div className="ai-loader">
              <div className="ai-loader-circle"></div>
              <div className="ai-loader-circle"></div>
              <div className="ai-loader-circle"></div>
            </div>
            <h2>Generating your Curated Quiz...</h2>
            <p>Our AI is crafting 25 evaluation questions for {topic}. Please wait, this might take up to 15 seconds.</p>
          </div>
        )}

        {quizState === "active" && quiz.length > 0 && (
          <div className="quiz-card fade-in">
            <div className="quiz-header">
              <span className="question-counter">Question {currentQuestionIndex + 1} of {quiz.length}</span>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="question-content">
              <span className="question-topic badge">{quiz[currentQuestionIndex].topic || topic}</span>
              <h3 className="question-text">{quiz[currentQuestionIndex].question}</h3>
              
              <div className="options-grid">
                {quiz[currentQuestionIndex].options.map((opt, idx) => {
                  const isSelected = answers[currentQuestionIndex] === idx;
                  return (
                    <button 
                      key={idx}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(idx)}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="quiz-footer">
              <button 
                className="btn-secondary" 
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevious}
              >
                Previous
              </button>
              
              {currentQuestionIndex < quiz.length - 1 ? (
                <button 
                  className="btn-primary" 
                  disabled={answers[currentQuestionIndex] === undefined}
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button 
                  className="btn-success submit-btn" 
                  disabled={answers[currentQuestionIndex] === undefined}
                  onClick={submitQuiz}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {quizState === "evaluating" && (
          <div className="loading-card fade-in">
            <div className="ai-loader">
              <div className="ai-loader-circle"></div>
              <div className="ai-loader-circle"></div>
              <div className="ai-loader-circle"></div>
            </div>
            <h2>Analyzing your results...</h2>
            <p>Evaluating answers and generating personalized feedback.</p>
          </div>
        )}

        {quizState === "finished" && evaluation && (
          <div className="results-container fade-in">
            <div className="score-card">
              <div className="score-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray={`${(evaluation.score / evaluation.total) * 100}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{evaluation.score}/{evaluation.total}</text>
                </svg>
              </div>
              <div className="score-details">
                <h2>Evaluation Complete!</h2>
                <p className="feedback-text">{evaluation.feedback}</p>
              </div>
            </div>

            {evaluation.improvementTopics && evaluation.improvementTopics.length > 0 && (
              <div className="improvement-card">
                <h3>📈 Topics to Review</h3>
                <p>Based on your answers, we recommend focusing on:</p>
                <ul className="improvement-list">
                  {evaluation.improvementTopics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="detailed-review">
              <h3>Detailed Review</h3>
              {evaluation.details.map((detail, idx) => (
                <div key={idx} className={`review-item ${detail.correct ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    <span className="review-q-num">Q{idx + 1}</span>
                    <span className="review-topic badge">{detail.topic}</span>
                  </div>
                  <p className="review-question">{detail.question}</p>
                  <div className="review-answers">
                    <p className={`user-answer ${detail.correct ? 'correct-text' : 'incorrect-text'}`}>
                      <strong>Your Answer:</strong> {detail.userAnswer}
                    </p>
                    {!detail.correct && (
                      <p className="correct-answer">
                        <strong>Correct Answer:</strong> {detail.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={() => setQuizState("intro")}>Retake Quiz</button>
              <button className="btn-secondary" onClick={() => navigate("/")}>Back to Dashboard</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
