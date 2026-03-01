
import dotenv from 'dotenv';
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { getPool } from '../../../../shared/lib/db.js'; 

dotenv.config();

describe('Login Service API Tests', () => {
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

  beforeAll(async () => {
    const pool = getPool();
    try {
      await pool.query('DELETE FROM Login WHERE user_ID IN (SELECT user_ID FROM User WHERE user_email = ?)', [testUser.email]);
      await pool.query('DELETE FROM User WHERE user_email = ?', [testUser.email]);
      console.log("Test environment scrubbed.");
    } catch (err) {
      console.log("Cleanup status:", err.message);
    }
  });

  it('POST /api/register - should create a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/success/i); 
  });

  it('POST /api/login - should authenticate valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty('user'); 
    expect(res.body.user).toHaveProperty('role');
    expect(res.body.user.role.toLowerCase()).toBe('driver');
  });

  it('POST /api/login - should reject incorrect password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: 'WrongPassword' });

    expect(res.statusCode).toBe(401);
  });
});
