import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Mail, ShieldCheck, Sparkles, BookOpen, MonitorPlay, Activity, ChevronRight } from 'lucide-react';
import UniversalHost from './UniversalHost';

interface HeroProps {
    onOpenCourse?: (force?: boolean) => void;
    isWaitlist?: boolean;
    launchDate?: Date;
    theme?: 'dark' | 'light';
}

const Hero: React.FC<HeroProps> = ({ onOpenCourse, isWaitlist, launchDate, theme = 'dark' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ 
            x: (e.clientX / window.innerWidth - 0.5) * 8, 
            y: (e.clientY / window.innerHeight - 0.5) * 8 
        });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!launchDate || !isWaitlist) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;
      if (distance < 0) return;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(timer);
  }, [launchDate, isWaitlist]);

  return (
    <div id="home" className="relative pt-32 pb-24 md:pt-56 md:pb-40 overflow-hidden min-h-screen flex items-center">
      {/* Dynamic Background Fog */}
      <div className={`absolute top-0 left-1/4 w-[1200px] h-[1200px] blur-[250px] rounded-full pointer-events-none animate-pulse-glow ${theme === 'light' ? 'bg-blue-200/20' : 'bg-path8-teal/5'}`}></div>
      <div className={`absolute bottom-0 right-1/4 w-[800px] h-[800px] blur-[200px] rounded-full pointer-events-none ${theme === 'light' ? 'bg-amber-100/30' : 'bg-path8-gold/5'}`}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 text-center lg:text-left space-y-10">
            <div className="animate-fade-in">
              <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-8 backdrop-blur-xl transition-all duration-700 shadow-[0_0_30px_rgba(0,229,255,0.1)] ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue'}`}>
                <Activity className="w-4 h-4 mr-3 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  {isWaitlist ? `Protocol Activation Pending: 2026` : `Active Monitoring Link Established`}
                </span>
              </div>
              
              <h1 className={`text-6xl sm:text-7xl md:text-9xl font-display font-black tracking-tighter leading-[0.75] mb-8 uppercase select-none ${theme === 'light' ? 'text-slate-900' : 'text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]'}`}>
                SPI CORE <br/>
                <span className="luxury-text block">MATRIX</span>
              </h1>
              
              <p className={`text-xl md:text-3xl mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light font-sans opacity-90 border-l-4 pl-10 italic ${theme === 'light' ? 'text-slate-600 border-blue-400' : 'text-text-muted border-accent-blue/30'}`}>
                Collaborate with <span className={theme === 'light' ? 'text-slate-900 font-black' : 'text-white font-black'}>Harvey AI</span> to master the ARDMS® SPI Physics blueprint.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 justify-center lg:justify-start items-center">
              <button 
                onClick={() => onOpenCourse?.()} 
                className="btn-gold group relative px-16 py-8 rounded-[2rem] font-black text-2xl uppercase tracking-[0.4em] shadow-gold-bright transition-all tactical-border"
              >
                <span className="flex items-center gap-6">
                    Enter Lab <BookOpen className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 mt-20 lg:mt-0 relative flex items-center justify-center">
            <div 
                className="relative perspective-3000 transition-transform duration-1000 ease-out flex flex-col items-center"
                style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
            >
                <div className={`absolute inset-0 blur-[200px] rounded-full animate-pulse-glow ${theme === 'light' ? 'bg-blue-400/30' : 'bg-accent-blue/20'}`} />
                
                <div className="relative group cursor-pointer">
                    <UniversalHost 
                        status="idle" 
                        theme={theme} 
                        variant="featured"
                        className={theme === 'light' ? 'drop-shadow-[0_20px_60px_rgba(0,0,0,0.1)]' : 'drop-shadow-[0_0_150px_rgba(0,229,255,0.4)]'} 
                    />
                    
                    <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 backdrop-blur-3xl border px-10 py-5 rounded-[2.5rem] whitespace-nowrap transition-all duration-700 shadow-2xl ${theme === 'light' ? 'bg-white/95 border-blue-100' : 'bg-midnight/90 border-accent-blue/30 shadow-blue-bright'}`}>
                        <div className="flex items-center gap-4">
                           <div className="w-3 h-3 rounded-full bg-accent-blue animate-pulse" />
                           <span className={`text-[12px] font-black uppercase tracking-[0.7em] ${theme === 'light' ? 'text-blue-600' : 'text-accent-blue'}`}>Harvey Prime : Active_Link</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;