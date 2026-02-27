import * as dominos_model from '../models/dominos_model.js';

export async function getDominosMenuItems(address) {
  try {
    const items = await dominos_model.getDominosMenuItems(address);

    for (const [category, products] of Object.entries(items)) {
      console.log(`\n📦 ${category}`);
      for (const item of products) {
        console.log(`  - [${item.code}] ${item.name}${item.price ? ` — $${item.price}` : ''}`);
      }
    }
  } catch (err) {
    console.error('Error fetching menu:', err.message);
  }
};
