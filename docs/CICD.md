# CI/CD Pipeline with GitHub Actions (Practical 12)

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** NEEL SHAH  
**Roll No:** 24IT092  
**Institute:** CSPIT, CHARUSAT  

---

## 1. CI/CD Architecture & Workflow Specification

The automated pipeline is defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

```
git push origin main / PR
          │
          ▼
    GitHub Actions
          │
   ┌──────┴──────────────────────────┐
   │ Job 1: lint (Code Quality)       │
   │ ├── Checkout repository         │
   │ ├── Setup Node.js 20            │
   │ ├── npm install                 │
   │ └── npm run lint (Oxlint)       │
   └──────┬──────────────────────────┘
          │ (Passes)
          ▼
   ┌─────────────────────────────────┐
   │ Job 2: build-and-test           │
   │ ├── Checkout repository         │
   │ ├── Setup Node.js 20            │
   │ ├── npm install                 │
   │ ├── npm test (Automated Vitest) │
   │ └── npm run build (Production)  │
   └──────┬──────────────────────────┘
          ▼
   Status: ✅ Green Checkmark / ❌ Red Cross
```

---

## 2. Automated Test Suite

Implemented in [`tests/api.test.js`](../tests/api.test.js):
- **Test 1:** `GET /cache/stats` returns `200 OK` with valid `hits`, `misses`, and `ttlSeconds: 60`.
- **Test 2:** `GET /tasks` without Bearer token returns `401 Unauthorized` protecting secured endpoints.
- **Test 3:** `GET /events/audit` returns `200 OK` with structured array of real-time audit entries.

---

## 3. Deliberate Failure & Fix Demonstration (Lab Requirement)

### A. Failure Case:
When an assertion in `tests/api.test.js` is changed to expect an invalid status (e.g. `expect(res.statusCode).toBe(500)` for `/cache/stats`):
- **Result:** `vitest` exits with code 1.
- **Pipeline:** GitHub Actions halts at the `Run Automated Integration Tests` step and marks the commit with a **Red X (❌)**.

### B. Fixed Case:
When the assertion matches the actual API contract (`expect(res.statusCode).toBe(200)`):
- **Result:** All 3 test suites pass in ~500 ms.
- **Pipeline:** GitHub Actions reports **Green Checkmark (✅)**.

---

## 4. Key Questions & Viva Analysis

### Q1. What is the difference between Continuous Integration (CI) and Continuous Deployment (CD), and which one does this practical demonstrate?
- **Continuous Integration (CI):** Automates building, linting, and executing automated test suites whenever code is committed to detect integration bugs early.
- **Continuous Deployment (CD):** Automatically packages and deploys the tested build artifacts to staging or production servers (e.g., AWS, Render, Vercel).
- **Demonstration:** This practical primarily demonstrates **Continuous Integration (CI)** with automated quality gating.

### Q2. Why does running tests automatically on every push catch problems earlier than testing manually before a release?
Automated CI tests execute immediately upon every commit or pull request within an isolated environment. Developers receive instant feedback while their changes are small and fresh in memory, preventing broken code from accumulating into an expensive release-day debugging nightmare.
