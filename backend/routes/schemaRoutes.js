import express from 'express';
import { generateBackendCode } from '../services/geminiService.js';

const router = express.Router();

// Generate backend code from schema
router.post('/generate', async (req, res) => {
  try {
    const { tables, relations, dbType, apiKey } = req.body;

    if (!tables || !relations || !dbType) {
      return res.status(400).json({ 
        error: 'Missing required fields: tables, relations, dbType' 
      });
    }

    // Use API key from request if provided, otherwise use environment variable
    const geminiApiKey = apiKey || process.env.GEMINI_API_KEY;
    
    // Log which API key source is being used
    const apiKeySource = apiKey ? 'REQUEST (from frontend localStorage)' : 'ENV_FILE (backend .env)';
    const apiKeyPreview = geminiApiKey ? geminiApiKey.substring(0, 10) + '...' : 'NONE';
    console.log(`🔑 API Key Source: ${apiKeySource} | Key: ${apiKeyPreview}`);
    
    if (!geminiApiKey) {
      return res.status(400).json({ 
        error: 'API_KEY_REQUIRED',
        message: 'Gemini API key is required. Please provide your API key.' 
      });
    }
    
    const files = await generateBackendCode(tables, relations, dbType, geminiApiKey);
    res.json(files);
  } catch (error) {
    console.error('Generation error:', error);
    
    // Check if it's a quota/rate limit error
    if (error.message?.includes('QUOTA_EXCEEDED') || 
        error.message?.includes('quota') ||
        error.message?.includes('429') ||
        error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ 
        error: 'QUOTA_EXCEEDED',
        message: error.message || 'API quota exceeded. Please try again later or upgrade your plan.' 
      });
    }
    
    // Check if it's an API key related error
    if (error.message?.includes('API_KEY') || 
        error.message?.includes('INVALID_API_KEY') ||
        error.message?.includes('401') || 
        error.message?.includes('403') ||
        error.message?.includes('Invalid') ||
        error.message?.includes('authentication')) {
      return res.status(401).json({ 
        error: 'INVALID_API_KEY',
        message: 'Invalid or expired Gemini API key. Please check your API key.' 
      });
    }
    
    res.status(500).json({ 
      error: 'GENERATION_FAILED',
      message: error.message || 'Failed to generate backend code' 
    });
  }
});

export default router;

