import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import schemaRoutes from './routes/schemaRoutes.js';
import authRoutes from './routes/authRoutes.js';

/**
 * Load environment variables
 * - Local: loads from .env
 * - Render/Production: uses Dashboard env vars
 */
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 10000;

/**
 * Connect to MongoDB
 */
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn('⚠️  MONGO_URI not found. Database features disabled.');
}

/**
 * Middleware
 */
// CORS configuration - normalize origins (remove trailing slashes)
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Normalize origin (remove trailing slash)
      const normalizedOrigin = origin.replace(/\/$/, '');
      
      // Check if origin is allowed
      if (allowedOrigins.includes('*') || allowedOrigins.includes(normalizedOrigin) || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SchemaArchitect API is running' });
});

/**
 * Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api', schemaRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This is the API server',
    availableRoutes: [
      'GET /api/health',
      'POST /api/generate'
    ]
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health: /api/health`);
  console.log(
    `🗄️  MongoDB: ${process.env.MONGO_URI ? 'Configured' : 'Not configured'}`
  );
  console.log(
    `🌐 Frontend: ${process.env.FRONTEND_URL || 'Not restricted'}`
  );
});
