import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    channelId: { type: String, required: true },
    uploader: { type: String, required: true },
    category: { type: String, required: true, default: 'Education' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Video', videoSchema);
