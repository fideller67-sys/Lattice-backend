import mongoose from 'mongoose';

const PageContentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  }, // e.g., 'sprint-14-board', 'workspace-settings'
  category: { 
    type: String, 
    enum: ['WORKSPACE', 'TEAM CHANNELS', 'PROJECTS', 'ADMINISTRATION'], 
    required: true 
  },

  developerPayload: {
    activeSprintVelocity: { type: Number, default: 0 },
    openBlockersCount: { type: Number, default: 0 },
    codeTelemetryLogs: { type: String, default: "" },
    assignedBranches: { type: Array, default: [] }
  },

  pmPayload: {
    okrAlignmentTags: { type: [String], default: [] },
    userImpactScore: { type: Number, default: 0 },
    cohortRolloutPercentage: { type: Number, default: 0 },
    dependencyMapping: { type: mongoose.Schema.Types.Mixed, default: {} }
  },

  directorPayload: {
    headcountAllocated: { type: Number, default: 0 },
    capExBudgetBurn: { type: Number, default: 0 },
    riskLevelAssessment: { type: String, default: "Nominal" },
    complianceFlags: { type: mongoose.Schema.Types.Mixed, default: {} }
  }
}, { timestamps: true });

export default mongoose.model('PageContent', PageContentSchema);