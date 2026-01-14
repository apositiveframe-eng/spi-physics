import React from 'react';
import { Gift, Lock, Key, ShieldCheck, Zap, Sparkles, FileText } from 'lucide-react';

const Bonuses: React.FC = () => {
  const bonuses = [
    {
      title: "SPI Secret Keys",
      desc: "5 hidden strategies to decode complex Doppler questions without performing full calculations.",
      icon: <Key className="w-6 h-6" />,
      tag: "STRATEGY"
    },
    {
      title: "The Anxiety Buffer",
      desc: "Neural breathing protocols designed to lower heart rate during the high-pressure 120-minute window.",
      icon: <Zap className="w-6 h-6" />,
      tag: "MINDSET"
    },
    {
      title: "Artifact Cheat Sheet",
      desc: "A high-fidelity PDF mapping every acoustic artifact to its physical cause for instant recognition.",
      icon: <FileText className="w-6 h-6" />,
      tag: "REFERENCE"
    },
    {
      title: "Physics Mnemonic Vault",
      desc: "Our full library of 'Path 8' mnemonics for memorizing every reciprocal relationship in physics.",
      icon: <Lock className="w-6 h-6" />,
      tag: "MEMORY"
    }
  ];

  return (
    <div className="py-24 md:py-32 bg-dark-primary/40 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-main/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-path8-teal/10 border border-path8-teal/20 text-path8-teal text-[10px] font-black uppercase tracking-[0.4em]">
            <Gift className="w-4 h-4" />
            Encryption Bonus
          </div>
          <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter luxury-text">
            Exclusive <br className="sm:hidden" /> Bonus Protocols
          </h2>
          <p className="text-text-muted font-light font-serif italic max-w-2xl mx-auto text-lg opacity-80">
            "We do not just provide data. We provide the edge. These secondary protocols are included at no additional cost."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bonuses.map((bonus, idx) => (
            <div key={idx} className="glass-panel p-10 rounded-[2.5rem] border-white/5 hover:border-gold-main/40 transition-all duration-700 group relative overflow-hidden tactical-border">
              <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                {bonus.icon}
              </div>
              
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-main group-hover:scale-110 transition-transform">
                  {bonus.icon}
                </div>
                <div>
                  <span className="text-[8px] font-black text-path8-teal uppercase tracking-[0.3em] mb-2 block">{bonus.tag}</span>
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight group-hover:text-gold-main transition-colors mb-4">
                    {bonus.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                    {bonus.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-[3rem] bg-gold-main/5 border border-gold-main/20 flex flex-col md:flex-row items-center gap-8 text-center md:text-left shadow-inner-gold">
          <div className="p-4 bg-gold-main/10 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-gold-main" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-display font-black text-white uppercase tracking-widest mb-1">Total Protocol Value: $149.00</h4>
            <p className="text-xs text-text-muted uppercase tracking-widest opacity-60">Included free with every Digital or Printed purchase.</p>
          </div>
          <div className="px-6 py-3 bg-gold-main text-dark-primary font-black uppercase tracking-widest text-[10px] rounded-xl shadow-gold">
            Verified Value
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bonuses;
