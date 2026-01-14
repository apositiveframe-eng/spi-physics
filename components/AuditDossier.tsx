import React from 'react';
import { X, Download, ShieldCheck, Target, Zap, FileText, Printer, ChevronRight, Share2, Layers } from 'lucide-react';

interface AuditDossierProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuditDossier: React.FC<AuditDossierProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const downloadDossier = () => {
    const content = `
ECHOMASTERS | STRATEGIC INTELLIGENCE DOSSIER
ARDMS® SPI PHYSICS PROTOCOL v3.1
-------------------------------------------

I. THE 13μs RANGE MATRIX
- 1cm Depth = 13μs Round Trip
- 2cm Depth = 26μs Round Trip
- 5cm Depth = 65μs Round Trip
- 10cm Depth = 130μs Round Trip

II. DOPPLER EFFICIENCY KEY (COSINE RULE)
- 0 Degrees: 100% Efficiency (True Velocity)
- 60 Degrees: 50% Efficiency (Half Velocity)
- 90 Degrees: 0% Efficiency (Zero Velocity / Black Hole)

III. RECEIVER ORDER OF OPERATIONS (A.C.C.D.R)
1. Amplification (Overall Gain)
2. Compensation (TGC)
3. Compression (Dynamic Range)
4. Demodulation (Rectification/Smoothing) - NOT ADJUSTABLE
5. Reject (Threshold)

IV. RESOLUTION VECTORS
- Axial (LARRD): SPL / 2 (Smaller is better)
- Lateral (LATA): Beam Diameter (Narrowest at focus)

V. SAFETY PARAMETERS
- MI (Mechanical Index): Link to Cavitation
- TI (Thermal Index): Link to Heating
- ALARA: As Low As Reasonably Achievable

-------------------------------------------
PROPERTY OF ECHOMASTERS MEDIA LLC
UNAUTHORIZED REPRODUCTION IS PROHIBITED.
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'EchoMasters_SPI_Audit_Guide.txt';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-10 animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-midnight/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] glass-panel rounded-[3rem] border-gold-main/40 bg-dark-secondary/95 shadow-gold-bright flex flex-col overflow-hidden animate-slide-up">
        
        {/* Dossier Header */}
        <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black/40 relative overflow-hidden print:hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12"><ShieldCheck className="w-64 h-64 text-gold-main" /></div>
            <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-gold-main/20 rounded-2xl border border-gold-main/40 text-gold-main animate-pulse shadow-gold">
                    <FileText className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-2xl md:text-4xl font-display font-black text-white uppercase tracking-tighter">Strategic Dossier</h3>
                    <p className="text-[10px] font-black text-gold-main/60 uppercase tracking-[0.5em]">Classified SPI Audit Guide v3.1</p>
                </div>
            </div>
            <div className="flex items-center gap-3 relative z-10">
                <button onClick={() => window.print()} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-text-muted hover:text-white transition-all"><Printer className="w-5 h-5" /></button>
                <button onClick={downloadDossier} className="btn-gold px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-gold"><Download className="w-4 h-4" /> Download Dossier</button>
                <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-text-muted hover:text-white transition-all"><X className="w-5 h-5" /></button>
            </div>
        </div>

        {/* Dossier Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-20 custom-scrollbar bg-dark-primary/20 print:bg-white print:text-black">
            
            {/* 13μs Rule Grid */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 text-gold-main">
                    <Target className="w-6 h-6" />
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">I. The 13μs Range Matrix</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { d: '1cm', t: '13μs' },
                        { d: '2cm', t: '26μs' },
                        { d: '5cm', t: '65μs' },
                        { d: '10cm', t: '130μs' }
                    ].map((row, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl text-center border-white/5 hover:border-gold-main/30 transition-all">
                            <div className="text-[10px] font-black text-gold-main/50 mb-1 uppercase tracking-widest">Depth</div>
                            <div className="text-2xl font-display font-black text-white">{row.d}</div>
                            <div className="h-[1px] w-8 bg-gold-main/20 mx-auto my-3" />
                            <div className="text-lg font-mono text-gold-main">{row.t}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Doppler Cosine Table */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 text-accent-blue">
                    <Zap className="w-6 h-6" />
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">II. Doppler Efficiency Key</h4>
                </div>
                <div className="glass-panel p-1 rounded-[2.5rem] border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                <th className="px-8 py-5">Incident Angle</th>
                                <th className="px-8 py-5">Cosine Factor</th>
                                <th className="px-8 py-5">Diagnostic Value</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-8 py-6 font-display font-black text-xl">0° / 180°</td>
                                <td className="px-8 py-6 font-mono text-accent-blue">1.0</td>
                                <td className="px-8 py-6 text-xs uppercase tracking-widest font-black text-green-500">Maximum Recall</td>
                            </tr>
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-8 py-6 font-display font-black text-xl">60°</td>
                                <td className="px-8 py-6 font-mono text-accent-blue">0.5</td>
                                <td className="px-8 py-6 text-xs uppercase tracking-widest font-black text-gold-main">Half Velocity</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                                <td className="px-8 py-6 font-display font-black text-xl">90°</td>
                                <td className="px-8 py-6 font-mono text-accent-blue">0.0</td>
                                <td className="px-8 py-6 text-xs uppercase tracking-widest font-black text-red-500">Black Hole (Zero Shift)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Instrumentation Logic */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 text-gold-main">
                    {/* Added missing Layers icon */}
                    <Layers className="w-6 h-6" />
                    <h4 className="text-xl font-display font-black uppercase tracking-widest">III. Receiver Hierarchy</h4>
                </div>
                <div className="space-y-4">
                    {[
                        { l: 'A', name: 'Amplification', desc: 'Global gain boost (adjustable)' },
                        { l: 'C', name: 'Compensation', desc: 'TGC depth correction (adjustable)' },
                        { l: 'C', name: 'Compression', desc: 'Dynamic range narrowing (adjustable)' },
                        { l: 'D', name: 'Demodulation', desc: 'Signal cleaning (NOT adjustable)', highlight: true },
                        { l: 'R', name: 'Reject', desc: 'Low-level noise filter (adjustable)' }
                    ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-8 p-6 rounded-3xl border transition-all ${item.highlight ? 'bg-red-500/5 border-red-500/20 opacity-80' : 'bg-white/5 border-white/10'}`}>
                            <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-display font-black text-xl ${item.highlight ? 'border-red-500 text-red-500' : 'border-gold-main text-gold-main'}`}>{item.l}</div>
                            <div className="flex-1">
                                <h5 className="font-black text-white uppercase tracking-widest text-sm mb-1">{item.name}</h5>
                                <p className="text-xs text-text-muted italic font-serif">{item.desc}</p>
                            </div>
                            {item.highlight && <div className="text-[8px] font-black text-red-500 uppercase tracking-widest border border-red-500/20 px-3 py-1 rounded-full">Engineer Only</div>}
                        </div>
                    ))}
                </div>
            </section>

            <div className="p-12 rounded-[3rem] bg-gold-main/5 border border-gold-main/10 text-center space-y-6">
                <h4 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic">"Precision is the only variable we control."</h4>
                <p className="text-sm text-text-muted font-serif italic max-w-2xl mx-auto opacity-70">Study these vectors daily. Memorization is the first step toward clinical intuition. When you are ready, initialize the simulation to prove your sync.</p>
                <div className="flex justify-center items-center gap-4 text-[9px] font-black text-gold-main/40 uppercase tracking-[0.4em]">
                    <span>EchoMasters Media LLC</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-main/20" />
                    <span>Neural Link Active</span>
                </div>
            </div>
        </div>
      </div>
      
      <style>{`
        @media print {
            .glass-panel { border: 1px solid #ddd !important; background: white !important; box-shadow: none !important; color: black !important; }
            .text-white { color: black !important; }
            .text-gold-main { color: #8a6d3b !important; }
            .bg-midnight, .bg-dark-secondary, .bg-black { background: white !important; }
            .btn-gold, button { display: none !important; }
            * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default AuditDossier;