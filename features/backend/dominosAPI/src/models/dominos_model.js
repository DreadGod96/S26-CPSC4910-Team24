import { NearbyStores, Menu } from 'dominos';

/**
 * Lists all available menu items for the nearest Domino's store to a given address.
 * @param {string} address - A street address, e.g. "900 Clark Ave, St. Louis, MO, 63102"
 * @returns {Promise<Object>} - An object with categorized menu items
 */
export async function getDominosMenuItems(address) {
  // Step 1: Find nearby stores
  const nearbyStores = await new NearbyStores(address);

  if (!nearbyStores.stores || nearbyStores.stores.length === 0) {
    throw new Error('No Dominos stores found near that address.');
  }

  // Step 2: Pick the closest open store
  let storeID = null;
  let minDistance = Infinity;

  for (const store of nearbyStores.stores) {
    if (
      store.IsOnlineCapable &&
      store.IsOpen &&
      store.MinDistance < minDistance
    ) {
      minDistance = store.MinDistance;
      storeID = store.StoreID;
    }
  }

  if (!storeID) {
    throw new Error('No open Dominos stores found near that address.');
  }

  console.log(`Using store ID: ${storeID} (${minDistance} miles away)`);

  // Step 3: Fetch the menu
  const menu = await new Menu(storeID);

  // Step 4: Extract and organize menu items
  const menuItems = {};

  for (const [categoryName, category] of Object.entries(menu.menu.Categories)) {
    menuItems[categoryName] = [];

    for (const productCode of category.Products || []) {
      const product = menu.menu.Products?.[productCode];
      if (product) {
        menuItems[categoryName].push({
          code: productCode,
          name: product.Name,
          description: product.Description || '',
          price: product.Variants
            ? Object.values(product.Variants)[0]?.Price
            : null,
          tags: product.Tags || {},
        });
      }
    }

    // Remove empty categories
    if (menuItems[categoryName].length === 0) {
      delete menuItems[categoryName];
    }
  }

  return menuItems;
}