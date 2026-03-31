import express from 'express';
import { post_data, get_company_list, get_company_id_by_name, get_driver_applications } from '../controllers/application_controller.js';

const router = express.Router();
router.post('/', post_data);
router.get('/companylist', get_company_list);
router.get('/getcompanyid', get_company_id_by_name);
router.get('/driver/:driver_id', get_driver_applications);
export default router;