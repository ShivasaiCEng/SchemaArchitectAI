
import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { TABLE_WIDTH, HEADER_HEIGHT, FIELD_HEIGHT } from '../constants.js';
import { Link, KeyRound } from 'lucide-react';
import Tooltip from './Tooltip.jsx';

const TableNode = ({ table, isSelected, onMouseDown, onSelect, onStartConnect }) => {
  const { isDark } = useTheme();
  
  return (
    <div
      className="absolute flex flex-col rounded-md overflow-visible transition-all duration-200 group"
      style={{
        left: table.x,
        top: table.y,
        width: TABLE_WIDTH,
        cursor: 'grab',
        backgroundColor: isDark ? '#18181b' : '#f4f4f5',
        border: `1px solid ${isSelected 
          ? (isDark ? '#a3e635' : '#84cc16')
          : (isDark ? '#27272a' : '#e4e4e7')}`,
        boxShadow: isSelected 
          ? `0 0 0 2px ${isDark ? '#a3e635' : '#84cc16'}, ${isDark ? '0 8px 16px rgba(0, 0, 0, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}`
          : (isDark ? '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'),
        zIndex: 10
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = isDark ? '#27272a' : '#e4e4e7';
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation(); // Prevent canvas drag
        onMouseDown(e, table.id);
        onSelect(table.id);
      }}
    >
      {/* Connection Handle (Right Side) */}
      <Tooltip content="Drag to connect tables" position="right" className="absolute -right-3 top-10 z-50">
        <div
          className="w-6 h-6 bg-lime-400 hover:bg-lime-300 rounded-full cursor-crosshair flex items-center justify-center shadow-lg border-2 border-black opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onStartConnect(table.id, e.clientX, e.clientY);
          }}
        >
          <Link size={12} className="text-black" />
        </div>
      </Tooltip>

      {/* Header */}
      <Tooltip content="Drag to move table" position="top">
        <div
          className="h-[40px] w-full px-4 flex items-center justify-center relative border-b rounded-t-md transition-colors"
          style={{
            backgroundColor: isSelected 
              ? (isDark ? '#a3e635' : '#84cc16')
              : (isDark ? '#09090b' : '#ffffff'),
            borderColor: isSelected
              ? (isDark ? '#84cc16' : '#65a30d')
              : (isDark ? '#27272a' : '#e4e4e7')
          }}
        >
          <span 
            className="font-bold truncate text-base tracking-wide text-center"
            style={{
              color: isSelected ? '#000000' : (isDark ? '#e4e4e7' : '#18181b')
            }}
          >
            {table.name}
          </span>
          
          {/* Decorative Dots */}
          <div className="absolute right-3 flex gap-1.5 opacity-50">
             <div 
               className="w-1.5 h-1.5 rounded-full"
               style={{
                 backgroundColor: isSelected 
                   ? 'rgba(0, 0, 0, 0.4)'
                   : (isDark ? '#52525b' : '#a1a1aa')
               }}
             />
             <div 
               className="w-1.5 h-1.5 rounded-full"
               style={{
                 backgroundColor: isSelected 
                   ? 'rgba(0, 0, 0, 0.4)'
                   : (isDark ? '#52525b' : '#a1a1aa')
               }}
             />
          </div>
        </div>
      </Tooltip>

      {/* Fields */}
      <div className="py-2 px-1 space-y-0.5">
        {table.fields.map((field) => (
          <Tooltip key={field.id} content={`Field: ${field.name} (${field.type})${field.required ? ' - Required' : ' - Optional'}${field.unique ? ' - Unique' : ''}`} position="right" delay={500}>
            <div
              className="flex items-center justify-center px-3 py-1 text-sm rounded group/field cursor-pointer transition-colors relative"
              style={{ 
                height: FIELD_HEIGHT,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
               {/* Indicator Dot (Absolute Left) */}
               <div 
                 className={`absolute left-3 w-1.5 h-1.5 rounded-full ${
                   field.required ? 'bg-red-500' : 'bg-zinc-700'
                 }`} 
                 title={field.required ? 'Required' : 'Optional'}
               />
               
               {/* Field Content: Name : Type (Centered) */}
               <div className="flex items-baseline justify-center w-full font-mono text-sm pl-4 pr-4">
                 <span 
                   className="truncate"
                   style={{
                     color: field.required 
                       ? (isDark ? '#f4f4f7' : '#18181b')
                       : (isDark ? '#a1a1aa' : '#3f3f46'),
                     fontWeight: field.required ? 'bold' : 'medium'
                   }}
                 >
                    {field.name}
                 </span>
                 
                 <span 
                   className="mx-2 font-bold"
                   style={{ color: isDark ? '#52525b' : '#a1a1aa' }}
                 >:</span>
                 
                 <span 
                   className="text-xs truncate"
                   style={{ color: isDark ? 'rgba(163, 230, 53, 0.8)' : '#65a30d' }}
                 >
                    {field.type}
                 </span>
               </div>

               {/* Icons for attributes (Absolute Right) */}
               {field.unique && (
                 <KeyRound size={10} className="text-yellow-500 absolute right-2 opacity-50 group-hover/field:opacity-100" />
               )}
            </div>
          </Tooltip>
        ))}
        {table.fields.length === 0 && (
          <div 
            className="text-xs text-center py-4 italic"
            style={{ color: isDark ? '#52525b' : '#a1a1aa' }}
          >
            No fields defined
          </div>
        )}
      </div>
    </div>
  );
};

export default TableNode;

