
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Target, Sparkles } from 'lucide-react';

interface FAQProps {
  theme?: 'dark' | 'light';
}

const FAQ: React.FC<FAQProps> = ({ theme = 'dark' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isLight = theme === 'light';

  const faqs = [
    {
      q: "What is the passing score for the ARDMS SPI exam?",
      a: "A passing score is 555 on a scale ranging from 300 to 700. This is a scaled score, meaning it is not a direct percentage but reflects the relative difficulty of the questions correctly answered."
    },
    {
      q: "How many questions are on the SPI exam?",
      a: "There are approximately 110 multiple-choice questions. You are given 2 hours (120 minutes) to complete the examination."
    },
    {
      q: "What is the prerequisite for taking the SPI?",
      a: "The SPI exam can be taken by students or graduates of ultrasound programs. You must provide documentation of successful completion of a general, medical, or sonographic physics course."
    },
    {
      q: "When can I retake the SPI if I fail?",
      a: "There is a mandatory 60-day waiting period between examination attempts. EchoMasters covers you with a full guarantee for one year, providing unlimited access until you pass."
    }
  ];

  return (
    <div id="faq" className={`py-24 relative transition-colors duration-1000 ${isLight ? 'bg-light-primary' : 'bg-dark-primary/60'}`}>
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-left">
        <div className="text-center mb-16 text-left">
          <div className="inline-flex items-center gap-3 mb-6 bg-gold-main/5 border border-gold-main/20 px-5 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-gold-main" />
            <span className="text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">Protocol Information</span>
          </div>
          <h2 className={`text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Registry Intelligence</h2>
          <p className={`text-lg font-light font-serif italic opacity-60 ${isLight ? 'text-slate-600' : 'text-text-muted'}`}>"The more you know about the protocol, the less you fear the interface."</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`glass-panel overflow-hidden transition-all duration-500 rounded-3xl border ${isLight ? 'bg-white border-black/5 shadow-md hover:border-gold-main/20' : 'border-white/5 hover:border-gold-main/20'}`}>
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-8 text-left group"
              >
                <span className={`text-lg md:text-xl font-display font-bold uppercase tracking-tight transition-colors ${openIndex === idx ? 'text-gold-main' : isLight ? 'text-slate-900 group-hover:text-gold-main' : 'text-white group-hover:text-gold-main'}`}>
                  {faq.q}
                </span>
                <div className={`p-2 rounded-xl transition-all duration-500 ${openIndex === idx ? 'bg-gold-main text-dark-primary rotate-180 shadow-gold' : isLight ? 'bg-black/5 text-slate-400' : 'bg-white/5 text-text-muted'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              <div className={`transition-all duration-700 ease-in-out ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`p-8 pt-0 font-sans leading-relaxed text-base md:text-lg border-t mt-2 ${isLight ? 'text-slate-600 border-black/5 bg-slate-50' : 'text-text-muted border-white/5 bg-black/20'}`}>
                  <div className="flex gap-4 items-start py-6">
                    <Target className="w-5 h-5 text-gold-main shrink-0 mt-1" />
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`mt-16 p-8 border rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 text-center md:text-left ${isLight ? 'bg-white border-black/5 shadow-xl' : 'bg-gold-main/5 border-gold-main/20'}`}>
           <div className={`p-5 rounded-3xl shrink-0 ${isLight ? 'bg-slate-50 border border-black/5' : 'bg-gold-main/10'}`}>
              <HelpCircle className="w-10 h-10 text-gold-main" />
           </div>
           <div className="flex-1">
              <h4 className={`text-xl font-display font-black uppercase tracking-widest mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Still recalibrating?</h4>
              <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-text-muted'}`}>Harvey is available 24/7 for deeper acoustic inquiries. Open the HARVEY terminal to begin a direct neural link.</p>
           </div>
           <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="btn-gold px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap shadow-gold">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
