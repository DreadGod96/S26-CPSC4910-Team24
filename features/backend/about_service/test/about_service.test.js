import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { pull_data } from '../src/controllers/about_controller.js';
import * as about_model from '../src/models/about_model.js';

//create mock model
vi.mock('../src/models/about_model.js', () => ({
    get_about: vi.fn()
}));

const app = express();
app.get('/api/about', pull_data);

describe('GET /api/about', () => {
    it('should return 200 and TigerPoints About data', async () => {
        vi.mocked(about_model.get_about).mockResolvedValue({
            team_num: 24,
            version_num: 2,
            release_date: '2026-02-11',
            product_name: 'TigerPoints',
            product_desc: 'A point-based driver incentive program.'
        });

        //call endpoint with supertest request
        const res = await request(app).get('/api/about');

        //compare results
        expect(res.statusCode).toBe(200);
        expect(res.body.team_num).toBe(24);
        expect(res.body.release_date).toBe('2026-02-11');
        expect(res.body.product_name).toBe('TigerPoints');
        expect(res.body.product_desc).toBe('A point-based driver incentive program.');
    });
});

