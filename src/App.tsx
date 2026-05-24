import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SpeakerHighlight from './components/SpeakerHighlight';
import RegistrationTickets from './components/RegistrationTickets';
import RegistrationModal from './components/RegistrationModal';
import TicketBadge from './components/TicketBadge';
import ScheduleSection from './components/ScheduleSection';
import ExecutiveHighlight from './components/ExecutiveHighlight';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import { RegistrationDetails } from './types';
import { Star, ShieldAlert, Award } from 'lucide-react';

export default function App() {
  const [selectedModality, setSelectedModality] = useState<'individual' | 'pareja' | null>(null);
  const [registration, setRegistration] = useState<RegistrationDetails | null>(null);

  // Load registration from localStorage if present
  useEffect(() => {
    try {
      const cached = localStorage.getItem('comev_badge_2026');
      if (cached) {
        setRegistration(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Failed to load credentials cache', e);
    }
  }, []);

  // Intersection Observer for scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const handleRegistrationSuccess = (data: RegistrationDetails) => {
    setRegistration(data);
    setSelectedModality(null);
    try {
      localStorage.setItem('comev_badge_2026', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to cache credentials', e);
    }

    // Scroll smoothly to registration block to focus on the newly produced ticket
    setTimeout(() => {
      const view = document.getElementById('registration-pass');
      if (view) {
        view.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleClearRegistration = () => {
    if (confirm('¿Estás seguro de que deseas eliminar tu carnet registrado en este dispositivo? Deberás registrarte nuevamente.')) {
      setRegistration(null);
      localStorage.removeItem('comev_badge_2026');
    }
  };

  const handleRegisterCta = () => {
    const section = document.getElementById('registration');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewTicketScroll = () => {
    const section = document.getElementById('registration-pass');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-deep-blue text-on-surface font-sans min-h-screen selection:bg-secondary-orange selection:text-deep-blue">
      
      {/* Dynamic Header */}
      <Header 
        onRegisterClick={handleRegisterCta} 
        hasTicket={!!registration}
        onViewTicket={handleViewTicketScroll}
      />

      {/* Hero module */}
      <Hero onCtaclick={handleRegisterCta} />

      {/* Featured Speakers Highlight */}
      <div id="speakers" className="scroll-mt-28 reveal-on-scroll">
        <SpeakerHighlight />
      </div>

      {/* Infinite Scrolling Ribbon */}
      <div className="w-full bg-[#fe9800] py-4 overflow-hidden border-y border-black/10 select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-[48px] px-6">
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              CASOS REALES <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              HERRAMIENTAS CONCRETAS <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              EJECUTIVO DISTINGUIDO <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              TECNOLOGÍA Y NEGOCIOS <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              EJECUTIVO DISTINGUIDO NACIONAL <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              CASOS REALES <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              HERRAMIENTAS CONCRETAS <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              EJECUTIVO DISTINGUIDO <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              TECNOLOGÍA Y NEGOCIOS <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              EJECUTIVO DISTINGUIDO NACIONAL <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              CASOS REALES <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              HERRAMIENTAS CONCRETAS <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              EJECUTIVO DISTINGUIDO <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              TECNOLOGÍA Y NEGOCIOS <span className="font-headline text-[15px] leading-none">★</span>
            </span>
            <span className="font-mono text-xs font-bold text-deep-blue tracking-[0.15em] flex items-center gap-1.5 shrink-0">
              EJECUTIVO DISTINGUIDO NACIONAL <span className="font-headline text-[15px] leading-none">★</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filterable Schedule / Agenda */}
      <div id="schedule" className="scroll-mt-28 reveal-on-scroll">
        <ScheduleSection />
      </div>

      {/* Ejecutivo Distinguido Nacional Highlight */}
      <div id="executive-highlight" className="scroll-mt-28 reveal-on-scroll">
        <ExecutiveHighlight />
      </div>

      {/* Ticket Registrations Section */}
      <div id="registration" className="scroll-mt-28 reveal-on-scroll">
        {registration ? (
          <div id="registration-pass" className="bg-gradient-to-b from-deep-blue via-[#041221] to-deep-blue py-12 border-t border-surface-card">
            <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
              
              <div className="text-center mb-10">
                <h3 className="font-headline font-black text-3xl uppercase text-white">TU PASE DE ACCESO</h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">Este carnet valida tu entrada a las áreas de conferencias, talleres y comidas oficiales.</p>
              </div>

              <div className="max-w-xl mx-auto">
                <TicketBadge 
                  registration={registration} 
                  onClear={handleClearRegistration} 
                />
              </div>

            </div>
          </div>
        ) : (
          <RegistrationTickets onSelectModality={(m) => setSelectedModality(m)} />
        )}
      </div>

      {/* Interactive Sede / Location */}
      <div id="location" className="scroll-mt-28 reveal-on-scroll">
        <LocationSection />
      </div>

      {/* Footer & Sponsors block */}
      <Footer />

      {/* Checkout modal if selected */}
      {selectedModality && (
        <RegistrationModal 
          modality={selectedModality}
          onClose={() => setSelectedModality(null)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

    </div>
  );
}

