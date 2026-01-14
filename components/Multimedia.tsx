import React from 'react';
import { Music, Headphones, Radio } from 'lucide-react';

const Multimedia: React.FC = () => {
  return (
    <div id="lectures" className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-main/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gold-main/10 border border-gold-main/20 text-gold-main text-[10px] font-black uppercase tracking-[0.4em]">
            <Radio className="w-3.5 h-3.5" />
            Multimedia Archive
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter luxury-text">
            Acoustic Lectures <br/> & Sonography Songs
          </h2>
          <p className="text-text-muted font-light font-sans max-w-2xl mx-auto text-lg md:text-xl italic opacity-80 leading-relaxed">
            "We encode data through melody. Tune into the frequency of success."
          </p>
        </div>

        <div className="glass-panel p-2 rounded-[3rem] border-gold-main/20 shadow-gold group transition-all duration-700 hover:border-gold-main/40">
          <div className="relative overflow-hidden rounded-[2.8rem] bg-black/40">
            <iframe 
              title="EchoMasters: Sonography Songs and Lectures" 
              allowTransparency={true}
              height="315" 
              width="100%" 
              style={{ border: 'none', minWidth: 'min(100%, 430px)', height: '315px' }} 
              scrolling="no" 
              data-name="pb-iframe-player" 
              src="https://www.podbean.com/player-v2/?i=7vbsd-10e390b-pbblog-playlist&share=1&download=1&fonts=Impact&skin=1b1b1b&font-color=ffffff&rtl=1&logo_link=episode_page&btn-skin=60a0c8&size=315" 
              loading="lazy" 
              allowFullScreen={true}
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="p-3 bg-gold-main/10 rounded-xl text-gold-main">
                    <Headphones className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Neural Integration</h4>
                    <p className="text-xs text-text-muted leading-relaxed">High-fidelity audio lectures designed for subconscious recall during the exam.</p>
                </div>
            </div>
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="p-3 bg-gold-main/10 rounded-xl text-gold-main">
                    <Music className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Formula Melodies</h4>
                    <p className="text-xs text-text-muted leading-relaxed">Mnemonic-heavy tracks that help you memorize complex physics equations effortlessly.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Multimedia;