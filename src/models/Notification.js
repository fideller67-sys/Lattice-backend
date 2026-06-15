import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['mention', 'task_assigned', 'system_alert', 'project_update', 'approval_needed'],
    default: 'system_alert',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  actionUrl: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
