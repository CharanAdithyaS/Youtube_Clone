import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';
import Comment from './models/Comment.js';

dotenv.config();

const seedData = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Channel.deleteMany({}),
    Video.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user01 = await User.create({
    userId: 'user01',
    username: 'JohnDoe',
    email: 'john@example.com',
    password: hashedPassword,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
    channels: ['channel01'],
  });

  await User.create({
    userId: 'user02',
    username: 'SarahTech',
    email: 'sarah@example.com',
    password: hashedPassword,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahTech',
    channels: ['channel02'],
  });

  await Channel.create({
    channelId: 'channel01',
    channelName: 'Code with John',
    owner: 'user01',
    description: 'Coding tutorials and tech reviews by John Doe.',
    channelBanner: 'https://picsum.photos/seed/banner1/1200/300',
    subscribers: 5200,
    videos: ['video01', 'video02', 'video03'],
  });

  await Channel.create({
    channelId: 'channel02',
    channelName: 'Sarah Plays',
    owner: 'user02',
    description: 'Gaming streams and walkthroughs.',
    channelBanner: 'https://picsum.photos/seed/banner2/1200/300',
    subscribers: 8900,
    videos: ['video04', 'video05'],
  });

  const videos = [
    {
      videoId: 'video01',
      title: 'Learn React in 30 Minutes',
      description: 'A quick tutorial to get started with React. We cover components, props, and state.',
      thumbnailUrl: 'https://picsum.photos/seed/react/640/360',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      channelId: 'channel01',
      uploader: 'user01',
      category: 'Education',
      views: 15200,
      likes: 1023,
      dislikes: 45,
      uploadDate: new Date('2024-09-20'),
    },
    {
      videoId: 'video02',
      title: 'Node.js REST API Crash Course',
      description: 'Build a complete REST API with Express and MongoDB from scratch.',
      thumbnailUrl: 'https://picsum.photos/seed/nodejs/640/360',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      channelId: 'channel01',
      uploader: 'user01',
      category: 'Tech',
      views: 22100,
      likes: 1876,
      dislikes: 32,
      uploadDate: new Date('2024-10-05'),
    },
    {
      videoId: 'video03',
      title: 'MongoDB for Beginners',
      description: 'Learn how to store and query data using MongoDB and Mongoose.',
      thumbnailUrl: 'https://picsum.photos/seed/mongo/640/360',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      channelId: 'channel01',
      uploader: 'user01',
      category: 'Education',
      views: 9800,
      likes: 654,
      dislikes: 18,
      uploadDate: new Date('2024-10-15'),
    },
    {
      videoId: 'video04',
      title: 'Epic Gaming Montage 2024',
      description: 'Best plays from the last month. Hope you enjoy!',
      thumbnailUrl: 'https://picsum.photos/seed/gaming/640/360',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      channelId: 'channel02',
      uploader: 'user02',
      category: 'Gaming',
      views: 45000,
      likes: 3200,
      dislikes: 89,
      uploadDate: new Date('2024-11-01'),
    },
    {
      videoId: 'video05',
      title: 'Chill Lo-Fi Beats to Code To',
      description: 'Relaxing music mix for late night coding sessions.',
      thumbnailUrl: 'https://picsum.photos/seed/music/640/360',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      channelId: 'channel02',
      uploader: 'user02',
      category: 'Music',
      views: 78000,
      likes: 5400,
      dislikes: 120,
      uploadDate: new Date('2024-11-10'),
    },
    {
      videoId: 'video06',
      title: 'Top Tech News This Week',
      description: 'A roundup of the biggest stories in tech.',
      thumbnailUrl: 'https://picsum.photos/seed/news/640/360',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      channelId: 'channel01',
      uploader: 'user01',
      category: 'News',
      views: 11200,
      likes: 890,
      dislikes: 25,
      uploadDate: new Date('2024-11-20'),
    },
    {
      videoId: 'video07',
      title: 'Funny Cat Compilation',
      description: 'The internet\'s finest cats doing silly things.',
      thumbnailUrl: 'https://picsum.photos/seed/cats/640/360',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      channelId: 'channel02',
      uploader: 'user02',
      category: 'Entertainment',
      views: 125000,
      likes: 9800,
      dislikes: 200,
      uploadDate: new Date('2024-12-01'),
    },
  ];

  await Video.insertMany(videos);

  await Comment.create({
    commentId: 'comment01',
    videoId: 'video01',
    userId: 'user02',
    username: 'SarahTech',
    text: 'Great video! Very helpful.',
    timestamp: new Date('2024-09-21T08:30:00Z'),
  });

  console.log('Database seeded successfully!');
  console.log('Test login: john@example.com / password123');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
