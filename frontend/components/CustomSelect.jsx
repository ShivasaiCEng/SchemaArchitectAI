import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, className = '', style = {} }) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div ref={selectRef} className={`relative ${className}`} style={style}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between transition-colors"
        style={{
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          border: `1px solid ${isDark ? '#3f3f46' : '#d4d4d8'}`,
          color: isDark ? '#e4e4e7' : '#18181b',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = isDark ? '#27272a' : '#f4f4f5';
          e.target.style.borderColor = isDark ? '#52525b' : '#a1a1aa';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = isDark ? '#18181b' : '#ffffff';
          e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
        }}
        onFocus={(e) => {
          e.target.style.borderColor = isDark ? '#a3e635' : '#84cc16';
          e.target.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
        }}
      >
        <span>{selectedOption?.label || selectedOption?.value}</span>
        <ChevronDown 
          size={16} 
          className="transition-transform"
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isDark ? '#a1a1aa' : '#3f3f46'
          }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-md shadow-lg transition-colors"
          style={{
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
            boxShadow: isDark 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm transition-colors"
              style={{
                backgroundColor: value === option.value
                  ? (isDark ? '#27272a' : '#f4f4f5')
                  : 'transparent',
                color: value === option.value
                  ? (isDark ? '#a3e635' : '#84cc16')
                  : (isDark ? '#e4e4e7' : '#18181b')
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = isDark ? '#27272a' : '#f4f4f5';
                  e.target.style.color = isDark ? '#a3e635' : '#84cc16';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = isDark ? '#e4e4e7' : '#18181b';
                }
              }}
            >
              {option.label || option.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

