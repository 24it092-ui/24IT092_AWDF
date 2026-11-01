import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Task Management API Automated Tests (CI/CD Pipeline)', () => {
  // Test 1: Verify Cache Debug Stats Endpoint
  it('GET /cache/stats returns 200 with hits and misses', async () => {
    const res = await request(app).get('/cache/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('hits');
    expect(res.body).toHaveProperty('misses');
    expect(res.body).toHaveProperty('ttlSeconds', 60);
  });

  // Test 2: Verify Protected Route Rejection without Bearer Token
  it('GET /tasks rejects request with 401 Unauthorized when token is missing', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  // Test 3: Verify Event-Driven Audit Logs Endpoint
  it('GET /events/audit returns 200 with audit events array', async () => {
    const res = await request(app).get('/events/audit');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);
  });
});
