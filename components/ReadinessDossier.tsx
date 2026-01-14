
import React from 'react';
import { X, ShieldCheck, ClipboardList, Target, Zap, Download, ChevronRight, FileCheck, AlertCircle, BookmarkCheck } from 'lucide-react';

interface ReadinessDossierProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReadinessDossier: React.FC<ReadinessDossierProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const requirements = [
    { id: 'edu', label: "Accredited Physics Coursework", status: 'verified', desc: "Documented completion of 3+ credit hours in Ultrasound Physics." },
    { id: 'clin', label: "Clinical Hour Validation", status: 'pending', desc: "Verification of clinical hours by a registered sonographer." },
    { id: 'id', label: "Inteleos™ Profile Synchronization", status: 'verified', desc: "Active portal account on the ARDMS®/Inteleos™ network." },
    { id: 'exam', label: "Testing Center Identification", status: 'pending', desc: "Valid government-issued ID matching registration data." }
  ];

  const phases = [
    { phase: "01", title: "Neural Mapping", status: "Active", desc: "Monograph traversal and glossary synchronization." },
    { phase: "02", title: "Vector Simulation", status: "Locked", desc: "Achieving 90%+ in the Interactive Lab environments." },
    { phase: "03", title: "Diagnostic Audit", status: "Locked", desc: "Successful completion of 3 consecutive Mock Exams." },
    { phase: "04", title: "Board Lockdown", status: "Locked", desc: "Final integrity check 24h prior to examination." }
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-10 animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-midnight/98 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-full max-h-[85vh] glass-panel rounded-[3rem] border-accent-blue/40 bg-dark-secondary/95 shadow-blue-bright flex flex-col overflow-hidden animate-slide-up">
        
        {/* PRD Header */}
        <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12"><ClipboardList className="w-64 h-64 text-accent-blue" /></div>
            <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-accent-blue/20 rounded-2xl border border-accent-blue/40 text-accent-blue animate-pulse">
                    <FileCheck className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-2xl md:text-4xl font-display font-black text-white uppercase tracking-tighter">Readiness Dossier</h3>
                    <p className="text-[10px] font-black text-accent-blue/60 uppercase tracking-[0.5em]">PRD: Professional Readiness Document</p>
                </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-text-muted hover:text-white transition-all relative z-10">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* PRD Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-16 custom-scrollbar">
            
            {/* Eligibility Tracking */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 text-accent-blue">
                    <ShieldCheck className="w-6 h-6" />
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">Certification Eligibility Matrix</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requirements.map((req) => (
                        <div key={req.id} className={`p-8 rounded-[2rem] border transition-all ${req.status === 'verified' ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10 opacity-60'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${req.status === 'verified' ? 'text-green-500' : 'text-text-muted'}`}>{req.status}</span>
                                {req.status === 'verified' ? <BookmarkCheck className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-text-muted" />}
                            </div>
                            <h5 className="text-lg font-display font-black text-white uppercase tracking-tight mb-2">{req.label}</h5>
                            <p className="text-xs text-text-muted font-sans italic">{req.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trajectory Phases */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 text-accent-gold">
                    <Zap className="w-6 h-6" />
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">Diagnostic Trajectory</h4>
                </div>
                <div className="space-y-4">
                    {phases.map((p, i) => (
                        <div key={i} className={`flex items-center gap-8 p-6 rounded-3xl border transition-all ${p.status === 'Active' ? 'bg-accent-gold/10 border-accent-gold/40 shadow-gold' : 'bg-white/5 border-white/5 opacity-40'}`}>
                            <div className="text-4xl font-display font-black text-white/10 select-none">{p.phase}</div>
                            <div className="flex-1">
                                <h5 className="font-black text-white uppercase tracking-widest text-sm mb-1">{p.title}</h5>
                                <p className="text-xs text-text-muted italic font-serif">{p.desc}</p>
                            </div>
                            <div className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${p.status === 'Active' ? 'bg-accent-gold text-dark-primary border-accent-gold' : 'text-text-muted border-white/10'}`}>
                                {p.status}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="p-12 rounded-[3rem] bg-accent-blue/5 border border-accent-blue/10 text-center space-y-6">
                <h4 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic">"Readiness is a state of calculated certainty."</h4>
                <p className="text-sm text-text-muted font-serif italic max-w-2xl mx-auto opacity-70">Verify all Eligibility vectors before committing to a test date. Incomplete synchronization is the primary cause of diagnostic failure.</p>
                <div className="flex justify-center gap-4">
                    <button className="btn-blue px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                        <Download className="w-4 h-4" /> Download Official PRD
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReadinessDossier;
