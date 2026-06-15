import express from 'express';
const router = express.Router();
import { protect, authorizeRoles } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validateInput.js';
import { createPageSchema, createNavNodeSchema } from '../validators/pageValidator.js';
import {
  getNavNodes,
  createNavNode,
  updateNavNode,
  deleteNavNode,
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} from '../controllers/pageController.js';

// ─── Navigation Nodes ───────────────────────────────────────
router.get('/nav', protect, getNavNodes);
router.post('/nav', protect, authorizeRoles('admin', 'director'), validateBody(createNavNodeSchema), createNavNode);
router.put('/nav/:id', protect, authorizeRoles('admin', 'director'), updateNavNode);
router.delete('/nav/:id', protect, authorizeRoles('admin', 'director'), deleteNavNode);

// ─── Page Content ───────────────────────────────────────────
router.get('/', protect, getPages);
router.get('/:slug', protect, getPageBySlug);
router.post('/', protect, authorizeRoles('admin', 'director', 'pm'), validateBody(createPageSchema), createPage);
router.put('/:slug', protect, authorizeRoles('admin', 'director', 'pm'), updatePage);
router.delete('/:slug', protect, authorizeRoles('admin', 'director'), deletePage);

export default router;
