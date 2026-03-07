import express from 'express';
import { getDominosMenu, phantomPlaceOrder, getItemImage } from '../controllers/dominos_controller.js';

const router = express.Router();
router.get('/get_menu', getDominosMenu);
router.post('/place_order', phantomPlaceOrder);
router.get('/item_image/:code', getItemImage);
export default router;
