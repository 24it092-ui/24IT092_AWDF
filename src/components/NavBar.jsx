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
          <span className="brand-text">AWDF Lab Suite</span>
        </div>

        {/* Practical Switcher Dropdown for seamless integration of all 14 practicals */}
        <div className="practical-selector-wrapper">
          <label htmlFor="practical-select" className="selector-label">Practical:</label>
          <select
            id="practical-select"
            className="practical-select"
            value={currentPractical}
            onChange={(e) => onSelectPractical(Number(e.target.value))}
          >
            {practicalList.map((p) => (
              <option key={p.id} value={p.id} disabled={!p.available}>
                Practical {p.id}: {p.title} {!p.available ? '(Upcoming)' : '✓'}
              </option>
            ))}
          </select>
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
