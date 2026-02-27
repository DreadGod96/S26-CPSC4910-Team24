import express from 'express';
import { getDominosMenu } from '../controllers/dominos_controller.js';

const router = express.Router();
router.post('/get_menu', getDominosMenu);
export default router;
