import express from 'express';
import { post_data } from '../controllers/application_controller.js';

const router = express.Router();
router.post('/', post_data);
export default router;