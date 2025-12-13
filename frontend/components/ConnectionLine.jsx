
import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { TABLE_WIDTH, HEADER_HEIGHT, FIELD_HEIGHT } from '../constants.js';

const ConnectionLine = ({ relation, source, target, onSelect, isSelected }) => {
  const { isDark } = useTheme();
  // Calculate connection points (center of tables for simplicity, could be enhanced to nearest edge)
  const sourceHeight = HEADER_HEIGHT + (source.fields.length * FIELD_HEIGHT) + 20; // +20 padding
  const targetHeight = HEADER_HEIGHT + (target.fields.length * FIELD_HEIGHT) + 20;

  const startX = source.x + TABLE_WIDTH / 2;
  const startY = source.y + sourceHeight / 2;
  const endX = target.x + TABLE_WIDTH / 2;
  const endY = target.y + targetHeight / 2;

  // Bezier Control Points for smooth curves
  const deltaX = Math.abs(endX - startX);
  const controlPointOffset = Math.max(deltaX * 0.5, 50);

  const path = `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY}, ${endX - controlPointOffset} ${endY}, ${endX} ${endY}`;

  // Midpoint for label
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onSelect(relation.id);
      }}
      className="cursor-pointer group"
    >
      {/* Interaction Area (Thicker, invisible line for easier clicking) */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth="15"
        fill="none"
      />
      {/* Visible Line */}
      <path
        d={path}
        stroke={isSelected 
          ? (isDark ? '#a3e635' : '#84cc16')
          : (isDark ? '#3f3f46' : '#d4d4d8')}
        strokeWidth={isSelected ? 3 : 2}
        fill="none"
        className="transition-colors duration-200"
        style={{
          stroke: isSelected 
            ? (isDark ? '#a3e635' : '#84cc16')
            : (isDark ? '#3f3f46' : '#d4d4d8')
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.target.style.stroke = isDark ? '#52525b' : '#a1a1aa';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.target.style.stroke = isDark ? '#3f3f46' : '#d4d4d8';
          }
        }}
        markerEnd={`url(#arrowhead-${isSelected ? 'selected' : 'normal'})`}
      />
      {/* Relationship Type Label */}
      <circle 
        cx={midX} 
        cy={midY} 
        r="12" 
        fill={isDark ? '#09090b' : '#ffffff'} 
        stroke={isSelected 
          ? (isDark ? '#a3e635' : '#84cc16')
          : (isDark ? '#3f3f46' : '#d4d4d8')} 
        strokeWidth="1" 
      />
      <text
        x={midX}
        y={midY}
        dy=".3em"
        textAnchor="middle"
        className="text-[10px] font-bold select-none pointer-events-none"
        fill={isDark ? '#ffffff' : '#18181b'}
      >
        {relation.type === '1:N' ? '1:N' : relation.type === 'N:M' ? 'N:M' : '1:1'}
      </text>
    </g>
  );
};

export default ConnectionLine;

