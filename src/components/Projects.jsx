import { useState, useEffect } from 'react';

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerCount, setTriggerCount] = useState(0);

  const username = 'octocat'; // Clean, public, reliable GitHub API test user

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setRepos(data);
          } else {
            setRepos([]);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch repositories from GitHub REST API');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [triggerCount]);

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">🌐</div>
        <div>
          <h2>GitHub Repositories (REST API)</h2>
          <p className="section-subtitle">
            Consumed via <code>useEffect</code> & GitHub REST API with Loading, Error & Search
          </p>
        </div>
      </div>

      {/* Controls Bar: Search Filter & Retry */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter repositories by name..."
          style={{
            flex: '1',
            minWidth: '220px',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />

        <button
          type="button"
          className="nav-button"
          onClick={() => setTriggerCount((c) => c + 1)}
          style={{ background: 'var(--primary)', color: '#fff', borderRadius: '8px', padding: '0.65rem 1.25rem' }}
        >
          🔄 Refresh / Retry API
        </button>
      </div>

      {/* 1. Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--text-muted)' }}>Fetching repositories from GitHub API...</p>
        </div>
      )}

      {/* 2. Error State with Retry Button */}
      {!loading && error && (
        <div className="qa-card" style={{ borderColor: '#ef4444', textAlign: 'center', padding: '2rem' }}>
          <h4 style={{ color: '#ef4444' }}>⚠️ API Request Failed</h4>
          <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.25rem' }}>{error}</p>
          <button
            type="button"
            className="nav-button"
            onClick={() => setTriggerCount((c) => c + 1)}
            style={{ background: '#ef4444', color: '#fff', borderRadius: '6px' }}
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* 3. Success State: Repository Grid */}
      {!loading && !error && (
        <>
          {filteredRepos.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              No repositories match "{searchQuery}".
            </p>
          ) : (
            <div className="projects-grid">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="project-card">
                  <div className="project-card-header">
                    <span className="project-tag">{repo.language || 'Code'}</span>
                    <span className="project-stars">★ {repo.stargazers_count}</span>
                  </div>
                  <h3 className="project-title">{repo.name}</h3>
                  <p className="project-desc">
                    {repo.description || 'No description provided by author.'}
                  </p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="nav-button"
                    style={{
                      marginTop: '0.75rem',
                      display: 'inline-block',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-color)',
                      textDecoration: 'none',
                      color: 'var(--accent)',
                      fontSize: '0.85rem',
                    }}
                  >
                    View on GitHub ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
