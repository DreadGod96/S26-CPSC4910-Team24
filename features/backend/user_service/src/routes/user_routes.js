import express from 'express';
import {
  pull_users,
  pull_user_by_id,
  update_user_field_controller,
  update_settings_controller,
  delete_user_controller,
  change_password_controller
} from '../controllers/user_controller.js';

const router = express.Router();

router.get('/', pull_users);
router.put('/settings/:id', update_settings_controller);
router.put('/change-password/:id', change_password_controller);
router.get('/:id', pull_user_by_id);
router.put('/:id', update_user_field_controller);
router.delete('/:id', delete_user_controller);

export default router;
