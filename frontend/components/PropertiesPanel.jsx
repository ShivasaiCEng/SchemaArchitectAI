
import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { FieldType, RelationType } from '../types.js';
import { FIELD_TYPES, RELATION_TYPES } from '../constants.js';
import { Trash2, Plus, X } from 'lucide-react'; // Assuming Lucide or similar icons, using text fallback if not available

const PropertiesPanel = ({
  selectedTable,
  selectedRelation,
  tables,
  updateTable,
  deleteTable,
  updateRelation,
  deleteRelation,
  onClose,
}) => {
  const { isDark } = useTheme();
  
  if (!selectedTable && !selectedRelation) return null;

  return (
    <div 
      className="w-80 h-full border-l flex flex-col overflow-y-auto z-50 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#111111' : '#f4f4f5',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        boxShadow: isDark ? '-4px 0 16px rgba(0, 0, 0, 0.4), -2px 0 4px rgba(0, 0, 0, 0.2)' : '-4px 0 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div 
        className="p-4 border-b flex justify-between items-center transition-colors duration-300"
        style={{
          backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(228, 228, 231, 0.5)',
          borderColor: isDark ? '#27272a' : '#e4e4e7'
        }}
      >
        <h2 
          className="font-bold text-lg"
          style={{ color: isDark ? '#ffffff' : '#18181b' }}
        >
          {selectedTable ? 'Edit Entity' : 'Edit Relation'}
        </h2>
        <button 
          onClick={onClose} 
          className="transition-colors"
          style={{ color: isDark ? '#71717a' : '#52525b' }}
          onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
          onMouseLeave={(e) => e.target.style.color = isDark ? '#71717a' : '#52525b'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="p-4 flex-1 space-y-6">
        {selectedTable && (
          <>
            {/* Table Name */}
            <div className="space-y-2">
              <label 
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: isDark ? '#71717a' : '#52525b' }}
              >
                Entity Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedTable.name}
                  onChange={(e) => updateTable({ ...selectedTable, name: e.target.value })}
                  className="flex-1 rounded px-3 py-2 text-sm focus:outline-none transition-colors"
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
                />
                <button
                   onClick={() => deleteTable(selectedTable.id)}
                   className="p-2 bg-red-500/10 text-red-400 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors"
                   title="Delete Table"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label 
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: isDark ? '#71717a' : '#52525b' }}
                >
                  Fields
                </label>
                <button
                  onClick={() => {
                    const newField = {
                      id: crypto.randomUUID(),
                      name: 'newField',
                      type: FieldType.STRING,
                      required: false,
                      unique: false
                    };
                    updateTable({
                      ...selectedTable,
                      fields: [...selectedTable.fields, newField]
                    });
                  }}
                  className="text-xs flex items-center gap-1 transition-colors font-medium"
                  style={{ color: isDark ? '#a3e635' : '#84cc16' }}
                  onMouseEnter={(e) => e.target.style.color = isDark ? '#84cc16' : '#65a30d'}
                  onMouseLeave={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add Field
                </button>
              </div>

              <div className="space-y-3">
                {selectedTable.fields.map((field, idx) => (
                  <div 
                    key={field.id} 
                    className="p-3 rounded space-y-3 transition-colors duration-300"
                    style={{
                      backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(228, 228, 231, 0.5)',
                      border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`
                    }}
                  >
                    <div className="flex gap-2">
                       <input
                        type="text"
                        value={field.name}
                        onChange={(e) => {
                          const newFields = [...selectedTable.fields];
                          newFields[idx] = { ...field, name: e.target.value };
                          updateTable({ ...selectedTable, fields: newFields });
                        }}
                        className="flex-1 rounded px-2 py-1 text-xs focus:outline-none font-mono transition-colors"
                        style={{
                          backgroundColor: isDark ? '#111111' : '#ffffff',
                          border: `1px solid ${isDark ? '#3f3f46' : '#d4d4d8'}`,
                          color: isDark ? '#ffffff' : '#18181b'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = isDark ? '#a3e635' : '#84cc16';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
                        }}
                        placeholder="Field Name"
                      />
                       <button
                         onClick={() => {
                           const newFields = selectedTable.fields.filter(f => f.id !== field.id);
                           updateTable({ ...selectedTable, fields: newFields });
                         }}
                         className="text-zinc-600 hover:text-red-400"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const newFields = [...selectedTable.fields];
                          newFields[idx] = { ...field, type: e.target.value };
                          updateTable({ ...selectedTable, fields: newFields });
                        }}
                        className="rounded px-2 py-1 text-xs focus:outline-none font-mono transition-colors"
                        style={{
                          backgroundColor: isDark ? '#111111' : '#ffffff',
                          border: `1px solid ${isDark ? '#3f3f46' : '#d4d4d8'}`,
                          color: isDark ? '#e4e4e7' : '#18181b'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = isDark ? '#a3e635' : '#84cc16';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
                        }}
                      >
                        {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className="flex items-center gap-2">
                         <label 
                           className="flex items-center gap-1 text-xs cursor-pointer transition-colors"
                           style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                           onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
                           onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
                         >
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => {
                                const newFields = [...selectedTable.fields];
                                newFields[idx] = { ...field, required: e.target.checked };
                                updateTable({ ...selectedTable, fields: newFields });
                              }}
                              className="rounded transition-colors"
                              style={{
                                borderColor: isDark ? '#3f3f46' : '#d4d4d8',
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                accentColor: isDark ? '#a3e635' : '#84cc16'
                              }}
                            />
                            Req
                         </label>
                         <label 
                           className="flex items-center gap-1 text-xs cursor-pointer transition-colors"
                           style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                           onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
                           onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
                         >
                            <input
                              type="checkbox"
                              checked={field.unique}
                              onChange={(e) => {
                                const newFields = [...selectedTable.fields];
                                newFields[idx] = { ...field, unique: e.target.checked };
                                updateTable({ ...selectedTable, fields: newFields });
                              }}
                              className="rounded transition-colors"
                              style={{
                                borderColor: isDark ? '#3f3f46' : '#d4d4d8',
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                accentColor: isDark ? '#a3e635' : '#84cc16'
                              }}
                            />
                            Unq
                         </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedRelation && (
          <>
            <div className="space-y-4">
              <label 
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: isDark ? '#71717a' : '#52525b' }}
              >
                Relationship Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                 {RELATION_TYPES.map(type => (
                   <button
                     key={type}
                     onClick={() => updateRelation({ ...selectedRelation, type })}
                     className="px-3 py-2 text-sm rounded border font-bold transition-colors"
                     style={{
                       backgroundColor: selectedRelation.type === type
                         ? (isDark ? '#a3e635' : '#84cc16')
                         : (isDark ? '#18181b' : '#ffffff'),
                       borderColor: selectedRelation.type === type
                         ? (isDark ? '#84cc16' : '#65a30d')
                         : (isDark ? '#3f3f46' : '#d4d4d8'),
                       color: selectedRelation.type === type
                         ? '#000000'
                         : (isDark ? '#a1a1aa' : '#3f3f46')
                     }}
                     onMouseEnter={(e) => {
                       if (selectedRelation.type !== type) {
                         e.target.style.borderColor = isDark ? '#52525b' : '#a1a1aa';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (selectedRelation.type !== type) {
                         e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
                       }
                     }}
                   >
                     {type}
                   </button>
                 ))}
              </div>
            </div>
             <div 
               className="pt-4 border-t"
               style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}
             >
               <button
                 onClick={() => deleteRelation(selectedRelation.id)}
                 className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded transition-colors"
                 style={{
                   backgroundColor: 'rgba(239, 68, 68, 0.1)',
                   color: '#ef4444',
                   border: '1px solid rgba(239, 68, 68, 0.2)'
                 }}
                 onMouseEnter={(e) => {
                   e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                 Delete Relationship
               </button>
             </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;

