import User from '../models/User.js';
import Task from '../models/Task.js';
import AuditLog from '../models/AuditLog.js';
import { HttpStatusCode } from "axios";

export const getAdminStats = async (req, res, next) => {
  try {
    const workspace = req.user.workspaceName;
    if (!workspace) {
      return res.status(400).json({ message: 'User must belong to a workspace' });
    }

    const workspaceFilter = { workspaceName: workspace };

    const totalUsers = await User.countDocuments(workspaceFilter);
    const developerCount = await User.countDocuments({ ...workspaceFilter, role: 'developer' });
    const pmCount = await User.countDocuments({ ...workspaceFilter, role: 'pm' });
    const directorCount = await User.countDocuments({ ...workspaceFilter, role: 'director' });
    const adminCount = await User.countDocuments({ ...workspaceFilter, role: 'admin' });

    const totalTasks = await Task.countDocuments(workspaceFilter);
    const todoTasks = await Task.countDocuments({ ...workspaceFilter, status: 'todo' });
    const inProgressTasks = await Task.countDocuments({ ...workspaceFilter, status: 'in-progress' });
    const reviewTasks = await Task.countDocuments({ ...workspaceFilter, status: 'review' });
    const doneTasks = await Task.countDocuments({ ...workspaceFilter, status: 'done' });

    res.status(HttpStatusCode.Ok).json({
      users: {
        total: totalUsers,
        byRole: {
          developer: developerCount,
          pm: pmCount,
          director: directorCount,
          admin: adminCount,
        }
      },
      tasks: {
        total: totalTasks,
        byStatus: {
          todo: todoTasks,
          inProgress: inProgressTasks,
          review: reviewTasks,
          done: doneTasks,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const workspace = req.user.workspaceName;
    if (!workspace) {
      return res.status(400).json({ message: 'User must belong to a workspace' });
    }

    const members = await User.find({ workspaceName: workspace })
      .select('name email role avatarInitials createdAt isVerified')
      .sort({ createdAt: -1 });

    res.status(200).json(members);
  } catch (error) {
    console.error('Error in getWorkspaceMembers:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['developer', 'pm', 'director', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Don't let them change their own role
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.workspaceName !== req.user.workspaceName) {
      return res.status(403).json({ message: 'User is not in your workspace' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: `Role updated to ${role}`, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error in updateUserRole:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Don't let an admin delete themselves
    if (id === req.user.id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(HttpStatusCode.NotFound).json({ message: 'User not found' });
    }

    if (user.workspaceName !== req.user.workspaceName) {
      return res.status(403).json({ message: 'User is not in your workspace' });
    }

    await user.deleteOne();

    res.status(HttpStatusCode.Ok).json({ message: `User ${user.name} (${user.email}) deleted successfully` });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(HttpStatusCode.Ok).json(logs);
  } catch (error) {
    next(error);
  }
};

export const inviteUser = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    
    // Simulate inviting a user by creating a stub user
    // Since we don't have an email sending workflow here fully fleshed out,
    // we'll create a dummy user in the workspace.
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      name: email.split('@')[0],
      email,
      role: role || 'viewer',
      workspaceName: req.user.workspaceName,
      avatarInitials: email.substring(0, 2).toUpperCase(),
      isVerified: true
    });

    res.status(HttpStatusCode.Created).json(newUser);
  } catch (error) {
    next(error);
  }
};
