import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QuestionBank, QuestionItem } from '../types';
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, LayoutDashboard, Trophy, CheckSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface QuizPlayerProps {
  bank: QuestionBank;
  initialQuestions?: QuestionItem[];
  onExit: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ bank, initialQuestions, onExit }) => {
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions || bank.questions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const { t } = useLanguage();

  const total = questions.length;
  const question = questions[currentIdx];

  const checkAnswer = useCallback((q: QuestionItem, userAns: string[]) => {
    const normalize = (s: string) => s.trim().toLowerCase()
        .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
        .replace(/。/g, '.')
        .replace(/，/g, ',')
        .replace(/：/g, ':')
        .replace(/？/g, '?')
        .replace(/！/g, '!')
        .replace(/（/g, '(')
        .replace(/）/g, ')')
        .replace(/\s+/g, ' ');

    const correct = q.correctAnswer || [];
    if (correct.length === 0) return null;

    const isText = q.type.includes("填空") || q.type.includes("简答");

    if (isText) {
      return userAns.length > 0 && correct.some(c => normalize(c) === normalize(userAns[0]));
    }

    if (userAns.length !== correct.length) return false;
    const s1 = [...userAns].sort();
    const s2 = [...correct].sort();
    return s1.every((val, index) => normalize(val) === normalize(s2[index]));
  }, []);

  const isJudgment = useMemo(() => {
    if (!question) return false;
    if (question.type.includes("判断")) return true;
    if (question.title.includes("判断")) return true;
    if (question.options.length === 2) {
       const hasKeywords = question.options.some(o => 
         /^(true|false|对|错)/i.test(o.text)
       );
       if (hasKeywords) return true;
    }
    return false;
  }, [question]);

  const isMultiSelect = question?.type.includes("多选");
  const isText = question?.type.includes("填空") || question?.type.includes("简答");

  const isCurrentCorrect = useMemo(() => {
    if (!question) return false;
    return checkAnswer(question, userAnswers[currentIdx] || []);
  }, [userAnswers, currentIdx, question, checkAnswer]);

  const handleSelect = (val: string) => {
    if (revealed[currentIdx]) return;

    setUserAnswers(prev => {
      const current = prev[currentIdx] || [];
      if (isMultiSelect) {
        if (current.includes(val)) {
          return { ...prev, [currentIdx]: current.filter(v => v !== val) };
        } else {
          return { ...prev, [currentIdx]: [...current, val] };
        }
      } else {
        return { ...prev, [currentIdx]: [val] };
      }
    });

    if (!isMultiSelect) {
      setRevealed(prev => ({ ...prev, [currentIdx]: true }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (revealed[currentIdx]) return;
      const val = e.target.value;
      setUserAnswers(prev => ({ ...prev, [currentIdx]: [val] }));
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (userAnswers[currentIdx]?.[0]?.trim()) {
            setRevealed(prev => ({ ...prev, [currentIdx]: true }));
          }
      }
  };

  const nextQuestion = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(c => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(c => c - 1);
    }
  };

  const toggleReveal = () => {
    setRevealed(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleRetryMistakes = () => {
    const wrongQuestions = questions.filter((q, idx) => {
      const userAns = userAnswers[idx] || [];
      return checkAnswer(q, userAns) === false;
    });

    if (wrongQuestions.length > 0) {
      setQuestions(wrongQuestions);
      setCurrentIdx(0);
      setUserAnswers({});
      setRevealed({});
      setIsFinished(false);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      if (!isFinished) {
        if (e.key === 'ArrowRight') nextQuestion();
        if (e.key === 'ArrowLeft') prevQuestion();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIdx, isFinished, nextQuestion, prevQuestion]);

  const results = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    questions.forEach((q, idx) => {
       const res = checkAnswer(q, userAnswers[idx] || []);
       if (res === true) correct++;
       else wrong++;
    });
    return { correct, wrong };
  }, [isFinished, questions, userAnswers, checkAnswer]);

  const renderTitle = (title: string) => {
    const isHtml = /<[a-z][\s\S]*>/i.test(title) || title.includes('&lt;') || title.includes('&nbsp;');
    if (isHtml) {
      return (
        <div
          className="text-xl md:text-3xl font-bold text-slate-800 leading-relaxed drop-shadow-sm select-text"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      );
    }
    const looksLikeJs = /function\s+\w+\s*\(|[{;}]/.test(title);
    const looksLikePy = /\b(if|else|elif|while|for|def|class|print)\b/.test(title) || /:\s*\b(if|else|elif)\b/.test(title);
    if (looksLikeJs || looksLikePy) {
      let formatted = title;
      if (looksLikeJs) {
        formatted = formatted
          .replace(/\)\s*\{/g, ') {\n')
          .replace(/\{\s*/g, '{\n')
          .replace(/;\s*/g, ';\n')
          .replace(/\}\s*/g, '\n}');
      }
      if (looksLikePy) {
        formatted = formatted
          .replace(/\s+def\s+/g, '\ndef ')
          .replace(/\s+class\s+/g, '\nclass ')
          .replace(/\s+if\s+/g, '\nif ')
          .replace(/\s+elif\s+/g, '\nelif ')
          .replace(/\s+else\s*:/g, '\nelse:')
          .replace(/\s+while\s+/g, '\nwhile ')
          .replace(/\s+for\s+/g, '\nfor ')
          .replace(/:\s*print\(/g, ':\nprint(')
          .replace(/\)\s+if\s+/g, ')\nif ')
          .replace(/\)\s+while\s+/g, ')\nwhile ')
          .replace(/\{\s*/g, '{\n')
          .replace(/,\s*"/g, ',\n"')
          .replace(/\}\s*print/g, '\n}\nprint');
      }
      const applyIndent = (code: string, lang: 'js' | 'py') => {
        const lines = code.split('\n').map(l => l.trim());
        let indent = 0;
        const out: string[] = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (lang === 'js') {
            if (/^\}/.test(line)) indent = Math.max(0, indent - 1);
            out.push(`${'  '.repeat(indent)}${line}`);
            if (/\{$/.test(line)) indent++;
          } else {
            const startsBlock = /^(def|class|if|elif|else:|for|while)\b/.test(line);
            const isCallOrPrint = /^[a-zA-Z_]\w*\s*\(/.test(line) || /^print\(/.test(line);
            if (isCallOrPrint) indent = 0;
            out.push(`${'  '.repeat(indent)}${line}`);
            if (line.endsWith(':')) indent = 1;
            if (startsBlock && !line.endsWith(':')) indent = 0;
          }
        }
        return out.join('\n');
      };
      formatted = applyIndent(formatted, looksLikeJs ? 'js' : 'py');
      return (
        <div className="rounded-2xl border border-slate-300/50 bg-slate-900/5 p-4 shadow-sm">
          <pre className="text-base md:text-lg font-mono whitespace-pre-wrap text-slate-800 leading-relaxed drop-shadow-sm select-text">
            {formatted}
          </pre>
        </div>
      );
    }
    return (
      <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-relaxed drop-shadow-sm select-text">
        {title}
      </h2>
    );
  };

  // --- Render Results Screen ---
  if (isFinished) {
    const isPerfect = results.wrong === 0;

    return (
      <div className="max-w-2xl mx-auto min-h-[calc(100vh-140px)] flex flex-col items-center justify-center animate-fade-in p-4">
        {isPerfect && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
             {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute animate-confetti text-4xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                >
                  {['🎉', '⭐', '✨', '🏆', '💯'][Math.floor(Math.random() * 5)]}
                </div>
             ))}
          </div>
        )}

        <div className="relative z-10 w-full glass-panel rounded-[3rem] p-8 sm:p-12 text-center">
           
           <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white/50 backdrop-blur-md ${isPerfect ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white' : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'}`}>
              {isPerfect ? <Trophy size={48} className="animate-bounce" /> : <LayoutDashboard size={40} />}
           </div>

           <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
             {isPerfect ? t('quiz.results.perfectTitle') : t('quiz.results.title')}
           </h2>
           <p className="text-slate-600 font-medium mb-10 text-lg">
             {isPerfect ? t('quiz.results.msgPerfect') : t('quiz.results.msgKeepGoing')}
           </p>

           <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 rounded-3xl bg-emerald-100/40 border border-emerald-200/50 flex flex-col items-center justify-center group hover:scale-105 transition-transform backdrop-blur-sm">
                 <div className="text-5xl font-black text-emerald-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-sm">{results.correct}</div>
                 <div className="text-sm font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                   <CheckCircle size={16} /> {t('quiz.results.statsCorrect')}
                 </div>
              </div>
              <div className="p-6 rounded-3xl bg-red-100/40 border border-red-200/50 flex flex-col items-center justify-center group hover:scale-105 transition-transform backdrop-blur-sm">
                 <div className="text-5xl font-black text-red-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-sm">{results.wrong}</div>
                 <div className="text-sm font-bold text-red-700 uppercase tracking-wide flex items-center gap-1">
                   <XCircle size={16} /> {t('quiz.results.statsWrong')}
                 </div>
              </div>
           </div>

           <div className="space-y-4">
             {!isPerfect && (
               <button 
                 onClick={handleRetryMistakes}
                 className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
               >
                 <RotateCcw size={22} strokeWidth={2.5} />
                 <span>{t('quiz.results.btnRetry')}</span>
               </button>
             )}
             
             <button 
               onClick={onExit}
               className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${isPerfect ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg' : 'bg-white/40 hover:bg-white/60 text-slate-700 border border-white/50'}`}
             >
               <ArrowLeft size={22} strokeWidth={2.5} />
               <span>{t('quiz.results.btnDashboard')}</span>
             </button>
           </div>
        </div>
      </div>
    );
  }

  // --- Render Quiz Question ---
  return (
    <div className="max-w-4xl mx-auto min-h-[calc(100vh-140px)] flex flex-col animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onExit}
          className="group text-slate-600 hover:text-brand-700 flex items-center space-x-1 font-bold transition-colors px-4 py-2 rounded-xl hover:bg-white/30 glass-button border-0"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('quiz.exit')}</span>
        </button>
        <div className="text-sm font-bold text-brand-700 bg-white/40 px-5 py-2 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
          {currentIdx + 1} <span className="text-slate-400 mx-1">/</span> {total}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/30 h-3 rounded-full mb-8 overflow-hidden backdrop-blur-sm border border-white/20">
        <div 
          className="bg-gradient-to-r from-brand-400 to-brand-500 h-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(52,211,153,0.6)]"
          style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10 flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
        
        <div className="mb-8 relative z-10">
          <span className="inline-block bg-white/50 text-brand-700 text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider mb-4 border border-white/50 shadow-sm backdrop-blur-md">
            {isJudgment ? "判断" : question.type}
          </span>
          {renderTitle(question.title)}
          {question.images && question.images.length > 0 && (
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-brand-200">
              {question.images.map((img, i) => (
                 <img key={i} src={img} alt={`Question attachment`} className="max-h-64 rounded-2xl border-4 border-white/50 shadow-lg hover:scale-105 transition-transform" />
              ))}
            </div>
          )}
        </div>

        {/* Options Area */}
        <div className="space-y-4 mb-8 relative z-10">
          {isText ? (
             <div className="space-y-4">
                <textarea 
                    className={`w-full p-6 glass-input rounded-3xl outline-none focus:ring-0 transition-all min-h-[160px] text-lg font-medium placeholder:text-slate-400 ${
                        revealed[currentIdx] 
                         ? isCurrentCorrect 
                             ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900' 
                             : 'border-red-300 bg-red-50/50 text-red-900'
                         : 'focus:bg-white/60 text-slate-800'
                    }`}
                    placeholder={t('quiz.typePlaceholder')}
                    value={userAnswers[currentIdx]?.[0] || ''}
                    onChange={handleTextChange}
                    onKeyDown={handleTextKeyDown}
                    disabled={revealed[currentIdx]}
                />
                
                {!revealed[currentIdx] && (
                  <button 
                    onClick={() => setRevealed(prev => ({ ...prev, [currentIdx]: true }))}
                    disabled={!userAnswers[currentIdx]?.[0]?.trim()}
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300/50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 ml-auto"
                  >
                    <CheckSquare size={20} />
                    <span>{t('quiz.check')}</span>
                  </button>
                )}
             </div>
          ) : (
            question.options.map((opt, i) => {
              const isSelected = (userAnswers[currentIdx] || []).includes(opt.text);
              const isActualAnswer = question.correctAnswer.includes(opt.text);
              
              let containerClass = "border-white/40 bg-white/20 hover:bg-white/40 cursor-pointer shadow-sm backdrop-blur-md";
              let markerClass = "border-slate-300/50 bg-white/50";
              let textClass = "text-slate-700";

              if (revealed[currentIdx]) {
                if (isActualAnswer) {
                  containerClass = "border-emerald-400 bg-emerald-100/40 shadow-md ring-1 ring-emerald-400/50";
                  markerClass = "bg-emerald-500 border-emerald-500 text-white";
                  textClass = "text-emerald-900";
                } else if (isSelected && !isActualAnswer) {
                  containerClass = "border-red-400 bg-red-100/40 shadow-md ring-1 ring-red-400/50";
                  markerClass = "bg-red-500 border-red-500 text-white";
                  textClass = "text-red-900";
                } else {
                  containerClass = "border-transparent bg-slate-100/10 opacity-40";
                }
              } else if (isSelected) {
                containerClass = "border-brand-400 bg-brand-50/40 ring-2 ring-brand-400/30 shadow-md";
                markerClass = "bg-brand-500 border-brand-500 text-white scale-110";
                textClass = "text-brand-900";
              }

              return (
                <div 
                  key={i}
                  onClick={() => handleSelect(opt.text)}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 group active:scale-[0.99] select-none ${containerClass}`}
                >
                  <div className={`mt-0.5 w-6 h-6 ${isMultiSelect ? 'rounded-lg' : 'rounded-full'} border-2 flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm ${markerClass}`}>
                    { (revealed[currentIdx] && isActualAnswer) || isSelected ? <div className={`w-2.5 h-2.5 bg-white ${isMultiSelect ? 'rounded-[2px]' : 'rounded-full'}`} /> : null }
                  </div>
                  <div className={`flex-1 font-bold text-lg leading-snug ${textClass}`}>
                     {!isJudgment && <span className="mr-3 opacity-60 font-black">{opt.label}.</span>}
                     {isJudgment ? 
                       (opt.text.replace(/^(true|false)[\.\s]*/i, '') || (opt.text.toLowerCase().includes('true') ? '对' : opt.text.toLowerCase().includes('false') ? '错' : opt.text)) 
                       : opt.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Feedback Area */}
        {revealed[currentIdx] && (
            <div className={`mt-auto mb-6 p-6 rounded-3xl border flex flex-col items-start relative z-10 animate-scale-in backdrop-blur-md ${isCurrentCorrect ? 'bg-emerald-100/40 border-emerald-200/50 text-emerald-900' : 'bg-red-100/40 border-red-200/50 text-red-900'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-full shrink-0 shadow-sm ${isCurrentCorrect ? 'bg-emerald-200 text-emerald-700' : 'bg-red-200 text-red-700'}`}>
                      {isCurrentCorrect ? <CheckCircle size={28}/> : <XCircle size={28}/>}
                    </div>
                    <div className="font-bold text-xl">
                      {isCurrentCorrect ? t('quiz.correct') : t('quiz.incorrect')}
                    </div>
                </div>
                
                {!isCurrentCorrect && (
                  <div className="w-full">
                      <span className="block mb-2 font-bold opacity-70 text-sm uppercase tracking-wider">{t('quiz.correctAnswer')}</span>
                      <div className="w-full bg-white/50 rounded-2xl border border-white/50 p-4 text-lg font-bold shadow-sm overflow-x-auto">
                        {question.correctAnswer.map((ans, idx) => {
                            const isHtml = /<[a-z][\s\S]*>/i.test(ans) || ans.includes('&lt;') || ans.includes('&nbsp;');
                            return (
                                <div key={idx} className={`mb-2 last:mb-0 ${isHtml ? 'prose-sm' : 'whitespace-pre-wrap font-mono'}`}>
                                    {isHtml ? (
                                        <div dangerouslySetInnerHTML={{ __html: ans }} />
                                    ) : (
                                        ans
                                    )}
                                </div>
                            );
                        })}
                      </div>
                  </div>
                )}
            </div>
        )}

        {/* Controls */}
        <div className="mt-auto pt-6 border-t border-white/30 flex items-center justify-between relative z-10">
           <div className="flex gap-4">
             <button 
                onClick={prevQuestion}
                disabled={currentIdx === 0}
                className="p-4 rounded-2xl glass-button hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-all active:scale-95"
                title={t('quiz.prev')}
             >
                <ChevronLeft size={24} strokeWidth={3} />
             </button>
             <button 
                onClick={toggleReveal}
                className="p-4 rounded-2xl glass-button text-brand-600 hover:text-brand-700 hover:bg-white/60 transition-all active:scale-95"
                title={revealed[currentIdx] ? t('quiz.hide') : t('quiz.show')}
             >
                {revealed[currentIdx] ? <EyeOff size={24} strokeWidth={2.5} /> : <Eye size={24} strokeWidth={2.5} />}
             </button>
           </div>
           
           <button 
             onClick={nextQuestion}
             className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
           >
             <span className="text-lg">{currentIdx === total - 1 ? t('quiz.finish') : t('quiz.next')}</span>
             <ChevronRight size={22} strokeWidth={3} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
