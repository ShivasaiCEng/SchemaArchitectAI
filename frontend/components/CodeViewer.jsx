import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Play } from 'lucide-react';

const CodeViewer = ({ files, onClose, onRun }) => {
  const { isDark } = useTheme();
  const [selectedFile, setSelectedFile] = useState(files[0] || null);

  if (files.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-8" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div 
        className="border w-full max-w-6xl h-[85vh] rounded-xl flex overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Sidebar File Explorer */}
        <div 
          className="w-64 border-r flex flex-col transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#111111' : '#f4f4f5',
            borderColor: isDark ? '#27272a' : '#e4e4e7'
          }}
        >
          <div 
            className="p-4 border-b transition-colors duration-300"
            style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}
          >
            <h3 
              className="font-bold"
              style={{ color: isDark ? '#ffffff' : '#18181b' }}
            >
              Generated Project
            </h3>
            <p 
              className="text-xs mt-1"
              style={{ color: isDark ? '#71717a' : '#52525b' }}
            >
              Node.js • Mongoose • Zod
            </p>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {files.map((file) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFile(file)}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{
                  backgroundColor: selectedFile?.filename === file.filename
                    ? (isDark ? '#27272a' : '#e4e4e7')
                    : 'transparent',
                  color: selectedFile?.filename === file.filename
                    ? (isDark ? '#a3e635' : '#84cc16')
                    : (isDark ? '#a1a1aa' : '#3f3f46'),
                  borderLeft: selectedFile?.filename === file.filename
                    ? `2px solid ${isDark ? '#a3e635' : '#84cc16'}`
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedFile?.filename !== file.filename) {
                    e.target.style.backgroundColor = isDark ? '#18181b' : '#e4e4e7';
                    e.target.style.color = isDark ? '#ffffff' : '#18181b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFile?.filename !== file.filename) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                  }
                }}
              >
                <span className="opacity-70">
                  {file.type === 'model' && '📦'}
                  {file.type === 'route' && '🛣️'}
                  {file.type === 'validation' && '🛡️'}
                  {file.type === 'server' && '🚀'}
                </span>
                <span className="truncate">{file.filename}</span>
              </button>
            ))}
          </div>
          
          {/* Footer with Back Button */}
          <div 
            className="p-4 border-t transition-colors duration-300"
            style={{
              borderColor: isDark ? '#27272a' : '#e4e4e7',
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(228, 228, 231, 0.5)'
            }}
          >
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded transition-all text-sm font-medium border group"
              style={{
                backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                borderColor: isDark ? '#3f3f46' : '#d4d4d8',
                color: isDark ? '#e4e4e7' : '#18181b'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#3f3f46' : '#d4d4d8';
                e.target.style.color = isDark ? '#ffffff' : '#18181b';
                e.target.style.borderColor = isDark ? '#52525b' : '#a1a1aa';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
                e.target.style.color = isDark ? '#e4e4e7' : '#18181b';
                e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Editor
            </button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div 
          className="flex-1 flex flex-col transition-colors duration-300"
          style={{ backgroundColor: isDark ? '#0d1117' : '#f9fafb' }}
        >
          <div 
            className="h-14 border-b flex items-center justify-between px-4 transition-colors duration-300"
            style={{
              borderColor: isDark ? '#27272a' : '#e4e4e7',
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(228, 228, 231, 0.5)'
            }}
          >
             <div className="flex items-center gap-4">
                <span 
                  className="text-sm font-mono"
                  style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                >
                  {selectedFile?.filename}
                </span>
             </div>
             
             <div className="flex gap-3 items-center">
               <button 
                  onClick={onRun}
                  className="flex items-center gap-2 px-4 py-1.5 text-black text-sm font-bold rounded shadow-lg transition-all"
                  style={{
                    backgroundColor: isDark ? '#84cc16' : '#a3e635'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = isDark ? '#84cc16' : '#a3e635';
                    e.target.style.transform = 'scale(1)';
                  }}
               >
                  <Play size={14} fill="currentColor" />
                  Run / Test API
               </button>

               <div className="h-4 w-px bg-zinc-700 mx-1"></div>

               <button
                 onClick={() => {
                   if(selectedFile) navigator.clipboard.writeText(selectedFile.content);
                 }}
                 className="text-xs transition-colors flex items-center gap-1 px-2 py-1.5 rounded"
                 style={{
                   color: isDark ? '#a1a1aa' : '#3f3f46',
                   backgroundColor: 'transparent'
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.color = isDark ? '#ffffff' : '#18181b';
                   e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                   e.target.style.backgroundColor = 'transparent';
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                 Copy Code
               </button>
               <button 
                 onClick={onClose} 
                 className="p-2 rounded transition-colors"
                 style={{
                   color: isDark ? '#a1a1aa' : '#3f3f46',
                   backgroundColor: 'transparent'
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.color = isDark ? '#ffffff' : '#18181b';
                   e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                   e.target.style.backgroundColor = 'transparent';
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
             </div>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            <pre 
              className="font-mono text-sm leading-relaxed whitespace-pre overflow-x-auto"
              style={{ color: isDark ? '#e4e4e7' : '#18181b' }}
            >
              <code>{selectedFile?.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;

