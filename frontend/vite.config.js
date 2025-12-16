import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        // Only use proxy in development when using localhost
        ...(apiBaseUrl.includes('localhost') || apiBaseUrl.includes('127.0.0.1') ? {
          proxy: {
            '/api': {
              target: apiBaseUrl,
              changeOrigin: true,
            }
          }
        } : {})
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

