import mongoose from 'mongoose';

const NavigationNodeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  }, // e.g., "Sprint 14 Board", "Workspace Settings", "Inbox"
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  }, // e.g., "sprint-14-board", "workspace-settings"
  category: { 
    type: String, 
    enum: ['WORKSPACE', 'TEAM CHANNELS', 'PROJECTS', 'ADMINISTRATION'], 
    required: true 
  }, // Groups your sidebar sections matching your design tokens
  displayOrder: { 
    type: Number, 
    required: true 
  }, // Keeps your sidebar items sorted correctly from top to bottom
  isLocked: { 
    type: Boolean, 
    default: false 
  } // Can be used to restrict certain pages to higher roles (like Director)
}, { timestamps: true });

export default mongoose.model('NavigationNode', NavigationNodeSchema);