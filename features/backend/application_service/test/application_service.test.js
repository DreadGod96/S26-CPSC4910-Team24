import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import the controller functions
import { post_data, get_company_list, get_company_id_by_name } from '../src/controllers/application_controller.js';

// Mock the Model - Path: application_service/src/models/application_model.js
import * as application_model from '../src/models/application_model.js';
vi.mock('../src/models/application_model.js', () => ({
    post_application: vi.fn(),
    get_company_list: vi.fn(),
    get_company_id_by_name: vi.fn()
}));

// Mock the shared stored procedures - Fixed path (4 levels up to reach project root)
import * as storedProcedures from '../../../../shared/lib/storedProcedures.js';
vi.mock('../../../../shared/lib/storedProcedures.js', () => ({
    get_company_id_by_name: vi.fn(),
    submit_application: vi.fn(),
    get_company_list: vi.fn()
}));

// Initialize Express
const app = express();
app.use(express.json());

// Routes
app.post('/api/application', post_data);
app.get('/api/application/companylist', get_company_list);
app.get('/api/application/getcompanyid', get_company_id_by_name);

describe('Application Service API', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Test: POST /api/application
    describe('POST /api/application', () => {
        it('should successfully submit an application', async () => {
            // Mock DB lookup for company name -> ID
            vi.mocked(storedProcedures.get_company_id_by_name).mockResolvedValue(101);
            
            // Mock Model response
            vi.mocked(application_model.post_application).mockResolvedValue({
                user_ID: 1,
                application_ID: 50
            });

            const res = await request(app)
                .post('/api/application')
                .send({
                    driver_ID: 1,
                    application_title: 'Full-time Driver',
                    company_name: 'FastTrucking'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Application submitted successfully');
            expect(res.body.application_ID).toBe(50);
        });

        it('should return 400 if fields are missing', async () => {
            const res = await request(app)
                .post('/api/application')
                .send({ driver_ID: 1 });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Missing required fields');
        });
    });

    // Test: GET /api/application/companylist
    describe('GET /api/application/companylist', () => {
        it('should return a list of companies', async () => {
            const mockCompanies = [{ id: 1, name: 'Logistics Inc' }];
            vi.mocked(application_model.get_company_list).mockResolvedValue(mockCompanies);

            const res = await request(app).get('/api/application/companylist');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockCompanies);
        });
    });

    // Test: GET /api/application/getcompanyid
    describe('GET /api/application/getcompanyid', () => {
        it('should return company ID for a valid name', async () => {
            // This is where it was failing with a 500 previously
            vi.mocked(storedProcedures.get_company_id_by_name).mockResolvedValue(99);

            const res = await request(app)
                .get('/api/application/getcompanyid')
                .query({ company_name: 'TestCorp' });

            expect(res.statusCode).toBe(200);
            expect(res.body.company_ID).toBe(99);
        });

        it('should return 400 if company_name query is missing', async () => {
            const res = await request(app).get('/api/application/getcompanyid');
            expect(res.statusCode).toBe(400);
        });
    });
});
