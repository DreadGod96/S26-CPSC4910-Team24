import * as dominos_model from '../models/dominos_model.js';

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

