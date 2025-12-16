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
// CORS configuration - allow all origins
app.use(
  cors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204
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
