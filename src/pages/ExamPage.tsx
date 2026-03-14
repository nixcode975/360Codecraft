import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { generateQuestions } from '../utils/generateQuestions';
import type { Question } from '../utils/generateQuestions';

const EXAM_DURATION = 600; // 10 minutes in seconds
const MAX_TAB_SWITCHES = 2;

export default function ExamPage() {
  const { currentField, currentCS1 } = useApp();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [cheated, setCheated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const tabSwitchRef = useRef(0);
  const cheatedRef = useRef(false);

  // Generate questions on mount
  useEffect(() => {
    if (!currentField || currentCS1 === 0) {
      navigate('/project/new');
      return;
    }
    setQuestions(generateQuestions(currentField));
  }, [currentField, currentCS1, navigate]);

  // Timer
  useEffect(() => {
    if (cheated || submitted || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cheated, submitted, questions.length]);

  // Tab switch detection
  useEffect(() => {
    if (cheated || submitted || questions.length === 0) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchRef.current += 1;
        setTabSwitches(tabSwitchRef.current);
        if (tabSwitchRef.current >= MAX_TAB_SWITCHES) {
          cheatedRef.current = true;
          setCheated(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cheated, submitted, questions.length]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);

    let cs2 = 0;
    if (!cheatedRef.current) {
      let correct = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.correctIndex) correct++;
      });
      cs2 = Math.round((correct / Math.max(questions.length, 1)) * 10 * 10) / 10;
      cs2 = Math.max(1, cs2);
    }

    // Navigate to results with CS2
    navigate('/results', { state: { cs2 } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, cheated, questions, navigate, submitted]);

  const selectOption = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Cheating overlay
  if (cheated) {
    return (
      <div className="cheat-overlay">
        <div className="cheat-card glass-card-static">
          <div className="cheat-icon">🚫</div>
          <h2>Exam Terminated</h2>
          <p>
            You switched tabs <strong>{MAX_TAB_SWITCHES} times</strong>. This is considered an attempt to cheat.
            Your exam score (CS2) has been set to <strong>0</strong>.
          </p>
          <button
            className="btn btn-danger btn-lg"
            onClick={() => navigate('/results', { state: { cs2: 0 } })}
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Generating exam questions...</p>
      </div>
    );
  }

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  // Format question text for assertion-reason type
  const renderQuestionText = (q: Question) => {
    if (q.type === 'assertion-reason') {
      const parts = q.text.split('\n');
      return (
        <div className="question-text">
          {parts.map((part, i) => {
            if (part.startsWith('Assertion:')) {
              return <span key={i} className="assertion"><strong>Assertion:</strong> {part.replace('Assertion:', '').trim()}</span>;
            }
            if (part.startsWith('Reason:')) {
              return <span key={i} className="reason"><strong>Reason:</strong> {part.replace('Reason:', '').trim()}</span>;
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      );
    }
    if (q.type === 'match-following') {
      const lines = q.text.split('\n');
      return (
        <div className="question-text">
          {lines.map((line, i) => (
            <span key={i} style={{ display: 'block', marginBottom: '0.3rem' }}>{line}</span>
          ))}
        </div>
      );
    }
    return <div className="question-text">{q.text}</div>;
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'assertion-reason': return 'Assertion & Reason';
      case 'match-following': return 'Match the Following';
      case 'analyse-situation': return 'Analyse Situation';
      default: return type;
    }
  };

  return (
    <div className="exam-container">
      <div className="step-indicator">
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step active"><div className="step-dot">4</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">5</div></div>
      </div>

      <div className="exam-header">
        <div className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div className="tab-warning">
          ⚠️ Tab switches: <span className="tab-count">{tabSwitches}/{MAX_TAB_SWITCHES}</span>
        </div>
        <div className="question-counter">
          Q {currentQ + 1}/{questions.length}
        </div>
      </div>

      <div className="exam-progress">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-card glass-card-static" key={question.id}>
        <span className="question-type-tag">{typeLabel(question.type)}</span>
        {renderQuestionText(question)}

        <div className="options-list">
          {question.options.map((option, oi) => (
            <div
              key={oi}
              className={`option-item ${answers[question.id] === oi ? 'selected' : ''}`}
              onClick={() => selectOption(question.id, oi)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + oi)}
              </span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>

        <div className="exam-actions">
          <button
            className="btn btn-secondary"
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(prev => prev - 1)}
          >
            ← Previous
          </button>

          {currentQ < questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentQ(prev => prev + 1)}
            >
              Next →
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
              ✅ Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
