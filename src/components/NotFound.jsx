import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="portfolio-section card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--primary)' }}>404</h1>
      <h2 style={{ margin: '0.75rem 0' }}>Route Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The path you attempted to navigate to does not exist in this single-page application.
      </p>
      <Link
        to="/"
        className="nav-button"
        style={{ background: 'var(--primary)', color: '#fff', padding: '0.65rem 1.25rem', textDecoration: 'none' }}
      >
        Return to Home
      </Link>
    </div>
  );
}
