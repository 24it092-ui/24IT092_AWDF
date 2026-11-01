import { useState } from 'react';

export default function AiAssistantView() {
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [editableDesc, setEditableDesc] = useState('');
  const [history, setHistory] = useState([
    {
      id: 1,
      title: 'Implement OAuth 2.0 Google Login',
      description: 'Integrate Google Identity Services with passport.js, store refresh tokens securely in MongoDB, and issue JWT session tokens.',
      provider: 'OpenAI gpt-4o-mini',
      time: '17:28:10',
    },
    {
      id: 2,
      title: 'Optimize Database Aggregation Queries',
      description: 'Index frequently filtered timestamp columns, replace in-memory sorting with MongoDB pipeline operators, and measure latency reduction.',
      provider: 'Graceful Fallback Engine',
      time: '17:29:45',
    },
  ]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5001/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle.trim() }),
      });

      const data = await res.json();
      setResult(data);
      setEditableDesc(data.description || '');

      if (data.description) {
        setHistory((prev) => [
          {
            id: Date.now(),
            title: taskTitle.trim(),
            description: data.description,
            provider: data.provider || 'AI Engine',
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      const fallback = `Break down "${taskTitle.trim()}" into modular sprint goals, verify requirements, and write unit test specs.`;
      setResult({
        description: fallback,
        fallback: true,
        provider: 'Local Graceful Degradation',
        disclaimer: 'Generated via fallback. Backend call offline.',
      });
      setEditableDesc(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">🤖</div>
        <div>
          <h2>Practical 13: AI Assistant & Description Generator</h2>
          <p className="section-subtitle">
            Secure Backend AI Integration (OpenAI / Gemini) with Graceful Degradation & Rate Limiting
          </p>
        </div>
      </div>

      {/* Security Architecture Explainer */}
      <div className="qa-card" style={{ marginBottom: '2rem', background: 'rgba(99,102,241,0.06)' }}>
        <h4 style={{ color: '#e0e7ff', marginBottom: '0.4rem' }}>🔒 Secure Server-Side AI Architecture</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
          As required by Practical 13, all AI interactions pass through the Node/Express backend (`/api/ai/generate-description`).
          The <code>API_KEY</code> is strictly kept in server <code>.env</code> and <strong>never exposed</strong> in browser network payloads. 
          If third-party AI is unavailable or rate-limited, the system executes <strong>Graceful Degradation</strong> without application crash.
        </p>
      </div>

      {/* Input Generator Form */}
      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter a task title (e.g. Build Payment Gateway, Setup Redis Cache)..."
          style={{
            flex: '1',
            minWidth: '280px',
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
          disabled={loading}
          className="nav-button"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: '#fff',
            borderRadius: '8px',
            padding: '0.75rem 1.4rem',
            fontWeight: 600,
          }}
        >
          {loading ? '✨ AI Thinking...' : '✨ Generate AI Description'}
        </button>
      </form>

      {/* AI Output Box */}
      {result && (
        <div className="qa-card" style={{ marginBottom: '2.5rem', borderColor: result.fallback ? '#fbbf24' : '#a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: result.fallback ? '#fbbf24' : '#a855f7' }}>
              Provider: {result.provider}
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-sub)' }}>
              Status: {result.fallback ? 'Graceful Fallback ✓' : 'Live API Response ✓'}
            </span>
          </div>

          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '0.35rem' }}>
            Editable AI Output (Review & Modify):
          </label>
          <textarea
            rows="3"
            value={editableDesc}
            onChange={(e) => setEditableDesc(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0.75rem',
              color: '#fff',
              fontFamily: 'inherit',
              fontSize: '0.92rem',
              outline: 'none',
            }}
          />

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            ⚠️ <em>{result.disclaimer}</em>
          </p>
        </div>
      )}

      {/* History Feed */}
      <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>Recent AI Task Generations</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {history.map((h) => (
          <div
            key={h.id}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <strong style={{ color: '#e0e7ff' }}>{h.title}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{h.provider} • {h.time}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              {h.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
