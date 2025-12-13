import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required',
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in MongoDB
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Generate token
    const token = generateToken(newUser);

    // Return user (without password) and token
    res.status(201).json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Check if MongoDB connection error
    if (error.name === 'MongoServerError' || error.message?.includes('Mongo')) {
      return res.status(503).json({ 
        error: 'Database connection error',
        message: 'Unable to connect to database. Please try again later.'
      });
    }
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create account. Please try again.'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required',
        message: 'Please provide email and password'
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email.toLowerCase()}`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`Login attempt failed: Invalid password for email ${email.toLowerCase()}`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    console.log(`Login successful: User ${user.email} authenticated`);

    // Generate token
    const token = generateToken(user);

    // Return user (without password) and token
    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if MongoDB connection error
    if (error.name === 'MongoServerError' || error.message?.includes('Mongo')) {
      return res.status(503).json({ 
        error: 'Database connection error',
        message: 'Unable to connect to database. Please try again later.'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to login. Please try again.'
    });
  }
});

// Verify token (optional - for protected routes)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token',
      message: 'Token verification failed'
    });
  }
});

export default router;

