import * as dominos_model from '../models/dominos_model.js';

export async function getDominosMenu(req, res) {
  try {
    const { street, city, region, postalCode } = req.body;

    if (!street || !city || !region || !postalCode) {
      return res.status(400).json({
        error: 'Missing required address fields: street, city, region, postalCode',
      });
    }

    const result = await dominos_model.getDominosMenu({ street, city, region, postalCode });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching menu:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
