import { Menu, NearbyStores, Address } from 'dominos';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_PATH = path.resolve(__dirname, '../../cache/menu_cache.json');

async function readCache() {
  try {
    const data = await readFile(CACHE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function writeCache(data) {
  await mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Fetches all available menu items from the nearest Domino's store.
 * If the closest store is open, the menu is fetched live and saved to
 * cache/menu_cache.json. If it is closed, the cached menu is returned instead.
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

  if (!closestStore.IsOpen) {
    const cached = await readCache();
    if (!cached) {
      throw new Error('Nearest Dominos store is currently closed and no cached menu is available.');
    }
    console.log(`Store #${closestStore.StoreID} is closed — serving cached menu.`);
    return { ...cached, isOpen: false, fromCache: true };
  }

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

  const result = {
    storeID,
    storeName: closestStore.AddressDescription,
    isOpen: true,
    products,
    specialtyItems,
  };

  await writeCache(result);
  return result;
}
