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
    
    const files = await generateBackendCode(tables, relations, dbType, geminiApiKey);
    res.json(files);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate backend code' });
  }
});

export default router;

