export default function NavBar({ activeSection, onNavigate, practicalList, currentPractical, onSelectPractical }) {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'analysis', label: 'Lab Analysis' },
  ];

  return (
    <nav className="portfolio-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-logo">⚡</span>
          <span className="brand-text">NEEL SHAH • Portfolio</span>
        </div>

        {/* In-page active navigation */}
        <ul className="navbar-links">
          {sections.map((sec) => (
            <li key={sec.id}>
              <button
                type="button"
                className={`nav-button ${activeSection === sec.id ? 'active' : ''}`}
                onClick={() => onNavigate(sec.id)}
              >
                {sec.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
