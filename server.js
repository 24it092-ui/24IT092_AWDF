import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001; // Using 5001 to avoid system port collisions

app.use(cors());
app.use(express.json());

// 1. Request logging middleware: logs method, URL, and ISO timestamp
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 2. Supplementary Middleware: Reject POST/PUT missing Content-Type application/json
const requireJsonContent = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Bad Request: Content-Type must be application/json',
      });
    }
  }
  next();
};
app.use(requireJsonContent);

// In-memory data store for tasks (CRUD)
let tasks = [
  { id: 1, title: 'Complete Practical 1 (Component Architecture)', status: 'completed' },
  { id: 2, title: 'Complete Practical 2 (Routing & useState)', status: 'completed' },
  { id: 3, title: 'Complete Practical 3 (GitHub REST API Integration)', status: 'completed' },
  { id: 4, title: 'Complete Practical 4 (Node & Express REST API)', status: 'in-progress' },
];

// 3. Supplementary Route Middleware: Validate numeric task ID
const validateTaskId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid Task ID: must be an integer' });
  }
  req.taskId = id;
  next();
};

// --- CRUD Endpoints (Richardson Maturity Model Level 2) ---

// GET /tasks - Read all
app.get('/tasks', (req, res) => {
  res.status(200).json({
    count: tasks.length,
    tasks: tasks.map(t => ({
      ...t,
      // HATEOAS awareness demonstration (Level 3 preview)
      _links: {
        self: `/tasks/${t.id}`,
        update: `/tasks/${t.id}`,
        delete: `/tasks/${t.id}`,
      }
    }))
  });
});

// POST /tasks - Create
app.post('/tasks', (req, res) => {
  const { title, status = 'pending' } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title: title.trim(),
    status,
  };
  tasks.push(newTask);
  res.status(201).json({
    message: 'Task created successfully',
    task: newTask,
    _links: {
      self: `/tasks/${newTask.id}`,
      delete: `/tasks/${newTask.id}`
    }
  });
});

// PUT /tasks/:id - Update
app.put('/tasks/:id', validateTaskId, (req, res) => {
  const index = tasks.findIndex(t => t.id === req.taskId);
  if (index === -1) {
    return res.status(404).json({ error: `Task with ID ${req.taskId} not found` });
  }

  const { title, status } = req.body;
  if (title !== undefined) tasks[index].title = title.trim();
  if (status !== undefined) tasks[index].status = status;

  res.status(200).json({
    message: 'Task updated successfully',
    task: tasks[index],
  });
});

// DELETE /tasks/:id - Delete
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const index = tasks.findIndex(t => t.id === req.taskId);
  if (index === -1) {
    return res.status(404).json({ error: `Task with ID ${req.taskId} not found` });
  }

  const deleted = tasks.splice(index, 1)[0];
  res.status(200).json({
    message: 'Task deleted successfully',
    task: deleted,
  });
});

// 4. Custom 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
    path: req.originalUrl,
    method: req.method,
  });
});

// 5. Global Error Handling Middleware (must be defined last)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
  });
});

app.listen(PORT, () => {
  console.log(`Task Manager REST API running on http://localhost:${PORT}`);
});

export default app;
