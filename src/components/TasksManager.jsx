import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, registerUser, loginUser, getMe, logoutUser } from '../api';

export default function TasksManager() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth form states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('neel.shah@charusat.edu.in');
  const [password, setPassword] = useState('password123');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Task form state
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check current session via /me endpoint
  const checkAuth = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
      loadTasks();
    } catch (err) {
      setUser(null);
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      if (err.message === 'UNAUTHORIZED_EXPIRED') {
        setUser(null);
        showToast('Session expired or unauthorized. Please log in.', 'error');
      } else {
        setError(err.message || 'Failed to fetch tasks.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (isRegisterMode) {
        await registerUser(email, password);
        showToast('✓ Registration successful! Logged in with JWT.');
      } else {
        await loginUser(email, password);
        showToast('✓ Logged in successfully with JWT token.');
      }
      checkAuth();
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setTasks([]);
    showToast('Logged out. JWT token cleared from localStorage.');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Task title cannot be empty', 'error');
      return;
    }

    const optimisticId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: optimisticId,
      title: title.trim(),
      priority,
      completed: false,
    };

    setTasks((prev) => [optimisticTask, ...prev]);
    const inputTitle = title;
    setTitle('');
    showToast('Task added optimistically! Syncing with MongoDB...', 'info');

    try {
      const result = await createTask({ title: inputTitle, priority });
      setTasks((prev) => prev.map((t) => (t._id === optimisticId ? result.task : t)));
      showToast('✓ Task confirmed & persisted in MongoDB!', 'success');
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t._id !== optimisticId));
      if (err.message === 'UNAUTHORIZED_EXPIRED') {
        setUser(null);
        showToast('Session expired. Please log in again.', 'error');
      } else {
        showToast(`Creation failed: ${err.message}`, 'error');
      }
    }
  };

  const handleToggle = async (task) => {
    const updatedStatus = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: updatedStatus } : t))
    );

    try {
      await updateTask(task._id, { completed: updatedStatus });
      showToast(`Task marked as ${updatedStatus ? 'completed' : 'pending'}`);
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: !updatedStatus } : t))
      );
      showToast(`Update error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, taskTitle) => {
    const confirmed = window.confirm(`Delete task "${taskTitle}" from MongoDB?`);
    if (!confirmed) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast(`Deleted task "${taskTitle}"`);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <section className="portfolio-section card">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? 'var(--primary)' : '#10b981',
            color: '#fff',
            padding: '0.85rem 1.4rem',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="section-header">
        <div className="section-icon">🔐</div>
        <div>
          <h2>Practical 7: JWT Authentication & Middleware Pipeline</h2>
          <p className="section-subtitle">
            bcrypt hashing, JWT Authorization: Bearer tokens, /me profile, and 401 expiry protection
          </p>
        </div>
      </div>

      {/* Auth State Switcher */}
      {!user ? (
        <div className="qa-card" style={{ maxWidth: '480px', margin: '1rem auto 2rem', padding: '1.75rem', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>
            {isRegisterMode ? 'Create Account (bcrypt Hash)' : 'Sign In with JWT'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Task routes are protected by server-side <code>authMiddleware</code>. Sign in to view and manage tasks.
          </p>

          {authError && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '0.6rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Password (min 6 chars)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff' }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="nav-button"
              style={{ background: 'var(--primary)', color: '#fff', borderRadius: '6px', padding: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}
            >
              {authLoading ? 'Authenticating...' : isRegisterMode ? 'Register & Generate JWT' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.5rem' }}
            >
              {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register here"}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* User Profile Bar (Supplementary: /me endpoint) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99,102,241,0.1)', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.25)', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as: </span>
              <strong style={{ color: '#fff' }}>{user.email}</strong>
              <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>JWT Active ✓</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="nav-button"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0.4rem 0.9rem' }}
            >
              Logout (Clear JWT)
            </button>
          </div>

          {/* Task Creation Form (Protected by JWT) */}
          <form onSubmit={handleCreate} style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New task title..."
              style={{
                flex: '1',
                minWidth: '240px',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#fff',
                outline: 'none',
              }}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                background: 'rgba(30,41,59,0.9)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
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
              className="nav-button"
              style={{ background: 'var(--primary)', color: '#fff', borderRadius: '8px', padding: '0.75rem 1.5rem' }}
            >
              + Add Protected Task
            </button>
          </form>

          {/* Tasks List */}
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Verifying JWT & fetching tasks...</p>
          ) : error ? (
            <div className="qa-card" style={{ borderColor: '#ef4444', textAlign: 'center', padding: '1.5rem' }}>
              <p style={{ color: '#f87171' }}>{error}</p>
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
                    padding: '0.85rem 1.25rem',
                    borderRadius: '10px',
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
                      onChange={() => handleToggle(t)}
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
                    onClick={() => handleDelete(t._id, t.title)}
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
        </>
      )}
    </section>
  );
}
