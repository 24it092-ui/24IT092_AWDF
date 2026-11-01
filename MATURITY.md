# Richardson Maturity Model: REST API Evaluation

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** NEEL SHAH  
**Roll No:** 24IT092  
**Institute:** CSPIT, CHARUSAT  

---

## 1. Evaluation Table

| Level | Criterion | Does API Satisfy? | Evidence / Implementation Details |
| :--- | :--- | :---: | :--- |
| **Level 0: The Swamp of POX** | Single URI, single HTTP method (typically POST) tunnelled for all RPC operations. | **NO (Exceeded)** | The API does not tunnel calls through an RPC-style endpoint (e.g. `/api` with action payloads). |
| **Level 1: Distinct Resources** | Separate URIs for individual business resources instead of a single catch-all endpoint. | **YES** | Discrete resource URIs: `/tasks` collection endpoint and individual entity endpoints `/tasks/:id`. |
| **Level 2: HTTP Verbs & Status Codes** | Correct HTTP standard methods (GET, POST, PUT, DELETE) combined with standard HTTP status codes (200, 201, 400, 404, 500). | **YES** | • `GET /tasks` $\rightarrow$ `200 OK`<br>• `POST /tasks` $\rightarrow$ `201 Created`<br>• `PUT /tasks/:id` $\rightarrow$ `200 OK` (or `404`)<br>• `DELETE /tasks/:id` $\rightarrow$ `200 OK` (or `404`)<br>• Bad input / validation error $\rightarrow$ `400 Bad Request`<br>• Unhandled exceptions $\rightarrow$ `500 Internal Server Error`. |
| **Level 3: Hypermedia Controls (HATEOAS)** | Hypermedia as the Engine of Application State: responses contain hypermedia links guiding client to next valid actions. | **Partial / Awareness** | Embedded `_links` object inside task objects demonstrating next valid transitions (`self`, `update`, `delete`). Full Level 3 client-driven state transitions are prototyped below. |

---

## 2. Overall Assessment
- **Current Level:** **Level 2 (Solid & Compliant)** with Level 3 awareness links.
- **Justification:** Every endpoint uses appropriate standard HTTP methods for semantics, provides predictable status codes, leverages separate resource URIs, and validates headers and payload structure.

---

## 3. HATEOAS (Level 3) Representation
Target response payload for `GET /tasks/123`:
```json
{
  "id": 123,
  "title": "Build Practical 4 RESTful Backend",
  "status": "completed",
  "_links": {
    "self": { "href": "/tasks/123", "method": "GET" },
    "update": { "href": "/tasks/123", "method": "PUT" },
    "delete": { "href": "/tasks/123", "method": "DELETE" },
    "collection": { "href": "/tasks", "method": "GET" }
  }
}
```

---

## 4. Why Most Production APIs Stop at Level 2
Most industry APIs (e.g., GitHub, Stripe, Twitter) intentionally stop at **Level 2** because:
1. **Client Complexity:** Implementing a true dynamic HATEOAS client that discovers actions dynamically adds excessive parsing overhead compared to standard client-side API SDKs and OpenAPI/Swagger schemas.
2. **Payload Bloat:** Hypermedia links significantly increase the bandwidth footprint of JSON payloads on high-throughput microservices.
3. **Decoupling Realities:** Frontend applications usually need dedicated UI components wired to specific predictable routes anyway; dynamic hypermedia navigation rarely eliminates frontend build-time contracts.
