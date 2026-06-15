import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

router.get('/stats', protect, getDashboardStats);

export default router;
