import React, { useState } from 'react';
import { glossaryTerms } from '../data/courseContent';
import { RotateCcw, ChevronLeft, ChevronRight, Zap, Brain, Layers, Star } from 'lucide-react';

interface FlashcardsProps {
  theme?: 'dark' | 'light';
}

const Flashcards: React.FC<FlashcardsProps> = ({ theme = 'dark' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [mastered, setMastered] = useState<Set<number>>(new Set());
    const [shuffledTerms, setShuffledTerms] = useState(() => [...glossaryTerms].sort(() => Math.random() - 0.5));
    const isLight = theme === 'light';

    const resetDeck = () => {
        setShuffledTerms([...glossaryTerms].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setIsFlipped(false);
        setMastered(new Set());
    };

    const toggleMastery = (idx: number) => {
        setMastered(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(prev => (prev + 1) % shuffledTerms.length), 150);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(prev => (prev - 1 + shuffledTerms.length) % shuffledTerms.length), 150);
    };

    const currentTerm = shuffledTerms[currentIndex];
    const progress = Math.round((mastered.size / shuffledTerms.length) * 100);

    return (
        <div className={`flex-1 flex flex-col p-4 md:p-12 lg:p-20 overflow-y-auto scroll-smooth custom-scrollbar animate-fade-in transition-colors duration-1000 ${isLight ? 'bg-light-primary/40' : 'bg-dark-primary/10'}`}>
            <div className="max-w-4xl mx-auto w-full space-y-8 md:space-y-16 pb-32 text-left">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10">
                    <div className="space-y-4 md:space-y-6 flex-1 w-full text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-gold-main/10 border border-gold-main/30 rounded-full">
                            <Zap className="w-3 h-3 text-gold-main" />
                            <span className="text-[8px] md:text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">Rapid Recall Vector</span>
                        </div>
                        <h1 className={`text-3xl md:text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-tight luxury-text ${isLight ? '!filter-none' : ''}`}>Recall Deck</h1>
                    </div>
                    <div className="w-full md:w-72 space-y-3 md:space-y-4 text-left">
                        <div className="flex justify-between items-end"><span className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mastery</span><span className="text-lg md:text-xl font-display font-black text-gold-main">{progress}%</span></div>
                        <div className={`w-full h-1 md:h-1.5 rounded-full overflow-hidden shadow-inner ${isLight ? 'bg-black/5' : 'bg-white/5'}`}><div className="h-full bg-gold-main shadow-gold transition-all duration-[2000ms]" style={{ width: `${progress}%` }}></div></div>
                        <button onClick={resetDeck} className="w-full py-2 flex items-center justify-center gap-2 text-[7px] md:text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-gold-main transition-colors active:scale-95"><RotateCcw className="w-2.5 h-2.5" /> Reset Protocol</button>
                    </div>
                </div>

                <div className="relative perspective-2000 w-full h-[300px] md:h-[550px] group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={`relative w-full h-full transition-all duration-700 preserve-3d transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}>
                        
                        <div className={`absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-6 md:p-12 rounded-[1.5rem] md:rounded-[5rem] tactical-border text-center shadow-2xl ${isLight ? 'bg-white border-black/5 shadow-2xl' : 'border-white/10 bg-dark-secondary/80'}`}>
                            <div className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-2 md:gap-3 opacity-20"><Brain className={`w-4 h-4 md:w-6 md:h-6 ${isLight ? 'text-slate-900' : 'text-gold-main'}`} /><span className={`text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] ${isLight ? 'text-slate-900' : ''}`}>Term Vector</span></div>
                            <h2 className={`text-2xl sm:text-4xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight leading-tight px-2 ${isLight ? 'text-slate-900' : 'luxury-text'}`}>{currentTerm.term}</h2>
                            <div className="absolute bottom-6 text-center w-full left-0 opacity-30 animate-pulse text-[7px] md:text-[10px] font-black uppercase tracking-[0.5em]">Tap to Flip</div>
                        </div>

                        <div className={`absolute inset-0 backface-hidden rotate-y-180 glass-panel flex flex-col items-center justify-center p-6 md:p-24 rounded-[1.5rem] md:rounded-[5rem] tactical-border text-center shadow-gold-bright ${isLight ? 'bg-white border-gold-main/40 shadow-2xl' : 'border-gold-main/30 bg-black/90'}`}>
                            <div className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-2 md:gap-3 opacity-40 text-gold-main"><Layers className="w-4 h-4 md:w-6 md:h-6" /><span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em]">Definition</span></div>
                            <p className={`text-base sm:text-2xl md:text-5xl font-serif italic leading-relaxed font-light opacity-95 px-2 md:px-10 ${isLight ? 'text-slate-800' : 'text-white'}`}>"{currentTerm.def}"</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 pt-2">
                    <div className="flex items-center gap-3 md:gap-6">
                        <button onClick={(e) => { e.stopPropagation(); prevCard(); }} className={`p-4 md:p-8 rounded-full border transition-all active:scale-90 shadow-xl ${isLight ? 'bg-white border-black/5 text-slate-400 hover:text-slate-900' : 'bg-white/5 border-white/10 text-text-muted hover:text-white'}`}><ChevronLeft className="w-5 h-5 md:w-10 md:h-10" /></button>
                        <span className="text-base md:text-2xl font-mono text-gold-main/60 tracking-widest">{currentIndex + 1} / {shuffledTerms.length}</span>
                        <button onClick={(e) => { e.stopPropagation(); nextCard(); }} className={`p-4 md:p-8 rounded-full border transition-all active:scale-90 shadow-xl ${isLight ? 'bg-white border-black/5 text-slate-400 hover:text-slate-900' : 'bg-white/5 border-white/10 text-text-muted hover:text-white'}`}><ChevronRight className="w-5 h-5 md:w-10 md:h-10" /></button>
                    </div>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleMastery(currentIndex); }}
                        className={`w-full md:w-auto px-8 md:px-16 py-4 md:py-8 rounded-xl md:rounded-[3rem] font-black uppercase tracking-[0.3em] md:tracking-[0.7em] text-[9px] md:text-sm transition-all flex items-center justify-center gap-3 md:gap-6 shadow-2xl active:scale-95 ${mastered.has(currentIndex) ? 'btn-gold shadow-gold-bright' : isLight ? 'bg-white border-2 border-black/5 text-slate-400 hover:text-slate-900' : 'bg-white/5 text-text-muted border-2 border-white/10 hover:border-gold-main/40 hover:text-white'}`}
                    >
                        <Star className={`w-4 h-4 md:w-7 md:h-7 ${mastered.has(currentIndex) ? 'fill-current' : ''}`} />
                        {mastered.has(currentIndex) ? 'Mastered' : 'Mark Known'}
                    </button>
                </div>
            </div>
            
            <style>{`
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .preserve-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

export default Flashcards;
