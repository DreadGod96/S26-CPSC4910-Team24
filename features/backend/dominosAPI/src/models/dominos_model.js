import { Menu, NearbyStores, Address } from 'dominos';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_PATH = path.resolve(__dirname, '../../cache/menu_cache.json');
const IMAGE_CACHE_DIR = path.resolve(__dirname, '../../cache/images');
const DOMINOS_IMAGE_URL = 'https://cache.dominos.com/olo/6_47_2/assets/build/market/US/_en/images/img/products/larges';

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
    imageCode: product.imageCode ?? null,
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

/**
 * Fetches a Dominos product image. Tries the live CDN first; on failure falls
 * back to the local file cache. Successfully fetched images are saved to
 * cache/images/{code}.jpg for future use.
 * @param {string} code - The product code (e.g. "P12IPAZA")
 * @returns {{ buffer: Buffer, contentType: string }}
 */
export async function getItemImage(code) {
  const cachedImagePath = path.join(IMAGE_CACHE_DIR, `${code}.jpg`);

  // Resolve the imageCode: preconfiguredProducts use a separate imageCode for CDN lookups
  const menuCache = await readCache();
  const item = menuCache?.specialtyItems?.find((i) => i.code === code);
  const imageCode = item?.imageCode ?? code;

  // 1. Try live Dominos CDN
  try {
    const url = `${DOMINOS_IMAGE_URL}/${imageCode}.jpg`;
    console.log(`Fetching live image: ${url}`);
    const res = await fetch(url);

    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get('content-type') || 'image/jpeg';

      // Save to local cache asynchronously (don't block the response)
      mkdir(IMAGE_CACHE_DIR, { recursive: true })
        .then(() => writeFile(cachedImagePath, buffer))
        .catch((err) => console.warn(`Failed to cache image ${code}:`, err.message));

      console.log(`Served live image for: ${code}`);
      return { buffer, contentType };
    }

    console.warn(`Live image not found for ${code} (status ${res.status}), falling back to cache.`);
  } catch (err) {
    console.warn(`Live image fetch failed for ${code}:`, err.message, '— falling back to cache.');
  }

  // 2. Fall back to local file cache
  try {
    await access(cachedImagePath);
    const buffer = await readFile(cachedImagePath);
    console.log(`Served cached image for: ${code}`);
    return { buffer, contentType: 'image/jpeg' };
  } catch {
    throw new Error(`Image not found for code: ${code}`);
  }
}

// ─── In-memory cart store ────────────────────────────────────────────────────
// Map<cartId, { cartId, items: Map<code, { code, name, price, quantity }>, createdAt }>
const carts = new Map();

function makeCartId() {
  return `cart-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function serializeCart(cart) {
  return {
    cartId: cart.cartId,
    items: [...cart.items.values()],
    itemCount: [...cart.items.values()].reduce((sum, i) => sum + i.quantity, 0),
    createdAt: cart.createdAt,
  };
}

/** Create a new empty cart and return its id. */
export function createCart() {
  const cartId = makeCartId();
  carts.set(cartId, { cartId, items: new Map(), createdAt: new Date().toISOString() });
  return { cartId };
}

/** Return serialized cart or null if not found. */
export function getCart(cartId) {
  const cart = carts.get(cartId);
  return cart ? serializeCart(cart) : null;
}

/**
 * Add an item to the cart. If the item already exists, quantity is incremented.
 * @param {string} cartId
 * @param {string} code    - product code
 * @param {number} quantity - must be >= 1
 * @param {string} [name]   - display name (optional, looked up from menu cache)
 * @param {string|null} [price]
 */
export async function addToCart(cartId, code, quantity = 1, name, price) {
  const cart = carts.get(cartId);
  if (!cart) throw new Error(`Cart not found: ${cartId}`);
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Quantity must be a positive integer.');

  // Enrich with menu data if name/price not provided
  if (!name || price === undefined) {
    const menuCache = await readCache();
    const menuItem = menuCache?.specialtyItems?.find((i) => i.code === code);
    name  = name  ?? menuItem?.name  ?? code;
    price = price ?? menuItem?.price ?? null;
  }

  if (cart.items.has(code)) {
    cart.items.get(code).quantity += quantity;
  } else {
    cart.items.set(code, { code, name, price, quantity });
  }

  return serializeCart(cart);
}

/**
 * Update the quantity of an existing cart item.
 * Setting quantity to 0 removes the item.
 */
export function updateCartItem(cartId, code, quantity) {
  const cart = carts.get(cartId);
  if (!cart) throw new Error(`Cart not found: ${cartId}`);
  if (!cart.items.has(code)) throw new Error(`Item ${code} is not in the cart.`);
  if (!Number.isInteger(quantity) || quantity < 0) throw new Error('Quantity must be a non-negative integer.');

  if (quantity === 0) {
    cart.items.delete(code);
  } else {
    cart.items.get(code).quantity = quantity;
  }

  return serializeCart(cart);
}

/** Remove an item entirely from the cart. */
export function removeFromCart(cartId, code) {
  const cart = carts.get(cartId);
  if (!cart) throw new Error(`Cart not found: ${cartId}`);
  if (!cart.items.has(code)) throw new Error(`Item ${code} is not in the cart.`);
  cart.items.delete(code);
  return serializeCart(cart);
}

/** Empty the cart without deleting it. */
export function clearCart(cartId) {
  const cart = carts.get(cartId);
  if (!cart) throw new Error(`Cart not found: ${cartId}`);
  cart.items.clear();
  return serializeCart(cart);
}

/**
 * Submit all items in the cart as a phantom order, then clear the cart.
 */
export async function submitCart(cartId, { address, customer, payment }) {
  const cart = carts.get(cartId);
  if (!cart) throw new Error(`Cart not found: ${cartId}`);
  if (cart.items.size === 0) throw new Error('Cart is empty.');

  const items = [...cart.items.values()].map(({ code, quantity }) => ({ code, quantity }));
  const result = await phantomPlaceOrder({ address, items, customer, payment });

  cart.items.clear();
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Phantom order — validates the payload and returns a simulated confirmation
 * without sending anything to Dominos.
 * @param {Object} orderPayload
 * @param {Object} orderPayload.address   - { street, city, region, postalCode }
 * @param {Array}  orderPayload.items     - [{ code, quantity }]
 * @param {Object} orderPayload.customer  - { firstName, lastName, email, phone }
 * @param {string} orderPayload.payment   - "card" | "cash"
 */
export async function phantomPlaceOrder({ address, items, customer, payment }) {
  if (!address?.street || !address?.city || !address?.region || !address?.postalCode) {
    throw new Error('Missing required address fields.');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }
  if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone) {
    throw new Error('Missing required customer fields.');
  }
  if (!['card', 'cash'].includes(payment)) {
    throw new Error('Payment must be "card" or "cash".');
  }

  const orderId = `PHANTOM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  return {
    phantom: true,
    orderId,
    status: 'confirmed',
    message: 'Phantom order accepted. No real order was placed.',
    address,
    items,
    customer: { firstName: customer.firstName, lastName: customer.lastName, email: customer.email },
    payment,
    estimatedDelivery: '30-45 minutes',
    placedAt: new Date().toISOString(),
  };
}
