import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

// 1. Setup the mock pool with both query AND execute
const mockPoolInstance = {
  query: vi.fn(),
  execute: vi.fn(),
  getConnection: vi.fn().mockResolvedValue({
    query: vi.fn(),
    execute: vi.fn(),
    release: vi.fn(),
    beginTransaction: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
  })
};

vi.mock('../../../../shared/lib/db.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    test_connection: vi.fn().mockResolvedValue(true),
    getPool: vi.fn(() => mockPoolInstance)
  };
});

import app from '../src/server.js';
import * as db from '../../../../shared/lib/db.js';

describe('Login Service API Tests (Mocked)', () => {
  const testUser = {
    email: 'test_unit@clemson.edu',
    password: 'Password123!', 
    role: 'driver',
    username: 'testguy_unit',
    first_name: 'Test',
    last_name: 'User',
    phone: '864-555-0000',
    company_ID: 1
  };

let fakePasswordHash;

  beforeAll(async () => {
    // Generate a fresh hash using the actual library on the machine
    fakePasswordHash = await bcrypt.hash(testUser.password, 10);
  });

  beforeEach(() => {
    // This clears out all the "memory" of previous database calls
    vi.clearAllMocks();
  });

  it('POST /api/register - should create a new user', async () => {
    const mockConn = await mockPoolInstance.getConnection();
    mockConn.execute.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{ insertId: 101 }]);
    mockConn.query.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{ insertId: 101 }]);

    const res = await request(app).post('/api/register').send(testUser);
    expect(res.statusCode).toBe(201);
  });

  it('POST /api/login - should authenticate valid credentials', async () => {
    const dbResponse = [[{ 
      user_ID: 1, 
      user_email: testUser.email, 
      password_hash: fakePasswordHash, 
      role: 'driver' 
    }], []];

    mockPoolInstance.query.mockResolvedValueOnce(dbResponse);
    mockPoolInstance.execute.mockResolvedValueOnce(dbResponse);

    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
  });

  it('POST /api/login - should reject incorrect password', async () => {
    const dbResponse = [[{ 
      user_ID: 1, 
      user_email: testUser.email, 
      password_hash: fakePasswordHash, 
      role: 'driver' 
    }], []];

    mockPoolInstance.query.mockResolvedValueOnce(dbResponse);
    mockPoolInstance.execute.mockResolvedValueOnce(dbResponse);

    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: 'WrongPassword' });

    expect(res.statusCode).toBe(401);
  });
});
