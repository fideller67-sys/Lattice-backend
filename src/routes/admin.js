import express from 'express';
const router = express.Router();
import { protect, authorizeRoles } from '../middlewares/auth.js';
import { getAdminStats, getWorkspaceMembers, updateUserRole, deleteUser, getAuditLogs, inviteUser } from '../controllers/adminController.js';

// Stats - accessible by director and admin
router.get('/stats', protect, authorizeRoles('admin', 'director'), getAdminStats);

// Members - accessible by director and admin
router.get('/members', protect, authorizeRoles('admin', 'director'), getWorkspaceMembers);

// Update user role - accessible by director and admin
router.put('/user/:id/role', protect, authorizeRoles('admin', 'director'), updateUserRole);

// Delete user - accessible by admin and director
router.delete('/user/:id', protect, authorizeRoles('admin', 'director'), deleteUser);

// Audit logs
router.get('/audit-logs', protect, authorizeRoles('admin', 'director'), getAuditLogs);

// Invite user
router.post('/invite', protect, authorizeRoles('admin', 'director'), inviteUser);

export default router;