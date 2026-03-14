import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const FIELDS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Computer Science',
  'Data Science',
  'Web Development',
  'Cybersecurity',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Robotics',
  'Physics',
  'Mathematics',
  'Chemistry',
  'Biology',
  'Psychology',
];

export default function ProjectIntake() {
  const [field, setField] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const { setCurrentField, setCurrentExperience } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!field) { setError('Please select a field'); return; }
    const exp = parseFloat(experience);
    if (isNaN(exp) || exp < 0) { setError('Please enter valid experience'); return; }
    setCurrentField(field);
    setCurrentExperience(exp);
    navigate('/project/upload');
  };

  return (
    <div className="intake-container">
      <div className="step-indicator">
        <div className="step active"><div className="step-dot">1</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">2</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">3</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">4</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">5</div></div>
      </div>

      <div className="intake-card glass-card-static">
        <h2>📋 Project Details</h2>
        <p className="subtitle">Tell us about your project and experience</p>

        <form className="intake-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="project-field">Field of Project</label>
            <select
              id="project-field"
              className="form-select"
              value={field}
              onChange={e => setField(e.target.value)}
            >
              <option value="">Select a field...</option>
              {FIELDS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="experience-level">Experience Level (in years)</label>
            <input
              id="experience-level"
              className="form-input"
              type="number"
              step="0.1"
              min="0"
              max="50"
              placeholder="e.g. 2.5 years"
              value={experience}
              onChange={e => setExperience(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Enter 0.5 for 6 months, 0.25 for 3 months, etc.
            </span>
          </div>

          {error && (
            <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>{error}</p>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Continue to Upload →
          </button>
        </form>
      </div>
    </div>
  );
}
