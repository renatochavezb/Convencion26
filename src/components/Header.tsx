import { useState, useEffect } from 'react';
import { Menu, X, Ticket, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onRegisterClick: () => void;
  hasTicket: boolean;
  onViewTicket: () => void;
}

export default function Header({ onRegisterClick, hasTicket, onViewTicket }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Smooth scroll helper
  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
      scrolled 
        ? 'bg-deep-blue/95 backdrop-blur-md border-b border-surface-card-high/80 shadow-md' 
        : 'bg-deep-blue/80 backdrop-blur-xs border-b border-surface-card/20'
    }`}>
      <div className="flex justify-between items-center w-full px-5 md:px-[80px] max-w-[1280px] mx-auto h-full">
        
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-headline font-black tracking-tighter text-white cursor-pointer select-none"
        >
          COMEV <span className="text-secondary-orange font-black italic">2026</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-mono text-xs">
          <button 
            onClick={() => handleScrollTo('speakers')}
            className="text-on-surface-variant hover:text-white leading-none tracking-widest uppercase transition-colors pointer-events-auto cursor-pointer"
          >
            Conferencistas
          </button>
          
          <button 
            onClick={() => handleScrollTo('schedule')}
            className="text-on-surface-variant hover:text-white leading-none tracking-widest uppercase transition-colors pointer-events-auto cursor-pointer"
          >
            Programa
          </button>
          
          <button 
            onClick={() => handleScrollTo('executive-highlight')}
            className="text-on-surface-variant hover:text-white leading-none tracking-widest uppercase transition-colors pointer-events-auto cursor-pointer"
          >
            Galardonado
          </button>

          <button 
            onClick={() => handleScrollTo('registration')}
            className="text-on-surface-variant hover:text-white leading-none tracking-widest uppercase transition-colors pointer-events-auto cursor-pointer"
          >
            Registro
          </button>

          <button 
            onClick={() => handleScrollTo('location')}
            className="text-on-surface-variant hover:text-white leading-none tracking-widest uppercase transition-colors pointer-events-auto cursor-pointer"
          >
            Sede
          </button>

          {hasTicket ? (
            <button
              onClick={onViewTicket}
              className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-emerald-500 hover:text-deep-blue transition-colors"
            >
              <Ticket className="w-4 h-4" /> Ver Mi Carnet
            </button>
          ) : (
            <button
              onClick={onRegisterClick}
              className="bg-secondary-orange text-deep-blue px-6 py-2 font-headline text-[13px] font-bold uppercase tracking-wider active:scale-95 duration-100 transition-all hover:bg-white hover:text-deep-blue rounded-none shadow-md cursor-pointer"
            >
              Register Now
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-secondary-orange transition-colors p-1"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[#001021] border-b border-surface-variant py-6 px-5 flex flex-col gap-5 md:hidden shadow-2xl animate-fadeIn">
          <button 
            onClick={() => handleScrollTo('speakers')}
            className="text-left py-2 font-mono text-xs font-bold leading-none tracking-widest uppercase text-on-surface-variant hover:text-white transition-colors"
          >
            Conferencistas
          </button>
          
          <button 
            onClick={() => handleScrollTo('schedule')}
            className="text-left py-2 font-mono text-xs font-bold leading-none tracking-widest uppercase text-on-surface-variant hover:text-white transition-colors"
          >
            Programa
          </button>

          <button 
            onClick={() => handleScrollTo('executive-highlight')}
            className="text-left py-2 font-mono text-xs font-bold leading-none tracking-widest uppercase text-on-surface-variant hover:text-white transition-colors"
          >
            Galardonado
          </button>

          <button 
            onClick={() => handleScrollTo('registration')}
            className="text-left py-2 font-mono text-xs font-bold leading-none tracking-widest uppercase text-on-surface-variant hover:text-white transition-colors"
          >
            Registro
          </button>

          <button 
            onClick={() => handleScrollTo('location')}
            className="text-left py-2 font-mono text-xs font-bold leading-none tracking-widest uppercase text-on-surface-variant hover:text-white transition-colors"
          >
            Sede
          </button>

          {hasTicket ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onViewTicket();
              }}
              className="w-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 py-3 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5"
            >
              <Ticket className="w-4.5 h-4.5" /> Ver Mi Carnet
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRegisterClick();
              }}
              className="w-full bg-secondary-orange text-deep-blue py-3 font-mono text-xs font-bold uppercase tracking-widest text-center"
            >
              Register Now
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
