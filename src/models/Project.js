import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  workspaceName: {
    type: String,
    required: true,
  },
  epics: [{
    name: String,
    color: String,
    textColor: String,
    tasks: [{
      id: String,
      title: String,
      priority: String,
      status: String
    }]
  }]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
