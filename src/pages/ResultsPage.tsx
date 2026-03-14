import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentField, currentExperience, currentFiles, currentCS1, addProject, resetCurrentFlow } = useApp();
  const [showBadge, setShowBadge] = useState(false);
  const cs2: number = (location.state as any)?.cs2 ?? 0;

  useEffect(() => {
    if (!currentField || currentCS1 === 0) {
      navigate('/dashboard');
      return;
    }
    const timer = setTimeout(() => setShowBadge(true), 800);
    return () => clearTimeout(timer);
  }, [currentField, currentCS1, navigate]);

  const gap = Math.abs(currentCS1 - cs2);
  const isSuccess = gap <= 3;
  const average = Math.round(((currentCS1 + cs2) / 2) * 10) / 10;

  const getBadge = (avg: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
    if (avg <= 2.5) return 'bronze';
    if (avg <= 5) return 'silver';
    if (avg <= 7.5) return 'gold';
    return 'platinum';
  };

  const badge = getBadge(average);

  const badgeConfig = {
    platinum: { emoji: '💎', label: 'Platinum', gradient: 'var(--gradient-badge-platinum)', color: '#1e293b' },
    gold: { emoji: '🥇', label: 'Gold', gradient: 'var(--gradient-badge-gold)', color: '#451a03' },
    silver: { emoji: '🥈', label: 'Silver', gradient: 'var(--gradient-badge-silver)', color: '#1e293b' },
    bronze: { emoji: '🥉', label: 'Bronze', gradient: 'var(--gradient-badge-bronze)', color: '#fff' },
  };

  const bc = badgeConfig[badge];

  const getScoreClass = (s: number) => s >= 7 ? 'high' : s >= 4 ? 'medium' : 'low';

  const handleDashboard = () => {
    if (isSuccess) {
      addProject({
        id: Date.now().toString(),
        field: currentField,
        experienceYears: currentExperience,
        files: currentFiles,
        cs1: currentCS1,
        cs2,
        average,
        badge,
        status: 'completed',
        createdAt: new Date().toISOString(),
      });
    }
    resetCurrentFlow();
    navigate('/dashboard');
  };

  if (!currentField) return null;

  return (
    <div className="results-container">
      <div className="step-indicator">
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step active"><div className="step-dot">5</div></div>
      </div>

      <div className={`results-card glass-card-static ${isSuccess ? 'congratulations' : 'try-again'}`}>
        <h2 className={`results-verdict ${isSuccess ? 'success' : 'failure'}`}>
          {isSuccess ? '🎉 CONGRATULATIONS!' : '⚠️ IMPROVE AND TRY AGAIN'}
        </h2>
        <p className="results-subtitle">
          {isSuccess
            ? 'Your project quality and conceptual knowledge are well aligned. Great work!'
            : 'A significant gap was detected between your project score and exam performance. This may indicate the project was not fully your own work, or you need to strengthen your theoretical foundations.'}
        </p>

        <div className="scores-display">
          <div className="score-block">
            <div className="score-title">CS1 (Project)</div>
            <div className={`score-number ${getScoreClass(currentCS1)}`}>{currentCS1}</div>
            <div className="score-out-of">out of 10</div>
          </div>
          <div className="score-block">
            <div className="score-title">CS2 (Exam)</div>
            <div className={`score-number ${getScoreClass(cs2)}`}>{cs2}</div>
            <div className="score-out-of">out of 10</div>
          </div>
        </div>

        <div className="average-display">
          <div className="avg-label">Average Score</div>
          <div className="avg-value">{average} / 10</div>
        </div>

        {isSuccess && showBadge && (
          <div className="badge-display">
            <span
              className="badge-large"
              style={{ background: bc.gradient, color: bc.color }}
            >
              {bc.emoji} {bc.label} Badge
            </span>
          </div>
        )}

        {!isSuccess && (
          <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <p style={{ color: 'var(--accent-rose)', fontWeight: 600, marginBottom: '0.5rem' }}>
              🔍 Problems Detected
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Gap between CS1 ({currentCS1}) and CS2 ({cs2}): <strong>{gap.toFixed(1)} points</strong><br/>
              {currentCS1 > cs2
                ? 'Your project appears more advanced than your demonstrated knowledge. Focus on strengthening your conceptual understanding.'
                : 'Your knowledge exceeds what your project demonstrates. Try submitting a more ambitious project.'}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn btn-primary btn-lg" onClick={handleDashboard}>
            {isSuccess ? '📂 Go to Dashboard' : '🔄 Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
}
