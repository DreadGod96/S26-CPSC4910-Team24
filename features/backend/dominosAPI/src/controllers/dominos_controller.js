import * as dominos_model from '../models/dominos_model.js';

// ─── Cart controllers ────────────────────────────────────────────────────────

export function createCart(req, res) {
  const result = dominos_model.createCart();
  return res.status(201).json(result);
}

export function getCart(req, res) {
  const cart = dominos_model.getCart(req.params.cartId);
  if (!cart) return res.status(404).json({ error: 'Cart not found.' });
  return res.status(200).json(cart);
}

export async function addToCart(req, res) {
  try {
    const { cartId } = req.params;
    const { code, quantity = 1, name, price } = req.body;
    if (!code) return res.status(400).json({ error: 'Item code is required.' });
    const cart = await dominos_model.addToCart(cartId, code, quantity, name, price);
    return res.status(200).json(cart);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
}

export function updateCartItem(req, res) {
  try {
    const { cartId, code } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'Quantity is required.' });
    const cart = dominos_model.updateCartItem(cartId, code, quantity);
    return res.status(200).json(cart);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
}

export function removeFromCart(req, res) {
  try {
    const cart = dominos_model.removeFromCart(req.params.cartId, req.params.code);
    return res.status(200).json(cart);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
}

export function clearCart(req, res) {
  try {
    const cart = dominos_model.clearCart(req.params.cartId);
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

export async function submitCart(req, res) {
  try {
    const { cartId } = req.params;
    const { address, customer, payment } = req.body;
    const result = await dominos_model.submitCart(cartId, { address, customer, payment });
    return res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export async function getItemImage(req, res) {
  try {
    const { code } = req.params;
    const { buffer, contentType } = await dominos_model.getItemImage(code);
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(buffer);
  } catch (err) {
    console.error('Image fetch error:', err.message);
    return res.status(404).json({ error: err.message });
  }
}

export async function phantomPlaceOrder(req, res) {
  try {
    const { address, items, customer, payment } = req.body;
    const result = await dominos_model.phantomPlaceOrder({ address, items, customer, payment });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Phantom order error:', err.message);
    return res.status(400).json({ error: err.message });
  }
}

export async function getDominosMenu(req, res) {
  try {
    const result = await dominos_model.getDominosMenu({
      street: '101 Calhoun Dr',
      city: 'Clemson',
      region: 'SC',
      postalCode: '29634',
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching menu:', err.message);
    return res.status(500).json({ error: 'Failed to fetch Dominos menu. Please try again later.' });
  }
}

