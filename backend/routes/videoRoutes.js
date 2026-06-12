import express from 'express';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const videos = await Video.find(filter).sort({ uploadDate: -1 });
    res.json(videos);
  } catch {
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

router.get('/:videoId', async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await Video.updateOne({ videoId: req.params.videoId }, { $inc: { views: 1 } });
    video.views += 1;

    const channel = await Channel.findOne({ channelId: video.channelId });
    res.json({ video, channelName: channel?.channelName || 'Unknown Channel' });
  } catch {
    res.status(500).json({ message: 'Failed to fetch video' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, channelId, category } = req.body;

    if (!title || !videoUrl || !channelId) {
      return res.status(400).json({ message: 'Title, video URL, and channel are required' });
    }

    const channel = await Channel.findOne({ channelId, owner: req.user.userId });
    if (!channel) {
      return res.status(403).json({ message: 'You can only upload to your own channel' });
    }

    const videoId = `video_${Date.now()}`;
    const video = await Video.create({
      videoId,
      title,
      description: description || '',
      thumbnailUrl: thumbnailUrl || 'https://picsum.photos/640/360',
      videoUrl,
      channelId,
      uploader: req.user.userId,
      category: category || 'Education',
    });

    channel.videos.push(videoId);
    await channel.save();

    res.status(201).json(video);
  } catch {
    res.status(500).json({ message: 'Failed to create video' });
  }
});

router.put('/:videoId', protect, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed to edit this video' });
    }

    const { title, description, thumbnailUrl, videoUrl, category } = req.body;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl) video.videoUrl = videoUrl;
    if (category) video.category = category;

    await video.save();
    res.json(video);
  } catch {
    res.status(500).json({ message: 'Failed to update video' });
  }
});

router.delete('/:videoId', protect, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed to delete this video' });
    }

    await Video.deleteOne({ videoId: req.params.videoId });
    await Channel.updateOne(
      { channelId: video.channelId },
      { $pull: { videos: video.videoId } }
    );

    res.json({ message: 'Video deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete video' });
  }
});

router.post('/:videoId/like', protect, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.likes += 1;
    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch {
    res.status(500).json({ message: 'Failed to like video' });
  }
});

router.post('/:videoId/dislike', protect, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.dislikes += 1;
    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch {
    res.status(500).json({ message: 'Failed to dislike video' });
  }
});

export default router;
