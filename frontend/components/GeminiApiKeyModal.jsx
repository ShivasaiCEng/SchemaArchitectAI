
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { X, Key, ExternalLink, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const GeminiApiKeyModal = ({ onClose, onSave }) => {
  const { isDark } = useTheme();
  // Load existing API key from localStorage if available
  const [apiKey, setApiKey] = useState(() => {
    const existing = localStorage.getItem('gemini_api_key');
    return existing || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Store API key in localStorage
      localStorage.setItem('gemini_api_key', apiKey.trim());
      
      // Call the save handler
      if (onSave) {
        await onSave(apiKey.trim());
      }
      
      onClose();
    } catch (err) {
      setError('Failed to save API key. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div 
        className="border w-full max-w-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative transition-colors max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: isDark ? '#111111' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors z-10"
          style={{ color: isDark ? '#71717a' : '#52525b' }}
          onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
          onMouseLeave={(e) => e.target.style.color = isDark ? '#71717a' : '#52525b'}
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                backgroundColor: isDark ? '#a3e635' : '#84cc16',
                boxShadow: isDark ? '0 0 20px rgba(163, 230, 53, 0.4)' : '0 0 20px rgba(132, 204, 22, 0.4)'
              }}
            >
              <Sparkles size={28} className="text-black" />
            </div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: isDark ? '#ffffff' : '#18181b' }}
            >
              Add Your Gemini API Key
            </h2>
            <p 
              className="text-sm"
              style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
            >
              Enable AI-powered code generation for your database schemas
            </p>
          </div>

          {/* Instructions Section */}
          {showInstructions && (
            <div 
              className="mb-6 p-5 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                borderColor: isDark ? '#27272a' : '#e4e4e7'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: isDark ? '#ffffff' : '#18181b' }}
              >
                <CheckCircle2 size={20} style={{ color: isDark ? '#a3e635' : '#84cc16' }} />
                Step-by-Step Instructions
              </h3>
              
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: isDark ? '#a3e635' : '#84cc16',
                      color: '#000000'
                    }}
                  >
                    1
                  </span>
                  <div className="flex-1">
                    <p 
                      className="font-medium mb-1"
                      style={{ color: isDark ? '#ffffff' : '#18181b' }}
                    >
                      Go to Google AI Studio
                    </p>
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm flex items-center gap-1 hover:underline transition-colors"
                      style={{ color: isDark ? '#a3e635' : '#84cc16' }}
                      onMouseEnter={(e) => e.target.style.color = isDark ? '#84cc16' : '#65a30d'}
                      onMouseLeave={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
                    >
                      Visit https://aistudio.google.com/apikey
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: isDark ? '#a3e635' : '#84cc16',
                      color: '#000000'
                    }}
                  >
                    2
                  </span>
                  <div className="flex-1">
                    <p 
                      className="font-medium mb-1"
                      style={{ color: isDark ? '#ffffff' : '#18181b' }}
                    >
                      Sign in with your Google account
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                    >
                      Use the same Google account you want to associate with the API key
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: isDark ? '#a3e635' : '#84cc16',
                      color: '#000000'
                    }}
                  >
                    3
                  </span>
                  <div className="flex-1">
                    <p 
                      className="font-medium mb-1"
                      style={{ color: isDark ? '#ffffff' : '#18181b' }}
                    >
                      Click "Create API Key"
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                    >
                      You'll see a button to create a new API key. Click it to generate one.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: isDark ? '#a3e635' : '#84cc16',
                      color: '#000000'
                    }}
                  >
                    4
                  </span>
                  <div className="flex-1">
                    <p 
                      className="font-medium mb-1"
                      style={{ color: isDark ? '#ffffff' : '#18181b' }}
                    >
                      Copy your API key
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                    >
                      The API key will be displayed. Copy it immediately as it won't be shown again.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: isDark ? '#a3e635' : '#84cc16',
                      color: '#000000'
                    }}
                  >
                    5
                  </span>
                  <div className="flex-1">
                    <p 
                      className="font-medium mb-1"
                      style={{ color: isDark ? '#ffffff' : '#18181b' }}
                    >
                      Paste it below and save
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                    >
                      Paste your API key in the input field below and click "Save API Key"
                    </p>
                  </div>
                </li>
              </ol>

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-4 text-sm font-medium transition-colors"
                style={{ color: isDark ? '#a3e635' : '#84cc16' }}
                onMouseEnter={(e) => e.target.style.color = isDark ? '#84cc16' : '#65a30d'}
                onMouseLeave={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              >
                Hide Instructions
              </button>
            </div>
          )}

          {!showInstructions && (
            <button
              onClick={() => setShowInstructions(true)}
              className="mb-4 text-sm font-medium transition-colors flex items-center gap-1"
              style={{ color: isDark ? '#a3e635' : '#84cc16' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#84cc16' : '#65a30d'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
            >
              Show Instructions
            </button>
          )}

          {/* API Key Input */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <label 
                className="text-xs font-bold uppercase ml-1 flex items-center gap-2"
                style={{ color: isDark ? '#71717a' : '#52525b' }}
              >
                <Key size={14} />
                Gemini API Key
              </label>
              {apiKey && (
                <span 
                  className="text-xs px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                    color: isDark ? '#a3e635' : '#65a30d'
                  }}
                >
                  Current: {apiKey.substring(0, 10)}...
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-lg py-3 pl-4 pr-4 focus:outline-none transition-colors font-mono text-sm"
                style={{
                  backgroundColor: isDark ? '#18181b' : '#ffffff',
                  border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                  color: isDark ? '#ffffff' : '#18181b'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = isDark ? '#a3e635' : '#84cc16';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#27272a' : '#e4e4e7';
                }}
                placeholder="AIzaSy..."
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded border border-red-400/20">
                {error}
              </div>
            )}
            <p 
              className="text-xs"
              style={{ color: isDark ? '#71717a' : '#52525b' }}
            >
              Your API key is stored locally and never shared with our servers
            </p>
            {apiKey && (
              <button
                onClick={() => {
                  localStorage.removeItem('gemini_api_key');
                  setApiKey('');
                  setError(null);
                }}
                className="text-xs font-medium transition-colors mt-2"
                style={{ color: isDark ? '#ef4444' : '#dc2626' }}
                onMouseEnter={(e) => e.target.style.color = isDark ? '#f87171' : '#fca5a5'}
                onMouseLeave={(e) => e.target.style.color = isDark ? '#ef4444' : '#dc2626'}
              >
                Clear existing API key
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 rounded-lg font-medium transition-colors border"
              style={{
                backgroundColor: 'transparent',
                borderColor: isDark ? '#27272a' : '#e4e4e7',
                color: isDark ? '#a1a1aa' : '#3f3f46'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#18181b' : '#f4f4f5';
                e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = isDark ? '#27272a' : '#e4e4e7';
              }}
            >
              Skip for Now
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 text-black font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: isDark ? '#a3e635' : '#84cc16',
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = isDark ? '#84cc16' : '#65a30d';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                }
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Save API Key
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiApiKeyModal;

