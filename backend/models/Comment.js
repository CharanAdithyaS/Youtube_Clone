import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    commentId: { type: String, required: true, unique: true },
    videoId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
