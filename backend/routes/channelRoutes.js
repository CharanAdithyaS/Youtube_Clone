import express from 'express';
import Channel from '../models/Channel.js';
import Video from '../models/Video.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName || channelName.trim().length < 3) {
      return res.status(400).json({ message: 'Channel name must be at least 3 characters' });
    }

    const channelId = `channel_${Date.now()}`;
    const channel = await Channel.create({
      channelId,
      channelName: channelName.trim(),
      owner: req.user.userId,
      description: description || '',
      channelBanner: channelBanner || 'https://picsum.photos/1200/300',
      subscribers: 0,
      videos: [],
    });

    await User.updateOne(
      { userId: req.user.userId },
      { $push: { channels: channelId } }
    );

    res.status(201).json(channel);
  } catch {
    res.status(500).json({ message: 'Failed to create channel' });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user.userId });
    res.json(channels);
  } catch {
    res.status(500).json({ message: 'Failed to fetch your channels' });
  }
});

router.get('/:channelId', async (req, res) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.channelId });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const videos = await Video.find({ channelId: channel.channelId }).sort({ uploadDate: -1 });
    const owner = await User.findOne({ userId: channel.owner }).select('username avatar');

    res.json({ channel, videos, owner });
  } catch {
    res.status(500).json({ message: 'Failed to fetch channel' });
  }
});

export default router;
