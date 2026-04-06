import express from 'express';
import { get_points, update_points } from '../controllers/points_controller.js';

const router = express.Router();

router.get('/:user_id', get_points);
router.post('/adjust', update_points);

export default router;