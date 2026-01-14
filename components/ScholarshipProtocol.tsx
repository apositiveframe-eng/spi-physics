import React from 'react';
import { X, Award, GraduationCap, HeartPulse, ShieldCheck, Zap, ArrowRight, FileCheck, Target, Users, Sparkles, MoveRight } from 'lucide-react';
import UniversalHost from './UniversalHost';

interface ScholarshipProtocolProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

const ScholarshipProtocol: React.FC<ScholarshipProtocolProps> = ({ isOpen, onClose, theme = 'dark' }) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const eligibility = [
    { title: "Clinical Persistence", criteria: "Currently enrolled in an accredited DMS/CVT program.", icon: GraduationCap },
    { title: "Academic Resonance", criteria: "Minimum 3.5 GPA in core physics/instrumentation courses.", icon: Award },
    { title: "Financial Mismatch", criteria: "Demonstrated need for protocol subsidization.", icon: Zap },
    { title: "Community Flux", criteria: "Commitment to serving under-resourced diagnostic sectors.", icon: Users }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-midnight/98 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full max-h-[92vh] glass-panel rounded-[3rem] md:rounded-[5rem] border-accent-gold/30 bg-dark-secondary/95 shadow-gold-bright flex flex-col overflow-hidden animate-slide-up tactical-border">
        
        {/* Header Section */}
        <div className={`p-8 md:p-16 border-b flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden ${isLight ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/5'}`}>
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12"><HeartPulse className="w-64 h-64 text-accent-gold" /></div>
            
            <div className="flex items-center gap-8 relative z-10">
                <div className="p-5 bg-accent-gold/20 rounded-3xl border border-accent-gold/30 text-accent-gold animate-pulse shadow-gold">
                    <Award className="w-10 h-10" />
                </div>
                <div className="text-left">
                    <h2 className={`text-3xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>Neural Equity <br/><span className="luxury-text !filter-none opacity-80">Protocol</span></h2>
                    <p className="text-[10px] font-black text-accent-gold uppercase tracking-[0.5em] mt-3">EchoMasters Scholarship v1.0</p>
                </div>
            </div>

            <button onClick={onClose} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-text-muted hover:text-white transition-all group active:scale-90">
                <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
            </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20 space-y-24 bg-dark-primary/10">
            
            {/* Harvey Mission Briefing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center">
                    <UniversalHost 
                        status="speaking" 
                        variant="featured" 
                        theme={theme}
                        message="Financial constraints should never result in signal interference for future diagnostic heroes. I have authorized the Neural Equity Handshake to subsidize the path for those with high academic resonance but low capital liquidity."
                    />
                </div>
                <div className="space-y-10 text-left">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-black uppercase tracking-widest">
                            <Target className="w-4 h-4" /> Strategic Objective
                        </div>
                        <h3 className={`text-2xl md:text-4xl font-display font-black uppercase tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>Empowering the <br/>Next Generation</h3>
                        <p className={`text-lg md:text-xl font-serif italic leading-relaxed opacity-80 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
                            "Our mission is to eliminate the 'Barrier to Entry' artifact. We provide 100% complimentary access to the full SPI Core Matrix for selected scholars who demonstrate exceptional clinical potential."
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <div className="text-3xl font-display font-black text-accent-gold">$25,000+</div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mt-1">Total Protocol Grants</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <div className="text-3xl font-display font-black text-accent-blue">150+</div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mt-1">Scholars Synchronized</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Eligibility Grid */}
            <div className="space-y-12">
                <div className="text-center md:text-left border-l-4 border-accent-gold pl-8">
                    <h4 className={`text-xl md:text-2xl font-display font-black uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>II. Eligibility Vectors</h4>
                    <p className="text-sm text-text-muted italic font-serif">"Verify your synchronization parameters before initializing application."</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {eligibility.map((item, i) => (
                        <div key={i} className="glass-panel p-10 rounded-[2.5rem] border-white/5 group hover:border-accent-gold/40 transition-all flex flex-col text-left">
                            <div className="p-4 bg-white/5 rounded-2xl w-fit text-accent-gold mb-8 group-hover:scale-110 transition-transform">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h5 className={`text-lg font-display font-black uppercase tracking-tight mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>{item.title}</h5>
                            <p className="text-sm text-text-muted leading-relaxed opacity-70 italic">{item.criteria}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Application Phases */}
            <div className={`p-12 md:p-20 rounded-[4rem] relative overflow-hidden group ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/60 border-accent-blue/20 border-2'}`}>
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"><Zap className="w-48 h-48 text-accent-blue" /></div>
                
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <h3 className={`text-3xl md:text-5xl font-display font-black uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>Execution <span className="text-accent-blue">Timeline</span></h3>
                    
                    <div className="space-y-6">
                        {[
                            { step: "01", label: "Dossier Submission", desc: "Submit your academic transcripts and a 500-word monograph on your clinical mission." },
                            { step: "02", label: "Neural Audit", desc: "Our board of registered sonographers reviews your diagnostic aptitude and need." },
                            { step: "03", label: "Protocol Activation", desc: "Selected scholars receive a lifetime Neural Link key within 14 business days." }
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-10 p-6 rounded-3xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all group/item">
                                <div className="text-4xl font-display font-black text-accent-blue/20 group-hover/item:text-accent-blue transition-colors">{s.step}</div>
                                <div>
                                    <h5 className="font-black text-white uppercase tracking-widest text-sm mb-1">{s.label}</h5>
                                    <p className="text-xs text-text-muted italic opacity-70">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <button className="btn-gold px-16 py-7 rounded-3xl font-black uppercase tracking-[0.4em] text-xs shadow-gold-bright transition-all active:scale-95 flex items-center justify-center gap-4 mx-auto">
                            Commence Application <MoveRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className={`p-8 border-t flex justify-between items-center bg-black/20 ${isLight ? 'bg-slate-100 border-slate-200' : 'border-white/5'}`}>
            <div className="flex items-center gap-4 text-[9px] font-black text-text-muted/40 uppercase tracking-[0.4em]">
               <ShieldCheck className="w-4 h-4" /> HUMAN_RESOURCES_PROTOCOL_SECURED
            </div>
            <p className="text-[10px] font-black text-accent-gold/60 uppercase tracking-widest">Deadlines: Biannual Review (Jan/July)</p>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipProtocol;