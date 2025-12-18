import React, { useState, useEffect, useRef } from 'react';
import { QuestionBank } from '../types';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ImporterProps {
  onImport: (bank: QuestionBank) => void;
}

const Importer: React.FC<ImporterProps> = ({ onImport }) => {
  const [jsonText, setJsonText] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEating, setIsEating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Eye tracking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + 100; // approximate eye level
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      // Limit movement radius
      const maxMove = 10;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy) / 20, maxMove);
      
      setPupilPos({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const processData = (data: any, fileName?: string) => {
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error(t('import.errorJson'));
    }
    
    let finalName = bankName.trim();
    if (!finalName) {
      if (fileName) {
          finalName = fileName.replace(/\.json$/i, '');
      } else if (data.source) {
          try {
             const url = new URL(data.source);
             finalName = `Quiz from ${url.hostname}`;
          } catch(e) {
             finalName = "Imported Quiz Bank";
          }
      } else {
         finalName = `Bank ${new Date().toLocaleDateString()}`;
      }
    }

    // Start eating animation
    setIsEating(true);
    setError(null);

    // After animation, trigger import
    setTimeout(() => {
        setIsEating(false);
        setIsFinished(true);
        setTimeout(() => {
             const newBank: QuestionBank = {
                id: crypto.randomUUID(),
                name: finalName,
                createdAt: Date.now(),
                questions: data.items,
            };
            onImport(newBank);
        }, 800); // Wait for swallow animation
    }, 2000); // Chewing duration
  };

  const handleFeed = () => {
    if (!jsonText.trim()) return;
    setError(null);
    try {
      const data = JSON.parse(jsonText);
      processData(data);
    } catch (err) {
      setError(t('import.errorParse'));
      shakeMonster();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleFile = (file: File) => {
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          // Fill the mouth with text first for visual feedback
          setJsonText(text);
          // Then eat it automatically
          const data = JSON.parse(text);
          processData(data, file.name);
        } catch (err) {
          setError(t('import.errorParse'));
          shakeMonster();
        }
      };
      reader.readAsText(file);
  }

  const shakeMonster = () => {
    const monster = document.getElementById('monster-body');
    if (monster) {
        monster.classList.remove('animate-shake');
        void monster.offsetWidth; // trigger reflow
        monster.classList.add('animate-shake');
    }
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center pt-8">
      
      {/* Header Text */}
      <div className={`text-center transition-all duration-500 ${isEating ? 'opacity-0 translate-y-[-20px]' : 'opacity-100'}`}>
        <h2 className="text-4xl font-black text-slate-800 drop-shadow-sm mb-2">{t('import.title')}</h2>
        <p className="text-slate-600 font-medium">{t('import.subtitle')}</p>
      </div>

      {/* The Monster Container */}
      <div className="relative mt-8 w-full max-w-lg aspect-[4/5] sm:aspect-square flex items-center justify-center">
         
         {/* Success Message (Burp) */}
         {isFinished && (
            <div className="absolute -top-20 z-50 animate-bounce">
                <div className="bg-white px-6 py-3 rounded-2xl shadow-xl border-2 border-brand-200 text-brand-600 font-black text-xl whitespace-nowrap">
                   {t('import.success')}
                </div>
                <div className="w-4 h-4 bg-white border-r-2 border-b-2 border-brand-200 transform rotate-45 mx-auto -mt-2"></div>
            </div>
         )}

         {/* Monster Body */}
         <div 
            id="monster-body"
            className={`
                relative w-full h-full glass-panel rounded-[3rem] sm:rounded-[4rem] 
                flex flex-col items-center p-8 transition-all duration-300
                ${isEating ? 'animate-chew' : 'animate-wobble-slow'}
                ${isFinished ? 'animate-swallow' : ''}
            `}
         >
            {/* Antenna / Name Input */}
            <div className="absolute -top-6 w-full flex justify-center z-20">
                <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2 transform hover:-translate-y-1 transition-transform">
                     <Sparkles size={14} className="text-brand-500"/>
                     <input 
                        type="text" 
                        placeholder={t('import.namePlaceholder')}
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 w-40 text-center"
                     />
                </div>
            </div>

            {/* Eyes */}
            <div className="flex gap-8 mb-6 mt-4 z-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-inner flex items-center justify-center relative overflow-hidden border-4 border-white/20">
                    <div 
                        className="w-8 h-8 bg-slate-800 rounded-full transition-transform duration-75"
                        style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
                    >
                         <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1 opacity-50"></div>
                    </div>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-inner flex items-center justify-center relative overflow-hidden border-4 border-white/20">
                    <div 
                        className="w-8 h-8 bg-slate-800 rounded-full transition-transform duration-75"
                        style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
                    >
                         <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1 opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Mouth (Dropzone/Input) */}
            <div className="w-full flex-1 relative group z-10">
                {/* Teeth Top */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                     {[1,2,3,4,5].map(i => (
                         <div key={i} className="w-8 h-6 bg-white rounded-b-xl shadow-sm"></div>
                     ))}
                </div>

                <div 
                    className={`
                        w-full h-full bg-slate-900/10 rounded-[2rem] border-4 border-transparent
                        transition-all duration-300 relative overflow-hidden shadow-inner
                        ${isDragOver ? 'bg-brand-500/20 scale-105 border-brand-400/50' : 'hover:bg-slate-900/15'}
                        ${jsonText ? 'bg-white/30' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <textarea
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                        placeholder={isDragOver ? t('import.dragDrop') : "Paste JSON here..."}
                        disabled={isEating}
                        className="w-full h-full bg-transparent p-6 pt-8 outline-none resize-none text-slate-700 font-mono text-xs text-center placeholder:text-slate-400/70"
                    />
                    
                    {/* Placeholder hint when empty */}
                    {!jsonText && !isDragOver && (
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400/60">
                             <Upload size={32} className="mb-2 opacity-50" />
                             <span className="text-sm font-bold uppercase tracking-widest opacity-50">{t('import.jsonLabel')}</span>
                        </div>
                    )}
                </div>

                 {/* Teeth Bottom */}
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                     {[1,2,3,4,5].map(i => (
                         <div key={i} className="w-8 h-6 bg-white rounded-t-xl shadow-sm"></div>
                     ))}
                </div>
            </div>

            {/* Hands (Decoration) */}
            <div className="absolute -left-4 top-1/2 w-8 h-12 bg-white/30 rounded-l-xl -rotate-12 backdrop-blur-sm border border-white/40"></div>
            <div className="absolute -right-4 top-1/2 w-8 h-12 bg-white/30 rounded-r-xl rotate-12 backdrop-blur-sm border border-white/40"></div>

            {/* Feed Button */}
            <div className="mt-6 w-full relative z-20">
                <button
                    onClick={handleFeed}
                    disabled={!jsonText || isEating}
                    className={`
                        w-full py-4 rounded-xl font-black text-lg shadow-lg transition-all
                        flex items-center justify-center gap-2
                        ${isEating 
                            ? 'bg-brand-400 cursor-wait scale-95' 
                            : !jsonText 
                                ? 'bg-slate-300/50 text-slate-400 cursor-not-allowed' 
                                : 'bg-brand-600 hover:bg-brand-500 text-white hover:scale-[1.02] hover:-translate-y-1 shadow-brand-500/40'}
                    `}
                >
                    {isEating ? t('import.eating') : t('import.btnText')}
                </button>
            </div>
            
            {/* File Upload Hidden Trigger */}
            <div className="absolute bottom-6 right-8 opacity-0 w-10 h-10 overflow-hidden">
                 <input type="file" accept=".json" onChange={handleFileUpload} />
            </div>

            {/* Error Bubble */}
            {error && (
                <div className="absolute -right-16 top-1/3 bg-red-100 text-red-600 p-3 rounded-xl rounded-bl-none shadow-lg border border-red-200 text-xs font-bold max-w-[120px] animate-fade-in z-50">
                    <AlertCircle size={16} className="inline mr-1 mb-0.5"/>
                    {error}
                </div>
            )}
         </div>

         {/* File Upload Button (External to monster to keep clean, or integrated) 
             Let's put a small button nearby
         */}
         <div className="absolute -bottom-12 flex justify-center w-full">
            <label className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-sm bg-white/30 px-4 py-2 rounded-full border border-white/40 shadow-sm transition-all hover:bg-white/60">
                <Upload size={16} />
                <span>{t('import.btnFile')}</span>
                <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                />
            </label>
         </div>

      </div>
    </div>
  );
};

export default Importer;