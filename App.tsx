
import React, { useState, useEffect } from 'react';
import { ViewState, QuestionBank, QuestionItem } from './types';
import ScriptGuide from './components/ScriptGuide';
import Importer from './components/Importer';
import BankDashboard from './components/BankDashboard';
import QuizPlayer from './components/QuizPlayer';
import { Layout, Import, BookMarked, Sparkles, Languages, AlertTriangle } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { DEFAULT_BANKS } from './constants';

// 版本号，每次更新题库时递增
const DATA_VERSION = '1.0.1';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [activeBankId, setActiveBankId] = useState<string | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[] | undefined>(undefined);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const savedVersion = localStorage.getItem('cx_quiz_version');
    const saved = localStorage.getItem('cx_quiz_banks');
    
    // 如果版本不匹配或没有保存的数据，使用默认题库
    if (savedVersion !== DATA_VERSION || !saved) {
      setBanks(DEFAULT_BANKS);
      localStorage.setItem('cx_quiz_version', DATA_VERSION);
      return;
    }
    
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setBanks(parsed);
      } else {
        setBanks(DEFAULT_BANKS);
      }
    } catch (e) {
      console.error("Failed to load banks", e);
      setBanks(DEFAULT_BANKS);
    }
  }, []);

  useEffect(() => {
    if (banks.length > 0) {
      localStorage.setItem('cx_quiz_banks', JSON.stringify(banks));
    }
  }, [banks]);

  const handleImport = (newBank: QuestionBank) => {
    setBanks(prev => [newBank, ...prev]);
    setView('DASHBOARD'); 
  };

  const handleRequestDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setBanks(prev => prev.filter(b => b.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const handleStartQuiz = (id: string, selectedQuestions?: QuestionItem[]) => {
    setActiveBankId(id);
    const bank = banks.find(b => b.id === id);
    
    if (bank && selectedQuestions && selectedQuestions.length > 0) {
        setFilteredQuestions(selectedQuestions);
    } else {
        setFilteredQuestions(undefined); // Use all questions
    }

    setView('QUIZ');
  };

  const activeBank = banks.find(b => b.id === activeBankId);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'cn' : 'en');
  };

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return <ScriptGuide />;
      case 'IMPORT':
        return <Importer onImport={handleImport} />;
      case 'DASHBOARD':
        return (
          <BankDashboard 
            banks={banks} 
            onDelete={handleRequestDelete} 
            onStart={handleStartQuiz} 
          />
        );
      case 'QUIZ':
        return activeBank ? (
          <QuizPlayer 
            key={`${activeBank.id}-${filteredQuestions ? 'filtered' : 'all'}-${Date.now()}`} 
            bank={activeBank} 
            initialQuestions={filteredQuestions}
            onExit={() => setView('DASHBOARD')} 
          />
        ) : (
          <div>Bank not found</div>
        );
      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] font-sans text-slate-800 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      
      {/* --- Animated Background Blobs --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Blob - Green/Teal */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        {/* Top Right Blob - Purple */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        {/* Bottom Left Blob - Pink */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
        {/* Center/Random Blob - Blue */}
        <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-3000"></div>
      </div>

      {/* Scrollable Container */}
      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden pb-safe scroll-smooth">
        {/* Glass Navigation */}
        {view !== 'QUIZ' && (
          <nav className="sticky top-4 z-50 mx-4 sm:mx-8 mt-4 rounded-2xl glass-panel shadow-sm transition-all mb-4">
            <div className="px-4 sm:px-6">
              <div className="flex justify-between items-center h-16">
                
                {/* Logo Area */}
                <div 
                  className="flex items-center cursor-pointer group select-none" 
                  onClick={() => setView('HOME')}
                >
                  <div className="relative">
                    <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl text-white mr-3 shadow-lg shadow-brand-200/50 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="font-black text-xl tracking-tight text-slate-800/90 group-hover:text-brand-600 transition-colors">
                    Good Review
                  </span>
                </div>
                
                {/* Nav Items */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setView('HOME')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${view === 'HOME' ? 'bg-white/60 text-brand-700 shadow-sm ring-1 ring-white/60' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'}`}
                  >
                    <Layout size={18} strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t('app.nav.guide')}</span>
                  </button>
                  <button 
                    onClick={() => setView('IMPORT')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${view === 'IMPORT' ? 'bg-white/60 text-brand-700 shadow-sm ring-1 ring-white/60' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'}`}
                  >
                    <Import size={18} strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t('app.nav.import')}</span>
                  </button>
                  <button 
                    onClick={() => setView('DASHBOARD')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${view === 'DASHBOARD' ? 'bg-white/60 text-brand-700 shadow-sm ring-1 ring-white/60' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'}`}
                  >
                    <BookMarked size={18} strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t('app.nav.banks')}</span>
                    {banks.length > 0 && (
                      <span className="flex h-2 w-2 sm:h-auto sm:w-auto ml-0.5">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500 sm:bg-brand-500 sm:text-white sm:px-1.5 sm:py-0.5 sm:text-[10px] sm:h-auto sm:w-auto justify-center items-center">{banks.length > 0 ? <span className="hidden sm:inline">{banks.length}</span> : ''}</span>
                      </span>
                    )}
                  </button>

                  <div className="w-px h-5 bg-slate-300/50 mx-1" />

                  <button
                    onClick={toggleLanguage}
                    className="p-2 rounded-xl hover:bg-white/40 text-slate-500 hover:text-brand-600 transition-all"
                  >
                    <Languages size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in pb-24 sm:pb-10">
          {renderContent()}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in" onClick={() => setDeleteTargetId(null)}>
          <div 
            className="glass-panel rounded-3xl p-8 max-w-sm w-full transform transition-all scale-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4 text-red-600">
               <div className="w-12 h-12 rounded-full bg-red-100/50 flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <AlertTriangle size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">{t('dashboard.deleteConfirmTitle')}</h3>
            </div>
            
            <p className="text-slate-600 mb-8 font-medium">
              {t('dashboard.deleteConfirm')}
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteTargetId(null)}
                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100/50 font-bold transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 backdrop-blur-sm transition-all"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
