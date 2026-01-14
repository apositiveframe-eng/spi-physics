
import React, { useState, useMemo, useEffect } from 'react';
import { 
    ChevronRight, Activity, Zap, Eye, ShieldCheck, 
    ClipboardList, Clock, Sparkles, Scan, ShieldAlert, Cpu, Layers
} from 'lucide-react';

interface VisualProps {
    theme?: 'dark' | 'light';
}

const WavePropagationGraph: React.FC<VisualProps> = ({ theme }) => {
    const [freq, setFreq] = useState(5);
    const [amp, setAmp] = useState(30);
    const [time, setTime] = useState(0);
    const isLight = theme === 'light';
    const points = 100;
    const particles = 40;

    useEffect(() => {
        let frameId: number;
        const animate = (t: number) => {
            setTime(t * 0.005);
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const pathData = useMemo(() => {
        let d = `M 0 50`;
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * 300;
            const y = 50 + Math.sin(i * (freq * 0.1) - time) * amp;
            d += ` L ${x} ${y}`;
        }
        return d;
    }, [freq, amp, time]);

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className={`relative h-48 rounded-[2.5rem] border overflow-hidden flex flex-col justify-center tactical-border ${isLight ? 'bg-slate-50 border-black/5 shadow-inner' : 'bg-black/60 border-white/5'}`}>
                <div className={`absolute inset-0 bg-grid-pattern pointer-events-none ${isLight ? 'opacity-30 invert' : 'opacity-10'}`} />
                <div className="relative h-24">
                    <svg viewBox="0 0 300 100" className="w-full h-full drop-shadow-blue">
                        <path d={pathData} fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" className="transition-all duration-300" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke={isLight ? "black" : "white"} strokeOpacity="0.1" strokeDasharray="4,4" />
                    </svg>
                </div>
                <div className={`h-12 relative flex items-center px-4 border-t ${isLight ? 'bg-white/50 border-black/5' : 'bg-black/20 border-white/5'}`}>
                    <div className="absolute left-4 top-2 text-[6px] font-black uppercase text-accent-blue/60 tracking-widest">Longitudinal_Displacement</div>
                    <div className="flex justify-between w-full">
                        {Array.from({ length: particles }).map((_, i) => {
                            const phase = (i / particles) * Math.PI * 2 * (freq * 0.5);
                            const shift = Math.sin(phase - time) * (amp * 0.2);
                            return (
                                <div 
                                    key={i} 
                                    className="w-1 h-4 bg-accent-blue/30 rounded-full" 
                                    style={{ transform: `translateX(${shift}px)`, opacity: 0.3 + (Math.abs(shift) / (amp * 0.2)) * 0.7 }} 
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="absolute bottom-3 right-6 flex gap-6 text-[7px] font-black text-accent-blue/60 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-1.5"><Cpu className="w-2.5 h-2.5" /> Core_Freq: {freq}MHz</span>
                    <span className="flex items-center gap-1.5"><Activity className="w-2.5 h-2.5" /> Amplitude: {amp}dB</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className={`glass-panel p-4 rounded-2xl ${isLight ? 'bg-white border-black/5' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex justify-between text-[8px] font-black uppercase text-text-muted tracking-widest"><span>Frequency Calibration</span><span className="text-accent-blue">{freq}MHz</span></div>
                    <input type="range" min="1" max="15" value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full h-1 bg-black/5 rounded-full appearance-none accent-accent-blue cursor-pointer" />
                </div>
                <div className={`glass-panel p-4 rounded-2xl ${isLight ? 'bg-white border-black/5' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex justify-between text-[8px] font-black uppercase text-text-muted tracking-widest"><span>Acoustic Intensity</span><span className="text-accent-blue">{amp}dB</span></div>
                    <input type="range" min="5" max="45" value={amp} onChange={(e) => setAmp(Number(e.target.value))} className="w-full h-1 bg-black/5 rounded-full appearance-none accent-accent-blue cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

const ImpedanceBoundaryGraph: React.FC<VisualProps> = ({ theme }) => {
    const [mismatch, setMismatch] = useState(25);
    const [time, setTime] = useState(0);
    const isLight = theme === 'light';

    useEffect(() => {
        const timer = setInterval(() => setTime(prev => (prev + 1.5) % 300), 16);
        return () => clearInterval(timer);
    }, []);

    const reflectionPercent = mismatch;
    const transmissionPercent = 100 - mismatch;

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className={`relative h-48 rounded-[2.5rem] border overflow-hidden tactical-border ${isLight ? 'bg-slate-50 border-black/5' : 'bg-black/60 border-white/5'}`}>
                <div className={`absolute inset-0 bg-grid-pattern pointer-events-none ${isLight ? 'opacity-30 invert' : 'opacity-10'}`} />
                <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full bg-accent-blue/5 border-r border-accent-blue/30 relative flex items-center justify-center">
                        <div className="absolute top-4 left-6 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                             <span className={`text-[7px] font-black uppercase tracking-[0.4em] ${isLight ? 'text-slate-400' : 'text-accent-blue/60'}`}>Media_Alpha (Tissue)</span>
                        </div>
                    </div>
                    <div className="w-1/2 h-full bg-accent-gold/5 flex items-center justify-center relative">
                         <div className="absolute top-4 right-6 flex items-center gap-2">
                             <span className={`text-[7px] font-black uppercase tracking-[0.4em] ${isLight ? 'text-slate-400' : 'text-accent-gold/60'}`}>Media_Beta (Bone)</span>
                             <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                        </div>
                    </div>
                </div>

                <svg viewBox="0 0 300 100" className="w-full h-full relative z-10">
                    <line x1="150" y1="0" x2="150" y2="100" stroke={isLight ? "black" : "white"} strokeOpacity="0.1" strokeDasharray="2,2" />
                    {time < 150 && (
                        <g transform={`translate(${time}, 50)`}>
                            <circle r="4" fill="#00E5FF" className="animate-pulse" />
                            <circle r="8" fill="none" stroke="#00E5FF" strokeOpacity="0.4" className="animate-ping" />
                        </g>
                    )}
                    {time >= 150 && (
                        <>
                            <g transform={`translate(${150 - (time - 150)}, 50)`}>
                                <circle r={2 + (reflectionPercent/20)} fill="#D9B65C" fillOpacity={reflectionPercent/100} />
                                <text x="-20" y="-15" fill="#D9B65C" fontSize="6" fontWeight="900" className="uppercase tracking-widest">{reflectionPercent}% Echo</text>
                            </g>
                            <g transform={`translate(${150 + (time - 150)}, 50)`}>
                                <circle r={2 + (transmissionPercent/20)} fill="#00E5FF" fillOpacity={transmissionPercent/100} />
                                <text x="10" y="-15" fill="#00E5FF" fontSize="6" fontWeight="900" className="uppercase tracking-widest">{transmissionPercent}% Flux</text>
                            </g>
                        </>
                    )}
                </svg>
            </div>
            <div className={`glass-panel p-6 rounded-3xl tactical-border ${isLight ? 'bg-white border-black/5' : 'bg-dark-secondary/80 border-white/10'}`}>
                <div className="flex justify-between items-end mb-2">
                    <div className="space-y-1">
                         <h5 className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>Mismatch Coefficient</h5>
                         <p className={`text-[8px] italic opacity-60 ${isLight ? 'text-slate-400' : 'text-text-muted'}`}>"Higher density differences amplify signal reflection."</p>
                    </div>
                    <span className="text-2xl font-display font-black text-accent-gold">{mismatch}%</span>
                </div>
                <input type="range" min="0" max="99" value={mismatch} onChange={(e) => setMismatch(Number(e.target.value))} className="w-full h-1 bg-black/5 rounded-full appearance-none accent-accent-gold cursor-pointer" />
            </div>
        </div>
    );
};

const ExamSections: React.FC<VisualProps> = ({ theme = 'dark' }) => {
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [labMode, setLabMode] = useState<'wave' | 'impedance'>('wave');
  const isLight = theme === 'light';

  const sections = [
    {
      id: "doppler",
      icon: <Activity className="w-6 h-6 text-gold-main" />,
      title: "Doppler Instrumentation",
      weight: "36%",
      topics: ["Hemodynamics", "Color/Power Physics", "Spectral Analysis", "Aliasing Control"],
      lab: null
    },
    {
      id: "principles",
      icon: <Eye className="w-6 h-6 text-gold-main" />,
      title: "Physical Principles",
      weight: "15%",
      topics: ["Wave Parameters", "Tissue Interaction", "Acoustic Variables", "Attenuation"],
      lab: {
          title: "Acoustic Interaction Lab",
          modes: [
              { id: 'wave', label: 'Waveform Sync', component: WavePropagationGraph },
              { id: 'impedance', label: 'Impedance Vector', component: ImpedanceBoundaryGraph }
          ]
      }
    },
    {
      id: "transducers",
      icon: <Layers className="w-6 h-6 text-gold-main" />,
      title: "Ultrasound Transducers",
      weight: "16%",
      topics: ["Crystal Construction", "Array Types", "Beam Formation", "Focusing Mechanisms"],
      lab: null
    }
  ];

  return (
    <div id="study-guides" className={`py-20 md:py-40 relative overflow-hidden transition-colors duration-1000 ${isLight ? 'bg-light-primary' : 'bg-dark-primary'}`}>
      <div className={`absolute top-0 right-0 w-1/2 h-full bg-grid-pattern pointer-events-none ${isLight ? 'opacity-30 invert' : 'opacity-10'}`} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="lg:grid lg:grid-cols-12 gap-20 items-start mb-24">
            <div className="lg:col-span-5 text-left space-y-12">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-gold-main/10 border border-gold-main/20 text-gold-main text-[11px] font-black uppercase tracking-[0.5em] shadow-gold">
                        <ClipboardList className="w-4 h-4" /> Blueprint_Activation_v4.5
                    </div>
                    <h2 className={`text-5xl md:text-8xl font-display font-black leading-[0.85] tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        SPI CORE <br/> <span className={`italic ${isLight ? 'text-slate-400' : 'luxury-text'}`}>BLUEPRINT</span>
                    </h2>
                    <p className={`text-xl md:text-2xl font-light leading-relaxed font-serif italic max-w-xl opacity-80 border-l-4 border-gold-main/30 pl-8 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
                        "The Matrix maps the official Content Outline into executable study protocols. Navigate the weights to optimize synchronization."
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  {[ { n: '110', l: 'Audit Questions' }, { n: '120', l: 'Minute Window' } ].map((card, i) => (
                    <div key={i} className={`glass-panel p-8 rounded-[2rem] border transition-all ${isLight ? 'bg-white border-black/5 shadow-lg' : 'border-white/5'}`}>
                      <div className="text-gold-main font-display font-black text-4xl mb-2">{card.n}</div>
                      <div className="text-[9px] text-text-muted uppercase tracking-[0.3em] font-black">{card.l}</div>
                    </div>
                  ))}
                </div>

                <div className={`glass-panel p-10 rounded-[3rem] tactical-border relative overflow-hidden group ${isLight ? 'bg-white border-black/5 shadow-2xl' : 'bg-dark-secondary/60'}`}>
                    <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <ShieldCheck className={`w-48 h-48 ${isLight ? 'text-slate-900' : 'text-gold-main'}`} />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10 text-left">
                      <div className="p-3 bg-gold-main/20 rounded-xl text-gold-main shadow-gold"><ShieldCheck className="w-6 h-6" /></div>
                      <h4 className={`font-black uppercase text-[10px] tracking-[0.3em] ${isLight ? 'text-slate-900' : 'text-white'}`}>Mastery Persistence Guarantee</h4>
                    </div>
                    <p className={`text-base leading-relaxed font-serif italic relative z-10 opacity-70 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
                      "Synchronization with our Doppler suite guarantees a passing trajectory. If board certification is not achieved, the protocol extension initiates automatically."
                    </p>
                </div>
            </div>

            <div className="lg:col-span-7 grid gap-8 mt-12 lg:mt-0 text-left">
                {sections.map((section) => {
                    const isLabOpen = activeLab === section.id;
                    return (
                        <div 
                            key={section.id} 
                            className={`glass-panel p-8 md:p-12 transition-all duration-1000 rounded-[3rem] tactical-border relative overflow-hidden ${isLabOpen ? 'border-accent-blue/50 ring-2 ring-accent-blue/5' : isLight ? 'bg-white border-black/5 shadow-xl hover:border-gold-main/30' : 'hover:bg-white/5 border-white/5 hover:border-gold-main/20'}`}
                        >
                            <div className="flex items-center justify-between mb-10 text-left">
                                <div className="flex items-center gap-8">
                                    <div className={`p-5 rounded-[1.5rem] border shadow-gold transition-all duration-700 ${isLabOpen ? 'scale-110 bg-accent-blue/10 border-accent-blue/30 shadow-blue' : isLight ? 'bg-slate-50 border-black/5' : 'bg-dark-tertiary border-white/10'}`}>
                                        {section.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className={`text-2xl md:text-3xl font-display font-black uppercase tracking-tight transition-colors ${isLabOpen ? 'text-accent-blue' : isLight ? 'text-slate-900' : 'text-white'}`}>
                                            {section.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5 opacity-40">
                                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Vector_ID: {section.id.toUpperCase()}</span>
                                            <div className="w-1 h-1 rounded-full bg-current" />
                                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">{section.topics.length} Protocols</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-4xl font-display font-black transition-colors ${isLabOpen ? 'text-accent-blue/30' : 'text-gold-main/10'}`}>{section.weight}</div>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 transition-all duration-700 ${isLabOpen ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'}`}>
                                {section.topics.map((topic, tIdx) => (
                                    <li key={tIdx} className={`flex items-center text-sm transition-all font-sans py-1 group/topic list-none cursor-default ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-text-muted hover:text-white'}`}>
                                        <ChevronRight className="w-4 h-4 text-gold-main/40 mr-4 group-hover/topic:translate-x-1.5" />
                                        {topic}
                                    </li>
                                ))}
                            </div>

                            {section.lab && (
                                <div className={`mt-6 transition-all duration-1000 ${isLabOpen ? 'opacity-100 scale-100' : 'hidden opacity-0 scale-95'}`}>
                                    <div className={`p-1 rounded-[2.5rem] border space-y-8 shadow-inner ${isLight ? 'bg-slate-50 border-black/5' : 'bg-black/30 border-white/5'}`}>
                                        <div className={`flex gap-3 p-2 rounded-[1.8rem] border ${isLight ? 'bg-white border-black/5' : 'bg-white/5 border-white/5'}`}>
                                            {section.lab.modes.map((mode) => (
                                                <button 
                                                    key={mode.id}
                                                    onClick={() => setLabMode(mode.id as any)}
                                                    className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all active:scale-95 ${labMode === mode.id ? 'bg-accent-blue text-dark-primary shadow-blue-bright scale-105' : 'text-text-muted hover:text-accent-blue hover:bg-black/5'}`}
                                                >
                                                    {mode.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-8">
                                            {labMode === 'wave' ? <WavePropagationGraph theme={theme} /> : <ImpedanceBoundaryGraph theme={theme} />}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={`mt-10 pt-8 border-t flex justify-between items-center relative z-20 ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isLabOpen ? 'bg-accent-blue shadow-blue animate-pulse' : 'bg-green-500/30'}`} />
                                        <span className={`text-[7px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-text-muted/40'}`}>Diagnostic_Link</span>
                                    </div>
                                </div>
                                {section.lab && (
                                    <button 
                                        onClick={() => setActiveLab(isLabOpen ? null : section.id)}
                                        className={`flex items-center gap-4 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all border active:scale-95 ${isLabOpen ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-blue' : isLight ? 'bg-slate-50 border-black/10 text-slate-900 hover:bg-slate-100 shadow-sm' : 'bg-white/5 border-white/10 text-gold-main hover:bg-gold-main hover:text-dark-primary shadow-glass'}`}
                                    >
                                        <Sparkles className={`w-4 h-4 ${isLabOpen ? 'animate-spin' : ''}`} />
                                        {isLabOpen ? 'Deactivate Lab' : 'Execute Lab Sync'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSections;
