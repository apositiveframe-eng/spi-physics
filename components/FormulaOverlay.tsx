import React from 'react';
import { X, Calculator, Info, Zap } from 'lucide-react';

interface FormulaOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormulaOverlay: React.FC<FormulaOverlayProps> = ({ isOpen, onClose }) => {
  const formulas = [
    { title: "Range Equation", formula: "Distance (mm) = [1.54 mm/µs × Time (µs)] / 2", hint: "13 microsecond rule: 1cm depth = 13µs round trip." },
    { title: "Axial Resolution", formula: "LARRD = Spatial Pulse Length / 2", hint: "Smaller is better. Lower SPL = Higher resolution." },
    { title: "Acoustic Impedance", formula: "Z = Density (kg/m³) × Speed (m/s)", hint: "Determines reflection at boundaries." },
    { title: "Doppler Shift", formula: "Δf = (2 × Velocity × Transmitted Freq × cosθ) / c", hint: "0° or 180° is best; 90° = No shift detected." },
    { title: "Nyquist Limit", formula: "Nyquist = Pulse Repetition Frequency (PRF) / 2", hint: "Beyond this limit, aliasing occurs." },
    { title: "Duty Factor (%)", formula: "DF = (Pulse Duration / PRP) × 100", hint: "Diagnostic US typically < 1%." },
    { title: "Mechanical Index", formula: "MI = Peak Rarefactional Pressure / √Frequency", hint: "Linked to cavitation (bubbles)." }
  ];

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-dark-primary/90 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl glass-panel rounded-[3rem] border-gold-main/30 bg-dark-secondary/95 shadow-gold-bright flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
        
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/40">
           <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-gold-main/10 border border-gold-main/30 text-gold-main">
                <Calculator className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest">Tactical Formulas</h3>
                <p className="text-xs text-gold-main/50 uppercase font-black tracking-widest">SPI Vector Math v2.0</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 text-text-muted hover:text-white bg-white/5 rounded-2xl border border-white/10 transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
           {formulas.map((f, i) => (
             <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gold-main/40 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <h4 className="text-[10px] font-black text-gold-main/60 uppercase tracking-[0.4em]">{f.title}</h4>
                    <Zap className="w-4 h-4 text-gold-main opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xl md:text-2xl font-mono text-white font-bold mb-4 break-words">{f.formula}</p>
                <div className="flex items-start gap-3 p-4 bg-black/40 rounded-xl">
                   <Info className="w-4 h-4 text-gold-accent shrink-0 mt-0.5" />
                   <p className="text-xs text-text-muted font-sans italic">{f.hint}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="p-8 bg-gold-main/5 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-gold-main/40 uppercase tracking-widest">Neural Reference Buffer 100%</p>
        </div>
      </div>
    </div>
  );
};

export default FormulaOverlay;