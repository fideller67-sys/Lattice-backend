import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import { getProject, getProjects, createProject, deleteProject } from '../controllers/projectController.js';

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:slug', protect, getProject);
router.delete('/:slug', protect, deleteProject);

export default router;
