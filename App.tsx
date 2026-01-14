import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ExamSections from './components/ExamSections';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Guarantee from './components/Guarantee';
import CourseViewer from './components/CourseViewer';
import LegalPages from './components/LegalPages';
import UnderwaterBackground from './components/UnderwaterBackground';
import LightLiveBackground from './components/LightLiveBackground';
import PulseChat from './components/PulseChat';
import Multimedia from './components/Multimedia';
import FAQ from './components/FAQ';
import Bonuses from './components/Bonuses';
import SecretsSection from './components/SecretsSection';
import AuditDossier from './components/AuditDossier';
import ReadinessDossier from './components/ReadinessDossier';
import ScholarshipProtocol from './components/ScholarshipProtocol';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [showCourse, setShowCourse] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isPRDOpen, setIsPRDOpen] = useState(false);
  const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isAdminBypass, setIsAdminBypass] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('em_admin_bypass') === 'true';
    }
    return false;
  });
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spi-theme');
      return (saved as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  const launchDate = useMemo(() => new Date('2026-01-01T00:00:00'), []);
  const [isWaitlistActive, setIsWaitlistActive] = useState(() => new Date() < launchDate);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('spi-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const playCorrectSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const tones = [523.25, 659.25, 783.99, 1046.5];
    tones.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + (i * 0.05));
        g.gain.setValueAtTime(0, t + (i * 0.05));
        g.gain.linearRampToValueAtTime(0.08, t + (i * 0.05) + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + (i * 0.05) + 0.6);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t + (i * 0.05));
        osc.stop(t + (i * 0.05) + 0.6);
    });
  };

  const playIncorrectSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const g = ctx.createGain();
    const modGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.linearRampToValueAtTime(45, t + 0.4);
    mod.type = 'sine';
    mod.frequency.setValueAtTime(25, t);
    modGain.gain.setValueAtTime(40, t);
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(g);
    g.connect(ctx.destination);
    mod.start(t);
    osc.start(t);
    mod.stop(t + 0.4);
    osc.stop(t + 0.4);
  };

  const handleLogout = () => {
      localStorage.removeItem('em_admin_bypass');
      setIsAdminBypass(false);
      setShowCourse(false);
  };

  const handleAuthSuccess = () => {
    const bypassActive = localStorage.getItem('em_admin_bypass') === 'true';
    setIsAdminBypass(bypassActive);
    setShowCourse(true);
  };

  const handleOpenCourse = (force: boolean = false) => {
    if (isWaitlistActive && !force && !isAdminBypass) {
        document.getElementById('waitlist-anchor')?.scrollIntoView({ behavior: 'smooth' });
    } else {
        setShowCourse(true);
    }
  };

  if (showCourse && !session && !isAdminBypass) {
    return <Auth onSuccess={handleAuthSuccess} />;
  }

  if (showCourse && (session || isAdminBypass)) {
      return (
        <div className={`relative min-h-screen transition-all duration-1000 ${theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'} overflow-hidden`}>
            {theme === 'dark' ? <UnderwaterBackground /> : <LightLiveBackground />}
            <CourseViewer 
                onExit={handleLogout} 
                onPlayCorrect={playCorrectSound}
                onPlayIncorrect={playIncorrectSound}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
            <PulseChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} theme={theme} />
        </div>
      );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${theme === 'dark' ? 'bg-dark-primary text-text-main' : 'bg-light-primary text-text-lightMain'} selection:bg-gold-main/30 selection:text-gold-accent animate-fade-in relative overflow-x-hidden text-left`}>
      {theme === 'dark' ? <UnderwaterBackground /> : <LightLiveBackground />}
      
      <div className="relative z-10">
        <Navbar 
          onOpenCourse={() => handleOpenCourse(true)} 
          onOpenAI={() => setIsAIChatOpen(true)} 
          onOpenPRD={() => setIsPRDOpen(true)}
          onOpenScholarship={() => setIsScholarshipOpen(true)}
          isWaitlist={isWaitlistActive} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <Hero onOpenCourse={() => handleOpenCourse(true)} isWaitlist={isWaitlistActive} launchDate={launchDate} theme={theme} />
        <SecretsSection theme={theme} onOpenDossier={() => setIsDossierOpen(true)} />
        <Features theme={theme} />
        <Multimedia theme={theme} />
        <ExamSections theme={theme} />
        <Testimonials theme={theme} />
        <Bonuses theme={theme} />
        <FAQ theme={theme} />
        <Guarantee theme={theme} />
        <Pricing theme={theme} isWaitlist={isWaitlistActive} />
        <Footer theme={theme} onOpenLegal={(type) => setLegalPage(type)} onOpenScholarship={() => setIsScholarshipOpen(true)} />
      </div>

      <PulseChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} theme={theme} />
      <AuditDossier isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} />
      <ReadinessDossier isOpen={isPRDOpen} onClose={() => setIsPRDOpen(false)} />
      <ScholarshipProtocol isOpen={isScholarshipOpen} onClose={() => setIsScholarshipOpen(false)} theme={theme} />

      {legalPage && (
        <LegalPages type={legalPage} onClose={() => setLegalPage(null)} />
      )}
    </div>
  );
};

export default App;