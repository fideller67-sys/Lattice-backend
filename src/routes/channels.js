import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import { getChannels, getMessages, postMessage, createChannel, deleteChannel } from '../controllers/channelController.js';

router.get('/', protect, getChannels);
router.post('/', protect, createChannel);
router.get('/:channelId/messages', protect, getMessages);
router.post('/:channelId/messages', protect, postMessage);
router.delete('/:channelId', protect, deleteChannel);

export default router;
