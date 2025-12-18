
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { QuestionBank, QuestionItem } from '../types';
import { Trash2, PlayCircle, BookOpen, Layers, Filter, CheckSquare, Square, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BankDashboardProps {
  banks: QuestionBank[];
  onDelete: (id: string) => void;
  onStart: (id: string, filteredQuestions?: QuestionItem[]) => void;
}

interface FilterGroup {
  id: string;
  label: string;
  count: number;
  questions: QuestionItem[];
}

const BankDashboard: React.FC<BankDashboardProps> = ({ banks, onDelete, onStart }) => {
  const { t } = useLanguage();
  
  // State for config modal
  const [configBank, setConfigBank] = useState<QuestionBank | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  // Helper to generate groups (types + chunks)
  const getFilterGroups = useMemo(() => {
    if (!configBank) return [];
    
    const groups: FilterGroup[] = [];
    const typeMap = new Map<string, QuestionItem[]>();

    // Group by type first
    configBank.questions.forEach(q => {
      const list = typeMap.get(q.type) || [];
      list.push(q);
      typeMap.set(q.type, list);
    });

    // Process types
    typeMap.forEach((questions, type) => {
      // Chunking logic for '单选' if > 50
      if (type === '单选' && questions.length > 50) {
        const chunkSize = 50;
        for (let i = 0; i < questions.length; i += chunkSize) {
          const chunk = questions.slice(i, i + chunkSize);
          const chunkIndex = Math.floor(i / chunkSize) + 1;
          groups.push({
            id: `${type}_part_${chunkIndex}`,
            label: `${type} ${chunkIndex}`, // e.g., 单选 1, 单选 2
            count: chunk.length,
            questions: chunk
          });
        }
      } else {
        // Standard grouping
        groups.push({
          id: type,
          label: type,
          count: questions.length,
          questions: questions
        });
      }
    });

    // Stable sort: by type label, then numeric chunk index if present
    return groups.sort((a, b) => {
      const [alType, blType] = [a.label.split(' ')[0], b.label.split(' ')[0]];
      if (alType !== blType) return alType.localeCompare(blType);
      const aNum = parseInt(a.id.match(/_part_(\d+)/)?.[1] || '0', 10);
      const bNum = parseInt(b.id.match(/_part_(\d+)/)?.[1] || '0', 10);
      return aNum - bNum;
    });
  }, [configBank]);

  const handleStartClick = (bank: QuestionBank) => {
    setConfigBank(bank);
    // Determine if we need to show the modal
    // We show modal if there are multiple groups (either multiple types OR chunked single type)
    // Temporarily set bank to calculate groups
    const typeMap = new Map<string, number>();
    bank.questions.forEach(q => typeMap.set(q.type, (typeMap.get(q.type) || 0) + 1));
    
    const hasLargeSingleChoice = (typeMap.get('单选') || 0) > 50;
    const hasMultipleTypes = typeMap.size > 1;

    if (hasMultipleTypes || hasLargeSingleChoice) {
      // Pre-calculate groups to select all by default
      // We can't use the memoized value here easily without render, so we set state and let effect or render handle it.
      // But we can just default select all in the toggle logic if empty? 
      // Better: Reset selected ids when opening
      // We need to calculate IDs here to select all by default
      const tempGroups: string[] = [];
      
      // Re-implement logic briefly for default selection
      typeMap.forEach((count, type) => {
         if (type === '单选' && count > 50) {
             const chunks = Math.ceil(count / 50);
             for(let i=1; i<=chunks; i++) tempGroups.push(`${type}_part_${i}`);
         } else {
             tempGroups.push(type);
         }
      });
      
      setSelectedGroupIds(tempGroups);
    } else {
      // Simple bank, just start
      onStart(bank.id);
      setConfigBank(null); // Ensure modal doesn't flash
    }
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const toggleAll = () => {
    if (selectedGroupIds.length === getFilterGroups.length) {
      setSelectedGroupIds([]);
    } else {
      setSelectedGroupIds(getFilterGroups.map(g => g.id));
    }
  };

  const confirmStartFiltered = () => {
    if (configBank) {
      // Gather selected question IDs from groups
      const selectedIds = new Set<number>();
      getFilterGroups
        .filter(g => selectedGroupIds.includes(g.id))
        .forEach(g => g.questions.forEach(q => selectedIds.add(q.id)));

      // Preserve original order from bank.questions
      const selectedQuestions = configBank.questions.filter(q => selectedIds.has(q.id));
      
      onStart(configBank.id, selectedQuestions);
      setConfigBank(null);
    }
  };

  const selectedCount = getFilterGroups
    .filter(g => selectedGroupIds.includes(g.id))
    .reduce((acc, g) => acc + g.count, 0);

  if (banks.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in glass-panel rounded-[3rem]">
        <div className="bg-white/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/50 backdrop-blur-sm">
          <Layers size={48} className="text-brand-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3">{t('dashboard.emptyTitle')}</h2>
        <p className="text-slate-600 max-w-md mx-auto text-lg font-medium">
          {t('dashboard.emptyDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-4xl font-black text-slate-800/90 drop-shadow-sm flex items-center gap-3">
        {t('dashboard.title')}
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banks.map((bank) => (
          <div 
            key={bank.id} 
            className="glass-card rounded-3xl p-6 flex flex-col h-full group hover:bg-white/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Glossy shine effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="flex-1 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/50 text-brand-600 flex items-center justify-center shadow-sm backdrop-blur-sm">
                    <BookOpen size={22} />
                </div>
                <div className="px-3 py-1 bg-white/40 text-slate-500 text-xs rounded-lg font-mono font-bold border border-white/40">
                    {new Date(bank.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 line-clamp-2 mb-3 leading-snug group-hover:text-brand-700 transition-colors" title={bank.name}>
                {bank.name}
              </h3>
              
              <div className="flex items-center text-slate-600 text-sm font-medium mb-6">
                <div className="flex items-center space-x-1.5 bg-white/30 px-3 py-1.5 rounded-lg border border-white/40">
                   <Layers size={14} />
                   <span>{bank.questions.length} {t('dashboard.questions')}</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-auto border-t border-white/40 flex items-center gap-3 relative z-10">
              <button
                onClick={() => handleStartClick(bank)}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95"
              >
                <PlayCircle size={20} />
                <span>{t('dashboard.btnPractice')}</span>
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(bank.id);
                }}
                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all border border-transparent hover:border-red-200/50 active:scale-95"
                title={t('dashboard.btnDelete')}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Modal - Portaled to document.body with fixed positioning */}
      {configBank && createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in p-4" onClick={() => setConfigBank(null)}>
           <div 
             className="glass-panel bg-white/90 rounded-[2rem] shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all scale-100 relative overflow-hidden flex flex-col max-h-[90vh]"
             onClick={e => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-4 relative z-10 shrink-0">
                 <div className="flex items-center gap-3 text-brand-700">
                     <div className="w-12 h-12 rounded-full bg-brand-100/50 flex items-center justify-center shrink-0 backdrop-blur-sm">
                         <Filter size={24} />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-800 leading-tight">{t('dashboard.setupTitle')}</h3>
                 </div>
                 <button onClick={() => setConfigBank(null)} className="p-2 rounded-full hover:bg-slate-100/50 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <p className="text-slate-600 mb-4 font-medium leading-relaxed relative z-10 shrink-0">
                 {t('dashboard.setupDesc')}
              </p>

              {/* Type Selection */}
              <div className="flex justify-between items-center px-1 mb-2 shrink-0 relative z-10">
                 <button onClick={toggleAll} className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wide flex items-center gap-1">
                    {selectedGroupIds.length === getFilterGroups.length ? <CheckSquare size={16}/> : <Square size={16}/>}
                    {t('dashboard.selectAll')}
                 </button>
                 <span className="text-xs font-bold text-slate-400">
                     {t('dashboard.selectedCount')}: {selectedCount}
                 </span>
              </div>

              <div className="space-y-3 mb-6 overflow-y-auto pr-2 relative z-10 custom-scrollbar flex-1">
                 {getFilterGroups.map((group) => (
                     <div 
                       key={group.id}
                       onClick={() => toggleGroup(group.id)}
                       className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                           selectedGroupIds.includes(group.id) 
                             ? 'bg-brand-50/50 border-brand-200/50 shadow-sm' 
                             : 'bg-white/40 border-transparent hover:bg-white/60'
                       }`}
                     >
                        <div className="flex items-center gap-3">
                            <div className={`transition-colors ${selectedGroupIds.includes(group.id) ? 'text-brand-500' : 'text-slate-300'}`}>
                                {selectedGroupIds.includes(group.id) ? <CheckSquare size={22} /> : <Square size={22} />}
                            </div>
                            <span className={`font-bold text-lg ${selectedGroupIds.includes(group.id) ? 'text-slate-800' : 'text-slate-500'}`}>{group.label}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-lg bg-white/60 text-xs font-bold text-slate-500 border border-white/50 shadow-sm">
                           {group.count}
                        </span>
                     </div>
                 ))}
              </div>
              
              <div className="shrink-0 relative z-10 pt-2">
                <button 
                    onClick={confirmStartFiltered}
                    disabled={selectedGroupIds.length === 0}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-brand-500/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                    <PlayCircle size={22} />
                    <span>{t('dashboard.startFiltered')}</span>
                </button>
              </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BankDashboard;
