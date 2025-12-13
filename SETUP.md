# Quick Setup Guide

## The Issue: "Cannot GET /"

This error occurs when you're accessing the **backend server** (port 5000) directly. The backend only serves API routes, not the web page.

## Solution

### Option 1: Run Both Frontend and Backend (Recommended)

From the **root directory**, run:
```bash
npm run dev
```

This starts:
- **Frontend** on `http://localhost:3000` ← **Access this URL**
- **Backend** on `http://localhost:5000` (API only)

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install  # If not already installed
npm run dev
```
Then open: `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd backend
npm install  # If not already installed
npm run dev
```

## Important URLs

- ✅ **Frontend (React App)**: `http://localhost:5173`
- ✅ **Backend API Health**: `http://localhost:5000/api/health`
- ❌ **Don't access**: `http://localhost:5000` directly (backend only)

## Troubleshooting

1. **Make sure both servers are running**
   - Frontend should show: "VITE v6.x.x ready in xxx ms"
   - Backend should show: "🚀 Backend server running on http://localhost:5000"

2. **Check if ports are in use**
   - Frontend uses port 3000
   - Backend uses port 5000
   - If these are taken, you'll see an error

3. **Install dependencies first**
   ```bash
   npm run install:all
   ```

4. **Clear cache and reinstall**
   ```bash
   # In frontend directory
   rm -rf node_modules
   npm install
   
   # In backend directory
   rm -rf node_modules
   npm install
   ```

