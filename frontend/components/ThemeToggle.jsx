import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
      style={{
        backgroundColor: 'transparent',
        color: isDark ? '#a3e635' : '#84cc16',
        border: 'none',
        fontSize: '1.5rem' // Match blog text size (text-2xl = 1.5rem)
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={24} className="animate-in fade-in" />
      ) : (
        <Moon size={24} className="animate-in fade-in" />
      )}
    </button>
  );
};

export default ThemeToggle;

