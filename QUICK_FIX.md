# Quick Fix for 404 Error

## Problem
Getting `GET http://localhost:3000/ 404 (Not Found)`

## Solution

### Step 1: Kill All Node Processes
```powershell
# In PowerShell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 2: Clear Vite Cache
```bash
cd frontend
rm -rf .vite node_modules/.vite
```

### Step 3: Restart Dev Server
```bash
cd frontend
npm run dev
```

### Step 4: Check the Output
You should see:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 5: Open Browser
- Go to: `http://localhost:5173`
- NOT `http://localhost:5173/` (trailing slash might cause issues)
- Try: `http://127.0.0.1:5173` if localhost doesn't work

## Alternative: Use Different Port

If port 3000 is still having issues:

1. The port is already set to 5173 (Vite's default)
2. Restart: `npm run dev`
3. Access: `http://localhost:5173`

## Still Not Working?

1. **Check if index.html exists:**
   ```bash
   cd frontend
   Test-Path index.html
   # Should return True
   ```

2. **Verify you're in the frontend directory:**
   ```bash
   pwd
   # Should show: .../frontend
   ```

3. **Check for errors in terminal:**
   - Look for red error messages
   - Check if Vite actually started

4. **Try accessing directly:**
   - `http://127.0.0.1:5173`
   - `http://localhost:5173/index.html`

