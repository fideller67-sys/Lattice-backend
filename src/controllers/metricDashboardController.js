import MetricDashboard from '../models/MetricDashboard.js';

export const getDashboardBySlug = async (req, res) => {
  try {
    const dashboard = await MetricDashboard.findOne({ slug: req.params.slug });
    
    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    res.status(200).json(dashboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
