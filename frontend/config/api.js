// API Configuration
// Uses environment variable VITE_API_BASE_URL or falls back to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Debug: Log the API base URL being used (only in development)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🔗 Environment variable VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || 'NOT SET');
}

// Helper function to build full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure API_BASE_URL doesn't have trailing slash
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const fullUrl = `${baseUrl}/${cleanEndpoint}`;
  
  // Debug log in development
  if (import.meta.env.DEV) {
    console.log('🌐 API Call:', fullUrl);
  }
  
  return fullUrl;
};

