# SchemaArchitect AI - MERN Stack Application

A full-stack application for designing database schemas visually and generating backend code.

## Project Structure

```
schemaarchitect-ai/
├── frontend/          # React + Vite frontend
├── backend/           # Express.js backend API
└── package.json       # Root package.json for managing both projects
```

## Getting Started

### ⚠️ Important: Access the Frontend, Not the Backend!

- ✅ **Frontend URL**: `http://localhost:3000` (This is where you access the app)
- ❌ **Backend URL**: `http://localhost:5000` (API only - don't access directly)

If you see "Cannot GET /" error, you're accessing the backend. Use the frontend URL instead!

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install all dependencies (root, frontend, and backend):
```bash
npm run install:all
```

Or install separately:
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### Running the Application

#### Development Mode (Both Frontend & Backend)

From the root directory:
```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173` (Vite default port)
- Backend on `http://localhost:5000`

#### Run Separately

**Frontend only:**
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
# Frontend will be available at http://localhost:5173
```

**Backend only:**
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

### Environment Variables

#### Backend (.env)
Create a `backend/.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

**MongoDB Connection String Examples:**
- Local MongoDB: `mongodb://localhost:27017/schemaarchitect`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/schemaarchitect?retryWrites=true&w=majority`
- MongoDB with authentication: `mongodb://username:password@localhost:27017/schemaarchitect`

**Note:** 
- Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string
- `JWT_SECRET` should be a random secret string for JWT token signing
- **`GEMINI_API_KEY`**: 
  - **Required for AI code generation** - Get your API key from [Google AI Studio](https://aistudio.google.com/)
  - If not provided, the app will use a basic mock code generator (limited functionality)
  - Add it to your `.env` file to enable full AI-powered code generation

#### Frontend (.env)
Create a `frontend/.env` file (optional):
```
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_api_key_here
```

## Features

- 🎨 Visual schema designer
- 🔄 Real-time collaboration
- 📦 Code generation (MongoDB, PostgreSQL, MySQL)
- 🧪 API sandbox testing
- 📱 Responsive design

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Lucide React Icons

### Backend
- Express.js
- MongoDB (Mongoose)
- Zod (Validation)

## License

MIT
