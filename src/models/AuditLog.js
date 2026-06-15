import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  actor: { 
    type: String, 
    required: true 
  },
  actionDescription: { 
    type: String, 
    required: true 
  },
  scopeContext: { 
    type: String, 
    required: true 
  },
  timestampLabel: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('AuditLog', AuditLogSchema);