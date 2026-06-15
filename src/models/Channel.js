import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  workspaceName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);
