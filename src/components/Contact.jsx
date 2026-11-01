import { useState } from 'react';

export default function Contact({ studentEmail }) {
  // useState 1: Controlled form input with real-time character count
  const [message, setMessage] = useState('');
  // useState 2: Toggle UI visibility (help tooltip / instructions)
  const [showTooltip, setShowTooltip] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">📬</div>
        <div>
          <h2>Contact Neel Shah</h2>
          <p className="section-subtitle">Controlled input & real-time reactive state</p>
        </div>
      </div>

      {/* Visibility Toggle Button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          className="nav-button"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)' }}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          {showTooltip ? 'Hide Form Help ▴' : 'Show Form Help ▾'}
        </button>
        {showTooltip && (
          <div className="qa-card" style={{ marginTop: '0.75rem', borderColor: 'var(--accent)' }}>
            <p>ℹ️ Type a message below. The input is fully controlled by <code>useState</code> and updates the preview & character counter live without page reload.</p>
          </div>
        )}
      </div>

      {submitted ? (
        <div className="qa-card" style={{ borderColor: 'var(--success)', padding: '1.5rem' }}>
          <h4 style={{ color: 'var(--success)' }}>✓ Message Dispatched to State!</h4>
          <p style={{ marginTop: '0.5rem', color: '#fff' }}>"{message}"</p>
          <button
            type="button"
            className="nav-button"
            style={{ marginTop: '1rem', background: 'var(--primary)', color: '#fff' }}
            onClick={() => { setSubmitted(false); setMessage(''); }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="message-input" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Your Message:
            </label>
            <textarea
              id="message-input"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message here..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.85rem',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            {/* Live Character Count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
              <span>Live Count: <strong style={{ color: 'var(--accent)' }}>{message.length}</strong> characters</span>
              <span>Recipient: {studentEmail}</span>
            </div>
          </div>

          {/* Real-time controlled preview */}
          {message && (
            <div className="qa-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-sub)' }}>Real-time Input Preview:</span>
              <p style={{ color: '#e2e8f0', marginTop: '0.25rem' }}>{message}</p>
            </div>
          )}

          <button
            type="submit"
            className="nav-button"
            style={{ background: 'var(--primary)', color: '#fff', padding: '0.75rem 1.5rem', alignSelf: 'flex-start', borderRadius: '8px' }}
          >
            Submit Message
          </button>
        </form>
      )}
    </section>
  );
}
