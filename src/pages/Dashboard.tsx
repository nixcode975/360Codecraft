import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function Dashboard() {
  const { projects } = useApp();
  const navigate = useNavigate();

  const getBadgeEmoji = (badge: string) => {
    switch (badge) {
      case 'platinum': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '';
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Evaluate your skills through real projects</p>

      <div className="dashboard-grid">
        <div
          className="glass-card dashboard-action-card"
          onClick={() => navigate('/project/new')}
          id="add-project-card"
        >
          <div className="card-icon">➕</div>
          <h3>Add Project</h3>
          <p>Submit a new project for skill evaluation</p>
        </div>

        <div
          className="glass-card dashboard-action-card"
          onClick={() => {
            const el = document.getElementById('existing-projects');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          id="existing-projects-card"
        >
          <div className="card-icon">📂</div>
          <h3>Existing Projects</h3>
          <p>{projects.length === 0 ? 'No projects yet' : `${projects.length} project${projects.length > 1 ? 's' : ''} evaluated`}</p>
        </div>
      </div>

      <div className="projects-section" id="existing-projects">
        <h2>📋 Your Projects</h2>

        {projects.length === 0 ? (
          <div className="glass-card-static empty-state">
            <div className="empty-icon">🔬</div>
            <p>No projects yet. Add your first project to get evaluated!</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="glass-card-static project-card">
                <div className="project-card-header">
                  <h4>{project.field}</h4>
                  <span className={`badge badge-${project.badge}`}>
                    {getBadgeEmoji(project.badge)} {project.badge}
                  </span>
                </div>
                <span className="field-tag">{project.field}</span>
                <div className="scores">
                  <div className="score-item">
                    <div className="score-label">CS1</div>
                    <div className={`score-value ${getScoreClass(project.cs1)}`} style={{ color: project.cs1 >= 7 ? 'var(--accent-emerald)' : project.cs1 >= 4 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                      {project.cs1}
                    </div>
                  </div>
                  <div className="score-item">
                    <div className="score-label">CS2</div>
                    <div className={`score-value ${getScoreClass(project.cs2)}`} style={{ color: project.cs2 >= 7 ? 'var(--accent-emerald)' : project.cs2 >= 4 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                      {project.cs2}
                    </div>
                  </div>
                  <div className="score-item">
                    <div className="score-label">AVG</div>
                    <div className="score-value" style={{ color: 'var(--accent-cyan)' }}>
                      {project.average}
                    </div>
                  </div>
                </div>
                <p className="experience-text">
                  {project.experienceYears < 1
                    ? `${Math.round(project.experienceYears * 12)} months experience`
                    : `${project.experienceYears} year${project.experienceYears > 1 ? 's' : ''} experience`
                  }
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
