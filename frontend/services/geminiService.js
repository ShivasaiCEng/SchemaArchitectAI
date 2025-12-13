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

export const generateBackendCode = async (
  tables,
  relations,
  dbType
) => {
  
  // Try to use backend API first
  try {
    // Get API key from localStorage if available
    const userApiKey = localStorage.getItem('gemini_api_key');
    
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        tables, 
        relations, 
        dbType,
        ...(userApiKey && { apiKey: userApiKey })
      }),
    });

    if (response.ok) {
      const files = await response.json();
      return files;
    }
  } catch (error) {
    console.warn('Backend API not available, using client-side generation:', error);
  }

  // FALLBACK: Use client-side generation
  // FALLBACK: Use Mock Generator if API Key is missing or explicitly requested
  if (!import.meta.env.VITE_GEMINI_API_KEY && !process.env.API_KEY) {
    console.warn("API Key missing. Using Mock Generator.");
    return generateMockCode(tables, relations, dbType);
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const schemaPayload = JSON.stringify({ tables, relations }, null, 2);

  const prompt = `
    Here is the database schema structure:
    ${schemaPayload}

    Generate the complete backend code for ${dbType}.
    Ensure the code is PRETTY-PRINTED (not minified).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback to mock if API fails
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

