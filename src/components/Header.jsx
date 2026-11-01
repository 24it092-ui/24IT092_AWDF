export default function Header({ name, title, rollNo, themeColor = '#6366f1' }) {
  return (
    <header className="portfolio-header" style={{ borderTop: `4px solid ${themeColor}` }}>
      <h1 className="header-name">{name}</h1>
      <p className="header-title">{title}</p>
      {rollNo && <span className="header-roll">Roll No: {rollNo}</span>}
    </header>
  );
}
