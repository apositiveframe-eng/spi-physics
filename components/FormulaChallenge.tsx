
import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, CheckCircle, XCircle, RefreshCw, ArrowRight, Zap, Target, Timer, Trophy } from 'lucide-react';

const FormulaChallenge: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
    const [score, setScore] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isFinished, setIsFinished] = useState(false);

    const challenges = useMemo(() => [
        { q: "Calculate total round-trip time for a target at 3cm depth.", a: "39", unit: "μs", hint: "13 microsecond rule." },
        { q: "If PRF is 10 kHz, what is the Nyquist Limit?", a: "5", unit: "kHz", hint: "Nyquist = PRF / 2." },
        { q: "Spatial Pulse Length is 4mm. Calculate Axial Resolution.", a: "2", unit: "mm", hint: "Resolution = SPL / 2." },
        { q: "Duty Factor if Pulse Duration is 1μs and PRP is 1000μs?", a: "0.1", unit: "%", hint: "DF = (PD / PRP) * 100." },
        { q: "Angle is 90°. What is the Doppler Shift frequency?", a: "0", unit: "Hz", hint: "cos(90°) is critical here." }
    ].sort(() => Math.random() - 0.5), []);

    const current = challenges[currentIndex];

    useEffect(() => {
        if (isFinished) return;
        if (timeLeft === 0) {
            handleCheck();
            return;
        }
        const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft, isFinished]);

    const handleCheck = () => {
        const correct = userAnswer.trim() === current.a;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);
        
        setTimeout(() => {
            if (currentIndex < challenges.length - 1) {
                setCurrentIndex(i => i + 1);
                setUserAnswer('');
                setIsCorrect(null);
                setTimeLeft(15);
            } else {
                setIsFinished(true);
            }
        }, 1500);
    };

    const handleKey = (val: string) => {
        if (isCorrect !== null) return;
        if (val === 'DEL') setUserAnswer(prev => prev.slice(0, -1));
        else if (userAnswer.length < 5) setUserAnswer(prev => prev + val);
    };

    if (isFinished) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                <div className="w-32 h-32 rounded-full border-4 border-gold-main flex items-center justify-center mb-8 shadow-gold">
                    <Trophy className="w-16 h-16 text-gold-main" />
                </div>
                <h2 className="text-5xl font-display font-black text-white uppercase mb-4 tracking-tighter">Sync Complete</h2>
                <p className="text-2xl text-text-muted italic mb-12">Vector Math Score: {score} / {challenges.length}</p>
                <button onClick={() => onComplete(score)} className="btn-gold px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-4">
                    Commit to Neural Map <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 gap-12 animate-fade-in bg-dark-primary/10">
            <div className="max-w-xl w-full space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">Vector: Acoustic Math</span>
                        <h3 className="text-4xl font-display font-black text-white uppercase tracking-tight leading-none">Diagnostic Calculation</h3>
                    </div>
                    <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${timeLeft < 5 ? 'border-red-500 text-red-500 animate-pulse' : 'border-white/10 text-white'}`}>
                        <Timer className="w-5 h-5" />
                        <span className="text-2xl font-mono font-black">{timeLeft}s</span>
                    </div>
                </div>

                <div className="glass-panel p-10 rounded-[3rem] border-gold-main/20 bg-dark-secondary/60 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><Calculator className="w-32 h-32 text-gold-main" /></div>
                    <div className="space-y-6 relative z-10">
                        <div className="p-3 bg-gold-main/10 border border-gold-main/20 rounded-xl w-fit text-gold-main text-[8px] font-black uppercase tracking-widest">Logic Prompt {currentIndex + 1}</div>
                        <p className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed">"{current.q}"</p>
                        
                        <div className="flex items-center gap-4 pt-4">
                            <div className={`flex-1 h-20 bg-black/40 border-2 rounded-2xl flex items-center justify-center text-4xl font-mono transition-all ${isCorrect === true ? 'border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : isCorrect === false ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 text-white'}`}>
                                {userAnswer || <span className="opacity-10">...</span>}
                            </div>
                            <div className="text-2xl font-display font-black text-gold-main/40 uppercase">{current.unit}</div>
                        </div>

                        {isCorrect === false && (
                            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-400 font-sans italic flex items-center gap-3">
                                <Target className="w-4 h-4" /> Calibration Required. Solution: {current.a} {current.unit}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[320px] grid grid-cols-3 gap-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'].map(k => (
                    <button 
                        key={k} 
                        onClick={() => handleKey(k)}
                        className={`h-20 rounded-2xl border-2 font-display font-black text-2xl transition-all active:scale-95 ${k === 'DEL' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-text-muted hover:border-gold-main/40 hover:text-white'}`}
                    >
                        {k}
                    </button>
                ))}
                <button 
                    onClick={handleCheck}
                    disabled={!userAnswer || isCorrect !== null}
                    className="col-span-3 btn-gold h-20 rounded-2xl font-black uppercase tracking-widest text-xs shadow-gold-bright flex items-center justify-center gap-4 disabled:opacity-20"
                >
                    Initialize Verification <Zap className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default FormulaChallenge;
