import { GoogleGenAI, Type } from "@google/genai";
import { DatabaseType } from "../types.js";

// Helper to construct the system prompt
const getSystemInstruction = (dbType) => `
You are a senior backend architect. Your task is to take a visual database schema JSON and generate a complete, production-ready Node.js backend.

TARGET DATABASE: ${dbType.toUpperCase()}

CRITICAL RULES:

${dbType === DatabaseType.MONGODB ? `
1. **Model Generation (Mongoose)**:
   - Use \`mongoose.Schema\`.
   - Handle 'String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Array', 'Object' types.
   - **Relationships**: 
     - 1:1 -> Use \`unique: true\` on the reference.
     - 1:N -> Use \`ref: 'ModelName'\`.
` : `
1. **Model Generation (Sequelize for ${dbType})**:
   - Use \`sequelize.define\`.
   - Use \`DataTypes.STRING\`, \`DataTypes.INTEGER\`, \`DataTypes.BOOLEAN\`, \`DataTypes.DATE\`, etc.
   - **Relationships**: 
     - Define associations in a static \`associate\` method or separate init file.
     - Use \`User.hasMany(Post)\` and \`Post.belongsTo(User)\`.
     - Convert 'ObjectId' fields to \`DataTypes.INTEGER\` (auto-increment) or \`DataTypes.UUID\`.
`}

2. **Validation (Zod)**:
   - Generate a corresponding Zod schema for *every* model.
   - Enforce \`required\`, \`min\`, \`max\` logic where inferred.

3. **Routes (Express)**:
   - Generate modular routes (GET, POST, PUT, DELETE).
   - **Middleware**: Apply the Zod validation middleware to POST/PUT routes.
   - **Error Handling**: Wrap async route handlers.

4. **File Structure**:
   - Return a JSON array of file objects.
   - Include \`server.js\` as the entry point.
   - Connect to DB (${dbType === DatabaseType.MONGODB ? 'mongoose.connect' : 'new Sequelize(...)'}).

5. **Code Formatting**:
   - **CRITICAL**: The code in the 'content' field MUST be formatted with standard 2-space indentation and real newlines (\n).
   - **DO NOT** return minified code (single line).
   - Make it readable for a developer.

OUTPUT FORMAT:
Return ONLY a JSON array.
Example:
[
  { "filename": "models/User.js", "content": "const mongoose = require('mongoose');\\n\\nconst UserSchema = ...", "type": "model" },
  { "filename": "routes/user.routes.js", "content": "...", "type": "route" },
  { "filename": "server.js", "content": "...", "type": "server" }
]
`;

// List of models to try - use any that works
const MODELS_TO_TRY = [
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro-002",
  "gemini-2.0-flash-exp"
];

// Try to generate with a specific model
const tryModel = async (ai, model, prompt, dbType) => {
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: getSystemInstruction(dbType),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            filename: { type: Type.STRING },
            content: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["model", "route", "validation", "server"] },
          },
          required: ["filename", "content", "type"]
        }
      }
    }
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Empty response from AI");

  return JSON.parse(jsonText);
};

export const generateBackendCode = async (
  tables,
  relations,
  dbType
) => {
  
  // Try to use backend API first (it has better model fallback logic)
  try {
    // Get API key from localStorage if available
    const userApiKey = localStorage.getItem('gemini_api_key');
    
    // Log which API key is being used
    if (userApiKey) {
      const keyPreview = userApiKey.substring(0, 10) + '...';
      console.log(`🔑 Frontend using API key from localStorage: ${keyPreview}`);
    } else {
      console.log(`🔑 Frontend: No API key in localStorage, will use backend .env key`);
    }
    
    if (!userApiKey) {
      throw new Error('API_KEY_REQUIRED');
    }
    
    const response = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        tables, 
        relations, 
        dbType,
        apiKey: userApiKey
      }),
    });

    if (response.ok) {
      const files = await response.json();
      return files;
    } else {
      // Handle error responses
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429 || errorData.error === 'QUOTA_EXCEEDED') {
        throw new Error('QUOTA_EXCEEDED: ' + (errorData.message || 'API quota exceeded'));
      }
      
      if (response.status === 401 || errorData.error === 'INVALID_API_KEY' || errorData.error === 'API_KEY_REQUIRED') {
        throw new Error('INVALID_API_KEY: ' + (errorData.message || 'Invalid API key'));
      }
      
      throw new Error(errorData.message || 'Failed to generate code');
    }
  } catch (error) {
    // Re-throw API key errors so they can be handled by the caller
    if (error.message?.includes('API_KEY_REQUIRED') || error.message?.includes('INVALID_API_KEY')) {
      throw error;
    }
    console.warn('Backend API not available, using client-side generation:', error);
  }

  // FALLBACK: Use client-side generation
  // Get API key from localStorage first, then fall back to env vars
  const userApiKey = localStorage.getItem('gemini_api_key');
  const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
  
  // FALLBACK: Use Mock Generator if API Key is missing
  if (!apiKey) {
    console.warn("API Key missing. Using Mock Generator.");
    throw new Error('API_KEY_REQUIRED');
  }
  const ai = new GoogleGenAI({ apiKey });

  const schemaPayload = JSON.stringify({ tables, relations }, null, 2);

  const prompt = `
    Here is the database schema structure:
    ${schemaPayload}

    Generate the complete backend code for ${dbType}.
    Ensure the code is PRETTY-PRINTED (not minified).
  `;

  try {
    // Try each model in the list until one succeeds
    let lastError = null;
    
    for (const model of MODELS_TO_TRY) {
      try {
        console.log(`🔄 Trying model: ${model}`);
        const result = await tryModel(ai, model, prompt, dbType);
        console.log(`✅ Successfully generated with model: ${model}`);
        return result;
      } catch (error) {
        console.warn(`❌ Model ${model} failed:`, error.message?.substring(0, 100));
        lastError = error;
        
        // Check if model doesn't exist (404) - skip it and try next
        const isNotFound = error.status === 404 || 
                          error.message?.includes('not found') ||
                          error.message?.includes('NOT_FOUND');
        
        if (isNotFound) {
          console.log(`⏭️ Model ${model} not found. Trying next model...`);
          continue; // Skip this model and try next one
        }
        
        // Check if this is a quota/rate limit error - try next model
        const isQuotaError = error.status === 429 || 
                           error.message?.includes('quota') ||
                           error.message?.includes('RESOURCE_EXHAUSTED') ||
                           error.message?.includes('limit: 0');
        
        if (isQuotaError) {
          console.log(`⏭️ Model ${model} has quota issues. Trying next model...`);
          continue; // Try next model
        }
        
        // If it's not a quota/availability/not found error, don't try other models
        // (e.g., invalid API key, malformed request, etc.)
        throw error;
      }
    }

    // If all models failed, handle the error
    if (lastError) {
      console.error("Gemini Generation Error (all models failed):", lastError);
      
      // Re-throw API key and quota errors
      if (lastError.message?.includes('API_KEY_REQUIRED') || 
          lastError.message?.includes('INVALID_API_KEY') ||
          lastError.message?.includes('QUOTA_EXCEEDED')) {
        throw lastError;
      }
      
      // Fallback to mock if API fails for other reasons
      console.warn("Falling back to mock code generator...");
      return generateMockCode(tables, relations, dbType);
    }
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    
    // Re-throw API key and quota errors
    if (error.message?.includes('API_KEY_REQUIRED') || 
        error.message?.includes('INVALID_API_KEY') ||
        error.message?.includes('QUOTA_EXCEEDED')) {
      throw error;
    }
    
    // Fallback to mock if API fails for other reasons
    console.warn("Falling back to mock code generator...");
    return generateMockCode(tables, relations, dbType);
  }
};

/**
 * Local Mock Generator for testing without API Key
 */
const generateMockCode = (
  tables,
  relations,
  dbType
) => {
  const files = [];
  const isSQL = dbType !== DatabaseType.MONGODB;

  // 1. Generate Server File
  files.push({
    filename: 'server.js',
    type: 'server',
    content: `
const express = require('express');
const app = express();
${isSQL ? `const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URI);` : `const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);`}

app.use(express.json());

// Routes
${tables.map(t => `app.use('/api/${t.name.toLowerCase()}s', require('./routes/${t.name.toLowerCase()}.routes'));`).join('\n')}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
    `.trim()
  });

  // 2. Generate Models & Routes & Validations
  tables.forEach(table => {
    // Model
    let modelContent = '';
    if (isSQL) {
      modelContent = `
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ${table.name} = sequelize.define('${table.name}', {
${table.fields.map(f => `  ${f.name}: {
    type: DataTypes.${f.type === 'String' ? 'STRING' : f.type === 'Number' ? 'INTEGER' : f.type === 'Boolean' ? 'BOOLEAN' : 'STRING'},
    allowNull: ${!f.required}
  }`).join(',\n')}
});

module.exports = ${table.name};
      `;
    } else {
      modelContent = `
const mongoose = require('mongoose');

const ${table.name}Schema = new mongoose.Schema({
${table.fields.map(f => `  ${f.name}: { type: ${f.type === 'ObjectId' ? 'mongoose.Schema.Types.ObjectId' : f.type}, required: ${f.required} }`).join(',\n')}
});

module.exports = mongoose.model('${table.name}', ${table.name}Schema);
      `;
    }

    files.push({
      filename: `models/${table.name}.js`,
      type: 'model',
      content: modelContent.trim()
    });

    // Validation
    files.push({
      filename: `validations/${table.name}.schema.js`,
      type: 'validation',
      content: `
const z = require('zod');

const ${table.name}Schema = z.object({
${table.fields.map(f => `  ${f.name}: z.${f.type === 'Number' ? 'number' : f.type === 'Boolean' ? 'boolean' : 'string'}()${!f.required ? '.optional()' : ''}`).join(',\n')}
});

module.exports = ${table.name}Schema;
      `.trim()
    });

    // Route
    files.push({
      filename: `routes/${table.name.toLowerCase()}.routes.js`,
      type: 'route',
      content: `
const router = require('express').Router();
const ${table.name}Model = require('../models/${table.name}');
const ${table.name}Validation = require('../validations/${table.name}.schema');

router.get('/', async (req, res) => {
  const items = await ${table.name}Model.${isSQL ? 'findAll()' : 'find()'};
  res.json(items);
});

router.post('/', async (req, res) => {
  const result = ${table.name}Validation.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);
  
  const newItem = await ${table.name}Model.create(req.body);
  res.json(newItem);
});

module.exports = router;
      `.trim()
    });
  });

  return files;
};

