import { Menu, NearbyStores, Address } from 'dominos';

/**
 * Fetches all available menu items from the nearest Domino's store.
 * @param {Object} addressParts - Address broken into explicit fields
 * @param {string} addressParts.street     - e.g. "900 Clark Ave"
 * @param {string} addressParts.city       - e.g. "St. Louis"
 * @param {string} addressParts.region     - e.g. "MO"
 * @param {string} addressParts.postalCode - e.g. "63102"
 */
export async function getDominosMenu({ street, city, region, postalCode }) {
  const address = new Address({ street, city, region, postalCode });

  const nearbyStores = await new NearbyStores(address);

  if (!nearbyStores.stores || nearbyStores.stores.length === 0) {
    throw new Error(`No Dominos stores found near ${street}, ${city}, ${region} ${postalCode}`);
  }

  const closestStore = nearbyStores.stores.reduce((best, store) =>
    store.MinDistance < best.MinDistance ? store : best
  );

  const storeID = closestStore.StoreID;
  console.log(`Using store #${storeID} — ${closestStore.AddressDescription} (${closestStore.MinDistance} mi)`);

  const menu = await new Menu(storeID);

  const products = Object.entries(menu.menu.products).map(([code, product]) => ({
    code,
    name: product.name ?? code,
    description: product.description ?? '',
    defaultToppings: product.defaultToppings ?? '',
    tags: product.tags ?? {},
  }));

  const specialtyItems = Object.entries(menu.menu.preconfiguredProducts).map(([code, product]) => ({
    code,
    name: product.name ?? code,
    description: product.description ?? '',
    price: product.price ?? null,
  }));

  return {
    storeID,
    storeName: closestStore.AddressDescription,
    isOpen: closestStore.IsOpen,
    products,
    specialtyItems,
  };
}
