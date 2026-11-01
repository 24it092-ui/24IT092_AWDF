import { useState, useEffect } from 'react';

export default function EventDrivenView() {
  const [logs, setLogs] = useState([]);
  const [testTitle, setTestTitle] = useState('');
  const [emitting, setEmitting] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5001/events/audit');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.events || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2500);
    return () => clearInterval(interval);
  }, []);

  const triggerAsyncEvent = async (e) => {
    e.preventDefault();
    if (!testTitle.trim()) return;
    setEmitting(true);

    const token = localStorage.getItem('awdf_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      await fetch('http://localhost:5001/tasks', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: testTitle.trim(), priority: 'high' }),
      });
      setTestTitle('');
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setEmitting(false);
    }
  };

  return (
    <section className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">📡</div>
        <div>
          <h2>Event-Driven Architecture & Async Messaging</h2>
          <p className="section-subtitle">
            Non-blocking background workers driven by Node.js <code>EventEmitter</code>
          </p>
        </div>
      </div>

      {/* Trigger Live Event Panel */}
      <form onSubmit={triggerAsyncEvent} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          placeholder="Publish custom task event (e.g. Generate Monthly Report)..."
          style={{
            flex: '1',
            minWidth: '260px',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#fff',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={emitting}
          className="nav-button"
          style={{ background: 'var(--primary)', color: '#fff', borderRadius: '8px', padding: '0.75rem 1.4rem' }}
        >
          {emitting ? 'Emitting...' : '⚡ Emit Async Event (task:created)'}
        </button>
      </form>

      {/* Architecture Flow Diagram Box */}
      <div className="qa-card" style={{ marginBottom: '2rem', background: 'rgba(99,102,241,0.06)' }}>
        <h4 style={{ color: '#e0e7ff', marginBottom: '0.5rem' }}>Decoupled Async Processing Flow</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
          When tasks are created, updated, or deleted, the controller immediately returns HTTP 201/200 to the client, while 
          <strong> <code>taskEvents.emit()</code></strong> triggers background worker routines asynchronously without delaying user response times.
        </p>
      </div>

      {/* Real-Time Event Audit Stream */}
      <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>Live Async Event Stream (Real-Time Buffer):</h4>
      {logs.length === 0 ? (
        <div className="qa-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No events emitted yet. Type a title above or perform a task action in the app to watch events stream in live!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background:
                      log.type === 'task:created'
                        ? 'rgba(16,185,129,0.2)'
                        : log.type === 'task:updated'
                        ? 'rgba(56,189,248,0.2)'
                        : 'rgba(239,68,68,0.2)',
                    color:
                      log.type === 'task:created'
                        ? '#34d399'
                        : log.type === 'task:updated'
                        ? '#38bdf8'
                        : '#f87171',
                  }}
                >
                  {log.type}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{log.details}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
