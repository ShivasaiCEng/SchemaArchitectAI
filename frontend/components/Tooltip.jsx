
import React, { useState } from 'react';

const Tooltip = ({ content, children, position = 'bottom', delay = 300, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const show = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: '-top-2 -translate-y-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full translate-y-2 left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full -translate-x-2 top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full translate-x-2 top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      onMouseEnter={show} 
      onMouseLeave={hide}
      onMouseDown={hide} // Hide on click
    >
      {children}
      {isVisible && (
        <div className={`absolute z-[100] px-3 py-1.5 text-xs font-medium text-slate-100 bg-slate-900 border border-slate-700 rounded-md shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-200 ${positionClasses[position]}`}>
          {content}
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-slate-900 border-slate-700 transform rotate-45 
            ${position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
            ${position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
            ${position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r' : ''}
            ${position === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l' : ''}
          `}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

