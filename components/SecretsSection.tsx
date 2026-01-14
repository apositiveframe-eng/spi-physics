
import React from 'react';
import { Target, ShieldAlert, Zap, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';

interface SecretsSectionProps {
  onOpenDossier: () => void;
  theme?: 'dark' | 'light';
}

const SecretsSection: React.FC<SecretsSectionProps> = ({ onOpenDossier, theme = 'dark' }) => {
  const isLight = theme === 'light';
  
  const secrets = [
    {
      title: "The 13μs Rule Secret",
      desc: "How to use the range equation to eliminate 50% of depth-related questions in under 3 seconds.",
      icon: <Target className="w-10 h-10 text-accent-blue" />,
      tag: "TIME SAVER"
    },
    {
      title: "Artifact Decoder",
      desc: "Distinguishing between real pathology and acoustic shadows using the simple Frequency Filter.",
      icon: <ShieldAlert className="w-10 h-10 text-accent-gold" />,
      tag: "DIAGNOSTIC LOGIC"
    },
    {
      title: "Doppler Efficiency Key",
      desc: "The 'Parallel Protocol' that ensures you never miss a velocity shift calculation again.",
      icon: <Zap className="w-10 h-10 text-path8-teal" />,
      tag: "CORE MATRIX"
    }
  ];

  return (
    <section id="secrets" className={`py-32 md:py-56 relative overflow-hidden border-y transition-colors duration-1000 ${isLight ? 'bg-light-primary border-black/5' : 'bg-dark-primary/80 border-white/5'}`}>
      <div className="absolute top-0 right-0 p-32 opacity-[0.03] animate-spin-slow pointer-events-none">
        <BrainCircuit className={`w-[800px] h-[800px] ${isLight ? 'text-slate-900' : 'text-accent-blue'}`} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="lg:grid lg:grid-cols-2 gap-32 items-center mb-40">
          <div className="space-y-12 text-left">
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-accent-gold text-[10px] font-black uppercase tracking-[0.6em] shadow-gold">
              <Sparkles className="w-4 h-4" />
              Intelligence Dossier
            </div>
            <h2 className={`text-6xl md:text-[9rem] font-display font-black uppercase tracking-tighter luxury-text leading-[0.85] ${isLight ? '!filter-none' : ''}`}>
              The Secrets <br/> to Sync
            </h2>
            <p className={`text-2xl font-light font-sans leading-relaxed italic border-l-4 border-accent-gold/40 pl-12 opacity-80 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
              "We don't teach the textbook. We teach the deconstruction of the ARDMS® interface. This is how you achieve 700+."
            </p>
            <div className="pt-8">
                <button onClick={onOpenDossier} className={`flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] transition-all group ${isLight ? 'text-slate-900 hover:text-accent-gold' : 'text-white hover:text-accent-gold'}`}>
                    View Strategic Dossier <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform text-accent-gold" />
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 mt-20 lg:mt-0">
            {secrets.map((secret, i) => (
              <div key={i} className={`glass-panel p-12 md:p-16 rounded-[3.5rem] border hover:border-accent-blue/40 transition-all group relative overflow-hidden text-left ${isLight ? 'bg-white border-black/5 shadow-xl' : 'border-white/10'}`}>
                <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-5 transition-opacity scale-150 rotate-12">
                    {secret.icon}
                </div>
                <div className="flex items-start gap-10 relative z-10">
                  <div className={`p-6 rounded-3xl group-hover:bg-accent-blue/10 transition-colors shrink-0 shadow-inner-blue ${isLight ? 'bg-slate-50 border-black/5' : 'bg-white/5'}`}>
                    {secret.icon}
                  </div>
                  <div className="space-y-4">
                    <span className="text-[9px] font-black text-accent-blue/60 uppercase tracking-[0.5em]">{secret.tag}</span>
                    <h3 className={`text-3xl font-display font-black group-hover:text-accent-blue transition-colors uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {secret.title}
                    </h3>
                    <p className={`text-lg leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity font-serif italic ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
                        {secret.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`glass-panel p-16 md:p-32 rounded-[5rem] text-center space-y-12 shadow-blue-bright relative overflow-hidden group ${isLight ? 'bg-white border-black/5 shadow-2xl' : 'border-accent-blue/30 bg-dark-secondary/90'}`}>
             <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="absolute -top-32 -right-32 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><Zap className={`w-[500px] h-[500px] ${isLight ? 'text-slate-900' : 'text-accent-blue'}`} /></div>
             
             <h3 className={`text-4xl md:text-7xl font-display font-black uppercase tracking-tighter max-w-4xl mx-auto leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                "One more thing before you commit to the exam date."
             </h3>
             <p className={`text-xl md:text-2xl font-sans leading-relaxed max-w-3xl mx-auto opacity-70 italic font-serif ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
                We've deconstructed 10,000+ student failures. The anomaly isn't lack of knowledge—it's lack of tactical deconstruction. 
             </p>
             <div className="flex flex-wrap justify-center gap-10 pt-8">
                <button onClick={onOpenDossier} className="btn-blue px-16 py-7 rounded-3xl font-black uppercase tracking-[0.4em] text-xs shadow-blue-bright">Get the Audit Guide</button>
                <button className={`px-16 py-7 border-2 font-black rounded-3xl uppercase tracking-[0.4em] text-xs transition-all hover:border-white/40 ${isLight ? 'bg-black/5 border-black/10 text-slate-900 hover:bg-black/10' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}`}>Free Core Sample</button>
             </div>
        </div>
      </div>
    </section>
  );
};

export default SecretsSection;
