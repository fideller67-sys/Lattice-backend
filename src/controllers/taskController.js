import Task from '../models/Task.js';
import { HttpStatusCode } from "axios";
import fs from 'fs';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, sprint, assignedTo, physics } = req.body;
    
    if (!req.user.workspaceName) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'User must complete onboarding and join a workspace before creating tasks' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      sprint,
      assignedTo,
      physics,
      workspaceName: req.user.workspaceName,
      createdBy: req.user.id,
    });

    res.status(HttpStatusCode.Created).json(task);
  } catch (error) {
    fs.appendFileSync('error.log', new Date().toISOString() + ': ' + error.stack + '\n\n');
    console.error('Error creating task:', error);
    res.status(HttpStatusCode.InternalServerError).json({ message: error.message || 'Server Error' });
  }
};

export const getTasks = async (req, res) => {
  try {
    if (!req.user.workspaceName) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'User must belong to a workspace' });
    }

    const tasks = await Task.find({ workspaceName: req.user.workspaceName })
      .populate('assignedTo', 'name avatarInitials')
      .populate('createdBy', 'name avatarInitials');

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Server Error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    let task = await Task.findById(id);
    if (!task) {
      return res.status(HttpStatusCode.NotFound).json({ message: 'Task not found' });
    }

    if (task.workspaceName !== req.user.workspaceName) {
      return res.status(HttpStatusCode.Forbidden).json({ message: 'Not authorized to update this task' });
    }

    
    const updateKeys = Object.keys(req.body);
    updateKeys.forEach(key => {
      task[key] = req.body[key];
    });

    await task.save();

    await task.populate('assignedTo', 'name avatarInitials');
    await task.populate('createdBy', 'name avatarInitials');

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Server Error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(HttpStatusCode.NotFound).json({ message: 'Task not found' });
    }

    if (task.workspaceName !== req.user.workspaceName) {
      return res.status(HttpStatusCode.Forbidden).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Server Error' });
  }
};
