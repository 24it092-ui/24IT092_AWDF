# Asynchronous Processing with Event-Driven Architecture (Practical 10)

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** NEEL SHAH  
**Roll No:** 24IT092  
**Institute:** CSPIT, CHARUSAT  

---

## 1. Architectural Overview & Diagram

```
                 Client HTTP Request
                         │
                         ▼
             Express Route Controller
                         │
             ┌───────────┴───────────┐
             │ (Sync DB Write)       │ (Async Emit)
             ▼                       ▼
      MongoDB Database       taskEvents (EventEmitter)
             │                       │
      Return HTTP 201         ┌──────┴──────────────────────┐
      (Immediate Response)    │                             │
                              ▼                             ▼
                      Audit Logger Worker           Notification Queue
                      (Non-blocking I/O)            (Async Worker)
```

---

## 2. Event Registry & Implementations

In [events.js](file:///Users/neel/Downloads/AWDF%20Project/events.js), an asynchronous `EventEmitter` decouples secondary side-effects from the primary request-response cycle:

| Event Name | Trigger Location | Purpose | Processing Type |
| :--- | :--- | :--- | :--- |
| **`task:created`** | `POST /tasks` | Dispatches asynchronous email notification & audit record | Asynchronous / Non-blocking |
| **`task:updated`** | `PUT /tasks/:id` | Records task state mutation and compliance audit | Asynchronous |
| **`task:deleted`** | `DELETE /tasks/:id` | Purges dependent analytical records & logs tombstone | Asynchronous |

---

## 3. Key Concepts & Viva Analysis

### Q1. Why use an Event-Driven Architecture (EDA) instead of executing side-effects sequentially inside the route handler?
- **Response Latency:** Sending an email or logging to an external service sequentially inside `POST /tasks` forces the client to wait hundreds of milliseconds. In an event-driven design, the server emits `task:created` and immediately returns `201 Created` to the user in less than 5 ms.
- **Decoupling (Single Responsibility):** The controller only cares about saving the resource. Additional consumers (analytics, notification, audit) can listen to the event without touching or complicating the controller code.

### Q2. How does Node.js handle asynchronous events under the hood?
Node's `EventEmitter` executes listeners synchronously within the current tick of the Event Loop unless listeners explicitly delegate work to background timers, microtasks, or libuv thread pool operations. Wrapping worker logic in asynchronous promises or job queues ensures main-thread responsiveness.
