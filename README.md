# AWDF Lab Practicals Suite (ITUE301)

![CI Pipeline](https://github.com/24it092-ui/24IT092_AWDF/actions/workflows/ci.yml/badge.svg)

**Student:** NEEL SHAH  
**Roll No:** 24IT092  
**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** CSPIT, Charotar University of Science and Technology (CHARUSAT)  

---

## 📌 Practical Index & Git Tags

Each practical assignment has its own dedicated commit and Git Release Tag. You can browse the codebase at any practical stage using the table below:

| Practical | Title | Git Tag | Key Features & Technologies |
| :---: | :--- | :---: | :--- |
| **Practical 1** | React & Component Architecture | [`practical-1`](#) | Vite + React scaffolding, Header, About, dynamic Skills props, Projects, Footer |
| **Practical 2** | State Management & Routing | [`practical-2`](#) | React Router v6, `useState`, controlled Contact form, live character count, Dark/Light theme |
| **Practical 3** | API Integration & Data Rendering | [`practical-3`](#) | GitHub REST API, `useEffect`, loading spinner, error state with retry button, live search |
| **Practical 4** | RESTful API with Node.js & Express | [`practical-4`](#) | Express CRUD server, request logging middleware, Content-Type validator, Richardson Maturity Model evaluation ([MATURITY.md](MATURITY.md)) |
| **Practical 5** | MongoDB Integration & Mongoose Schema | [`practical-5`](#) | MongoDB/Mongoose connection, Task schema, priority enum, pre-save whitespace trim hook, structured validation errors |
| **Practical 6** | Full Stack Integration (React + Node + MongoDB) | [`practical-6`](#) | Centralized [src/api.js](src/api.js), CORS configuration, optimistic UI updates, delete confirmation dialog, toast notifications |
| **Practical 7** | Authentication & Middleware Pipeline | [`practical-7`](#) | `bcryptjs` password hashing, JWT signing & verification, `POST /register`, `POST /login`, `GET /me`, 401 token expiry auto-logout |
| **Practical 8** | Performance Optimization & Lazy Loading | [`practical-8`](#) | Route code-splitting with `React.lazy` and `Suspense`, heavy component dynamic load, bundle measurement ([docs/PERFORMANCE.md](docs/PERFORMANCE.md)) |
| **Practical 9** | In-Memory Caching & Query Optimization | [`practical-9`](#) | `node-cache` integration, 60s TTL, cache invalidation on POST/PUT/DELETE, single-task cache, cache hit/miss stats endpoint ([docs/CACHING.md](docs/CACHING.md)) |
| **Practical 10** | Asynchronous Processing with Event-Driven Architecture | [`practical-10`](#) | `EventEmitter` asynchronous messaging, `task:created`, `task:updated`, `task:deleted` non-blocking background workers ([docs/EVENTS.md](docs/EVENTS.md)) |
| **Practical 12** | CI/CD Pipeline with GitHub Actions | [`practical-12`](#) | `.github/workflows/ci.yml`, automated Vitest suite, lint job (Oxlint), build verification, failure/pass docs ([docs/CICD.md](docs/CICD.md)) |
| **Practical 13** | AI API Integration into a Web Application | [`practical-13`](#) | Server-side AI endpoint `/api/ai/generate-description`, graceful degradation, rate limiting, editable description & disclaimer ([docs/AI_INTEGRATION.md](docs/AI_INTEGRATION.md)) |

---

## 🚀 How to Run Locally

### 1. Start the Backend API (Port 5001)
```bash
node server.js
```

### 2. Start the Frontend Dev Server (Port 5173/5174)
```bash
npm run dev
```

### 3. Check out any specific Practical's code
To switch the codebase to the exact state of any practical:
```bash
git checkout practical-1   # Exact code for Practical 1
git checkout practical-5   # Exact code for Practical 5
git checkout main          # Return to latest integrated practical
```
