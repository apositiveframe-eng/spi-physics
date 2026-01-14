
import React from 'react';
import { Brain, Zap, Layers, Activity, ChevronRight } from 'lucide-react';

interface FeaturesProps {
  theme?: 'dark' | 'light';
}

const Features: React.FC<FeaturesProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  
  const benefits = [
    {
      icon: <Zap className="w-10 h-10 md:w-12 md:h-12 text-path8-gold" />,
      title: "Pulse Prep Mode",
      description: "High-speed drills covering all 110 ARDMS question archetypes with instant vector analysis.",
      tag: "INSTRUMENTATION"
    },
    {
      icon: <Brain className="w-10 h-10 md:w-12 md:h-12 text-path8-lime" />,
      title: "Recall Vector",
      description: "250+ active recall flashcards mapped to the latest SPI content outline for neural persistence.",
      tag: "DEFINITIONS"
    },
    {
      icon: <Layers className="w-10 h-10 md:w-12 md:h-12 text-path8-teal" />,
      title: "Study Protocol",
      description: "A comprehensive digital monograph covering every domain from Clinical Safety to Doppler.",
      tag: "BLUEPRINT"
    },
    {
      icon: <Activity className="w-10 h-10 md:w-12 md:h-12 text-path8-silver" />,
      title: "Diagnostic Simulation",
      description: "Interactive lab environments to visualize the physics behind complex sonographic images.",
      tag: "SIMULATION"
    }
  ];

  return (
    <div id="features" className={`relative py-24 md:py-48 px-6 overflow-hidden ${isLight ? 'bg-light-primary' : 'bg-transparent'}`}>
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-path8-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-path8-teal/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24 md:mb-40 space-y-10">
            <div className="flex items-center justify-center gap-6">
                <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-path8-gold/30" />
                <span className="text-[11px] font-black text-path8-gold uppercase tracking-[0.6em] glow-text-gold">System Capabilities</span>
                <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-path8-gold/30" />
            </div>
          <h2 className={`text-5xl md:text-8xl lg:text-9xl font-display font-black mb-10 uppercase tracking-tighter leading-[0.85] luxury-text ${isLight ? '!filter-none' : ''}`}>
            Precision <br/> Prep Tools
          </h2>
          <p className={`text-xl md:text-2xl font-light leading-relaxed italic opacity-80 font-serif max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
            "We have engineered a study protocol that replicates the exact cognitive demands of the SPI examination."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className={`glass-panel p-12 md:p-14 transition-all duration-1000 hover:-translate-y-6 hover:border-path8-gold/40 group rounded-[4rem] relative overflow-hidden tactical-border ${isLight ? 'bg-white shadow-xl' : 'glass-texture'}`}>
              <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-5 transition-opacity duration-1000 transform rotate-12 scale-150">
                {benefit.icon}
              </div>
              
              <div className="flex flex-col h-full text-left">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center mb-12 border-2 transition-all duration-700 group-hover:scale-110 ${isLight ? 'bg-slate-50 border-black/5 shadow-sm' : 'bg-white/5 border-white/10 shadow-inner-gold'}`}>
                    {benefit.icon}
                </div>
                
                <div className="space-y-6 mb-10 flex-1">
                    <span className="text-[9px] font-black text-path8-gold/60 uppercase tracking-[0.4em]">{benefit.tag}</span>
                    <h3 className={`text-2xl md:text-3xl font-display font-black group-hover:text-path8-gold transition-colors tracking-tight uppercase leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {benefit.title}
                    </h3>
                    <p className={`text-sm md:text-base leading-relaxed font-light opacity-70 group-hover:opacity-100 transition-opacity ${isLight ? 'text-slate-500' : 'text-text-muted'}`}>
                        {benefit.description}
                    </p>
                </div>
                
                <div className={`flex items-center gap-3 group-hover:text-gold-main transition-colors text-[10px] font-black uppercase tracking-widest pt-6 border-t ${isLight ? 'border-black/5 text-slate-300' : 'border-white/5 text-gold-main/30'}`}>
                    Protocol Details <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
