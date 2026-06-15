import express from 'express';
const router = express.Router();
import { protect, authorizeRoles } from '../middlewares/auth.js';
import { getAdminStats, getWorkspaceMembers, updateUserRole, deleteUser, getAuditLogs, inviteUser } from '../controllers/adminController.js';

router.get('/stats', protect, authorizeRoles('admin', 'director'), getAdminStats);

router.get('/members', protect, authorizeRoles('admin', 'director'), getWorkspaceMembers);

router.put('/user/:id/role', protect, authorizeRoles('admin', 'director'), updateUserRole);

router.delete('/user/:id', protect, authorizeRoles('admin', 'director'), deleteUser);

router.get('/audit-logs', protect, authorizeRoles('admin', 'director'), getAuditLogs);

router.post('/invite', protect, authorizeRoles('admin', 'director'), inviteUser);

export default router;