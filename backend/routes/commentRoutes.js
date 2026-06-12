import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({ timestamp: -1 });
    res.json(comments);
  } catch {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

router.post('/:videoId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.create({
      commentId: `comment_${Date.now()}`,
      videoId: req.params.videoId,
      userId: req.user.userId,
      username: req.user.username,
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch {
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

router.put('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findOne({ commentId: req.params.commentId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    comment.text = text.trim();
    await comment.save();
    res.json(comment);
  } catch {
    res.status(500).json({ message: 'Failed to update comment' });
  }
});

router.delete('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findOne({ commentId: req.params.commentId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    await Comment.deleteOne({ commentId: req.params.commentId });
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

export default router;
