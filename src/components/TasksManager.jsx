import { useState, useEffect } from 'react';

export default function TasksManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const API_URL = 'http://localhost:5001/tasks';

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError('Could not reach MongoDB backend at http://localhost:5001. Make sure node server.js is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.details) {
          setValidationErrors(result.details);
        } else {
          setValidationErrors([result.error || 'Failed to create task']);
        }
      } else {
        setTitle('');
        setPriority('medium');
        fetchTasks();
      }
    } catch (err) {
      setValidationErrors(['Network error connecting to backend']);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCompleted = async (task) => {
    try {
      await fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">🗄️</div>
        <div>
          <h2>Practical 4 & 5: Live MongoDB Task Manager</h2>
          <p className="section-subtitle">
            Connected to <code>node server.js</code> (Express + Mongoose Schema Validation)
          </p>
        </div>
      </div>

      {/* Create Task Form demonstrating Mongoose Schema & Validation */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title (tests pre-save whitespace trim)..."
            style={{
              flex: '1',
              minWidth: '240px',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              color: '#fff',
              outline: 'none',
            }}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              color: '#fff',
              outline: 'none',
            }}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="nav-button"
            style={{ background: 'var(--primary)', color: '#fff', borderRadius: '8px', padding: '0.65rem 1.25rem' }}
          >
            {submitting ? 'Saving...' : '+ Add Task (MongoDB)'}
          </button>
        </div>

        {/* Structured Mongoose Validation Error Display */}
        {validationErrors.length > 0 && (
          <div className="qa-card" style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
            <h4 style={{ color: '#ef4444' }}>⚠️ Mongoose Schema Validation Failed:</h4>
            <ul style={{ margin: '0.5rem 0 0 1.25rem', color: '#fca5a5' }}>
              {validationErrors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {/* Task List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading live tasks from MongoDB...</p>
      ) : error ? (
        <div className="qa-card" style={{ borderColor: '#ef4444', textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ color: '#f87171' }}>{error}</p>
          <button type="button" onClick={fetchTasks} className="nav-button" style={{ marginTop: '1rem', background: '#ef4444', color: '#fff' }}>
            Retry Connection
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No tasks found in database.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map((t) => (
            <div
              key={t._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.2rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => handleToggleCompleted(t)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? 'var(--text-sub)' : '#fff', fontWeight: 500 }}>
                  {t.title}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background:
                      t.priority === 'high' ? 'rgba(239,68,68,0.2)' : t.priority === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(56,189,248,0.2)',
                    color: t.priority === 'high' ? '#f87171' : t.priority === 'medium' ? '#fbbf24' : '#38bdf8',
                  }}
                >
                  {t.priority}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(t._id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Delete ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
