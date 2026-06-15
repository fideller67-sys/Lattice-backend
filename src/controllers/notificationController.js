import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Seed some fake notifications if none exist to make the UI look good initially
    if (notifications.length === 0) {
      const defaultNotifications = [
        {
          user: req.user._id,
          title: 'Welcome to Lattice',
          message: 'Your workspace has been provisioned successfully.',
          type: 'system_alert',
        },
        {
          user: req.user._id,
          title: 'Task Assigned',
          message: 'You have been assigned to "Setup Initial Architecture"',
          type: 'task_assigned',
          actionUrl: '/developer/tasks'
        }
      ];
      notifications = await Notification.insertMany(defaultNotifications);
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findOneAndDelete({ _id: id, user: req.user._id });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
