import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from './models/Task.js';
import User from './models/User.js';
import cache, { cacheStats } from './cache.js';
import taskEvents, { eventAuditLogs } from './events.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_2026';

app.use(cors());
app.use(express.json());

// 1. Request logging middleware
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

// 3. Connect Database
async function connectDB() {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB connected successfully to ${uri}`);
  } catch (err) {
    console.log('Starting embedded MongoDB instance...');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Embedded MongoDB connected successfully at ${memoryUri}`);

    // Seed default tasks
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.create([
        { title: 'Complete Practical 1 (Component Architecture)', priority: 'high', completed: true },
        { title: 'Complete Practical 2 (Routing & useState)', priority: 'high', completed: true },
        { title: 'Complete Practical 3 (GitHub REST API Integration)', priority: 'medium', completed: true },
        { title: 'Complete Practical 4 (RESTful Express API)', priority: 'high', completed: true },
        { title: 'Complete Practical 5 (MongoDB & Mongoose Validation)', priority: 'high', completed: true },
        { title: 'Complete Practical 6 (Full Stack Integration)', priority: 'high', completed: true },
        { title: 'Complete Practical 7 (JWT Authentication & Middleware)', priority: 'high', completed: true },
        { title: 'Complete Practical 8 (Performance Optimization & Lazy Loading)', priority: 'high', completed: true },
        { title: 'Complete Practical 9 (In-Memory Caching with node-cache)', priority: 'high', completed: false },
      ]);
    }
  }
}
connectDB();

// Authentication Middleware
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed Bearer token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

const validateTaskInput = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Validation Error: Task title is required' });
  }
  next();
};

// --- Auth Routes ---
app.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be >= 6 chars' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), password: hashedPassword });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered', token, user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

app.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// --- Practical 9 Supplementary: Debug Endpoint for Cache Hit/Miss Stats ---
app.get('/cache/stats', (req, res) => {
  res.status(200).json({
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    keys: cache.keys(),
    ttlSeconds: 60,
  });
});

// --- Practical 10: Live Event Audit Logs Endpoint ---
app.get('/events/audit', (req, res) => {
  res.status(200).json({
    count: eventAuditLogs.length,
    events: eventAuditLogs,
  });
});

// --- Practical 13: Secure Backend AI Integration with Graceful Degradation ---
// Simple in-memory rate limiter: max 1 AI request per client per 10 seconds
const aiRateLimiter = new Map();

app.post('/api/ai/generate-description', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const clientIP = req.ip || req.connection.remoteAddress || 'client';
  const lastCall = aiRateLimiter.get(clientIP) || 0;
  const now = Date.now();

  if (now - lastCall < 10000) {
    const waitSec = Math.ceil((10000 - (now - lastCall)) / 1000);
    return res.status(429).json({
      error: `Rate limit: Please wait ${waitSec}s before generating another description`,
      fallback: true,
    });
  }
  aiRateLimiter.set(clientIP, now);

  const apiKey = process.env.OPENAI_API_KEY;

  // Graceful degradation: If key is missing or invalid, generate intelligent rule-based fallback
  if (!apiKey || apiKey === 'mock_or_real_key' || apiKey.includes('your_')) {
    // Graceful offline fallback logic
    const fallbackDescription = `Break down "${title.trim()}" into actionable milestones, verify required dependencies, and execute validation tests.`;
    return res.status(200).json({
      description: fallbackDescription,
      fallback: true,
      provider: 'Local AI Fallback Engine (Graceful Degradation)',
      disclaimer: 'Generated via fallback engine. Review and edit before saving.',
    });
  }

  try {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an agile project assistant. Provide a concise, 1-2 sentence actionable task description for software development.',
        },
        {
          role: 'user',
          content: `Write a short task description for: "${title.trim()}"`,
        },
      ],
      max_tokens: 80,
    });

    const description = completion.choices?.[0]?.message?.content?.trim() || '';
    res.status(200).json({
      description,
      fallback: false,
      provider: 'OpenAI gpt-4o-mini',
      disclaimer: 'AI-generated content. Please review and modify before saving.',
    });
  } catch (err) {
    console.warn('External AI call failed. Gracefully degrading to intelligent fallback:', err.message);
    const fallbackDescription = `Implement and verify "${title.trim()}" with proper error handling and automated test coverage.`;
    res.status(200).json({
      description: fallbackDescription,
      fallback: true,
      provider: 'Graceful Degradation Fallback',
      disclaimer: 'AI service unavailable. Generated via graceful offline fallback.',
    });
  }
});

// --- Protected Task CRUD Routes with In-Memory Caching ---

// GET /tasks - Cached with node-cache
app.get('/tasks', authMiddleware, async (req, res, next) => {
  try {
    const cacheKey = 'all_tasks';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      cacheStats.hits++;
      return res.status(200).json({
        ...cachedData,
        _cache: 'HIT',
      });
    }

    cacheStats.misses++;
    const tasks = await Task.find().sort({ createdAt: -1 });
    const responsePayload = {
      count: tasks.length,
      tasks,
    };

    cache.set(cacheKey, responsePayload, 60); // 60s TTL
    res.status(200).json({
      ...responsePayload,
      _cache: 'MISS',
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id - Supplementary: Single-task caching
app.get('/tasks/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }

    const cacheKey = `task_${req.params.id}`;
    const cachedTask = cache.get(cacheKey);

    if (cachedTask) {
      cacheStats.hits++;
      return res.status(200).json({ task: cachedTask, _cache: 'HIT' });
    }

    cacheStats.misses++;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    cache.set(cacheKey, task, 60);
    res.status(200).json({ task, _cache: 'MISS' });
  } catch (err) {
    next(err);
  }
});

// POST /tasks - Invalidate cache on write
app.post('/tasks', authMiddleware, validateTaskInput, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const newTask = await Task.create({ title, description, completed, priority });

    // Cache Invalidation
    cache.del('all_tasks');

    // Practical 10: Asynchronous event emission
    taskEvents.emit('task:created', newTask);

    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id - Invalidate collection and item cache on write
app.put('/tasks/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

    // Invalidate caches
    cache.del('all_tasks');
    cache.del(`task_${req.params.id}`);

    // Practical 10: Asynchronous event emission
    taskEvents.emit('task:updated', updatedTask);

    res.status(200).json({ message: 'Task updated', task: updatedTask });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - Invalidate collection and item cache on write
app.delete('/tasks/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });

    // Invalidate caches
    cache.del('all_tasks');
    cache.del(`task_${req.params.id}`);

    // Practical 10: Asynchronous event emission
    taskEvents.emit('task:deleted', deleted);

    res.status(200).json({ message: 'Task deleted', task: deleted });
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => res.status(404).json({ error: 'Route Not Found' }));

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => console.log(`Server with node-cache running on http://localhost:${PORT}`));

export default app;
