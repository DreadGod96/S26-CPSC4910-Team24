import * as dominos_model from '../models/dominos_model.js';

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

