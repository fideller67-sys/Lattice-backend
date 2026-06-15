import mongoose from 'mongoose';

const MetricDashboardSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  metrics: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  items: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
}, { timestamps: true });

export default mongoose.model('MetricDashboard', MetricDashboardSchema);
