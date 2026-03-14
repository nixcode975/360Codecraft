import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      >
        CODEcraft<span>360</span>
      </div>
      <div className="navbar-user">
        <span className="navbar-email">{user.email}</span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => { logout(); navigate('/'); }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
