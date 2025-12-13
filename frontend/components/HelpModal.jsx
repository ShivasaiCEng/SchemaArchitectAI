
import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { X, MousePointer, Link, Code, Layers } from 'lucide-react';

const HelpModal = ({ onClose }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div 
        className="border w-full max-w-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors"
        style={{
          backgroundColor: isDark ? '#111111' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          className="p-6 border-b flex items-center justify-between transition-colors duration-300"
          style={{
            borderColor: isDark ? '#27272a' : '#e4e4e7',
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(228, 228, 231, 0.5)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{
                backgroundColor: isDark ? 'rgba(163, 230, 53, 0.1)' : 'rgba(132, 204, 22, 0.1)'
              }}
            >
               <Layers 
                 className=""
                 size={24}
                 style={{ color: isDark ? '#a3e635' : '#84cc16' }}
               />
            </div>
            <div>
              <h2 
                className="text-xl font-bold"
                style={{ color: isDark ? '#ffffff' : '#18181b' }}
              >
                How to use SchemaArchitect
              </h2>
              <p 
                className="text-sm"
                style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
              >
                Quick start guide
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="transition-colors"
            style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
            onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
            onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="p-4 rounded-lg border transition-colors duration-300"
              style={{
                backgroundColor: isDark ? '#09090b' : '#f4f4f5',
                borderColor: isDark ? '#27272a' : '#e4e4e7'
              }}
            >
              <div 
                className="flex items-center gap-2 mb-2 font-bold"
                style={{ color: isDark ? '#a3e635' : '#84cc16' }}
              >
                <MousePointer size={18} />
                <span>1. Create & Move</span>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
              >
                Click <strong>"Add Entity"</strong> to create tables. Drag them around the infinite canvas to organize your schema.
              </p>
            </div>

            <div 
              className="p-4 rounded-lg border transition-colors duration-300"
              style={{
                backgroundColor: isDark ? '#09090b' : '#f4f4f5',
                borderColor: isDark ? '#27272a' : '#e4e4e7'
              }}
            >
              <div 
                className="flex items-center gap-2 mb-2 font-bold"
                style={{ color: isDark ? '#a3e635' : '#84cc16' }}
              >
                <Link size={18} />
                <span>2. Connect</span>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
              >
                Hover over a table to see the <strong>Lime Handle</strong> on the right. Drag from that handle to another table to create a relationship.
              </p>
            </div>

            <div 
              className="p-4 rounded-lg border transition-colors duration-300"
              style={{
                backgroundColor: isDark ? '#09090b' : '#f4f4f5',
                borderColor: isDark ? '#27272a' : '#e4e4e7'
              }}
            >
              <div 
                className="flex items-center gap-2 mb-2 font-bold"
                style={{ color: isDark ? '#a3e635' : '#84cc16' }}
              >
                <Layers size={18} />
                <span>3. Edit Properties</span>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
              >
                Click any table or relationship line to open the <strong>Properties Panel</strong>. Add fields, change types, and toggle 1:N / N:M relations.
              </p>
            </div>

            <div 
              className="p-4 rounded-lg border transition-colors duration-300"
              style={{
                backgroundColor: isDark ? '#09090b' : '#f4f4f5',
                borderColor: isDark ? '#27272a' : '#e4e4e7'
              }}
            >
              <div 
                className="flex items-center gap-2 mb-2 font-bold"
                style={{ color: isDark ? '#a3e635' : '#84cc16' }}
              >
                <Code size={18} />
                <span>4. Generate & Export</span>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
              >
                Select <strong>MongoDB</strong> or <strong>PostgreSQL/MySQL</strong> from the toolbar. Hit <strong>"Generate Backend"</strong> to create production-ready code.
              </p>
            </div>
          </div>

          <div 
            className="border-t pt-6 transition-colors duration-300"
            style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}
          >
            <h3 
              className="font-bold mb-3"
              style={{ color: isDark ? '#ffffff' : '#18181b' }}
            >
              Target Databases
            </h3>
             <ul 
               className="list-disc list-inside text-sm space-y-1"
               style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
             >
               <li><strong>MongoDB:</strong> Mongoose Schemas + Express + Zod</li>
               <li><strong>SQL:</strong> Sequelize Models + Express + Zod</li>
             </ul>
             <p 
               className="text-xs mt-2 italic"
               style={{ color: isDark ? '#71717a' : '#52525b' }}
             >
               Note: If no API key is present, the app switches to <strong>Mock Mode</strong> to demonstrate code generation locally.
             </p>
          </div>

        </div>
        
        <div 
          className="p-4 border-t flex justify-end transition-colors duration-300"
          style={{
            borderColor: isDark ? '#27272a' : '#e4e4e7',
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.3)' : 'rgba(228, 228, 231, 0.3)'
          }}
        >
          <button 
            onClick={onClose}
            className="px-6 py-2 text-black rounded-lg font-bold transition-colors"
            style={{
              backgroundColor: isDark ? '#a3e635' : '#84cc16'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? '#84cc16' : '#65a30d';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

