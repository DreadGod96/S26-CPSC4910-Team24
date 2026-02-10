import express from 'express';
import { get_data_row } from '../controllers/about_controller.js';

const router = express.Router();
router.get('/', get_data_row);
export default router;
