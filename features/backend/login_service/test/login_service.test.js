import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import * from '../src/controllers/login_controller.js';
import * as login_model from '../src/models/login_model.js';

vi.mock('../src/models/login_model.js', () => ({
    
