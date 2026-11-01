# In-Memory Caching & Query Optimization (Practical 9)

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** NEEL SHAH  
**Roll No:** 24IT092  
**Institute:** CSPIT, CHARUSAT  

---

## 1. Measured Response Time Comparison Table

Empirical measurements recorded via `curl` and Postman over `GET /tasks`:

| Reading # | Uncached (Database Read / MISS) | Cached (`node-cache` / HIT) | Latency Reduction |
| :---: | :---: | :---: | :---: |
| **Sample 1** | **6.64 ms** | **2.15 ms** | **67.6% faster** |
| **Sample 2** | **6.42 ms** | **1.97 ms** | **69.3% faster** |
| **Sample 3** | **6.78 ms** | **1.89 ms** | **72.1% faster** |
| **Average** | **6.61 ms** | **2.00 ms** | **~70% latency drop** |

---

## 2. Answers to Key Questions & Analysis

### Q1. Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?
If the cache is not invalidated during `POST`, `PUT`, or `DELETE`, clients querying the API will continue to receive stale data from memory until the TTL expires. This causes serious data inconsistency bugs (e.g., a deleted task still appearing on screen, or edited task titles reverting to their old values).

### Q2. What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?
In task management apps, a TTL of **30 to 60 seconds** is reasonable when paired with active write invalidation (`cache.del`).  
**The Trade-off:**
- **Longer TTL:** Maximizes cache hit ratio and offloads database pressure, but risks serving stale data if external background processes mutate the database without invalidating the application cache.
- **Shorter TTL:** Guarantees higher freshness and lower staleness window, but increases database load from frequent cache misses.

### Q3. Why is in-memory caching (`node-cache`) not suitable for a multi-server/multi-instance deployment?
`node-cache` stores items in the local RAM memory of a single Node.js OS process. In a distributed deployment with multiple server instances behind a load balancer (e.g. Nginx or Kubernetes):
- A user creating a task on **Server A** will only invalidate Server A's local cache.
- Their subsequent request may be routed by the load balancer to **Server B**, which still holds the old cached state in its independent RAM.
- **Solution for Production:** A centralized distributed cache such as **Redis** or **Memcached** shared across all application instances.
