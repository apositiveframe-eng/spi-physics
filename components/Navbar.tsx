import React, { useState, useEffect } from 'react';
import { Menu, Search, X, ShoppingCart, BookOpen, Clock, Sparkles, ChevronRight, Sun, Moon, ClipboardList, GraduationCap } from 'lucide-react';

interface NavbarProps {
    onOpenCourse?: () => void;
    onOpenAI?: () => void;
    onOpenPRD?: () => void;
    onOpenScholarship?: () => void;
    isWaitlist?: boolean;
    theme?: 'dark' | 'light';
    onToggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCourse, onOpenAI, onOpenPRD, onOpenScholarship, isWaitlist, theme, onToggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setIsOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed w-full top-0 z-[100] transition-all duration-1000 ${scrolled ? 'py-4' : 'py-10'}`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${scrolled ? 'max-w-6xl' : 'max-w-7xl'}`}>
        <div className={`glass-panel rounded-[2.5rem] px-8 md:px-12 h-18 md:h-22 flex justify-between items-center transition-all duration-1000 ${scrolled ? 'shadow-blue-bright border-accent-blue/10 bg-black/40' : 'bg-black/10 backdrop-blur-md'}`}>
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group">
            <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-accent-gold/20 rounded-2xl flex items-center justify-center font-display font-black text-accent-gold shadow-gold group-hover:bg-accent-gold/10 transition-all duration-700 group-hover:scale-110">
                  <span className="text-xl md:text-2xl">E</span>
                </div>
                <div className="flex flex-col">
                    <span className={`font-display font-black text-xl md:text-3xl tracking-widest leading-none text-left group-hover:text-accent-gold transition-colors duration-700 ${theme === 'light' ? 'text-text-lightMain' : 'text-white'}`}>EchoMasters</span>
                    <span className={`text-[9px] uppercase tracking-[0.5em] font-sans font-black mt-1.5 text-left opacity-40 ${theme === 'light' ? 'text-text-lightMuted' : 'text-text-muted'}`}>Protocol_Node</span>
                </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-12 items-center">
            <button onClick={onOpenScholarship} className="flex items-center gap-3 text-text-muted hover:text-accent-gold transition-all duration-700 group px-3 py-2">
                <GraduationCap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">SCHOLARSHIP</span>
            </button>
            <button onClick={onOpenAI} className="flex items-center gap-3 text-accent-gold hover:text-accent-blue transition-all duration-700 group px-3 py-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">HARVEY_AI</span>
            </button>
            <button onClick={onOpenPRD} className="flex items-center gap-3 text-accent-blue hover:text-white transition-all duration-700 group px-3 py-2">
                <ClipboardList className="w-4 h-4 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">READINESS_PRD</span>
            </button>
            
            <div className="h-8 w-[1px] bg-white/10" />

            <button 
                onClick={onToggleTheme}
                className={`p-3.5 rounded-2xl border transition-all duration-700 hover:scale-110 active:scale-95 flex items-center justify-center ${theme === 'light' ? 'bg-path8-walnut/5 border-path8-walnut/10 text-path8-walnut' : 'bg-white/5 border-white/10 text-accent-gold shadow-glass'}`}
            >
                {theme === 'light' ? <Moon className="w-5 h-5 animate-fade-in" /> : <Sun className="w-5 h-5 animate-fade-in" />}
            </button>

            <button 
                onClick={onOpenCourse}
                className={`group flex items-center gap-4 px-10 py-4 rounded-[1.8rem] transition-all duration-700 border-2 ${isWaitlist ? 'bg-accent-gold/5 border-accent-gold/20 text-accent-gold hover:bg-accent-gold/20' : 'btn-blue shadow-blue'}`}
            >
                {isWaitlist ? <Clock className="w-5 h-5 text-accent-gold" /> : <BookOpen className="w-5 h-5 text-dark-primary" />}
                <span className={`font-display font-black text-xs uppercase tracking-widest ${isWaitlist ? 'text-white' : 'text-dark-primary'}`}>{isWaitlist ? "Join Waitlist" : "Control Hub"}</span>
            </button>
          </nav>

          {/* Mobile UI Buttons */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={onOpenAI} className="p-4 text-accent-gold bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all"><Sparkles className="w-6 h-6" /></button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-4 hover:text-accent-gold focus:outline-none transition-all active:scale-90"
            >
              {isOpen ? <X className="h-7 w-7 text-accent-gold" /> : <Menu className={`h-7 w-7 ${theme === 'light' ? 'text-text-lightMain' : 'text-white'}`} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-[110] transition-all duration-1000 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute inset-0 backdrop-blur-2xl transition-colors duration-1000 ${theme === 'light' ? 'bg-light-primary/95' : 'bg-dark-primary/95'}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-[90%] max-w-sm border-l p-12 flex flex-col gap-10 transition-transform duration-1000 ease-out shadow-[-50px_0_100px_rgba(0,0,0,0.5)] ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${theme === 'light' ? 'bg-light-tertiary border-black/5' : 'bg-dark-tertiary border-white/5'}`}>
          <div className="flex justify-between items-center mb-8">
             <div className="w-14 h-14 border-2 border-accent-gold/20 rounded-2xl flex items-center justify-center font-display font-bold text-accent-gold">E</div>
             <button onClick={() => setIsOpen(false)} className={`p-3 hover:text-accent-gold transition-colors ${theme === 'light' ? 'text-text-lightMuted' : 'text-text-muted'}`}><X className="w-10 h-10" /></button>
          </div>
          
          <div className="space-y-6">
            <button onClick={() => { onOpenScholarship?.(); setIsOpen(false); }} className="w-full text-left p-8 bg-accent-gold/5 border-2 border-accent-gold/20 rounded-[2.5rem] text-accent-gold flex items-center justify-between group shadow-gold">
              <div className="flex items-center gap-6">
                <GraduationCap className="w-8 h-8" />
                <span className="font-black uppercase tracking-widest text-xs">Scholarship Protocol</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-30" />
            </button>
            <button onClick={() => { onOpenPRD?.(); setIsOpen(false); }} className="w-full text-left p-8 bg-accent-blue/5 border-2 border-accent-blue/20 rounded-[2.5rem] text-accent-blue flex items-center justify-between group shadow-blue">
              <div className="flex items-center gap-6">
                <ClipboardList className="w-8 h-8" />
                <span className="font-black uppercase tracking-widest text-xs">Readiness Dossier</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-30" />
            </button>
            <button onClick={() => { onOpenAI?.(); setIsOpen(false); }} className="w-full text-left p-8 bg-accent-gold/5 border-2 border-accent-gold/20 rounded-[2.5rem] text-accent-gold flex items-center justify-between group shadow-gold">
              <div className="flex items-center gap-6">
                <Sparkles className="w-8 h-8" />
                <span className="font-black uppercase tracking-widest text-xs">HARVEY_AI Mentor</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-30" />
            </button>
            
            <button onClick={onOpenCourse} className={`w-full text-left p-8 border rounded-[2.5rem] flex items-center justify-between group transition-all ${theme === 'light' ? 'bg-white border-black/5 text-text-lightMain' : 'bg-white/5 border-white/5 text-white'}`}>
              <div className="flex items-center gap-6">
                <BookOpen className="w-8 h-8 text-accent-gold" />
                <span className="font-black uppercase tracking-widest text-xs">{isWaitlist ? "Join Waitlist" : "Control Center"}</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-30" />
            </button>
          </div>
          
          <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between opacity-30">
             <div className="text-[8px] font-black uppercase tracking-widest">v4.2 EchoMasters</div>
             <button onClick={onToggleTheme} className="p-3 bg-white/5 rounded-xl border border-white/5">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;