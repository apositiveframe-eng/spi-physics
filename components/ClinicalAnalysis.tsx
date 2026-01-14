
import React, { useState } from 'react';
import { Microscope, ArrowRight, ShieldAlert, CheckCircle, Info, RefreshCw, Zap, Eye, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Simulations from './Simulations';
import UniversalHost from './UniversalHost';

const cases = [
    {
        id: 1,
        title: "The Silent Shadow",
        description: "You are scanning a gallbladder. You identify a 2cm echogenic focus in the neck. There is no posterior shadowing visible, but you suspect a gallstone.",
        options: [
            "Increase Digital Gain",
            "Increase Transducer Frequency",
            "Change to a deeper focal zone",
            "Decrease PRF"
        ],
        correct: 1,
        explanation: "Higher frequencies provide better lateral resolution and sharper shadowing artifacts due to increased attenuation by the stone.",
        visual: "AxialResolutionVisual"
    },
    {
        id: 2,
        title: "Diaphragm Echo Paradox",
        description: "While scanning the liver/diaphragm interface, a second 'liver' appears above the diaphragm. The student assumes it is a tumor.",
        options: [
            "Lower the Power",
            "Increase TGC",
            "Recognize Mirror Image Artifact",
            "Increase Dynamic Range"
        ],
        correct: 2,
        explanation: "This is a mirror image artifact caused by the strong diaphragm reflector. Recognizing it avoids false pathology reports.",
        visual: "HarmonicImagingVisual"
    }
];

interface ClinicalAnalysisProps {
    onPlayCorrect: () => void;
    onPlayIncorrect: () => void;
}

const ClinicalAnalysis: React.FC<ClinicalAnalysisProps> = ({ onPlayCorrect, onPlayIncorrect }) => {
    const [activeCase, setActiveCase] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [hostStatus, setHostStatus] = useState<'idle' | 'speaking' | 'thinking'>('idle');

    const current = cases[activeCase];

    const handleVerify = () => {
        if (selected === null) return;
        
        // Play sound first as requested
        if (selected === current.correct) {
            onPlayCorrect();
        } else {
            onPlayIncorrect();
        }

        setIsRevealed(true);
        setHostStatus('speaking');
    };

    const handleNext = () => {
        setActiveCase((activeCase + 1) % cases.length);
        setIsRevealed(false);
        setSelected(null);
        setHostStatus('idle');
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-16 lg:p-24 animate-fade-in bg-dark-primary/10 text-left">
            <div className="max-w-6xl mx-auto space-y-12 pb-48">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-8xl font-display font-black text-white uppercase tracking-tighter luxury-text">Case Analysis</h1>
                    <p className="text-lg md:text-xl text-text-muted font-light italic font-serif opacity-70">"Translate physics into clinical diagnostic integrity."</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="glass-panel p-10 rounded-[3rem] border-white/5 space-y-8 bg-dark-secondary/60 relative overflow-hidden tactical-border">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Microscope className="w-32 h-32 text-gold-main" /></div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gold-main/10 rounded-xl text-gold-main"><ShieldAlert className="w-5 h-5" /></div>
                                <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest">{current.title}</h3>
                            </div>
                            <p className="text-xl md:text-2xl text-text-main font-serif leading-relaxed italic border-l-4 border-gold-main/30 pl-8">"{current.description}"</p>
                            
                            <div className="space-y-4 pt-4">
                                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Recommended Protocol Adjustment:</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {current.options.map((opt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => !isRevealed && setSelected(i)}
                                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${selected === i ? 'border-gold-main bg-gold-main/10 text-white' : 'border-white/5 text-text-muted hover:bg-white/5'}`}
                                        >
                                            <span className="flex items-center gap-4">
                                                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${selected === i ? 'bg-gold-main border-gold-main text-dark-primary' : 'border-white/10'}`}>
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                {opt}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!isRevealed ? (
                                <button 
                                    disabled={selected === null}
                                    onClick={handleVerify}
                                    className="btn-gold w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-gold-bright disabled:opacity-20 transition-all active:scale-95"
                                >
                                    Verify Diagnostic Choice
                                </button>
                            ) : (
                                <div className={`p-8 rounded-[2rem] border-2 animate-slide-up ${selected === current.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        {selected === current.correct ? <CheckCircle className="w-6 h-6 text-green-500" /> : <ShieldAlert className="w-6 h-6 text-red-500" />}
                                        <h4 className={`text-xl font-display font-black uppercase ${selected === current.correct ? 'text-green-500' : 'text-red-500'}`}>
                                            {selected === current.correct ? 'Acoustic Alignment Confirmed' : 'Physics Mismatch'}
                                        </h4>
                                    </div>
                                    <p className="text-text-main font-sans leading-relaxed opacity-90">{current.explanation}</p>
                                    <button 
                                        onClick={handleNext}
                                        className="mt-8 flex items-center gap-3 text-gold-main font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                                    >
                                        Next Clinical Vector <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-12">
                        {/* Harvey Insights */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gold-main/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <UniversalHost 
                                status={hostStatus} 
                                message={isRevealed ? (selected === current.correct ? "Excellent calibration, scholar. You've identified the high-frequency requirement correctly." : "Wait. You missed the attenuation factor. Higher frequencies would sharpen that shadow.") : "Observe the simulation carefully. Which adjustment will clarify the pathology?"} 
                                className="relative z-10 scale-90" 
                            />
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-gold-main uppercase tracking-[0.4em] flex items-center gap-3"><Eye className="w-4 h-4" /> Diagnostic Simulation</h4>
                            <Simulations type={current.visual} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicalAnalysis;
