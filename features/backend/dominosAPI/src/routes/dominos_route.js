import express from 'express';
import { getDominosMenuItems } from '../controllers/dominos_controller.js';

const router = express.Router();
router.post('/get_menu', getDominosMenuItems);
export default router;