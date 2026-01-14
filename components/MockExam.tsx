
import React, { useState, useEffect, useMemo } from 'react';
import { courseData, AssessmentQuestion } from '../data/courseContent';
import { Timer, ClipboardCheck, ArrowLeft, RefreshCw, Trophy, ShieldAlert, CheckCircle, XCircle, Info, Lightbulb, Bot, X, EyeOff, Eye, Scissors, Bookmark, History } from 'lucide-react';
import UniversalHost from './UniversalHost';
import { GoogleGenAI } from "@google/genai";

interface ExamReport {
  id: string;
  timestamp: number;
  score: number;
  correct: number;
  total: number;
  timeSpent: number;
  missedTopics: string[];
}

interface MockExamProps {
  onReturn: () => void;
  onPlayCorrect: () => void;
  onPlayIncorrect: () => void;
  onSaveReport?: (report: ExamReport) => void;
  theme?: 'dark' | 'light';
}

const MockExam: React.FC<MockExamProps> = ({ onReturn, onPlayCorrect, onPlayIncorrect, onSaveReport, theme = 'dark' }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState<{ q: AssessmentQuestion, topicId: string, topicTitle: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [eliminated, setEliminated] = useState<Record<number, Set<number>>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [boardMode, setBoardMode] = useState(false);
  const [timerHidden, setTimerHidden] = useState(false);
  const isLight = theme === 'light';

  const startExam = () => {
    const allQ = courseData.flatMap(m => m.topics.flatMap(t => t.assessment.map(q => ({ q, topicId: t.id, topicTitle: t.title }))));
    const shuffled = [...allQ].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(shuffled);
    setExamStarted(true);
    setIsFinished(false);
    setAnswers({});
    setEliminated({});
    setFlagged(new Set());
    setCurrentIndex(0);
    setTimeLeft(1800);
  };

  const saveReport = (report: ExamReport) => {
    const existing = localStorage.getItem('em-exam-reports');
    const reports: ExamReport[] = existing ? JSON.parse(existing) : [];
    reports.unshift(report);
    localStorage.setItem('em-exam-reports', JSON.stringify(reports.slice(0, 10)));
  };

  const getHarveyHint = async () => {
    const currentQ = questions[currentIndex];
    if (isGeneratingHint) return;
    setIsGeneratingHint(true);
    setShowHint(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are Harvey. Briefly explain the physics behind this question: "${currentQ.q.question}". 
            Don't give the answer away directly, but provide a helpful analogy related to ultrasound physics. Max 40 words. No markdown.`,
        });
        setHintText(response.text || "Focus on the relationship between frequency and depth, scholar.");
    } catch (e) {
        setHintText("The answer lies in the acoustic impedance mismatch at this boundary.");
    } finally {
        setIsGeneratingHint(false);
    }
  };

  const toggleEliminate = (qIdx: number, oIdx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setEliminated(prev => {
        const next = { ...prev };
        if (!next[qIdx]) next[qIdx] = new Set();
        const currentSet = new Set(next[qIdx]);
        if (currentSet.has(oIdx)) currentSet.delete(oIdx);
        else currentSet.add(oIdx);
        next[qIdx] = currentSet;
        return next;
    });
  };

  const toggleFlag = () => {
    setFlagged(prev => {
        const next = new Set(prev);
        if (next.has(currentIndex)) next.delete(currentIndex);
        else next.add(currentIndex);
        return next;
    });
  };

  useEffect(() => {
    if (examStarted && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      finishExam();
    }
  }, [examStarted, timeLeft, isFinished]);

  const finishExam = () => {
    setIsFinished(true);
    let correct = 0;
    const missedTopics: string[] = [];
    questions.forEach((qObj, i) => {
      if (answers[i] === qObj.q.correctAnswer) correct++;
      else missedTopics.push(qObj.topicTitle);
    });

    const report: ExamReport = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      score: Math.round((correct / questions.length) * 100),
      correct,
      total: questions.length,
      timeSpent: 1800 - timeLeft,
      missedTopics: Array.from(new Set(missedTopics))
    };
    saveReport(report);
    if (onSaveReport) {
      onSaveReport(report);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  const results = useMemo(() => {
    if (!isFinished) return null;
    let correct = 0;
    const missedTopics: string[] = [];
    questions.forEach((qObj, i) => {
      if (answers[i] === qObj.q.correctAnswer) correct++;
      else missedTopics.push(qObj.topicTitle);
    });
    return { score: Math.round((correct / questions.length) * 100), correct, total: questions.length, missedTopics: Array.from(new Set(missedTopics)) };
  }, [isFinished, answers, questions]);

  if (!examStarted) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-10 animate-fade-in text-center overflow-y-auto ${isLight ? 'bg-light-primary/40' : 'bg-dark-primary/20 backdrop-blur-3xl'}`}>
        <div className="max-w-3xl space-y-12">
          <div className="flex justify-center"><UniversalHost status="idle" theme={theme} className="drop-shadow-gold" /></div>
          <div className="space-y-6">
            <h1 className={`text-5xl md:text-8xl font-display font-black uppercase luxury-text leading-tight tracking-tighter ${isLight ? '!filter-none' : ''}`}>Mock Diagnostic</h1>
            <p className={`text-xl md:text-3xl font-light italic font-serif leading-relaxed px-4 opacity-80 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>"Precision is tested in the crucible of time. Are you ready for calibration?"</p>
          </div>
          <div className={`flex items-center justify-center gap-8 py-6 border-y ${isLight ? 'border-black/5' : 'border-white/5'}`}>
             <button onClick={() => setBoardMode(!boardMode)} className={`flex items-center gap-3 px-6 py-2 rounded-full border transition-all ${boardMode ? 'bg-gold-main/20 border-gold-main text-gold-main shadow-gold' : isLight ? 'border-black/10 text-slate-400' : 'border-white/10 text-text-muted'}`}>
                <Scissors className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Board Simulation {boardMode ? 'ON' : 'OFF'}</span>
             </button>
             <button onClick={() => setTimerHidden(!timerHidden)} className={`flex items-center gap-3 px-6 py-2 rounded-full border transition-all ${timerHidden ? isLight ? 'bg-black/5 border-black/40 text-slate-900' : 'bg-white/10 border-white/40 text-white' : isLight ? 'border-black/10 text-slate-400' : 'border-white/10 text-text-muted'}`}>
                {timerHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{timerHidden ? 'Timer Hidden' : 'Timer Visible'}</span>
             </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={onReturn} className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all py-3 ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-text-muted hover:text-white'}`}><ArrowLeft className="w-5 h-5" /> Hub Return</button>
            <button onClick={startExam} className="btn-gold px-16 py-6 rounded-2xl font-black uppercase tracking-[0.6em] text-sm shadow-gold-bright flex items-center justify-center gap-5 group">Initiate Audit <CheckCircle className="w-6 h-6" /></button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished && results) {
    return (
      <div className={`flex-1 overflow-y-auto p-10 md:p-24 animate-fade-in text-left ${isLight ? 'bg-light-primary/40' : 'bg-dark-primary/10'}`}>
        <div className="max-w-5xl mx-auto space-y-16 pb-48">
          <div className="text-center space-y-8">
            <div className={`mx-auto w-32 h-32 md:w-48 md:h-48 rounded-[3rem] border-4 flex items-center justify-center font-display font-black text-4xl md:text-7xl shadow-gold tactical-border ${results.score >= 85 ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-red-500 text-red-400 bg-red-500/10'}`}>
              {results.score}%
            </div>
            <h1 className={`text-4xl md:text-8xl font-display font-black uppercase luxury-text leading-tight tracking-tighter ${isLight ? '!filter-none' : ''}`}>Diagnostic Report</h1>
            <p className={`text-xl md:text-3xl font-light italic font-serif max-w-3xl mx-auto opacity-80 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
              {results.score >= 85 ? "Excellent resonance. You are board-ready, scholar." : "Interference detected. Further calibration in missed vectors is advised."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className={`glass-panel p-10 md:p-14 rounded-[3rem] space-y-8 tactical-border ${isLight ? 'bg-white border-black/5 shadow-xl' : 'bg-dark-secondary/60 border-white/10'}`}>
              <div className="flex items-center gap-4 text-gold-main"><CheckCircle className="w-6 h-6" /><h3 className={`text-xl font-display font-black uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>Metrics</h3></div>
              <div className="space-y-6">
                <div className="flex justify-between items-center"><span className="text-text-muted uppercase tracking-widest text-xs">Total Resolved</span><span className={`font-mono text-2xl ${isLight ? 'text-slate-900' : 'text-white'}`}>{results.correct} / {results.total}</span></div>
                <div className="flex justify-between items-center"><span className="text-text-muted uppercase tracking-widest text-xs">Time Efficiency</span><span className={`font-mono text-2xl ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatTime(1800 - timeLeft)}</span></div>
              </div>
            </div>
            <div className={`glass-panel p-10 md:p-14 rounded-[3rem] space-y-8 tactical-border text-left ${isLight ? 'bg-white border-black/5 shadow-xl' : 'bg-dark-secondary/60 border-white/10'}`}>
              <div className="flex items-center gap-4 text-red-400"><ShieldAlert className="w-6 h-6" /><h3 className={`text-xl font-display font-black uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>Weak Vectors</h3></div>
              <div className="flex flex-wrap gap-4 text-left">
                {results.missedTopics.length > 0 ? results.missedTopics.map((t, i) => (
                  <span key={i} className="px-4 py-2 bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg">{t}</span>
                )) : <span className="text-green-400 text-sm font-bold">Zero anomalies detected.</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
            <button onClick={onReturn} className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all py-3 ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-text-muted hover:text-white'}`}><ArrowLeft className="w-5 h-5" /> Hub Return</button>
            <button onClick={startExam} className="btn-gold px-16 py-6 rounded-2xl font-black uppercase tracking-[0.6em] text-sm shadow-gold-bright flex items-center justify-center gap-5">Recalibrate Audit <RefreshCw className="w-6 h-6" /></button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden relative text-left ${isLight ? 'bg-light-primary/40' : 'bg-dark-primary/10'}`}>
      <div className={`h-16 border-b flex items-center justify-between px-6 md:px-10 shrink-0 ${isLight ? 'bg-white/80 border-black/5' : 'bg-black/40 border-white/5'}`}>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 text-gold-main">
            <Timer className={`w-4 h-4 ${timeLeft < 300 ? 'animate-pulse text-red-500' : ''}`} />
            {!timerHidden ? (
                <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-500' : isLight ? 'text-slate-900' : 'text-white'}`}>{formatTime(timeLeft)}</span>
            ) : (
                <span className="font-mono text-lg opacity-20">--:--</span>
            )}
          </div>
          <div className={`h-4 w-[1px] hidden sm:block ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
          <div className="text-[10px] font-black uppercase tracking-widest text-text-muted hidden xs:block">Diagnostic: {currentIndex + 1} / {questions.length}</div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
            <button onClick={toggleFlag} className={`flex items-center gap-2 transition-all ${flagged.has(currentIndex) ? 'text-gold-main' : isLight ? 'text-slate-400 hover:text-slate-900' : 'text-text-muted hover:text-white'}`}>
                <Bookmark className={`w-4 h-4 ${flagged.has(currentIndex) ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">Flag</span>
            </button>
            <button onClick={getHarveyHint} className="flex items-center gap-2 text-gold-main hover:text-white transition-all group">
                <Lightbulb className="w-4 h-4 group-hover:animate-pulse" />
                <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">Guide</span>
            </button>
            <button onClick={() => { if (confirm("Terminate active diagnostic? All progress will be purged.")) setExamStarted(false); }} className="text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Abort</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-16 lg:p-24 scroll-smooth custom-scrollbar text-left">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {questions.map((_, i) => (
                <div 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${i === currentIndex ? 'bg-gold-main scale-125 shadow-gold' : answers[i] !== undefined ? 'bg-green-500/40' : flagged.has(i) ? 'bg-gold-main/40' : isLight ? 'bg-black/5' : 'bg-white/5'}`} 
                />
            ))}
          </div>

          {showHint && (
            <div className={`glass-panel p-8 rounded-[2rem] animate-slide-up flex gap-6 items-start relative overflow-hidden text-left ${isLight ? 'bg-white border-gold-main/40 shadow-xl' : 'bg-gold-main/5 border-gold-main/40'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-[0.05]"><Bot className={`w-16 h-16 ${isLight ? 'text-slate-900' : 'text-gold-main'}`} /></div>
                <div className="p-3 bg-gold-main/20 rounded-xl text-gold-main shrink-0"><Info className="w-5 h-5" /></div>
                <div className="space-y-2 relative z-10">
                    <h4 className="text-[10px] font-black text-gold-main uppercase tracking-widest">Harvey Calibration</h4>
                    <p className={`text-sm md:text-base font-serif italic leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                        {isGeneratingHint ? "Consulting neural atlas..." : hintText}
                    </p>
                </div>
                <button onClick={() => setShowHint(false)} className={`p-1 transition-colors ${isLight ? 'text-slate-300 hover:text-slate-900' : 'text-white/20 hover:text-white'}`}><X className="w-4 h-4" /></button>
            </div>
          )}

          <div className={`glass-panel p-8 md:p-20 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden tactical-border text-left ${isLight ? 'bg-white border-black/5 shadow-2xl' : 'bg-dark-secondary/60 border-white/10'}`}>
            <div className="space-y-10 md:space-y-12 text-left">
               <div className="flex items-center gap-4 text-left"><span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-main/60 bg-gold-main/10 px-4 py-1.5 rounded-full border border-gold-main/20">{currentQ.topicTitle}</span></div>
               <h3 className={`text-2xl md:text-5xl font-display font-black leading-tight uppercase tracking-tight text-left ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentQ.q.question}</h3>
               <div className="grid grid-cols-1 gap-4 md:gap-6 text-left">
                {currentQ.q.options.map((opt, i) => {
                  const isEliminated = eliminated[currentIndex]?.has(i);
                  return (
                    <div key={i} className="relative group/opt">
                      <button 
                        onContextMenu={(e) => toggleEliminate(currentIndex, i, e)}
                        onClick={() => !isEliminated && setAnswers(prev => ({...prev, [currentIndex]: i}))} 
                        className={`w-full text-left p-5 md:p-10 rounded-[2rem] border-2 transition-all duration-300 text-base md:text-2xl font-medium leading-tight relative overflow-hidden ${isEliminated ? 'opacity-20 grayscale cursor-not-allowed border-transparent' : answers[currentIndex] === i ? 'bg-gold-main/15 border-gold-main shadow-gold' : isLight ? 'bg-black/5 border-black/5 text-slate-500 hover:bg-black/10 hover:border-gold-main/20' : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10 hover:border-gold-main/20'}`}
                      >
                        <span className={`flex items-center gap-4 md:gap-6 ${isEliminated ? 'line-through' : isLight && answers[currentIndex] === i ? 'text-slate-900' : ''}`}>
                          <span className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full border-2 flex items-center justify-center text-xs md:sm font-black ${answers[currentIndex] === i ? 'bg-gold-main border-gold-main text-dark-primary' : isLight ? 'border-black/10' : 'border-white/10'}`}>
                            {String.fromCharCode(65 + i)}
                          </span> 
                          {opt}
                        </span>
                      </button>
                      <button 
                        onClick={(e) => toggleEliminate(currentIndex, i, e)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all md:opacity-0 group-hover/opt:opacity-100 ${isEliminated ? 'bg-red-500 text-white opacity-100' : isLight ? 'bg-black/5 text-slate-400 hover:text-red-600' : 'bg-white/5 text-text-muted hover:text-red-400'}`}
                        title="Eliminate Choice"
                      >
                        <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  );
                })}
               </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-6">
            <button disabled={currentIndex === 0} onClick={() => { setCurrentIndex(c => c - 1); setShowHint(false); }} className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all ${currentIndex === 0 ? 'opacity-0' : isLight ? 'bg-black/5 text-slate-400 hover:bg-black/10 hover:text-slate-900' : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'}`}>Back</button>
            <div className="flex gap-4 w-full sm:w-auto">
              {currentIndex < questions.length - 1 ? (
                <button disabled={answers[currentIndex] === undefined} onClick={() => { setCurrentIndex(c => c + 1); setShowHint(false); }} className={`w-full sm:w-auto btn-gold px-16 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-gold-bright transition-all ${answers[currentIndex] === undefined ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}>Proceed</button>
              ) : (
                <button disabled={Object.keys(answers).length < questions.length} onClick={() => finishExam()} className={`w-full sm:w-auto btn-gold px-16 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-gold-bright transition-all ${Object.keys(answers).length < questions.length ? 'opacity-50 cursor-not-allowed' : ''}`}>Finalize Audit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExam;
