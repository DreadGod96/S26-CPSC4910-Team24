import express from 'express';
import { get_points } from '../controllers/points_controller.js';

const router = express.Router();

// GET /api/points/:user_id
router.get('/:user_id', get_points);

export default router;