# Troubleshooting Guide

## 404 Errors

If you're seeing 404 errors, check:

1. **Which resource is 404?**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh the page
   - Look for red entries (404 status)
   - Check the file name that's failing

2. **Common 404 Causes:**

   **Missing CSS file:**
   - ✅ Fixed: Created `frontend/index.css`
   
   **Module import issues:**
   - Make sure all imports use correct paths
   - Check file extensions (.jsx, .js)
   - Verify files exist in the correct locations

   **Vite entry point:**
   - Entry point should be `/index.jsx` in `index.html`
   - File should exist at `frontend/index.jsx`

3. **Quick Fixes:**

   ```bash
   # Stop all servers (Ctrl+C)
   
   # Clear cache and reinstall
   cd frontend
   rm -rf node_modules .vite dist
   npm install
   npm run dev
   ```

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

5. **Verify Vite is Running:**
   - Should see: `VITE v6.x.x ready in xxx ms`
   - Should see: `➜  Local:   http://localhost:3000/`
   - If not, check terminal for errors

## Still Not Working?

1. **Check if port 3000 is available:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3000
   ```

2. **Try a different port:**
   - Edit `frontend/vite.config.js`
   - Change `port: 3000` to `port: 3001`

3. **Check file permissions:**
   - Make sure you have read/write access to the frontend folder

4. **Verify Node.js version:**
   ```bash
   node --version
   # Should be v18 or higher
   ```

