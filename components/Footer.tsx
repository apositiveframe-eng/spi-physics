import React from 'react';

interface FooterProps {
  onOpenLegal?: (type: 'terms' | 'privacy') => void;
  onOpenScholarship?: () => void;
  theme?: 'dark' | 'light';
}

const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenScholarship, theme = 'dark' }) => {
  const isLight = theme === 'light';
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLegalClick = (e: React.MouseEvent, type: 'terms' | 'privacy') => {
    e.preventDefault();
    onOpenLegal?.(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScholarshipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenScholarship?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`transition-colors duration-1000 py-16 border-t ${isLight ? 'bg-light-primary text-slate-500 border-black/5' : 'bg-dark-primary text-text-muted border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">
            <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                     <div className={`w-8 h-8 rounded border flex items-center justify-center font-display font-bold text-gold-main ${isLight ? 'bg-slate-50 border-black/5' : 'bg-gold-main/10 border-gold-main/20'}`}>E</div>
                     <h3 className={`font-display font-bold text-lg uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-text-main'}`}>EchoMasters</h3>
                </div>
            </div>
            <div>
                <h4 className={`font-serif font-semibold mb-6 text-xs uppercase tracking-widest opacity-50 ${isLight ? 'text-slate-900' : 'text-text-main'}`}>Guides</h4>
                <ul className="space-y-3 text-sm font-sans">
                    <li><a href="#study-guides" onClick={(e) => scrollToSection(e, 'study-guides')} className="hover:text-gold-main transition-colors">SPI Physics</a></li>
                    <li><a href="#" className="hover:text-gold-main transition-colors">ARDMS General</a></li>
                </ul>
            </div>
            <div>
                <h4 className={`font-serif font-semibold mb-6 text-xs uppercase tracking-widest opacity-50 ${isLight ? 'text-slate-900' : 'text-text-main'}`}>Company</h4>
                <ul className="space-y-3 text-sm font-sans">
                    <li><a href="#" onClick={handleScholarshipClick} className="hover:text-gold-main transition-colors font-bold text-accent-gold">Scholarships</a></li>
                    <li><a href="#" className="hover:text-gold-main transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-gold-main transition-colors">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 className={`font-serif font-semibold mb-6 text-xs uppercase tracking-widest opacity-50 ${isLight ? 'text-slate-900' : 'text-text-main'}`}>Legal</h4>
                <ul className="space-y-3 text-sm font-sans">
                    <li><a href="#" onClick={(e) => handleLegalClick(e, 'privacy')} className="hover:text-gold-main transition-colors">Privacy</a></li>
                    <li><a href="#" onClick={(e) => handleLegalClick(e, 'terms')} className="hover:text-gold-main transition-colors">Terms</a></li>
                </ul>
            </div>
        </div>
        <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-sans uppercase tracking-widest font-black ${isLight ? 'border-black/5 text-slate-300' : 'border-white/5 text-text-muted/40'}`}>
            <p>&copy; {new Date().getFullYear()} EchoMasters Media LLC.</p>
            <div className="mt-4 md:mt-0">
                <span>Designed for Precision</span>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;