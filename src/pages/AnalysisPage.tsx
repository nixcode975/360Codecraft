import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function AnalysisPage() {
  const [loading, setLoading] = useState(true);
  const { currentField, currentExperience, currentCS1, currentFiles } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentField || currentCS1 === 0) {
      navigate('/project/new');
      return;
    }
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, [currentField, currentCS1, navigate]);

  if (loading) {
    return (
      <div className="analysis-container">
        <div className="step-indicator">
          <div className="step completed"><div className="step-dot">✓</div></div>
          <div className="step-connector completed"></div>
          <div className="step completed"><div className="step-dot">✓</div></div>
          <div className="step-connector completed"></div>
          <div className="step active"><div className="step-dot">3</div></div>
          <div className="step-connector"></div>
          <div className="step"><div className="step-dot">4</div></div>
          <div className="step-connector"></div>
          <div className="step"><div className="step-dot">5</div></div>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">🤖 AI is analyzing your project...</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Evaluating complexity relative to your experience level
          </p>
        </div>
      </div>
    );
  }

  const getGradient = (score: number) => {
    if (score >= 7) return 'var(--gradient-emerald)';
    if (score >= 4) return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(135deg, #f43f5e, #fb7185)';
  };

  return (
    <div className="analysis-container">
      <div className="step-indicator">
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step active"><div className="step-dot">3</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">4</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">5</div></div>
      </div>

      <div className="analysis-card glass-card-static">
        <h2>🔍 Project Analysis Complete</h2>

        <div className="score-circle" style={{ background: getGradient(currentCS1) }}>
          <div className="score-circle-inner">
            <span className="score-number">{currentCS1}</span>
            <span className="score-label">CS1</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Credit Score 1 – Project Evaluation
        </p>

        <div className="analysis-details">
          <span className="detail-chip">📁 {currentField}</span>
          <span className="detail-chip">⏱️ {currentExperience < 1 ? `${Math.round(currentExperience * 12)}mo` : `${currentExperience}yr`} exp</span>
          <span className="detail-chip">📎 {currentFiles.length} file{currentFiles.length !== 1 ? 's' : ''}</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 2rem' }}>
          CS1 measures how impressive your project is <strong>relative to your experience level</strong>.
          Next, you'll take a conceptual exam to verify your knowledge.
        </p>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/exam')}
        >
          🧠 Start Conceptual Exam →
        </button>
      </div>
    </div>
  );
}
