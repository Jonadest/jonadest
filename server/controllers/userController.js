import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login - Updated with better cookie settings
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET, // Changed from JWT_TOKEN to JWT_SECRET
      { expiresIn: '7d' }
    );

    // Updated cookie settings
    res.cookie('jbc', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production only
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain:
        process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
      path: '/',
    });

    // Return user data (excluding password)
    const userData = {
      _id: user._id,
      email: user.email,
      role: 'user',
    };

    res.json({
      message: 'Login successful',
      user: userData,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout - Updated with proper cookie clearing
export const logoutUser = async (req, res) => {
  res.clearCookie('jbc', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain:
      process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
    path: '/',
  });

  res.json({ message: 'Logged out successfully' });
};
