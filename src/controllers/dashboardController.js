import Task from '../models/Task.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (!req.user.workspaceName) {
      return res.status(400).json({ message: 'User must belong to a workspace' });
    }

    const workspace = req.user.workspaceName;

    // Task stats for this workspace
    const allTasks = await Task.find({ workspaceName: workspace });
    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter(t => t.status === 'done').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;
    const reviewTasks = allTasks.filter(t => t.status === 'review').length;
    const todoTasks = allTasks.filter(t => t.status === 'todo').length;
    const backlogTasks = allTasks.filter(t => t.status === 'backlog').length;
    const highPriorityOpen = allTasks.filter(t => t.priority === 'High' && t.status !== 'done').length;

    // Velocity = % of tasks that are done or in-review
    const velocity = totalTasks > 0 ? Math.round(((doneTasks + reviewTasks) / totalTasks) * 100) : 0;

    // Tasks assigned to the current user
    const myTasks = allTasks.filter(t => t.assignedTo && t.assignedTo.toString() === req.user.id);
    const myOpenTasks = myTasks.filter(t => t.status !== 'done').length;

    // Workspace member count
    const memberCount = await User.countDocuments({ workspaceName: workspace });

    res.status(200).json({
      velocity,
      totalTasks,
      doneTasks,
      inProgressTasks,
      reviewTasks,
      todoTasks,
      backlogTasks,
      highPriorityOpen,
      myOpenTasks,
      memberCount,
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
