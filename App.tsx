import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Bot, 
  FileText, 
  Save, 
  RefreshCw, 
  ClipboardList, 
  BrainCircuit, 
  HeartHandshake, 
  Search,
  CheckCircle2,
  Download,
  Trash2,
  Plus,
  Sparkles,
  Wand2,
  Maximize2,
  X,
  MessageSquarePlus,
  Edit3,
  PenLine,
  Stethoscope,
  FolderOpen,
  History,
  LayoutDashboard,
  Globe,
  Menu
} from 'lucide-react';

import { Session, ClientInfo, AnalysisMode, GeminiResponse, Archive, ViewState, Language } from './types';
import { translations } from './locales';
import { generateSessionAnalysis, generateExecutiveSummary, generateComprehensivePlan } from './services/gemini';

// --- Sub-Components (Extracted to avoid definition inside render) ---

const EditModal = ({ 
  session, 
  setSession, 
  onClose, 
  onSave,
  lang
}: { 
  session: Session | null, 
  setSession: (s: Session) => void, 
  onClose: () => void, 
  onSave: () => void,
  lang: Language
}) => {
  if (!session) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Edit3 size={18} /> {t.editRecord}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.clientOriginal}</label>
            <textarea 
              className="w-full text-slate-800 text-sm whitespace-pre-wrap border-none resize-none focus:ring-0 p-0"
              value={session.clientStatement}
              onChange={(e) => setSession({...session, clientStatement: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-teal-700 flex items-center gap-2">
                <BrainCircuit size={16}/> {t.professionalAnalysis} ({session.mode})
              </label>
              <textarea 
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-64 text-sm font-sans leading-relaxed"
                value={session.analysis}
                onChange={(e) => setSession({...session, analysis: e.target.value})}
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Wand2 size={16}/> {t.interventionPlan}
              </label>
              <textarea 
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 h-64 text-sm font-sans leading-relaxed"
                value={session.plan}
                onChange={(e) => setSession({...session, plan: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-amber-700 flex items-center gap-2">
                <MessageSquarePlus size={16}/> {t.feedbackLabel}
              </label>
              <textarea 
                className="w-full p-4 border border-amber-200 bg-amber-50 rounded-lg focus:ring-2 focus:ring-amber-500 h-32 text-sm font-sans"
                placeholder={t.feedbackPlaceholder}
                value={session.feedback || ''}
                onChange={(e) => setSession({...session, feedback: e.target.value})}
              ></textarea>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {t.cancel}
          </button>
          <button 
            onClick={onSave}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md flex items-center gap-2"
          >
            <Save size={18} /> {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportEditModal = ({ 
  type, 
  initialData, 
  onClose, 
  onSave,
  lang
}: { 
  type: string, 
  initialData: any, 
  onClose: () => void, 
  onSave: (data: any) => void,
  lang: Language
}) => {
  const [tempData, setTempData] = useState(initialData);
  const t = translations[lang];

  useEffect(() => {
    setTempData(initialData);
  }, [initialData]);

  const renderInputs = () => {
    if (type === 'info') {
      return (
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.basicInfo}</label>
              <input 
                className="w-full p-2 border rounded" 
                value={tempData.name} 
                onChange={e => setTempData({...tempData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.gender}</label>
                <select 
                  className="w-full p-2 border rounded" 
                  value={tempData.gender} 
                  onChange={e => setTempData({...tempData, gender: e.target.value})}
                >
                  <option value="男">{t.genderOptions.male}</option>
                  <option value="女">{t.genderOptions.female}</option>
                  <option value="其他">{t.genderOptions.other}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.age}</label>
                <input 
                  className="w-full p-2 border rounded" 
                  value={tempData.age} 
                  onChange={e => setTempData({...tempData, age: e.target.value})}
                />
              </div>
            </div>
        </div>
      );
    } else {
      return (
        <textarea 
          className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-teal-500 text-sm leading-relaxed"
          value={tempData}
          onChange={e => setTempData(e.target.value)}
        />
      );
    }
  };

  const titleMap: Record<string, string> = {
    'info': t.editInfo,
    'complaint': t.editComplaint,
    'summary': t.editSummary,
    'plan': t.editPlan
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div className="bg-teal-700 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <PenLine size={18} /> {titleMap[type]}
          </h3>
          <button onClick={onClose}><X size={24}/></button>
        </div>
        <div className="p-6 bg-slate-50">
          {renderInputs()}
        </div>
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600">{t.cancel}</button>
          <button 
            onClick={() => onSave(tempData)} 
            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

const App = () => {
  // --- 状态管理 ---
  const [view, setView] = useState<ViewState>('intake');
  const [lang, setLang] = useState<Language>('zh');
  const [archives, setArchives] = useState<Archive[]>([]);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    age: '',
    gender: '未说明',
    contact: '',
    initialProblem: ''
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  
  // 当前输入状态
  const [currentInput, setCurrentInput] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState('');
  const [currentPlan, setCurrentPlan] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState(''); 
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false); 
  
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [comprehensivePlan, setComprehensivePlan] = useState(''); 
  
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('CBT'); 
  
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editingReportSection, setEditingReportSection] = useState<{type: string, data: any} | null>(null); 

  const sessionsEndRef = useRef<HTMLDivElement>(null);
  
  const t = translations[lang]; // Shortcut for translations

  // --- Effects ---
  useEffect(() => {
    // Load archives from local storage on mount
    const savedArchives = localStorage.getItem('mindscribe_archives');
    if (savedArchives) {
      try {
        setArchives(JSON.parse(savedArchives));
      } catch (e) {
        console.error("Failed to parse archives", e);
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, isAnalyzing]);

  // --- 辅助函数 ---
  const scrollToBottom = () => {
    if (!editingSession && !editingReportSection && view === 'session') {
      sessionsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSession = (sessionId: number) => {
    const element = document.getElementById(`session-${sessionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-yellow-50');
      setTimeout(() => element.classList.remove('bg-yellow-50'), 1500);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const handleSaveEditedSession = () => {
    if (!editingSession) return;
    setSessions(sessions.map(s => s.id === editingSession.id ? editingSession : s));
    setEditingSession(null);
  };

  const handleSaveReportSection = (type: string, data: any) => {
    if (type === 'info') {
      setClientInfo({ ...clientInfo, ...data });
    } else if (type === 'complaint') {
      setClientInfo({ ...clientInfo, initialProblem: data });
    } else if (type === 'summary') {
      setExecutiveSummary(data);
    } else if (type === 'plan') {
      setComprehensivePlan(data); 
    }
    setEditingReportSection(null);
  };

  const handleSavePDF = () => {
    window.print();
  };

  // --- Archive Management ---

  const handleSaveArchive = () => {
    if (!clientInfo.name) {
      alert(t.pleaseEnterName);
      return;
    }

    const archiveId = currentCaseId || Date.now().toString();
    const newArchive: Archive = {
      id: archiveId,
      lastModified: new Date().toLocaleString(),
      clientInfo,
      sessions,
      executiveSummary,
      comprehensivePlan,
      analysisMode,
      language: lang
    };

    // Update existing or add new
    const existingIndex = archives.findIndex(a => a.id === archiveId);
    let updatedArchives = [...archives];
    
    if (existingIndex >= 0) {
      updatedArchives[existingIndex] = newArchive;
    } else {
      updatedArchives = [newArchive, ...archives];
    }

    setArchives(updatedArchives);
    setCurrentCaseId(archiveId);
    localStorage.setItem('mindscribe_archives', JSON.stringify(updatedArchives));
    
    // Provide simple feedback
    const btn = document.getElementById('save-btn');
    if(btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = t.saved;
      setTimeout(() => btn.innerHTML = originalText, 2000);
    }
  };

  const handleLoadArchive = (archive: Archive) => {
    if (window.confirm(t.confirmLoad)) {
      setClientInfo(archive.clientInfo);
      setSessions(archive.sessions);
      setExecutiveSummary(archive.executiveSummary);
      setComprehensivePlan(archive.comprehensivePlan);
      setAnalysisMode(archive.analysisMode);
      setCurrentCaseId(archive.id);
      
      // Optional: switch app language to match archive if desired, or keep user preference.
      // setLang(archive.language || 'zh'); 

      setView('session');
    }
  };

  const handleDeleteArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.confirmDelete)) {
      const updatedArchives = archives.filter(a => a.id !== id);
      setArchives(updatedArchives);
      localStorage.setItem('mindscribe_archives', JSON.stringify(updatedArchives));
      if (currentCaseId === id) setCurrentCaseId(null);
    }
  };

  const handleNewCase = () => {
    if (sessions.length > 0 && window.confirm(t.confirmNew)) {
       resetState();
    } else if (sessions.length === 0) {
       resetState();
    }
  };

  const resetState = () => {
    setClientInfo({ name: '', age: '', gender: '未说明', contact: '', initialProblem: '' });
    setSessions([]);
    setExecutiveSummary('');
    setComprehensivePlan('');
    setCurrentCaseId(null);
    setView('intake');
  };

  // --- Gemini Integration ---
  const handleGenerateAnalysis = async (text: string, mode: AnalysisMode) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const result: GeminiResponse = await generateSessionAnalysis(text, mode, lang);
      setCurrentAnalysis(result.analysis);
      setCurrentPlan(result.plan);
    } catch (error) {
      setCurrentAnalysis(lang === 'zh' ? "分析生成失败，请重试。" : "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (sessions.length === 0) return;
    setIsSummarizing(true);
    const summary = await generateExecutiveSummary(sessions, clientInfo, lang);
    setExecutiveSummary(summary);
    setIsSummarizing(false);
  };

  const handleGeneratePlan = async () => {
    if (sessions.length === 0) return;
    setIsGeneratingPlan(true);
    const plan = await generateComprehensivePlan(sessions, clientInfo, lang);
    setComprehensivePlan(plan);
    setIsGeneratingPlan(false);
  };

  const handleAddSession = () => {
    if (!currentInput.trim()) return;
    
    const newSession: Session = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      clientStatement: currentInput,
      analysis: currentAnalysis, 
      plan: currentPlan,
      feedback: currentFeedback, 
      mode: analysisMode
    };

    setSessions([...sessions, newSession]);
    setCurrentInput('');
    setCurrentAnalysis('');
    setCurrentPlan('');
    setCurrentFeedback(''); 
  };

  // --- 界面组件 ---

  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-40 flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb- safe-area-inset-bottom">
      <button 
        onClick={() => setView(sessions.length > 0 ? 'session' : 'intake')}
        className={`flex flex-col items-center justify-center w-full h-full ${view === 'session' || view === 'intake' ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] mt-1 font-medium">{t.navSession}</span>
      </button>
      
      <button 
        onClick={() => setView('report')}
        className={`flex flex-col items-center justify-center w-full h-full ${view === 'report' ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <FileText size={20} />
        <span className="text-[10px] mt-1 font-medium">{t.navReport}</span>
      </button>

      <button 
        onClick={() => setView('archives')}
        className={`flex flex-col items-center justify-center w-full h-full ${view === 'archives' ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <FolderOpen size={20} />
        <span className="text-[10px] mt-1 font-medium">{t.navArchives}</span>
      </button>
    </div>
  );

  const LanguageSwitcher = ({ className }: {className?: string}) => (
    <button 
      onClick={toggleLanguage}
      className={`flex items-center gap-1 text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-slate-600 backdrop-blur-sm border border-slate-200 transition ${className}`}
    >
      <Globe size={12} /> {t.toggleLanguage}
    </button>
  );

  const renderIntakeView = () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6 print:hidden overflow-y-auto pb-24">
      <div className="absolute top-4 right-4">
         <button onClick={toggleLanguage} className="text-slate-400 hover:text-teal-600 flex items-center gap-1 text-sm bg-white p-2 rounded shadow-sm">
           <Globe size={16} /> {t.toggleLanguage}
         </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-slate-200">
        <div className="flex items-center justify-center mb-6 text-teal-600">
          <BrainCircuit size={48} />
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">{t.newFile}</h1>
        <p className="text-center text-slate-500 mb-8">{t.appTitle} <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full ml-1">{t.aiPowered}</span></p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.clientAlias}</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder={t.placeholderName}
              value={clientInfo.name}
              onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.age}</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={clientInfo.age}
                onChange={(e) => setClientInfo({...clientInfo, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.gender}</label>
              <select 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={clientInfo.gender}
                onChange={(e) => setClientInfo({...clientInfo, gender: e.target.value})}
              >
                <option value="未说明">{t.genderOptions.unspecified}</option>
                <option value="男">{t.genderOptions.male}</option>
                <option value="女">{t.genderOptions.female}</option>
                <option value="其他">{t.genderOptions.other}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.intakeProblem}</label>
            <textarea 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-24"
              placeholder={t.placeholderProblem}
              value={clientInfo.initialProblem}
              onChange={(e) => setClientInfo({...clientInfo, initialProblem: e.target.value})}
            ></textarea>
          </div>
          
          <button 
            onClick={() => {
              if (clientInfo.name) setView('session');
            }}
            disabled={!clientInfo.name}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
             {t.startSession} <CheckCircle2 size={18} />
          </button>
          
          <div className="pt-4 flex justify-center md:hidden">
            <button 
              onClick={() => setView('archives')} 
              className="text-slate-500 text-sm flex items-center gap-1 hover:text-teal-600"
            >
              <History size={14} /> {t.viewArchives}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchivesView = () => (
    <div className="h-full bg-slate-50 flex flex-col pb-20 md:pb-0">
      <div className="bg-white px-6 py-4 shadow-sm border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FolderOpen className="text-teal-600" /> {t.historyArchives}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={toggleLanguage} className="text-slate-500 mr-2 hover:bg-slate-100 p-2 rounded-full"><Globe size={18}/></button>
          <button 
             onClick={handleNewCase}
             className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} /> {t.newArchive}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {archives.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <History size={48} className="mb-4 opacity-50"/>
            <p>{t.noArchives}</p>
            <p className="text-sm">{t.archiveHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archives.map(archive => (
              <div 
                key={archive.id} 
                className={`bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer group ${currentCaseId === archive.id ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200'}`}
                onClick={() => handleLoadArchive(archive)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                       {archive.clientInfo.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{archive.clientInfo.name}</h3>
                      <p className="text-xs text-slate-500">{archive.clientInfo.gender} | {archive.clientInfo.age}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteArchive(archive.id, e)}
                    className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span className="font-bold">{t.intakeProblem}:</span> {archive.clientInfo.initialProblem.slice(0, 40)}...
                  </p>
                  <div className="flex gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><History size={12}/> {archive.lastModified.split(' ')[0]}</span>
                    <span className="flex items-center gap-1"><MessageSquarePlus size={12}/> {archive.sessions.length}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-end">
                   <span className="text-xs font-bold text-teal-600 group-hover:underline">{t.loadArchive} &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSessionView = () => (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative print:hidden pb-16 md:pb-0">
      
      {/* 左侧面板 - Desktop */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl">
              {clientInfo.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-slate-800">{clientInfo.name}</h2>
              <p className="text-xs text-slate-500">{clientInfo.gender} | {clientInfo.age}</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
            <strong>{t.intakeProblem}:</strong> {clientInfo.initialProblem || "..."}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.sessionTimeline}</h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">{t.noRecords}</p>
          ) : (
            sessions.map((session, idx) => (
              <div 
                key={session.id} 
                onClick={() => scrollToSession(session.id)}
                className="text-sm border-l-2 border-teal-200 pl-3 py-2 hover:bg-teal-50 transition cursor-pointer group rounded-r-md"
              >
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                   <span>{session.timestamp.split(' ')[1]}</span>
                   <span className="opacity-0 group-hover:opacity-100 text-teal-600">Jump</span>
                </div>
                <p className="text-slate-700 line-clamp-1 font-medium">{session.clientStatement}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 space-y-2">
           <button 
             onClick={handleSaveArchive}
             className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition text-sm"
           >
             <Save size={16} /> {t.saveProgress}
           </button>
           
           <button 
             onClick={() => setView('archives')}
             className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 py-2 text-sm"
           >
             <FolderOpen size={16} /> {t.archiveList}
           </button>

           <button 
             onClick={toggleLanguage}
             className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-teal-600 py-2 text-sm transition"
           >
             <Globe size={16} /> {t.toggleLanguage}
           </button>
        </div>
      </div>

      {/* 主工作区 */}
      <div className="flex-1 flex flex-col h-full w-full min-w-0">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2 text-sm md:text-base">
            <HeartHandshake className="text-teal-600" size={20} />
            <span className="hidden md:inline">{t.realtimeAnalysis}</span>
            <span className="md:hidden">{clientInfo.name}</span>
            <span className="text-xs bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={10} /> AI
            </span>
          </h2>
          <div className="flex gap-2 text-sm items-center">
             <span className="hidden sm:inline text-slate-500 text-xs mr-2">{t.currentView}:</span>
             <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100 font-medium text-xs md:text-sm">
                {t.modes[analysisMode]}
             </span>
             
             {/* Header language switcher - visible on desktop if sidebar is hidden (e.g. tablet), but for simplicity we keep it or rely on sidebar */}
             <div className="md:hidden">
                <LanguageSwitcher className="bg-slate-200 text-slate-600 hover:bg-slate-300 border-transparent"/>
             </div>

             {/* Mobile Save Button */}
             <button 
                id="save-btn"
                onClick={handleSaveArchive}
                className="md:hidden bg-slate-100 text-slate-700 p-2 rounded-full hover:bg-slate-200 ml-2"
             >
               <Save size={18} />
             </button>
          </div>
        </div>

        {/* 聊天流区域 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 scroll-smooth">
          {sessions.map((session, idx) => (
            <div id={`session-${session.id}`} key={session.id} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors p-2 rounded-xl">
              {/* 来访者气泡 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-2xl">
                  <p className="text-slate-800 whitespace-pre-wrap">{session.clientStatement}</p>
                </div>
              </div>

              {/* 分析师/系统气泡 */}
              <div className="flex gap-4 flex-row-reverse group">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex-shrink-0 flex items-center justify-center text-white cursor-pointer hover:bg-teal-700 transition" onClick={() => setEditingSession(session)} title="点击头像也可编辑">
                  <Bot size={20} />
                </div>
                <div 
                  className="bg-teal-50 p-4 rounded-2xl rounded-tr-none shadow-sm border border-teal-100 max-w-2xl w-full relative cursor-pointer hover:border-teal-300 transition-colors"
                  onDoubleClick={() => setEditingSession(session)}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setEditingSession(session);
                    }}
                    className="absolute top-2 right-2 text-teal-400 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 p-1 rounded transition md:opacity-0 group-hover:opacity-100"
                  >
                    <Maximize2 size={16} />
                  </button>

                  <div className="mb-2 pb-2 border-b border-teal-200/50 flex justify-between items-center pr-8">
                    <span className="text-xs font-bold text-teal-800 uppercase flex items-center gap-1"><Sparkles size={12}/> {t.analysisResult} ({t.modes[session.mode]})</span>
                  </div>
                  <pre className="text-sm text-teal-900 whitespace-pre-wrap font-sans mb-4 leading-relaxed max-h-96 overflow-y-hidden relative">
                    {session.analysis}
                  </pre>
                  
                  <div className="bg-white/60 p-3 rounded-lg border border-teal-100 mb-2">
                    <span className="text-xs font-bold text-slate-600 block mb-1">{t.interventionResult}:</span>
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{session.plan}</pre>
                  </div>

                  {session.feedback && (
                    <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-100 mt-2">
                       <span className="text-xs font-bold text-amber-700 block mb-1 flex items-center gap-1">
                         <MessageSquarePlus size={12}/> {t.feedbackResult}:
                       </span>
                       <p className="text-sm text-amber-900 whitespace-pre-wrap">{session.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                 <div className="h-px bg-slate-200 w-full max-w-xs my-2"></div>
              </div>
            </div>
          ))}
          
          {/* 输入区域 (Stateful) */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-20 shrink-0">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-700">{t.navSession}</h3>
               <div className="flex gap-2">
                 {['CBT', 'Psychoanalysis', 'Humanistic'].map((m) => (
                   <button 
                    key={m}
                    onClick={() => setAnalysisMode(m as AnalysisMode)}
                    className={`text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full border transition-all duration-200 ${analysisMode === m ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-teal-400'}`}
                   >
                     {t.modes[m as AnalysisMode]}
                   </button>
                 ))}
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左：来访者输入 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600 flex gap-2 items-center">
                  <User size={14}/> {t.clientInputLabel}
                </label>
                <textarea 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-32 text-sm"
                  placeholder={t.clientInputPlaceholder}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                ></textarea>
                <button 
                  onClick={() => handleGenerateAnalysis(currentInput, analysisMode)}
                  disabled={!currentInput || isAnalyzing}
                  className="self-start text-xs bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                   {isAnalyzing ? <RefreshCw className="animate-spin" size={14}/> : <Sparkles size={14}/>} 
                   {isAnalyzing ? t.analyzing : ` ✨ ${t.analyzeButton}`}
                </button>
              </div>

              {/* 右：分析与方案 */}
              <div className="flex flex-col gap-2 h-full">
                <label className="text-sm font-medium text-slate-600 flex gap-2 items-center">
                  <ClipboardList size={14}/> {t.analysisLabel}
                </label>
                <div className="flex flex-col gap-2 flex-1">
                  <textarea 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 h-20 text-sm bg-slate-50"
                    placeholder={t.analysisPlaceholder}
                    value={currentAnalysis}
                    onChange={(e) => setCurrentAnalysis(e.target.value)}
                  ></textarea>
                  <textarea 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 h-16 text-sm bg-slate-50"
                    placeholder={t.planPlaceholder}
                    value={currentPlan}
                    onChange={(e) => setCurrentPlan(e.target.value)}
                  ></textarea>
                  
                  {/* 3. 咨询后反馈框 */}
                  <div className="relative flex-1">
                    <div className="absolute top-2 right-2 text-slate-400 pointer-events-none">
                      <MessageSquarePlus size={14} />
                    </div>
                    <textarea 
                      className="w-full p-2 border border-amber-200 rounded-lg focus:ring-1 focus:ring-amber-500 h-16 text-sm bg-amber-50 placeholder-amber-400/70"
                      placeholder={t.feedbackPlaceholder}
                      value={currentFeedback}
                      onChange={(e) => setCurrentFeedback(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleAddSession}
                disabled={!currentInput || !currentAnalysis}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
              >
                <Plus size={18} /> {t.addToArchive}
              </button>
            </div>
          </div>
          <div ref={sessionsEndRef} />
        </div>
      </div>
    </div>
  );

  const renderReportView = () => (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center relative print:p-0 print:bg-white print:h-auto print:block pb-24">
      
      <div className="report-container bg-white w-full max-w-4xl shadow-2xl rounded-none md:rounded-lg overflow-hidden flex flex-col">
        {/* 报告头部 */}
        <div className="bg-teal-700 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">{t.reportTitle}</h1>
              <p className="opacity-80 text-sm">{t.confidential}</p>
            </div>
            <div className="text-right">
              <LanguageSwitcher/>
              <p className="font-mono text-sm opacity-70 mt-2">Case ID: {currentCaseId ? currentCaseId.slice(-6) : Date.now().toString().slice(-6)}</p>
              <p className="font-mono text-sm opacity-70">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* 报告主体 */}
        <div className="p-6 md:p-10 space-y-8 flex-1 overflow-y-auto font-serif text-slate-800 print:overflow-visible print:h-auto">
          
          <section 
            className="border-b border-slate-200 pb-6 group cursor-pointer hover:bg-slate-50 transition rounded px-2"
            onDoubleClick={() => setEditingReportSection({type: 'info', data: clientInfo})}
          >
            <h2 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-600 block"></span> I. {t.basicInfo}
              <span className="text-xs text-slate-300 font-normal opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2 print:hidden"><PenLine size={12}/> {t.editRecord}</span>
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p><span className="font-bold text-slate-500 w-24 inline-block">{t.client}:</span> {clientInfo.name}</p>
              <p><span className="font-bold text-slate-500 w-24 inline-block">{t.gender}:</span> {clientInfo.gender}</p>
              <p><span className="font-bold text-slate-500 w-24 inline-block">{t.age}:</span> {clientInfo.age}</p>
              <p><span className="font-bold text-slate-500 w-24 inline-block">{t.visitCount}:</span> {sessions.length}</p>
            </div>
          </section>

          <section 
            className="border-b border-slate-200 pb-6 group cursor-pointer hover:bg-slate-50 transition rounded px-2"
            onDoubleClick={() => setEditingReportSection({type: 'complaint', data: clientInfo.initialProblem})}
          >
            <h2 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-600 block"></span> II. {t.complaintEval}
              <span className="text-xs text-slate-300 font-normal opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2 print:hidden"><PenLine size={12}/> {t.editRecord}</span>
            </h2>
            <p className="leading-relaxed text-slate-700 bg-slate-50 p-4 rounded border border-slate-100">
              {clientInfo.initialProblem}
            </p>
          </section>

          <section 
            className="border-b border-slate-200 pb-6 group cursor-pointer hover:bg-slate-50 transition rounded px-2"
            onDoubleClick={() => setEditingReportSection({type: 'summary', data: executiveSummary})}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-teal-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-teal-600 block"></span> III. {t.aiSummary}
                <span className="text-xs text-slate-300 font-normal opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2 print:hidden"><PenLine size={12}/> {t.editRecord}</span>
              </h2>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateSummary();
                }}
                disabled={isSummarizing || sessions.length === 0}
                className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full hover:bg-teal-200 transition flex items-center gap-1 disabled:opacity-50 print:hidden"
              >
                {isSummarizing ? <RefreshCw className="animate-spin" size={12}/> : <Sparkles size={12}/>} 
                {executiveSummary ? t.regenerate : `✨ ${t.generateSummary}`}
              </button>
            </div>
            {executiveSummary ? (
              <div className="bg-emerald-50 p-4 rounded border border-emerald-100 text-sm leading-relaxed whitespace-pre-wrap animate-in fade-in">
                <h4 className="text-emerald-800 font-bold mb-2 flex items-center gap-1"><Bot size={14}/> Gemini:</h4>
                {executiveSummary}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">{t.noSummary}</p>
            )}
          </section>

          <section className="border-b border-slate-200 pb-6">
            <h2 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-600 block"></span> IV. {t.sessionDetails}
            </h2>
            <div className="space-y-6">
              {sessions.map((s, i) => (
                <div 
                  key={i} 
                  className="pl-4 border-l-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition p-2 rounded group break-inside-avoid"
                  onDoubleClick={() => setEditingSession(s)}
                  title="Double click to edit"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">Session {i+1}</span>
                    <span className="text-xs text-slate-400">{s.timestamp}</span>
                    <span className="text-xs border border-slate-200 text-slate-400 px-1 rounded">{t.modes[s.mode]}</span>
                    <span className="text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition print:hidden"><PenLine size={10}/></span>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 font-bold">{t.client}:</p>
                    <p className="text-sm italic text-slate-600 mb-2">"{s.clientStatement}"</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-slate-500 font-bold">{t.analysisResult}:</p>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{s.analysis}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section 
            className="group cursor-pointer hover:bg-slate-50 transition rounded px-2 pb-6"
            onDoubleClick={() => comprehensivePlan && setEditingReportSection({type: 'plan', data: comprehensivePlan})}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-teal-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-teal-600 block"></span> V. {t.comprehensivePlan}
                <span className="text-xs text-slate-300 font-normal opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2 print:hidden"><PenLine size={12}/> {t.editRecord}</span>
              </h2>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleGeneratePlan();
                }}
                disabled={isGeneratingPlan || sessions.length === 0}
                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition flex items-center gap-1 disabled:opacity-50 print:hidden"
              >
                {isGeneratingPlan ? <RefreshCw className="animate-spin" size={12}/> : <Stethoscope size={12}/>} 
                {comprehensivePlan ? t.regenerate : `✨ ${t.generatePlan}`}
              </button>
            </div>
            
            {comprehensivePlan ? (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-serif">
                   {comprehensivePlan}
                </p>
              </div>
            ) : (
               <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                 <p className="text-xs text-slate-400 mb-2 italic print:hidden">{t.noSummary}</p>
               </div>
            )}
          </section>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between print:hidden">
           <div className="md:hidden"></div> {/* Spacer for mobile */}
          <button 
            onClick={() => setView('session')}
            className="px-6 py-2 rounded-lg border border-slate-300 hover:bg-white transition text-slate-600 hidden md:block"
          >
            {t.back}
          </button>
          
          <button 
             onClick={handleSaveArchive}
             className="px-6 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 mr-2"
          >
            <Save size={18} /> <span className="hidden md:inline">{t.save}</span>
          </button>

          <button 
            onClick={handleSavePDF}
            className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition flex items-center gap-2 shadow-lg shadow-teal-200"
          >
            <Download size={18} /> <span className="hidden md:inline">{t.exportPDF}</span>
          </button>
        </div>
      </div>

      {/* Extracted Components Rendered Here */}
      <EditModal 
        session={editingSession} 
        setSession={setEditingSession} 
        onClose={() => setEditingSession(null)} 
        onSave={handleSaveEditedSession} 
        lang={lang}
      />
      
      {editingReportSection && (
        <ReportEditModal 
          type={editingReportSection.type} 
          initialData={editingReportSection.data} 
          onClose={() => setEditingReportSection(null)} 
          onSave={(data) => handleSaveReportSection(editingReportSection.type, data)} 
          key={editingReportSection.type}
          lang={lang} 
        />
      )}
    </div>
  );

  return (
    <div className="font-sans text-slate-900 h-screen w-full relative">
      {view === 'intake' && renderIntakeView()}
      {view === 'session' && renderSessionView()}
      {view === 'report' && renderReportView()}
      {view === 'archives' && renderArchivesView()}
      <MobileBottomNav />
    </div>
  );
};

export default App;