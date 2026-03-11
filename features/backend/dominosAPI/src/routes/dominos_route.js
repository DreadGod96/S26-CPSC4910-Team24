import express from 'express';
import {
  getDominosMenu,
  phantomPlaceOrder,
  getItemImage,
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  submitCart,
} from '../controllers/dominos_controller.js';

const router = express.Router();

// Menu & ordering
router.get('/get_menu', getDominosMenu);
router.post('/place_order', phantomPlaceOrder);
router.get('/item_image/:code', getItemImage);

// Cart
router.post('/cart', createCart);
router.get('/cart/:cartId', getCart);
router.post('/cart/:cartId/add', addToCart);
router.put('/cart/:cartId/item/:code', updateCartItem);
router.delete('/cart/:cartId/item/:code', removeFromCart);
router.delete('/cart/:cartId', clearCart);
router.post('/cart/:cartId/submit', submitCart);

export default router;
