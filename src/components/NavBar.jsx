import { NavLink } from 'react-router-dom';

export default function NavBar({ isDarkMode, onToggleTheme }) {
  const routes = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects (API)' },
    { to: '/tasks', label: 'MongoDB Tasks' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="portfolio-navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          <span className="brand-logo">⚡</span>
          <span className="brand-text">NEEL SHAH • 24IT092</span>
        </NavLink>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* React Router NavLink navigation */}
          <ul className="navbar-links">
            {routes.map((r) => (
              <li key={r.to}>
                <NavLink
                  to={r.to}
                  className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  {r.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Dark / Light Mode Toggle using useState */}
          <button
            type="button"
            className="nav-button"
            onClick={onToggleTheme}
            style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', padding: '0.4rem 0.8rem' }}
            title="Toggle Theme"
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}
