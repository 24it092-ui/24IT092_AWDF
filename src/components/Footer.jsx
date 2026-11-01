export default function Footer({ studentName, year = new Date().getFullYear(), githubUrl, email }) {
  return (
    <footer className="portfolio-footer">
      <div className="footer-content">
        <p className="footer-copyright">
          © {year} <strong>{studentName}</strong> • Charotar University of Science and Technology (CHARUSAT)
        </p>
        <p className="footer-meta">
          B.Tech IT/CE/CSE/AIML | Advanced Web Development Frameworks (ITUE301)
        </p>
        <div className="footer-links">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="footer-link">
              GitHub Profile
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="footer-link">
              {email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
