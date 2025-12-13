
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import CustomSelect from './CustomSelect.jsx';
import { DatabaseType, FieldType } from '../types.js';
import { Play, RotateCcw, X, Plus, Trash, Search, Server, AlertCircle, CheckCircle } from 'lucide-react';

const ApiSandbox = ({ tables, dbType, onClose }) => {
  const { isDark } = useTheme();
  // --- Simulation State ---
  // Use Ref for "Backend" storage logic to avoid stale closures in setTimeout
  const dbRef = useRef({});
  // Use State for UI rendering to keep visual in sync
  const [db, setDb] = useState({});
  
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- UI State ---
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || '');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('{\n  \n}');
  const [response, setResponse] = useState('// Response will appear here');
  const [responseStatus, setResponseStatus] = useState(null);

  // Initialize DB
  useEffect(() => {
    const initialDb = {};
    tables.forEach(t => {
      initialDb[t.name] = [];
    });
    dbRef.current = initialDb;
    setDb(initialDb);
    addLog('SYSTEM', 'STARTUP', 200, `Mock ${dbType.toUpperCase()} Server started.`);
  }, []); // Run once on mount

  // Reset Body when table changes
  useEffect(() => {
    if (method === 'POST') {
      const table = tables.find(t => t.id === selectedTableId);
      if (table) {
        const template = {};
        table.fields.forEach(f => {
          if (f.name === 'id') return; // Skip ID
          if (f.defaultValue) {
             // Try to parse default value if it looks like a number/bool, otherwise string
             if (!isNaN(Number(f.defaultValue)) && f.type === FieldType.NUMBER) template[f.name] = Number(f.defaultValue);
             else if ((f.defaultValue === 'true' || f.defaultValue === 'false') && f.type === FieldType.BOOLEAN) template[f.name] = f.defaultValue === 'true';
             else template[f.name] = f.defaultValue;
          }
          else if (f.type === FieldType.STRING) template[f.name] = "string";
          else if (f.type === FieldType.NUMBER) template[f.name] = 0;
          else if (f.type === FieldType.BOOLEAN) template[f.name] = false;
          else if (f.type === FieldType.DATE) template[f.name] = new Date().toISOString();
          else template[f.name] = null;
        });
        setRequestBody(JSON.stringify(template, null, 2));
      }
    }
  }, [selectedTableId, method, tables]);

  const addLog = (method, path, status, message) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      method,
      path,
      status,
      message
    }, ...prev]);
  };

  const handleRun = () => {
    const table = tables.find(t => t.id === selectedTableId);
    if (!table) {
      addLog('ERROR', 'N/A', 404, 'No table selected');
      return;
    }

    const tableName = table.name;
    const endpoint = `/api/${tableName.toLowerCase()}s`;

    setIsLoading(true);
    setResponse('// Processing request...');
    setResponseStatus(null);
    addLog(method, endpoint, 0, 'Processing...');

    // Simulate Network Delay
    setTimeout(() => {
      try {
        let result;
        let status = 200;
        
        // IMPORTANT: Read from Ref to get latest state inside callback
        const currentDb = dbRef.current;

        if (method === 'GET') {
          // Read
          result = currentDb[tableName] || [];
        } 
        else if (method === 'POST') {
          // Parse Body
          let body;
          try {
             body = JSON.parse(requestBody);
          } catch (e) {
             throw new Error("Invalid JSON body");
          }

          // Validation Logic
          for (const field of table.fields) {
            const val = body[field.name];
            
            // Required Check
            if (field.required && (val === undefined || val === null || val === '')) {
               throw new Error(`Field '${field.name}' is required.`);
            }

            // Type Check (Simple)
            if (val !== undefined && val !== null) {
              if (field.type === FieldType.NUMBER && typeof val !== 'number') throw new Error(`'${field.name}' must be a Number.`);
              if (field.type === FieldType.BOOLEAN && typeof val !== 'boolean') throw new Error(`'${field.name}' must be a Boolean.`);
            }

            // Unique Check
            if (field.unique) {
               const exists = currentDb[tableName]?.some(r => r[field.name] === val);
               if (exists) throw new Error(`Duplicate value for unique field '${field.name}'.`);
            }
          }

          // Create Record
          const newId = dbType === DatabaseType.MONGODB ? crypto.randomUUID() : ((currentDb[tableName]?.length || 0) + 1);
          const newRecord = { id: newId, ...body };
          
          // Update Logic
          const updatedTable = [...(currentDb[tableName] || []), newRecord];
          
          // Write to Ref
          dbRef.current = { ...currentDb, [tableName]: updatedTable };
          // Sync to State for UI
          setDb({ ...dbRef.current });
          
          result = newRecord;
          status = 201;
        }
        else if (method === 'DELETE') {
           // Delete Logic
           dbRef.current = { ...currentDb, [tableName]: [] };
           setDb({ ...dbRef.current });
           result = { message: `All ${tableName} records deleted.` };
        }

        setResponse(JSON.stringify(result, null, 2));
        setResponseStatus(status);
        addLog(method, endpoint, status, status === 201 ? 'Created' : 'OK');

      } catch (err) {
        setResponse(JSON.stringify({ error: err.message }, null, 2));
        setResponseStatus(400);
        addLog(method, endpoint, 400, err.message);
      } finally {
        setIsLoading(false);
      }
    }, 400); // Fake network delay
  };

  const selectedTable = tables.find(t => t.id === selectedTableId);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-sm p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
      <div 
        className="border w-full max-w-7xl h-[90vh] rounded-xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors"
        style={{
          backgroundColor: isDark ? '#111111' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        
        {/* --- Left Pane: Request Maker --- */}
        <div 
          className="w-1/3 border-r flex flex-col transition-colors"
          style={{
            backgroundColor: isDark ? '#09090b' : '#f4f4f5',
            borderColor: isDark ? '#27272a' : '#e4e4e7'
          }}
        >
           <div 
             className="p-4 border-b flex items-center justify-between transition-colors"
             style={{
               borderColor: isDark ? '#27272a' : '#e4e4e7'
             }}
           >
             <div 
               className="flex items-center gap-2 font-bold transition-colors"
               style={{ color: isDark ? '#ffffff' : '#18181b' }}
             >
               <Server 
                 className=""
                 size={20}
                 style={{ color: isDark ? '#a3e635' : '#84cc16' }}
               />
               API Tester
             </div>
             <div 
               className="text-xs px-2 py-1 rounded font-mono transition-colors"
               style={{
                 backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                 color: isDark ? '#a1a1aa' : '#3f3f46'
               }}
             >
               Localhost Mode
             </div>
           </div>

           <div className="p-6 space-y-6 flex-1 overflow-y-auto">
             
             {/* Endpoint Control */}
             <div className="space-y-2">
               <label 
                 className="text-xs font-bold uppercase transition-colors"
                 style={{ color: isDark ? '#71717a' : '#52525b' }}
               >
                 Endpoint
               </label>
               <div 
                 className="flex rounded-lg border p-1 gap-1 transition-colors"
                 style={{
                   backgroundColor: isDark ? '#18181b' : '#ffffff',
                   borderColor: isDark ? '#3f3f46' : '#d4d4d8'
                 }}
               >
                 <CustomSelect
                   value={method}
                   onChange={(value) => setMethod(value)}
                   options={[
                     { value: 'GET', label: 'GET' },
                     { value: 'POST', label: 'POST' },
                     { value: 'DELETE', label: 'DELETE' }
                   ]}
                   className="font-bold"
                   style={{ minWidth: '80px' }}
                 />
                 <div 
                   className="w-px mx-1"
                   style={{ backgroundColor: isDark ? '#3f3f46' : '#d4d4d8' }}
                 ></div>
                 <CustomSelect
                   value={selectedTableId}
                   onChange={(value) => setSelectedTableId(value)}
                   options={tables.map(t => ({
                     value: t.id,
                     label: `/api/${t.name.toLowerCase()}s`
                   }))}
                   className="flex-1"
                 />
               </div>
             </div>

             {/* Request Body Editor */}
             {method === 'POST' && (
               <div className="space-y-2 flex-1 flex flex-col">
                 <div className="flex items-center justify-between">
                    <label 
                      className="text-xs font-bold uppercase transition-colors"
                      style={{ color: isDark ? '#71717a' : '#52525b' }}
                    >
                      Request Body (JSON)
                    </label>
                    <span 
                      className="text-xs transition-colors"
                      style={{ color: isDark ? '#52525b' : '#a1a1aa' }}
                    >
                      Schema: {selectedTable?.name}
                    </span>
                 </div>
                 <textarea
                   value={requestBody}
                   onChange={(e) => setRequestBody(e.target.value)}
                   className="w-full h-64 rounded-lg p-3 text-sm font-mono focus:outline-none resize-none custom-scrollbar transition-colors"
                   style={{
                     backgroundColor: isDark ? '#18181b' : '#ffffff',
                     border: `1px solid ${isDark ? '#3f3f46' : '#d4d4d8'}`,
                     color: isDark ? '#a3e635' : '#84cc16'
                   }}
                   onFocus={(e) => {
                     e.target.style.borderColor = isDark ? '#a3e635' : '#84cc16';
                   }}
                   onBlur={(e) => {
                     e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
                   }}
                   spellCheck="false"
                 />
               </div>
             )}

             <button
               onClick={handleRun}
               disabled={isLoading}
               className="w-full py-3 font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
               style={{
                 backgroundColor: isLoading 
                   ? (isDark ? '#27272a' : '#e4e4e7')
                   : (isDark ? '#84cc16' : '#a3e635'),
                 color: isLoading 
                   ? (isDark ? '#71717a' : '#a1a1aa')
                   : '#000000',
                 cursor: isLoading ? 'wait' : 'pointer'
               }}
               onMouseEnter={(e) => {
                 if (!isLoading) {
                   e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                 }
               }}
               onMouseLeave={(e) => {
                 if (!isLoading) {
                   e.target.style.backgroundColor = isDark ? '#84cc16' : '#a3e635';
                 }
               }}
             >
               {isLoading ? (
                 <>
                   <span className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full"></span>
                   Sending...
                 </>
               ) : (
                 <>
                   <Play size={18} fill="currentColor" />
                   Send Request
                 </>
               )}
             </button>
           </div>
        </div>

        {/* --- Middle Pane: Response Viewer --- */}
        <div 
          className="w-1/3 border-r flex flex-col transition-colors"
          style={{
            backgroundColor: isDark ? '#111111' : '#f4f4f5',
            borderColor: isDark ? '#27272a' : '#e4e4e7'
          }}
        >
           <div 
             className="p-3 border-b flex items-center justify-between transition-colors"
             style={{
               borderColor: isDark ? '#27272a' : '#e4e4e7',
               backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(228, 228, 231, 0.5)'
             }}
           >
             <span 
               className="text-xs font-bold uppercase transition-colors"
               style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
             >
               Response
             </span>
             {responseStatus && (
               <span 
                 className="text-xs px-2 py-0.5 rounded font-mono font-bold"
                 style={{
                   backgroundColor: responseStatus >= 200 && responseStatus < 300 
                     ? (isDark ? 'rgba(163, 230, 53, 0.2)' : 'rgba(132, 204, 22, 0.2)')
                     : 'rgba(239, 68, 68, 0.2)',
                   color: responseStatus >= 200 && responseStatus < 300 
                     ? (isDark ? '#a3e635' : '#84cc16')
                     : '#ef4444'
                 }}
               >
                 Status: {responseStatus}
               </span>
             )}
           </div>
           <div className="flex-1 p-0 overflow-hidden relative group">
              <pre 
                className="w-full h-full p-4 overflow-auto font-mono text-sm custom-scrollbar transition-opacity"
                style={{
                  opacity: isLoading ? 0.5 : 1,
                  color: responseStatus && responseStatus >= 400 
                    ? '#ef4444'
                    : (isDark ? '#e4e4e7' : '#18181b')
                }}
              >
                {response}
              </pre>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full"></div>
                </div>
              )}
           </div>
        </div>

        {/* --- Right Pane: Database & Logs --- */}
        <div 
          className="w-1/3 flex flex-col transition-colors"
          style={{
            backgroundColor: isDark ? '#09090b' : '#f4f4f5'
          }}
        >
           {/* DB View */}
           <div 
             className="flex-1 flex flex-col border-b overflow-hidden transition-colors"
             style={{
               borderColor: isDark ? '#27272a' : '#e4e4e7'
             }}
           >
              <div 
                className="p-3 border-b flex items-center justify-between transition-colors"
                style={{
                  borderColor: isDark ? '#27272a' : '#e4e4e7',
                  backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : 'rgba(228, 228, 231, 0.5)'
                }}
              >
                <span 
                  className="text-xs font-bold uppercase transition-colors"
                  style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                >
                  Database: {dbType}
                </span>
                <button 
                  onClick={() => {
                     if (confirm('Clear entire database?')) {
                       const reset = {};
                       tables.forEach(t => reset[t.name] = []);
                       dbRef.current = reset;
                       setDb(reset);
                       addLog('SYSTEM', 'RESET', 200, 'Database cleared.');
                     }
                  }}
                  className="text-xs flex items-center gap-1 transition-colors"
                  style={{ color: '#ef4444' }}
                  onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                >
                  <Trash size={12} /> Clear Data
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
                {(Object.entries(db)).map(([tbl, records]) => (
                  <div key={tbl} className="space-y-2">
                    <h4 
                      className="text-xs font-bold flex items-center gap-2 transition-colors"
                      style={{ color: isDark ? '#71717a' : '#52525b' }}
                    >
                      <DatabaseIcon size={12} /> {tbl} <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>({records.length})</span>
                    </h4>
                    {records.length === 0 ? (
                      <div 
                        className="text-xs italic px-2 py-1 border border-dashed rounded transition-colors"
                        style={{
                          color: isDark ? '#3f3f46' : '#a1a1aa',
                          borderColor: isDark ? '#27272a' : '#d4d4d8'
                        }}
                      >
                        Table is empty
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {records.map((rec, i) => (
                          <div 
                            key={i} 
                            className="text-xs font-mono border p-2 rounded truncate transition-colors cursor-default" 
                            title={JSON.stringify(rec, null, 2)}
                            style={{
                              backgroundColor: isDark ? '#18181b' : '#ffffff',
                              borderColor: isDark ? '#27272a' : '#e4e4e7',
                              color: isDark ? '#a1a1aa' : '#3f3f46'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = isDark ? '#e4e4e7' : '#18181b';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                            }}
                          >
                             {JSON.stringify(rec)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </div>

           {/* Server Logs */}
           <div 
             className="h-1/3 flex flex-col transition-colors"
             style={{
               backgroundColor: isDark ? '#000000' : '#f4f4f5'
             }}
           >
              <div 
                className="p-2 border-b text-xs font-bold uppercase flex items-center gap-2 transition-colors"
                style={{
                  borderColor: isDark ? '#27272a' : '#e4e4e7',
                  backgroundColor: isDark ? 'rgba(24, 24, 27, 0.3)' : 'rgba(228, 228, 231, 0.3)',
                  color: isDark ? '#71717a' : '#52525b'
                }}
              >
                <AlertCircle size={12} /> Server Console
              </div>
              <div className="flex-1 overflow-auto p-2 font-mono text-xs space-y-1 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>[{log.timestamp}]</span>
                    <span 
                      style={{
                        color: log.status >= 400 
                          ? '#ef4444' 
                          : log.status === 0 
                            ? '#eab308' 
                            : (isDark ? '#a3e635' : '#84cc16'),
                        fontWeight: (log.status >= 400 || log.status >= 200) ? 'bold' : 'normal'
                      }}
                    >
                      {log.method}
                    </span>
                    <span style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}>{log.path}</span>
                    <span style={{ color: isDark ? '#71717a' : '#52525b' }}>- {log.message}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div 
                    className="italic px-2 transition-colors"
                    style={{ color: isDark ? '#3f3f46' : '#a1a1aa' }}
                  >
                    Ready...
                  </div>
                )}
              </div>
           </div>
        </div>

        <button 
           onClick={onClose}
           className="absolute top-4 right-4 p-2 rounded-full border shadow-xl transition-colors hover:rotate-90 duration-200"
           style={{
             backgroundColor: isDark ? '#27272a' : '#e4e4e7',
             borderColor: isDark ? '#3f3f46' : '#d4d4d8',
             color: isDark ? '#ffffff' : '#18181b'
           }}
           onMouseEnter={(e) => {
             e.target.style.backgroundColor = isDark ? '#3f3f46' : '#d4d4d8';
           }}
           onMouseLeave={(e) => {
             e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
           }}
        >
           <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Simple Icon helper
const DatabaseIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"></path></svg>
);

export default ApiSandbox;

