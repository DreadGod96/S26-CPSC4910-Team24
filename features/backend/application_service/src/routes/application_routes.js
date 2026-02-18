import express from 'express';
import { pull_data } from '../controllers/application_controller.js';

const router = express.Router();
router.get('/', pull_data);
export default router;
