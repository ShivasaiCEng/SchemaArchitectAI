
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext.jsx';
import { DatabaseType } from './types.js';
import { SAMPLE_SCHEMA_TABLES, SAMPLE_SCHEMA_RELATIONS, TABLE_WIDTH, HEADER_HEIGHT, FIELD_HEIGHT, EXAMPLE_PRESETS } from './constants.js';
import TableNode from './components/TableNode.jsx';
import ConnectionLine from './components/ConnectionLine.jsx';
import PropertiesPanel from './components/PropertiesPanel.jsx';
import CodeViewer from './components/CodeViewer.jsx';
import HelpModal from './components/HelpModal.jsx';
import ApiSandbox from './components/ApiSandbox.jsx';
import Tooltip from './components/Tooltip.jsx';
import LandingPage from './components/LandingPage.jsx';
import AuthModal from './components/AuthModal.jsx';
import GeminiApiKeyModal from './components/GeminiApiKeyModal.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import CustomSelect from './components/CustomSelect.jsx';
import { generateBackendCode } from './services/geminiService.js';
import { LayoutTemplate, Undo, Redo, HelpCircle, Database, Play, Layers, User as UserIcon, LogOut } from 'lucide-react';

function AppContent() {
  const { isDark } = useTheme();
  // --- View State ---
  const [showLanding, setShowLanding] = useState(true);

  // --- Auth State ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('schema_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState(null);
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(false);

  // --- App State ---
  const [tables, setTables] = useState(SAMPLE_SCHEMA_TABLES);
  const [relations, setRelations] = useState(SAMPLE_SCHEMA_RELATIONS);
  const [targetDb, setTargetDb] = useState(DatabaseType.MONGODB);
  
  // Undo/Redo Stacks
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState(null);

  const [selection, setSelection] = useState({ type: null, id: null });
  const [dragState, setDragState] = useState(null);
  const [linkingState, setLinkingState] = useState(null);
  
  // Ref for canvas to handle coordinates
  const canvasRef = useRef(null);

  // --- Helper ---
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Auth Handlers ---
  const handleAuthSuccess = (u) => {
     setUser(u);
     localStorage.setItem('schema_user', JSON.stringify(u));
     setAuthMode(null);
     showToast(`Welcome, ${u.name}!`);
     setShowLanding(false); // Go straight to app on auth
     
     // Check if user has Gemini API key, if not show modal
     const existingKey = localStorage.getItem('gemini_api_key');
     if (!existingKey) {
       // Show modal after a short delay for better UX
       setTimeout(() => {
         setShowGeminiModal(true);
       }, 500);
     }
  };
  
  const handleGeminiKeySave = async (apiKey) => {
     showToast('Gemini API key saved successfully!');
     // If user was trying to generate, automatically trigger generation
     if (shouldAutoGenerate) {
       setShouldAutoGenerate(false);
       // Small delay to ensure modal closes first
       setTimeout(() => {
         handleGenerate();
       }, 300);
     }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('schema_user');
    localStorage.removeItem('auth_token');
    setShowLanding(true);
    showToast("Logged out successfully");
    // Ensure user cannot access app after logout
    setSelection({ type: null, id: null });
  };
  
  // Check for existing auth token on mount and verify authentication
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('schema_user');
    
    if (token && savedUser) {
      // Verify token with backend
      fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('schema_user', JSON.stringify(data.user));
          // User is authenticated, allow access to app
          setShowLanding(false);
        } else {
          // Token invalid, clear storage and force login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('schema_user');
          setUser(null);
          setShowLanding(true);
        }
      })
      .catch(err => {
        console.error('Token verification failed:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('schema_user');
        setUser(null);
        setShowLanding(true);
      });
    } else {
      // No token or user, ensure landing page is shown
      setUser(null);
      setShowLanding(true);
    }
  }, []);

  // --- History Management ---
  const saveCheckpoint = useCallback(() => {
    const snapshot = {
      tables: JSON.parse(JSON.stringify(tables)),
      relations: JSON.parse(JSON.stringify(relations))
    };
    setHistory(prev => [...prev, snapshot]);
    setFuture([]); // Clear redo stack on new action
  }, [tables, relations]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    
    // Save current state to future
    const currentSnapshot = { tables, relations };
    setFuture(prev => [currentSnapshot, ...prev]);

    // Restore last state from history
    const previous = history[history.length - 1];
    setTables(previous.tables);
    setRelations(previous.relations);
    setHistory(prev => prev.slice(0, -1));
  }, [history, tables, relations]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    // Save current to history
    const currentSnapshot = { tables, relations };
    setHistory(prev => [...prev, currentSnapshot]);

    // Restore next state from future
    const next = future[0];
    setTables(next.tables);
    setRelations(next.relations);
    setFuture(prev => prev.slice(1));
  }, [future, tables, relations]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle shortcuts on landing page or modals
      if (showLanding || authMode) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, showLanding, authMode]);

  // --- Actions ---

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0 && !dragState) {
       setSelection({ type: null, id: null });
       setShowTemplates(false);
    }
  }, [dragState]);

  const handleTableMouseDown = (e, tableId) => {
    if (e.shiftKey) {
      // Start Linking Mode (Shift+Click)
      setLinkingState({ sourceId: tableId, mousePos: { x: e.clientX, y: e.clientY } });
      e.stopPropagation();
      return;
    }

    const table = tables.find(t => t.id === tableId);
    if (table) {
      setDragState({
        id: tableId,
        offset: { x: e.clientX - table.x, y: e.clientY - table.y },
        initialPos: { x: table.x, y: table.y }
      });
      setSelection({ type: 'table', id: tableId });
      setShowTemplates(false);
    }
  };
  
  const handleStartConnect = (tableId, x, y) => {
    setLinkingState({ sourceId: tableId, mousePos: { x, y } });
    setShowTemplates(false);
  };

  const handleMouseMove = useCallback((e) => {
    // Handle Dragging
    if (dragState) {
      setTables(prev => prev.map(t =>
        t.id === dragState.id
          ? { ...t, x: e.clientX - dragState.offset.x, y: e.clientY - dragState.offset.y }
          : t
      ));
    }
    // Handle Linking (Visual Line)
    if (linkingState) {
      setLinkingState(prev => prev ? { ...prev, mousePos: { x: e.clientX, y: e.clientY } } : null);
    }
  }, [dragState, linkingState]);

  const handleMouseUp = useCallback((e) => {
     if (dragState) {
       const table = tables.find(t => t.id === dragState.id);
       if (table && (Math.abs(table.x - dragState.initialPos.x) > 2 || Math.abs(table.y - dragState.initialPos.y) > 2)) {
         // Should logic: snapshot was handled at start in wrapper
       }
       setDragState(null);
     }

     // Handle Link Completion
     if (linkingState) {
       const mouseX = e.clientX;
       const mouseY = e.clientY;

       const targetTable = tables.find(t => {
          const tableHeight = HEADER_HEIGHT + (t.fields.length * FIELD_HEIGHT) + 20; 
          const right = t.x + TABLE_WIDTH;
          const bottom = t.y + tableHeight;
          return mouseX >= t.x && mouseX <= right && mouseY >= t.y && mouseY <= bottom;
       });

       if (targetTable && targetTable.id !== linkingState.sourceId) {
         saveCheckpoint();
         const newRelation = {
           id: crypto.randomUUID(),
           sourceTableId: linkingState.sourceId,
           targetTableId: targetTable.id,
           type: '1:N'
         };
         setRelations(prev => [...prev, newRelation]);
       }
       setLinkingState(null);
     }
  }, [linkingState, tables, dragState, saveCheckpoint, relations]);

  const handleDragStartWrapped = (e, tableId) => {
     saveCheckpoint();
     handleTableMouseDown(e, tableId);
  };

  const addTable = () => {
    saveCheckpoint();
    const newTable = {
      id: crypto.randomUUID(),
      name: 'NewTable',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      fields: []
    };
    setTables([...tables, newTable]);
    setSelection({ type: 'table', id: newTable.id });
  };

  const loadPreset = (name) => {
    saveCheckpoint();
    const preset = EXAMPLE_PRESETS[name];
    if (preset) {
      setTables(JSON.parse(JSON.stringify(preset.tables)));
      setRelations(JSON.parse(JSON.stringify(preset.relations)));
      
      // Auto-switch DB based on name hint
      const lowerName = name.toLowerCase();
      if (lowerName.includes('postgresql')) {
        setTargetDb(DatabaseType.POSTGRESQL);
        showToast(`Loaded template for PostgreSQL`);
      } else if (lowerName.includes('mysql')) {
        setTargetDb(DatabaseType.MYSQL);
        showToast(`Loaded template for MySQL`);
      } else if (lowerName.includes('sql') && !lowerName.includes('nosql')) {
         setTargetDb(DatabaseType.POSTGRESQL); // Default to Postgres for generic SQL
         showToast(`Loaded template for SQL`);
      } else {
         setTargetDb(DatabaseType.MONGODB);
         showToast(`Loaded template for MongoDB`);
      }

      setShowTemplates(false);
      setSelection({ type: null, id: null });
    }
  };

  const handleGenerate = async () => {
    // Check if API key exists in localStorage
    const userApiKey = localStorage.getItem('gemini_api_key');
    
    // If no API key, show modal to ask for it
    if (!userApiKey) {
      setShouldAutoGenerate(true); // Mark that we should generate after key is saved
      setShowGeminiModal(true);
      showToast("Please provide your Gemini API key to generate code");
      return;
    }

    setIsGenerating(true);
    try {
      // Use API key for generation
      const files = await generateBackendCode(tables, relations, targetDb);
      setGeneratedFiles(files);
      setShowCode(true);
      showToast(`Generated for ${targetDb.toUpperCase()} successfully!`);
    } catch (e) {
      console.error("Generation error:", e);
      
      // Check if it's a quota/rate limit error
      if (e.message?.includes('QUOTA_EXCEEDED') || e.message?.includes('quota') || e.message?.includes('429')) {
        const quotaMessage = e.message.replace('QUOTA_EXCEEDED: ', '');
        showToast(quotaMessage || "API quota exceeded. Please try again later or upgrade your plan.");
        return;
      }
      
      // Check if it's an API key error
      if (e.message?.includes('API_KEY_REQUIRED') || e.message?.includes('INVALID_API_KEY') || e.message?.includes('401') || e.message?.includes('403')) {
        showToast("Invalid or missing API key. Please provide a valid Gemini API key.");
        // Clear invalid key and show modal
        localStorage.removeItem('gemini_api_key');
        setShouldAutoGenerate(true);
        setShowGeminiModal(true);
      } else {
        showToast("Generation failed: " + (e.message || "See console for details"));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateTable = (updated) => {
      const oldTable = tables.find(t => t.id === updated.id);
      if (oldTable && oldTable.fields.length !== updated.fields.length) {
          saveCheckpoint();
      }
      setTables(prev => prev.map(t => t.id === updated.id ? updated : t));
  };
  
  const handleDeleteTable = (id) => {
      saveCheckpoint();
      setTables(prev => prev.filter(t => t.id !== id));
      setRelations(prev => prev.filter(r => r.sourceTableId !== id && r.targetTableId !== id));
      setSelection({ type: null, id: null });
  };

  // Derived State
  const selectedTable = selection.type === 'table' ? tables.find(t => t.id === selection.id) || null : null;
  const selectedRelation = selection.type === 'relation' ? relations.find(r => r.id === selection.id) || null : null;

  // --- RENDER ---
  
  // Show landing page if not authenticated or explicitly set
  if (showLanding || !user) {
    return (
      <>
        <LandingPage 
          user={user}
          onGetStarted={() => {
            // Only allow access if user is authenticated
            if (user) {
              setShowLanding(false);
            } else {
              // If not authenticated, show login modal
              setAuthMode('login');
              showToast("Please sign in to access the application");
            }
          }} 
          onOpenAuth={setAuthMode}
          onLogout={handleLogout}
        />
        {authMode && (
          <AuthModal 
            mode={authMode} 
            onClose={() => setAuthMode(null)} 
            onAuthSuccess={handleAuthSuccess}
            onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          />
        )}
        {showGeminiModal && (
          <GeminiApiKeyModal
            onClose={() => setShowGeminiModal(false)}
            onSave={handleGeminiKeySave}
          />
        )}
      </>
    );
  }

  return (
    <div 
      className="flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#09090b' : '#ffffff',
        color: isDark ? '#e4e4e7' : '#18181b'
      }}
    >
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[100] px-4 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-top-4 font-medium"
          style={{
            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
            border: `1px solid ${isDark ? '#3f3f46' : '#e4e4e7'}`,
            color: isDark ? '#a3e635' : '#65a30d'
          }}
        >
          {toast}
        </div>
      )}

      {/* --- Toolbar --- */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-4">
        <div 
          className="flex items-center gap-4 border p-2 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#111111' : '#f4f4f5',
            borderColor: isDark ? '#27272a' : '#e4e4e7',
            boxShadow: isDark ? '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Logo or User Profile */}
          <button 
             onClick={() => setShowLanding(true)}
             className="px-3 font-bold flex items-center gap-2 select-none transition-colors"
             style={{
               color: isDark ? '#ffffff' : '#18181b'
             }}
             onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#65a30d'}
             onMouseLeave={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
          >
             {user ? (
               <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center text-black shadow-[0_0_10px_rgba(163,230,53,0.3)]">
                    <UserIcon size={14} />
                 </div>
                 <span className="truncate max-w-[120px]">{user.name}</span>
               </div>
             ) : (
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center text-black">
                    <Layers size={12} strokeWidth={3} />
                 </div>
                 <span style={{ color: isDark ? '#ffffff' : '#18181b' }}>SchemaArchitect</span>
               </div>
             )}
          </button>
          
          <div className="h-6 w-px mx-2" style={{ backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}></div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          <div className="h-6 w-px mx-2" style={{ backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}></div>
          
          {/* History Controls */}
          <div className="flex items-center gap-1">
            <Tooltip content="Undo (Ctrl+Z)" position="bottom">
              <button 
                onClick={undo} 
                disabled={history.length === 0}
                className={`p-1.5 rounded transition-colors ${history.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                style={{
                  color: history.length === 0 
                    ? (isDark ? '#3f3f46' : '#a1a1aa')
                    : (isDark ? '#a1a1aa' : '#3f3f46'),
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (history.length > 0) {
                    e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
                    e.target.style.color = isDark ? '#a3e635' : '#65a30d';
                  }
                }}
                onMouseLeave={(e) => {
                  if (history.length > 0) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                  }
                }}
              >
                <Undo size={16} />
              </button>
            </Tooltip>
            <Tooltip content="Redo (Ctrl+Y)" position="bottom">
              <button 
                onClick={redo} 
                disabled={future.length === 0}
                className={`p-1.5 rounded transition-colors ${future.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                style={{
                  color: future.length === 0 
                    ? (isDark ? '#3f3f46' : '#a1a1aa')
                    : (isDark ? '#a1a1aa' : '#3f3f46'),
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (future.length > 0) {
                    e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
                    e.target.style.color = isDark ? '#a3e635' : '#65a30d';
                  }
                }}
                onMouseLeave={(e) => {
                  if (future.length > 0) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                  }
                }}
              >
                <Redo size={16} />
              </button>
            </Tooltip>
          </div>

          <div className="h-6 w-px mx-2" style={{ backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}></div>
          
          <Tooltip content="Create a new entity table" position="bottom">
            <button 
              onClick={addTable} 
              className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                color: isDark ? '#e4e4e7' : '#18181b'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#3f3f46' : '#d4d4d8';
                e.target.style.color = isDark ? '#a3e635' : '#65a30d';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
                e.target.style.color = isDark ? '#e4e4e7' : '#18181b';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              Add Entity
            </button>
          </Tooltip>

          <div className="relative">
            <Tooltip content="Load pre-built example schemas" position="bottom">
              <button 
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors border"
                style={{
                  backgroundColor: showTemplates 
                    ? (isDark ? '#27272a' : '#e4e4e7')
                    : 'transparent',
                  borderColor: showTemplates
                    ? (isDark ? '#3f3f46' : '#d4d4d8')
                    : 'transparent',
                  color: showTemplates
                    ? (isDark ? '#a3e635' : '#65a30d')
                    : (isDark ? '#a1a1aa' : '#3f3f46')
                }}
                onMouseEnter={(e) => {
                  if (!showTemplates) {
                    e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
                    e.target.style.color = isDark ? '#ffffff' : '#18181b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showTemplates) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                  }
                }}
              >
                <LayoutTemplate size={16} />
                Templates
              </button>
            </Tooltip>
            
            {showTemplates && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 border rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                  backgroundColor: isDark ? '#111111' : '#f4f4f5',
                  borderColor: isDark ? '#27272a' : '#e4e4e7'
                }}
              >
                {Object.keys(EXAMPLE_PRESETS).map(name => (
                  <button
                    key={name}
                    onClick={() => loadPreset(name)}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors border-b last:border-0 flex items-center justify-between"
                    style={{
                      color: isDark ? '#a1a1aa' : '#3f3f46',
                      borderColor: isDark ? '#18181b' : '#e4e4e7'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = isDark ? '#18181b' : '#e4e4e7';
                      e.target.style.color = isDark ? '#a3e635' : '#65a30d';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                    }}
                  >
                    <span>{name.split(' (')[0]}</span>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: isDark ? '#27272a' : '#d4d4d8',
                        color: isDark ? '#71717a' : '#52525b'
                      }}
                    >
                        {name.includes('SQL') ? 'SQL' : 'Mongo'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-6 w-px mx-2" style={{ backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}></div>
          
          {/* DB Selector */}
          <Tooltip content="Select target database for code generation" position="bottom">
            <div className="flex items-center gap-2 px-2">
              <Database size={16} style={{ color: isDark ? '#71717a' : '#52525b' }} />
              <CustomSelect
                value={targetDb}
                onChange={(value) => setTargetDb(value)}
                options={[
                  { value: DatabaseType.MONGODB, label: 'MongoDB' },
                  { value: DatabaseType.POSTGRESQL, label: 'PostgreSQL' },
                  { value: DatabaseType.MYSQL, label: 'MySQL' }
                ]}
                className="text-sm"
                style={{ minWidth: '120px' }}
              />
            </div>
          </Tooltip>

          <div className="h-6 w-px mx-2" style={{ backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}></div>
          
          {/* Sandbox Launch (Direct) */}
          <Tooltip content="Test API in Sandbox (Mock Server)" position="bottom">
            <button 
              onClick={() => setShowSandbox(true)}
              className="p-1.5 rounded transition-colors"
              style={{
                color: isDark ? '#a1a1aa' : '#3f3f46',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isDark ? '#a3e635' : '#65a30d';
                e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Play size={18} />
            </button>
          </Tooltip>

          <div className="h-6 w-px mx-2" style={{ backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}></div>
          
          <Tooltip content="Show Tutorial & Help" position="bottom">
            <button 
              onClick={() => setShowHelp(true)}
              className="p-1.5 rounded transition-colors"
              style={{
                color: isDark ? '#a1a1aa' : '#3f3f46',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isDark ? '#a3e635' : '#84cc16';
                e.target.style.backgroundColor = isDark ? '#27272a' : '#e4e4e7';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <HelpCircle size={18} />
            </button>
          </Tooltip>

        </div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <Tooltip content="Generate source code for selected DB" position="bottom-left">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all"
            style={{
              backgroundColor: isGenerating 
                ? (isDark ? '#27272a' : '#e4e4e7')
                : (isDark ? '#a3e635' : '#84cc16'),
              color: isGenerating 
                ? (isDark ? '#71717a' : '#a1a1aa')
                : '#000000',
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.target.style.backgroundColor = isDark ? '#84cc16' : '#65a30d';
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating) {
                e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                Generate Backend
              </>
            )}
          </button>
        </Tooltip>
      </div>

      {/* --- Canvas --- */}
      <div
        ref={canvasRef}
        className="relative flex-1 cursor-crosshair overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#09090b' : '#ffffff'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{
               backgroundImage: `radial-gradient(${isDark ? '#52525b' : '#d4d4d8'} 1px, transparent 1px)`,
               backgroundSize: '24px 24px'
             }}
        />

        {/* SVG Layer for Connections - Behind tables (z-index: 1) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 1, position: 'absolute' }}>
           <defs>
              <marker id="arrowhead-normal" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#52525b" />
              </marker>
              <marker id="arrowhead-selected" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#a3e635" />
              </marker>
           </defs>
           {/* Linking Preview Line */}
           {linkingState && (
             <line
               x1={tables.find(t => t.id === linkingState.sourceId).x + TABLE_WIDTH}
               y1={tables.find(t => t.id === linkingState.sourceId).y + HEADER_HEIGHT + 12} 
               x2={linkingState.mousePos.x}
               y2={linkingState.mousePos.y}
               stroke="#a3e635"
               strokeWidth="2"
               strokeDasharray="5,5"
             />
           )}
           {/* Existing Relations */}
           {relations.map(rel => {
             const source = tables.find(t => t.id === rel.sourceTableId);
             const target = tables.find(t => t.id === rel.targetTableId);
             if (!source || !target) return null;
             return (
               <g key={rel.id} className="pointer-events-auto">
                 <ConnectionLine
                   relation={rel}
                   source={source}
                   target={target}
                   isSelected={selection.id === rel.id}
                   onSelect={(id) => setSelection({ type: 'relation', id })}
                 />
               </g>
             );
           })}
        </svg>

        {/* Nodes Layer - Above connections */}
        {tables.map(table => (
          <TableNode
            key={table.id}
            table={table}
            isSelected={selection.id === table.id}
            onMouseDown={(e, id) => handleDragStartWrapped(e, id)}
            onSelect={(id) => setSelection({ type: 'table', id })}
            onStartConnect={handleStartConnect}
          />
        ))}

      </div>

      {/* --- Properties Panel --- */}
      {(selectedTable || selectedRelation) && (
        <PropertiesPanel
          selectedTable={selectedTable}
          selectedRelation={selectedRelation}
          tables={tables}
          updateTable={handleUpdateTable}
          deleteTable={handleDeleteTable}
          updateRelation={(updated) => {
              saveCheckpoint(); // Save history on relationship change (e.g. 1:N to N:M)
              setRelations(prev => prev.map(r => r.id === updated.id ? updated : r))
          }}
          deleteRelation={(id) => {
             saveCheckpoint();
             setRelations(prev => prev.filter(r => r.id !== id));
             setSelection({ type: null, id: null });
          }}
          onClose={() => setSelection({ type: null, id: null })}
        />
      )}

      {/* --- Modals --- */}
      {showCode && (
        <CodeViewer
          files={generatedFiles}
          onClose={() => setShowCode(false)}
          onRun={() => {
            setShowCode(false);
            setShowSandbox(true);
          }}
        />
      )}
      
      {showSandbox && (
        <ApiSandbox
          tables={tables}
          dbType={targetDb}
          onClose={() => setShowSandbox(false)}
        />
      )}
      
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}

      {showGeminiModal && (
        <GeminiApiKeyModal
          onClose={() => setShowGeminiModal(false)}
          onSave={handleGeminiKeySave}
        />
      )}

    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

