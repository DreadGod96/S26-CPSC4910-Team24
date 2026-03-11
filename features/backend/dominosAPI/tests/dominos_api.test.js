import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import {
  getDominosMenu,
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  submitCart,
} from '../src/controllers/dominos_controller.js';
import * as dominos_model from '../src/models/dominos_model.js';

vi.mock('../src/models/dominos_model.js', () => ({
  getDominosMenu: vi.fn(),
  createCart: vi.fn(),
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeFromCart: vi.fn(),
  clearCart: vi.fn(),
  submitCart: vi.fn(),
  phantomPlaceOrder: vi.fn(),
}));

// ─── App setup ───────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

// Menu
app.get('/api/dominos/get_menu', getDominosMenu);

// Cart
app.post('/api/dominos/cart', createCart);
app.get('/api/dominos/cart/:cartId', getCart);
app.post('/api/dominos/cart/:cartId/add', addToCart);
app.put('/api/dominos/cart/:cartId/item/:code', updateCartItem);
app.delete('/api/dominos/cart/:cartId/item/:code', removeFromCart);
app.delete('/api/dominos/cart/:cartId', clearCart);
app.post('/api/dominos/cart/:cartId/submit', submitCart);

// ─── Shared fixtures ─────────────────────────────────────────────────────────

const CLEMSON_ADDRESS = {
  street: '101 Calhoun Dr',
  city: 'Clemson',
  region: 'SC',
  postalCode: '29634',
};

const mockMenuResponse = {
  storeID: '4234',
  storeName: '101 Calhoun Dr, Clemson, SC',
  isOpen: true,
  products: [
    { code: 'P_14SCREEN', name: 'Large Hand Tossed Pizza', description: '', defaultToppings: '', tags: {} },
  ],
  specialtyItems: [
    { code: 'F_PBITES', name: 'Parmesan Bread Bites', description: '', price: '5.99', imageCode: 'F_PBITES' },
  ],
};

const CART_ID = 'cart-1234567890-000001';

const mockCart = {
  cartId: CART_ID,
  items: [{ code: 'F_PBITES', name: 'Parmesan Bread Bites', price: '5.99', quantity: 2 }],
  itemCount: 2,
  createdAt: '2026-03-09T00:00:00.000Z',
};

const validCustomer = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '8641234567',
};

const validSubmitBody = {
  address: { street: '101 Calhoun Dr', city: 'Clemson', region: 'SC', postalCode: '29634' },
  customer: validCustomer,
  payment: 'cash',
};

// ─── GET /api/dominos/get_menu ────────────────────────────────────────────────

describe('GET /api/dominos/get_menu', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 200 and full menu data', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockResolvedValue(mockMenuResponse);

    const res = await request(app).get('/api/dominos/get_menu');

    expect(res.statusCode).toBe(200);
    expect(res.body.storeID).toBe('4234');
    expect(res.body.isOpen).toBe(true);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.specialtyItems).toHaveLength(1);
  });

  it('should call the model with the hardcoded Clemson address', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockResolvedValue(mockMenuResponse);

    await request(app).get('/api/dominos/get_menu');

    expect(dominos_model.getDominosMenu).toHaveBeenCalledOnce();
    expect(dominos_model.getDominosMenu).toHaveBeenCalledWith(CLEMSON_ADDRESS);
  });

  it('should return 200 with fromCache: true when the store is closed but cache exists', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockResolvedValue({
      ...mockMenuResponse,
      isOpen: false,
      fromCache: true,
    });

    const res = await request(app).get('/api/dominos/get_menu');

    expect(res.statusCode).toBe(200);
    expect(res.body.isOpen).toBe(false);
    expect(res.body.fromCache).toBe(true);
  });

  it('should return 500 with a generic message when the model throws', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockRejectedValue(
      new Error('No Dominos stores found near 101 Calhoun Dr, Clemson, SC 29634')
    );

    const res = await request(app).get('/api/dominos/get_menu');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Failed to fetch Dominos menu. Please try again later.');
  });

  it('should not leak the raw error message to the client on 500', async () => {
    vi.mocked(dominos_model.getDominosMenu).mockRejectedValue(
      new Error('Internal library failure details')
    );

    const res = await request(app).get('/api/dominos/get_menu');

    expect(res.body.error).not.toContain('Internal library failure details');
  });
});

// ─── POST /api/dominos/cart ───────────────────────────────────────────────────

describe('POST /api/dominos/cart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 201 with a new cartId', async () => {
    vi.mocked(dominos_model.createCart).mockReturnValue({ cartId: CART_ID });

    const res = await request(app).post('/api/dominos/cart');

    expect(res.statusCode).toBe(201);
    expect(res.body.cartId).toBe(CART_ID);
  });

  it('should call the model once', async () => {
    vi.mocked(dominos_model.createCart).mockReturnValue({ cartId: CART_ID });

    await request(app).post('/api/dominos/cart');

    expect(dominos_model.createCart).toHaveBeenCalledOnce();
  });
});

// ─── GET /api/dominos/cart/:cartId ───────────────────────────────────────────

describe('GET /api/dominos/cart/:cartId', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 200 and the cart when it exists', async () => {
    vi.mocked(dominos_model.getCart).mockReturnValue(mockCart);

    const res = await request(app).get(`/api/dominos/cart/${CART_ID}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.cartId).toBe(CART_ID);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.itemCount).toBe(2);
  });

  it('should return 404 when the cart does not exist', async () => {
    vi.mocked(dominos_model.getCart).mockReturnValue(null);

    const res = await request(app).get('/api/dominos/cart/nonexistent');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

// ─── POST /api/dominos/cart/:cartId/add ──────────────────────────────────────

describe('POST /api/dominos/cart/:cartId/add', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 200 and the updated cart when item is added', async () => {
    vi.mocked(dominos_model.addToCart).mockResolvedValue(mockCart);

    const res = await request(app)
      .post(`/api/dominos/cart/${CART_ID}/add`)
      .send({ code: 'F_PBITES', quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(dominos_model.addToCart).toHaveBeenCalledWith(CART_ID, 'F_PBITES', 2, undefined, undefined);
  });

  it('should default quantity to 1 when not provided', async () => {
    vi.mocked(dominos_model.addToCart).mockResolvedValue(mockCart);

    await request(app)
      .post(`/api/dominos/cart/${CART_ID}/add`)
      .send({ code: 'F_PBITES' });

    expect(dominos_model.addToCart).toHaveBeenCalledWith(CART_ID, 'F_PBITES', 1, undefined, undefined);
  });

  it('should return 400 when code is missing', async () => {
    const res = await request(app)
      .post(`/api/dominos/cart/${CART_ID}/add`)
      .send({ quantity: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/code/i);
  });

  it('should return 404 when the cart does not exist', async () => {
    vi.mocked(dominos_model.addToCart).mockRejectedValue(new Error('Cart not found: bad-id'));

    const res = await request(app)
      .post('/api/dominos/cart/bad-id/add')
      .send({ code: 'F_PBITES' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

// ─── PUT /api/dominos/cart/:cartId/item/:code ─────────────────────────────────

describe('PUT /api/dominos/cart/:cartId/item/:code', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 200 and updated cart when quantity is changed', async () => {
    vi.mocked(dominos_model.updateCartItem).mockReturnValue(mockCart);

    const res = await request(app)
      .put(`/api/dominos/cart/${CART_ID}/item/F_PBITES`)
      .send({ quantity: 3 });

    expect(res.statusCode).toBe(200);
    expect(dominos_model.updateCartItem).toHaveBeenCalledWith(CART_ID, 'F_PBITES', 3);
  });

  it('should return 400 when quantity is missing', async () => {
    const res = await request(app)
      .put(`/api/dominos/cart/${CART_ID}/item/F_PBITES`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/quantity/i);
  });

  it('should return 404 when the cart does not exist', async () => {
    vi.mocked(dominos_model.updateCartItem).mockImplementation(() => {
      throw new Error('Cart not found: bad-id');
    });

    const res = await request(app)
      .put('/api/dominos/cart/bad-id/item/F_PBITES')
      .send({ quantity: 1 });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 when the item is not in the cart', async () => {
    vi.mocked(dominos_model.updateCartItem).mockImplementation(() => {
      throw new Error('Item UNKNOWN is not in the cart.');
    });

    const res = await request(app)
      .put(`/api/dominos/cart/${CART_ID}/item/UNKNOWN`)
      .send({ quantity: 1 });

    expect(res.statusCode).toBe(400);
  });
});

// ─── DELETE /api/dominos/cart/:cartId/item/:code ──────────────────────────────

describe('DELETE /api/dominos/cart/:cartId/item/:code', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 200 and the cart after removing the item', async () => {
    const emptyCart = { ...mockCart, items: [], itemCount: 0 };
    vi.mocked(dominos_model.removeFromCart).mockReturnValue(emptyCart);

    const res = await request(app).delete(`/api/dominos/cart/${CART_ID}/item/F_PBITES`);

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(0);
    expect(dominos_model.removeFromCart).toHaveBeenCalledWith(CART_ID, 'F_PBITES');
  });

  it('should return 404 when the cart does not exist', async () => {
    vi.mocked(dominos_model.removeFromCart).mockImplementation(() => {
      throw new Error('Cart not found: bad-id');
    });

    const res = await request(app).delete('/api/dominos/cart/bad-id/item/F_PBITES');

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 when the item is not in the cart', async () => {
    vi.mocked(dominos_model.removeFromCart).mockImplementation(() => {
      throw new Error('Item UNKNOWN is not in the cart.');
    });

    const res = await request(app).delete(`/api/dominos/cart/${CART_ID}/item/UNKNOWN`);

    expect(res.statusCode).toBe(400);
  });
});

// ─── DELETE /api/dominos/cart/:cartId ────────────────────────────────────────

describe('DELETE /api/dominos/cart/:cartId', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 200 with an empty cart after clearing', async () => {
    const cleared = { ...mockCart, items: [], itemCount: 0 };
    vi.mocked(dominos_model.clearCart).mockReturnValue(cleared);

    const res = await request(app).delete(`/api/dominos/cart/${CART_ID}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(0);
    expect(dominos_model.clearCart).toHaveBeenCalledWith(CART_ID);
  });

  it('should return 404 when the cart does not exist', async () => {
    vi.mocked(dominos_model.clearCart).mockImplementation(() => {
      throw new Error('Cart not found: bad-id');
    });

    const res = await request(app).delete('/api/dominos/cart/bad-id');

    expect(res.statusCode).toBe(404);
  });
});

// ─── POST /api/dominos/cart/:cartId/submit ────────────────────────────────────

describe('POST /api/dominos/cart/:cartId/submit', () => {
  beforeEach(() => vi.clearAllMocks());

  const mockOrderResult = {
    phantom: true,
    orderId: 'PHANTOM-1234',
    status: 'confirmed',
    message: 'Phantom order accepted. No real order was placed.',
    address: validSubmitBody.address,
    items: [{ code: 'F_PBITES', quantity: 2 }],
    customer: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    payment: 'cash',
    estimatedDelivery: '30-45 minutes',
    placedAt: '2026-03-09T00:00:00.000Z',
  };

  it('should return 200 with phantom order confirmation', async () => {
    vi.mocked(dominos_model.submitCart).mockResolvedValue(mockOrderResult);

    const res = await request(app)
      .post(`/api/dominos/cart/${CART_ID}/submit`)
      .send(validSubmitBody);

    expect(res.statusCode).toBe(200);
    expect(res.body.phantom).toBe(true);
    expect(res.body.status).toBe('confirmed');
    expect(res.body.orderId).toMatch(/PHANTOM/);
  });

  it('should normalize address aliases (state → region, zip → postalCode)', async () => {
    vi.mocked(dominos_model.submitCart).mockResolvedValue(mockOrderResult);

    await request(app)
      .post(`/api/dominos/cart/${CART_ID}/submit`)
      .send({
        address: { street: '101 Calhoun Dr', city: 'Clemson', state: 'SC', zip: '29634' },
        customer: validCustomer,
        payment: 'cash',
      });

    expect(dominos_model.submitCart).toHaveBeenCalledWith(
      CART_ID,
      expect.objectContaining({
        address: expect.objectContaining({ region: 'SC', postalCode: '29634' }),
      })
    );
  });

  it('should normalize payment object to its type string', async () => {
    vi.mocked(dominos_model.submitCart).mockResolvedValue(mockOrderResult);

    await request(app)
      .post(`/api/dominos/cart/${CART_ID}/submit`)
      .send({
        ...validSubmitBody,
        payment: { type: 'card', number: '4111111111111111', expiration: '01/30', cvv: '123' },
      });

    expect(dominos_model.submitCart).toHaveBeenCalledWith(
      CART_ID,
      expect.objectContaining({ payment: 'card' })
    );
  });

  it('should return 404 when the cart does not exist', async () => {
    vi.mocked(dominos_model.submitCart).mockRejectedValue(new Error('Cart not found: bad-id'));

    const res = await request(app)
      .post('/api/dominos/cart/bad-id/submit')
      .send(validSubmitBody);

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 when the cart is empty', async () => {
    vi.mocked(dominos_model.submitCart).mockRejectedValue(new Error('Cart is empty.'));

    const res = await request(app)
      .post(`/api/dominos/cart/${CART_ID}/submit`)
      .send(validSubmitBody);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/empty/i);
  });
});
