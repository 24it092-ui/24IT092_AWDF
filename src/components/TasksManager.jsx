import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';

export default function TasksManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [toast, setToast] = useState(null); // Toast notification for user actions

  // Show auto-dismissing toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Supplementary Problem: Optimistic UI update for task creation
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
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistically update UI immediately
    setTasks((prev) => [optimisticTask, ...prev]);
    const inputTitle = title;
    setTitle('');
    showToast('Task added optimistically! Syncing with MongoDB...', 'info');

    // 2. Perform background server write
    try {
      const result = await createTask({ title: inputTitle, priority });
      // Replace temporary optimistic item with actual saved document
      setTasks((prev) =>
        prev.map((t) => (t._id === optimisticId ? result.task : t))
      );
      showToast('✓ Task confirmed & persisted in MongoDB!', 'success');
    } catch (err) {
      // Rollback optimistic state if server rejects
      setTasks((prev) => prev.filter((t) => t._id !== optimisticId));
      showToast(`Creation failed: ${err.message}`, 'error');
    }
  };

  const handleToggle = async (task) => {
    const updatedStatus = !task.completed;
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: updatedStatus } : t))
    );

    try {
      await updateTask(task._id, { completed: updatedStatus });
      showToast(`Task marked as ${updatedStatus ? 'completed' : 'pending'}`);
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: !updatedStatus } : t))
      );
      showToast(`Update error: ${err.message}`, 'error');
    }
  };

  // Supplementary Problem: Confirmation dialog before deleting
  const handleDelete = async (id, taskTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete task "${taskTitle}" from MongoDB?`);
    if (!confirmed) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast(`Deleted task "${taskTitle}" successfully`);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <section className="portfolio-section card">
      {/* Toast Notification Component */}
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}

      <div className="section-header">
        <div className="section-icon">⚡</div>
        <div>
          <h2>Practical 6: Full Stack Integration (React + Node + MongoDB)</h2>
          <p className="section-subtitle">
            Live end-to-end CRUD, CORS enabled, Optimistic UI updates & Confirmation modal
          </p>
        </div>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleCreate} style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title (tests optimistic UI updates)..."
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
          + Add Task (Full-Stack)
        </button>
      </form>

      {/* Tasks Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Synchronizing with MongoDB backend...</p>
        </div>
      ) : error ? (
        <div className="qa-card" style={{ borderColor: '#ef4444', textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ color: '#f87171' }}>{error}</p>
          <button type="button" onClick={loadTasks} className="nav-button" style={{ marginTop: '1rem', background: '#ef4444', color: '#fff' }}>
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
    </section>
  );
}
