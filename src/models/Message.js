import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'error', 'chat'],
    default: 'chat',
  },
  isBot: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
