import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    channelId: { type: String, required: true, unique: true },
    channelName: { type: String, required: true, trim: true },
    owner: { type: String, required: true },
    description: { type: String, default: '' },
    channelBanner: { type: String, default: '' },
    subscribers: { type: Number, default: 0 },
    videos: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Channel', channelSchema);
