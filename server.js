import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from './models/Task.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// 1. Request logging middleware: logs method, URL, and timestamp
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 2. Reject POST/PUT missing Content-Type application/json
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

// 3. Connect to MongoDB (Connects to MONGO_URI, or initializes in-memory MongoDB fallback if local mongod is absent)
async function connectDB() {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB connected successfully to ${uri}`);
  } catch (err) {
    console.log('External MongoDB not found. Starting embedded MongoDB instance for seamless lab testing...');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Embedded MongoDB connected successfully at ${memoryUri}`);

    // Seed default tasks
    await Task.create([
      { title: 'Complete Practical 1 (Component Architecture)', priority: 'high', completed: true },
      { title: 'Complete Practical 2 (Routing & useState)', priority: 'high', completed: true },
      { title: 'Complete Practical 3 (GitHub REST API Integration)', priority: 'medium', completed: true },
      { title: 'Complete Practical 4 (RESTful Express API)', priority: 'high', completed: true },
      { title: 'Complete Practical 5 (MongoDB & Mongoose Validation)', priority: 'high', completed: false },
    ]);
  }
}
connectDB();

// --- CRUD Endpoints with Real Mongoose Operations ---

// GET /tasks - Read all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id - Supplementary: Read single task with proper 404 handling
app.get('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${req.params.id} not found` });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// POST /tasks - Create task with Mongoose schema validation
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const newTask = await Task.create({
      title,
      description,
      completed,
      priority,
    });
    res.status(201).json({
      message: 'Task created successfully in MongoDB',
      task: newTask,
    });
  } catch (err) {
    // Structured validation errors instead of raw Mongoose error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        error: 'Validation Error',
        details: messages,
      });
    }
    next(err);
  }
});

// PUT /tasks/:id - Update task by ID
app.put('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: `Task with ID ${req.params.id} not found` });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        error: 'Validation Error',
        details: messages,
      });
    }
    next(err);
  }
});

// DELETE /tasks/:id - Delete task by ID
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }

    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: `Task with ID ${req.params.id} not found` });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task: deleted,
    });
  } catch (err) {
    next(err);
  }
});

// 4. Custom 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
    path: req.originalUrl,
    method: req.method,
  });
});

// 5. Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server',
  });
});

app.listen(PORT, () => {
  console.log(`Task Manager API with MongoDB running on http://localhost:${PORT}`);
});

export default app;
