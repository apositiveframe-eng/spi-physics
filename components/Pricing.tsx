
import React from 'react';
import { Check, Zap, ShieldCheck, Infinity, Calendar, Clock } from 'lucide-react';

interface PricingProps {
    isWaitlist?: boolean;
    theme?: 'dark' | 'light';
}

const Pricing: React.FC<PricingProps> = ({ isWaitlist, theme = 'dark' }) => {
  const isLight = theme === 'light';
  
  const tiers = [
    {
      id: 'monthly',
      name: "1 Month Access",
      tagline: "Focused Sprint Protocol",
      price: "26",
      period: "MO",
      icon: <Clock className="w-10 h-10 text-path8-teal" />,
      features: [
        "Full Clinical Simulation Suite",
        "Harvey AI Mentorship",
        "All 11 Study Modules",
        "Digital Flashcard Access",
        "Standard Neural Progress Tracking"
      ],
      buttonText: isWaitlist ? "Reserve Sprint" : "Unlock Monthly",
      isFeatured: false
    },
    {
      id: 'yearly',
      name: "Annual Protocol",
      tagline: "Strategic Mastery Program",
      price: "143.00",
      period: "YR",
      icon: <Calendar className="w-10 h-10 text-accent-gold" />,
      features: [
        "Everything in Monthly",
        "Board Exam Probability Audit",
        "Priority Support Matrix",
        "Bonus Mindset Protocols",
        "Custom Study Path AI"
      ],
      buttonText: isWaitlist ? "Reserve Annual" : "Unlock Yearly",
      isFeatured: true
    },
    {
      id: 'lifetime',
      name: "Lifetime Sync",
      tagline: "Total Diagnostic Mastery",
      price: "280",
      period: "LIFE",
      icon: <Infinity className={`w-10 h-10 ${isLight ? 'text-slate-900' : 'text-white'}`} />,
      features: [
        "Everything in Yearly",
        "Zero Renewal Fees Ever",
        "All Future ARDMS Protocols",
        "Permanent Neural Vault Access",
        "Lifetime Strategy Consultation"
      ],
      buttonText: isWaitlist ? "Reserve Lifetime" : "Unlock Forever",
      isFeatured: false
    }
  ];

  return (
    <div id="pricing" className={`py-24 md:py-48 relative overflow-hidden border-t transition-colors duration-1000 ${isLight ? 'bg-light-primary border-black/5' : 'bg-dark-primary border-white/5'}`}>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none ${isLight ? 'bg-blue-100/30' : 'bg-accent-blue/5'}`}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 md:mb-32 space-y-6">
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-accent-gold text-[10px] font-black uppercase tracking-[0.5em] shadow-gold">
            <Zap className="w-4 h-4" /> Pricing Vectors
          </div>
          <h2 className={`text-5xl md:text-9xl font-display font-black uppercase tracking-tighter luxury-text leading-none ${isLight ? '!filter-none' : ''}`}>
              Choose Your Protocol
          </h2>
          <p className={`text-xl md:text-2xl font-light font-sans italic opacity-70 max-w-3xl mx-auto ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
              Select the synchronization window that aligns with your diagnostic objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {tiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative group h-full ${tier.isFeatured ? 'md:-translate-y-8' : ''}`}
            >
              {tier.isFeatured && (
                <div className="absolute -inset-1 bg-gradient-to-b from-accent-gold via-accent-blue to-transparent rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              )}
              
              <div className={`relative h-full glass-panel p-1.5 rounded-[3rem] transition-all duration-700 overflow-hidden flex flex-col ${tier.isFeatured ? (isLight ? 'bg-white border-accent-gold shadow-2xl' : 'border-accent-gold/40 bg-dark-secondary/80') : (isLight ? 'bg-white border-black/5 shadow-xl' : 'border-white/5 bg-dark-secondary/60')}`}>
                
                {tier.isFeatured && (
                  <div className="absolute top-0 right-0 bg-accent-gold text-dark-primary text-[10px] font-black px-6 py-3 uppercase tracking-[0.4em] rounded-bl-[1.5rem] shadow-gold z-10">
                      MOST POPULAR
                  </div>
                )}
                
                <div className="p-10 md:p-14 rounded-[2.8rem] flex flex-col h-full relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                      {tier.icon}
                    </div>
                    
                    <div className="mb-10 relative z-10 text-left">
                        <h3 className={`text-3xl font-display font-black mb-2 uppercase tracking-tight ${tier.isFeatured || !isLight ? 'text-slate-900 md:text-white' : 'text-slate-400'}`}>{tier.name}</h3>
                        <p className="text-xs text-accent-gold font-serif italic tracking-wide">{tier.tagline}</p>
                    </div>
                    
                    <div className="flex items-baseline gap-3 mb-10 relative z-10">
                        <span className={`text-6xl md:text-7xl font-display font-black ${tier.isFeatured || !isLight ? 'text-slate-900 md:text-white' : 'text-slate-700'}`}>
                          <span className="text-3xl align-top mr-1">$</span>{tier.price}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">{tier.period}</span>
                          <span className="text-text-muted/40 text-[8px] font-black uppercase tracking-widest">Protocol</span>
                        </div>
                    </div>
                    
                    <ul className="space-y-6 mb-12 flex-1 relative z-10">
                        {tier.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-4 text-sm md:text-base group/item">
                            <Check className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${tier.isFeatured ? 'text-accent-gold' : 'text-path8-teal'}`} />
                            <span className={`opacity-80 group-hover/item:opacity-100 transition-opacity ${isLight ? 'text-slate-700' : 'text-text-main'}`}>{feature}</span>
                          </li>
                        ))}
                    </ul>
                    
                    <button className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] transition-all transform hover:-translate-y-1 active:scale-95 relative z-10 ${tier.isFeatured ? 'bg-accent-gold text-dark-primary shadow-gold-bright hover:shadow-gold' : isLight ? 'bg-slate-900 text-white shadow-xl' : 'bg-white/5 text-white border-2 border-white/10 hover:bg-white/10 shadow-glass'}`}>
                        {tier.buttonText}
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center max-w-3xl mx-auto space-y-10">
            <div className={`glass-panel p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 text-left shadow-inner relative overflow-hidden ${isLight ? 'bg-white border-black/5 shadow-2xl' : 'border-accent-gold/20 bg-accent-gold/5'}`}>
                <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><ShieldCheck className={`w-48 h-48 ${isLight ? 'text-slate-900' : 'text-accent-gold'}`} /></div>
                <div className="p-5 bg-accent-gold/20 rounded-3xl shrink-0 shadow-gold">
                   <ShieldCheck className="w-12 h-12 text-accent-gold" />
                </div>
                <div className="space-y-2 relative z-10 text-left">
                   <h4 className={`text-xl font-display font-black uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>Persistence Protocol Guarantee</h4>
                   <p className={`text-base leading-relaxed italic font-serif opacity-80 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>
                      "Each synchronization vector includes our 100% Persistence Protocol. If you do not achieve board certification after completing the monograph, we grant an automatic 6-month extension to your membership. Your mission continues until sync is achieved."
                   </p>
                </div>
            </div>
            
            <div className="space-y-4 opacity-40">
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.6em]">Secure Payment Node Activation | 256-bit AES Encryption</p>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em]">ARDMS® is a registered trademark of Inteleos™. EchoMasters is an independent diagnostic medium.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
