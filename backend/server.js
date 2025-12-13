import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import schemaRoutes from './routes/schemaRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the backend directory
const envResult = dotenv.config({ path: join(__dirname, '.env') });
if (envResult.error) {
  console.error('❌ Error loading .env file:', envResult.error);
} else {
  console.log('✅ Environment variables loaded from .env file');
}

// Connect to MongoDB
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn('⚠️  MONGO_URI not found in environment variables. Authentication will not work properly.');
  console.warn('   Please add MONGO_URI to your .env file');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SchemaArchitect API is running' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Schema generation routes
app.use('/api', schemaRoutes);

// Catch-all route for non-API requests
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'This is the API server. Please access the frontend at http://localhost:5173',
    apiRoutes: [
      'GET /api/health',
      'POST /api/generate'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  if (process.env.MONGO_URI) {
    console.log(`🗄️  MongoDB: Connection will be established...`);
  } else {
    console.log(`⚠️  MongoDB: Not configured (add MONGO_URI to .env)`);
  }
  if (process.env.GEMINI_API_KEY) {
    console.log(`🤖 Gemini API: Configured (code generation enabled)`);
  } else {
    console.log(`⚠️  Gemini API: Not configured (add GEMINI_API_KEY to .env for AI code generation)`);
    console.log(`   Will use mock code generator instead`);
  }
  console.log(`\n💡 Frontend should be accessed at: http://localhost:5173`);
  console.log(`   Make sure to run 'npm run dev:frontend' in another terminal\n`);
});

