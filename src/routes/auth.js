import express from 'express';
const router = express.Router();
import { registerUser, loginUser, verifyOtp, getMe, onboardUser, githubLogin, githubCallback, getWorkspaceUsers } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js'; // Your JWT validation middleware

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);
router.put('/onboarding', protect, onboardUser);
router.get('/users/workspace', protect, getWorkspaceUsers);

router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);

export default router;