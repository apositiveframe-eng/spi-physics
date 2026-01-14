import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Guarantee: React.FC = () => {
  return (
    <div id="guarantee" className="py-20 bg-dark-primary border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center p-6 bg-gold-main/10 rounded-full mb-8 border border-gold-main/20 shadow-gold backdrop-blur-sm">
            <ShieldCheck className="w-12 h-12 text-gold-main" />
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-text-main mb-6 uppercase tracking-widest">
          100% Persistence Protocol
        </h2>
        <p className="text-xl md:text-2xl text-text-muted mb-10 leading-relaxed font-light font-sans max-w-2xl mx-auto">
          Pass your boards or receive an automatic 6-month membership extension. We stay synced until you certify.
        </p>
      </div>
    </div>
  );
};

export default Guarantee;