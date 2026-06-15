import Channel from '../models/Channel.js';
import Message from '../models/Message.js';

export const getChannels = async (req, res) => {
  try {
    const workspace = req.user.workspaceName;
    if (!workspace) return res.status(400).json({ message: 'User must belong to a workspace' });

    let channels = await Channel.find({ workspaceName: workspace });

    if (channels.length === 0) {
      const defaultChannels = [
        { name: 'PlatformEng', description: 'Core platform engineering', workspaceName: workspace },
        { name: 'DesignReview', description: 'UI/UX design reviews', workspaceName: workspace },
        { name: 'InfraOps', description: 'Infrastructure and Operations', workspaceName: workspace },
        { name: 'QaAutomation', description: 'QA and Testing automation', workspaceName: workspace },
        { name: 'ReleaseTrain', description: 'Release management and CI/CD', workspaceName: workspace },
      ];
      channels = await Channel.insertMany(defaultChannels);
    }

    res.status(200).json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workspace = req.user.workspaceName;
    if (!workspace) return res.status(400).json({ message: 'User must belong to a workspace' });

    const newChannel = await Channel.create({
      name: name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      workspaceName: workspace
    });

    res.status(201).json(newChannel);
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channelId })
      .populate('sender', 'name avatarInitials role')
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 messages
    
    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const postMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { text, type, isBot } = req.body;

    const message = await Message.create({
      channelId,
      text,
      sender: req.user._id,
      type: type || 'chat',
      isBot: isBot || false,
    });

    await message.populate('sender', 'name avatarInitials role');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const workspace = req.user.workspaceName;
    
    const channel = await Channel.findOneAndDelete({ _id: channelId, workspaceName: workspace });
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.status(200).json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
