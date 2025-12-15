
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

const AuthModal = ({ mode, onClose, onAuthSuccess, onSwitchMode }) => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }
      if (mode === 'signup' && !name) {
        setError("Name is required");
        setIsLoading(false);
        return;
      }

      // API endpoint
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = mode === 'signup' 
        ? { name, email, password }
        : { email, password };

      // Call backend API
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Authentication failed');
        setIsLoading(false);
        return;
      }

      // Verify response has required data
      if (!data.success || !data.user || !data.token) {
        setError('Invalid response from server. Please try again.');
        setIsLoading(false);
        return;
      }

      // Success - store token and user
      localStorage.setItem('auth_token', data.token);
      
      // Call success handler with user data
      onAuthSuccess(data.user);
    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please check if the backend server is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div 
        className="border w-full max-w-md rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative transition-colors"
        style={{
          backgroundColor: isDark ? '#111111' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: isDark ? '#71717a' : '#52525b' }}
          onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
          onMouseLeave={(e) => e.target.style.color = isDark ? '#71717a' : '#52525b'}
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="mb-8 text-center">
             <div 
               className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-black"
               style={{
                 backgroundColor: isDark ? '#a3e635' : '#84cc16',
                 boxShadow: isDark ? '0 0 15px rgba(163, 230, 53, 0.3)' : '0 0 15px rgba(132, 204, 22, 0.3)'
               }}
             >
                <UserIcon size={24} />
             </div>
             <h2 
               className="text-2xl font-bold mb-2"
               style={{ color: isDark ? '#ffffff' : '#18181b' }}
             >
               {mode === 'login' ? 'Welcome Back' : 'Create Account'}
             </h2>
             <p 
               className="text-sm"
               style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
             >
               {mode === 'login' ? 'Enter your credentials to access your projects' : 'Start designing your architecture today'}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div className="space-y-1">
                <label 
                  className="text-xs font-bold uppercase ml-1"
                  style={{ color: isDark ? '#71717a' : '#52525b' }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon 
                    className="absolute left-3 top-1/2 -translate-y-1/2" 
                    size={18}
                    style={{ color: isDark ? '#71717a' : '#52525b' }}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg py-3 pl-10 pr-4 focus:outline-none transition-colors"
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
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label 
                className="text-xs font-bold uppercase ml-1"
                style={{ color: isDark ? '#71717a' : '#52525b' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 -translate-y-1/2" 
                  size={18}
                  style={{ color: isDark ? '#71717a' : '#52525b' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg py-3 pl-10 pr-4 focus:outline-none transition-colors"
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
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label 
                className="text-xs font-bold uppercase ml-1"
                style={{ color: isDark ? '#71717a' : '#52525b' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2" 
                  size={18}
                  style={{ color: isDark ? '#71717a' : '#52525b' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg py-3 pl-10 pr-4 focus:outline-none transition-colors"
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
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded border border-red-400/20 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-black font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
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
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p 
              className="text-sm"
              style={{ color: isDark ? '#71717a' : '#52525b' }}
            >
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={onSwitchMode}
                className="hover:underline font-medium transition-colors"
                style={{ color: isDark ? '#a3e635' : '#84cc16' }}
                onMouseEnter={(e) => e.target.style.color = isDark ? '#84cc16' : '#65a30d'}
                onMouseLeave={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

