import express from 'express';
import { getDominosMenu, phantomPlaceOrder } from '../controllers/dominos_controller.js';

const router = express.Router();
router.get('/get_menu', getDominosMenu);
router.post('/place_order', phantomPlaceOrder);
export default router;
