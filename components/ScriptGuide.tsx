import React, { useState } from 'react';
import { FULL_USERSCRIPT } from '../constants';
import { Clipboard, CheckCircle2, Terminal, ArrowDownCircle, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ScriptGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = () => {
    navigator.clipboard.writeText(FULL_USERSCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-button text-brand-700 text-xs font-extrabold uppercase tracking-wide mb-2 animate-float">
          <span>✨ New Way to Review</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-800/90 drop-shadow-sm leading-tight">
          {t('guide.title')} <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{t('guide.titleHighlight')}</span>
        </h1>
        <p className="text-lg text-slate-600/90 max-w-xl mx-auto leading-relaxed px-4 font-medium">
          {t('guide.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        {/* Step 1 */}
        <div className="relative group">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8 h-full flex flex-col hover:bg-white/30 transition-all duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center text-brand-600 shadow-sm shrink-0 backdrop-blur-md">
                 <Terminal size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('guide.step1.title')}</h2>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed font-medium">
              {t('guide.step1.desc')}
            </p>

            <div className="mt-auto space-y-4">
                <div className="bg-slate-900/90 backdrop-blur rounded-2xl p-4 relative group/code overflow-hidden border border-slate-700/50 shadow-inner h-32">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                         <div className="bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 rounded">JS</div>
                    </div>
                    <code className="text-brand-300 font-mono text-xs block opacity-80">
                        // ==UserScript==<br/>
                        // @name Chaoxing...<br/>
                        // @name         Chaoxing Work Scraper<br/>
                        // @namespace    cx-work-scraper<br/>
                        // @version      1.4.0<br/>
                        ...
                    </code>
                </div>
                <button
                onClick={handleCopy}
                className="w-full py-4 rounded-xl bg-brand-600/90 hover:bg-brand-600 text-white font-bold transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 flex items-center justify-center gap-2 active:scale-[0.98] backdrop-blur-sm"
                >
                {copied ? <CheckCircle2 size={18} /> : <Clipboard size={18} />}
                <span>{copied ? t('guide.step1.copied') : t('guide.step1.copy')}</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <ArrowDownCircle size={14} />
                    <span>{t('guide.step1.tip')}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative group">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8 h-full flex flex-col hover:bg-white/30 transition-all duration-300">
             <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center text-indigo-500 shadow-sm shrink-0 backdrop-blur-md">
                 <Database size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('guide.step2.title')}</h2>
            </div>

            <div className="space-y-5 flex-1">
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm shrink-0 backdrop-blur-sm">1</div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-base mb-1">{t('guide.step2.goto')}</h3>
                        <p className="text-slate-600 text-sm font-medium">{t('guide.step2.gotoDesc')}</p>
                    </div>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm shrink-0 backdrop-blur-sm">2</div>
                     <div>
                        <h3 className="font-bold text-slate-800 text-base mb-1">{t('guide.step2.panel')}</h3>
                        <p className="text-slate-600 text-sm font-medium">{t('guide.step2.panelDesc')}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                     <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm shrink-0 backdrop-blur-sm">3</div>
                     <div>
                        <h3 className="font-bold text-slate-800 text-base mb-1">{t('guide.step2.import')}</h3>
                        <p className="text-slate-600 text-sm font-medium">{t('guide.step2.importDesc')}</p>
                    </div>
                </div>
            </div>

             <div className="mt-8 p-4 bg-amber-100/30 rounded-2xl border border-amber-200/40 flex items-start gap-3 text-amber-800 text-sm font-medium backdrop-blur-sm">
                 <div className="mt-0.5">💡</div>
                 <p>{t('guide.step2.tipBox')}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptGuide;