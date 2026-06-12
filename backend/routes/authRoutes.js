import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;

    const user = await User.create({
      userId,
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      channels: [],
    });

    res.status(201).json({
      message: 'Account created successfully. Please log in.',
      user: { userId: user.userId, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channels: user.channels,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.userId }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
