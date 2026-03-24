import express from 'express';
import { pull_users } from '../controllers/user_controller.js';

const router = express.Router();
router.get('/', pull_users);

export default router;