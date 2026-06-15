import express from 'express';
import { getDashboardBySlug } from '../controllers/metricDashboardController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:slug', protect, getDashboardBySlug);

export default router;
