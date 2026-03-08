import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { getDominosMenu } from '../src/controllers/dominos_controller.js';
import * as dominos_model from '../src/models/dominos_model.js';

vi.mock('../src/models/dominos_model.js', () => ({
  getDominosMenu: vi.fn(),
}));

const app = express();
app.use(express.json());
app.post('/api/dominos/get_menu', getDominosMenu);

const validAddress = {
  street: '900 Clark Ave',
  city: 'St. Louis',
  region: 'MO',
  postalCode: '63102',
};

const mockMenuResponse = {
  storeID: '4234',
  storeName: '900 Clark Ave, St. Louis, MO',
  isOpen: true,
  products: [
    { code: 'P_14SCREEN', name: 'Large Hand Tossed Pizza', description: '', defaultToppings: '', tags: {} },
  ],
  specialtyItems: [
    { code: 'PBKIREZA', name: 'Chicken Bacon Ranch Pizza', description: '', price: '12.99' },
  ],
};

describe('POST /api/dominos/get_menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Success ---

  it('should return 200 and full menu data for a valid address', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockResolvedValue(mockMenuResponse);

    const res = await request(app).post('/api/dominos/get_menu').send(validAddress);

    expect(res.statusCode).toBe(200);
    expect(res.body.storeID).toBe('4234');
    expect(res.body.storeName).toBe('900 Clark Ave, St. Louis, MO');
    expect(res.body.isOpen).toBe(true);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.specialtyItems).toHaveLength(1);
  });

  it('should call the model with exactly the address fields from the request', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockResolvedValue(mockMenuResponse);

    await request(app).post('/api/dominos/get_menu').send(validAddress);

    expect(dominos_model.getDominosMenu).toHaveBeenCalledOnce();
    expect(dominos_model.getDominosMenu).toHaveBeenCalledWith(validAddress);
  });

  // --- Validation: missing required fields ---

  it('should return 400 when street is missing', async () => {
    const { street, ...body } = validAddress;
    const res = await request(app).post('/api/dominos/get_menu').send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/street/i);
  });

  it('should return 400 when city is missing', async () => {
    const { city, ...body } = validAddress;
    const res = await request(app).post('/api/dominos/get_menu').send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/city/i);
  });

  it('should return 400 when region is missing', async () => {
    const { region, ...body } = validAddress;
    const res = await request(app).post('/api/dominos/get_menu').send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/region/i);
  });

  it('should return 400 when postalCode is missing', async () => {
    const { postalCode, ...body } = validAddress;
    const res = await request(app).post('/api/dominos/get_menu').send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/postalCode/i);
  });

  it('should return 400 when body is completely empty', async () => {
    const res = await request(app).post('/api/dominos/get_menu').send({});

    expect(res.statusCode).toBe(400);
  });

  it('should not call the model when a required field is missing', async () => {
    const { postalCode, ...body } = validAddress;
    await request(app).post('/api/dominos/get_menu').send(body);

    expect(dominos_model.getDominosMenu).not.toHaveBeenCalled();
  });

  // --- Cache behaviour ---

  it('should return 200 with fromCache: true when the store is closed but cache exists', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockResolvedValue({
      ...mockMenuResponse,
      isOpen: false,
      fromCache: true,
    });

    const res = await request(app).post('/api/dominos/get_menu').send(validAddress);

    expect(res.statusCode).toBe(200);
    expect(res.body.isOpen).toBe(false);
    expect(res.body.fromCache).toBe(true);
    expect(res.body.products).toHaveLength(1);
  });

  // --- Error handling ---

  it('should return 500 with a generic message when the model throws', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockRejectedValue(
      new Error('No Dominos stores found near 900 Clark Ave, St. Louis, MO 63102')
    );

    const res = await request(app).post('/api/dominos/get_menu').send(validAddress);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Failed to fetch Dominos menu. Please try again later.');
  });

  it('should return 500 when store is closed and no cache exists', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockRejectedValue(
      new Error('Nearest Dominos store is currently closed and no cached menu is available.')
    );

    const res = await request(app).post('/api/dominos/get_menu').send(validAddress);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Failed to fetch Dominos menu. Please try again later.');
  });

  it('should not leak the raw error message to the client on 500', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockRejectedValue(
      new Error('Internal library failure details')
    );

    const res = await request(app).post('/api/dominos/get_menu').send(validAddress);

    expect(res.body.error).not.toContain('Internal library failure details');
  });
});
