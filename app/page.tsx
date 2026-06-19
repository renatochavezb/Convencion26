"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SpeakerHighlight from '@/components/SpeakerHighlight';
import RegistrationTickets from '@/components/RegistrationTickets';
import RegistrationModal from '@/components/RegistrationModal';
import TicketBadge from '@/components/TicketBadge';
import ScheduleSection from '@/components/ScheduleSection';
import ExecutiveHighlight from '@/components/ExecutiveHighlight';
import LocationSection from '@/components/LocationSection';
import FlightDiscountsSection from '@/components/FlightDiscountsSection';
import Footer from '@/components/Footer';
import PassportPage from '@/components/PassportPage';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import { RegistrationDetails } from '@/types';
import { Star, ShieldAlert, Award, RefreshCw, Ticket } from 'lucide-react';

export default function App() {
  const [registration, setRegistration] = useState<RegistrationDetails | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    modality: 'individual' | 'pareja';
    initialStep?: 1 | 2 | 3;
    prefill?: RegistrationDetails;
  } | null>(null);
  const [currentHash, setCurrentHash] = useState('');

  // Set initial hash after mount (client-side only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isProd = process.env.NODE_ENV === 'production';
    
    if (params.has('sello') && !window.location.hash) {
      if (!isProd) {
        window.location.hash = '#pasaporte';
      }
    }
    
    const initialHash = window.location.hash;
    if (initialHash === '#pasaporte' && isProd) {
      window.location.hash = '';
      setCurrentHash('');
    } else {
      setCurrentHash(initialHash || (params.has('sello') && !isProd ? '#pasaporte' : ''));
    }
    
    const handleHashChange = () => {
      if (window.location.hash === '#pasaporte' && isProd) {
        window.location.hash = '';
        setCurrentHash('');
      } else {
        setCurrentHash(window.location.hash);
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load registration from localStorage if present and sync with database
  useEffect(() => {
    try {
      const cached = localStorage.getItem('comev_badge_2026');
      if (cached) {
        const parsed = JSON.parse(cached);
        setRegistration(parsed);

        // Sync with MongoDB backend in the background
        if (parsed.email) {
          fetch(`/api/register/${encodeURIComponent(parsed.email)}`)
            .then(res => {
              if (res.ok) return res.json();
              throw new Error('Not found');
            })
            .then(data => {
              setRegistration(data);
              localStorage.setItem('comev_badge_2026', JSON.stringify(data));
            })
            .catch(err => console.log('Database sync offline/unavailable, using cached', err));
        }
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

  const handleRegistrationSuccess = async (data: RegistrationDetails) => {
    setRegistration(data);
    setModalConfig(null);
    try {
      localStorage.setItem('comev_badge_2026', JSON.stringify(data));
      // Save to MongoDB database
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error('Failed to cache credentials or save to database', e);
    }

    // Redirect directly to passport page
    setTimeout(() => {
      if (process.env.NODE_ENV !== 'production') {
        window.location.hash = '#pasaporte';
      }
    }, 150);
  };

  const handleClearRegistration = () => {
    if (confirm('¿Estás seguro de que deseas eliminar tu carnet registrado en este dispositivo? Deberás registrarte nuevamente.')) {
      setRegistration(null);
      localStorage.removeItem('comev_badge_2026');
      localStorage.removeItem('comev_perfil');
      localStorage.removeItem('comev_folio');
    }
  };

  const handleRegisterCta = () => {
    const section = document.getElementById('registration');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewTicketScroll = () => {
    window.location.hash = '#pasaporte';
  };

  const openRegistrationModal = (modality: 'individual' | 'pareja') => {
    setModalConfig({ modality, initialStep: 1 });
  };

  const handleBankDetailsClick = () => {
    if (registration) {
      setModalConfig({
        modality: registration.ticketType,
        initialStep: 2,
        prefill: registration,
      });
      return;
    }

    const shouldRegister = confirm(
      'Para ver tus datos bancarios con tu referencia de pago, primero debes registrarte.\n\n¿Deseas registrarte ahora?'
    );
    if (shouldRegister) {
      openRegistrationModal('individual');
    }
  };

  const handleProofClick = () => {
    if (registration) {
      setModalConfig({
        modality: registration.ticketType,
        initialStep: 3,
        prefill: registration,
      });
      return;
    }

    const shouldRegister = confirm(
      'Para subir tu comprobante de pago, primero debes registrarte.\n\n¿Deseas registrarte ahora?'
    );
    if (shouldRegister) {
      openRegistrationModal('individual');
    }
  };

  if (currentHash === '#pasaporte' && process.env.NODE_ENV !== 'production') {
    return <PassportPage />;
  }

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
          <div id="registration-pass" className="bg-gradient-to-b from-deep-blue via-[#041221] to-deep-blue py-16 border-t border-surface-card">
            <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
              <div className="max-w-xl mx-auto bg-[#001021] border-2 border-secondary-orange/40 p-8 text-center rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-[3px] border border-outline/10 rounded-xl pointer-events-none" />
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    REGISTRO CONFIRMADO
                  </div>
                  
                  <div>
                    <h4 className="font-headline font-black text-white text-2xl uppercase tracking-tight">¡TU REGISTRO ESTÁ LISTO!</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed max-w-sm mx-auto">
                      Has registrado tus datos para la inscripcion para la Convención ¡VIVA CHIHUAHUA!, asegurate de mandar el comprobante de pago.
                    </p>
                  </div>

                  <div className="border-t border-outline/10 my-4" />

                  <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleBankDetailsClick}
                      className="w-full sm:w-auto border-2 border-emerald-400/60 text-emerald-300 hover:bg-emerald-400/10 hover:text-white hover:border-emerald-300 font-headline text-xs font-bold uppercase tracking-wider py-3.5 px-6 transition-all cursor-pointer shrink-0"
                    >
                      Datos bancarios
                    </button>
                    <button
                      type="button"
                      onClick={handleProofClick}
                      className="w-full sm:w-auto border-2 border-[#fe9800]/70 text-[#ffc080] hover:bg-[#fe9800]/10 hover:text-white hover:border-[#fe9800] font-headline text-xs font-bold uppercase tracking-wider py-3.5 px-6 transition-all cursor-pointer shrink-0"
                    >
                      Comprobante
                    </button>
                    <button
                      onClick={handleClearRegistration}
                      className="w-full sm:w-auto border border-outline/40 text-on-surface-variant hover:text-white font-mono text-[10px] leading-none tracking-widest py-3.5 px-6 transition-all uppercase flex items-center justify-center gap-1.5 hover:bg-white/5 rounded-xl cursor-pointer shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Registrar Otro</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <RegistrationTickets
            onSelectModality={openRegistrationModal}
            onBankDetailsClick={handleBankDetailsClick}
            onProofClick={handleProofClick}
          />
        )}
      </div>

      {/* Flight discounts — TAR & Volaris */}
      <div id="flights" className="scroll-mt-28 reveal-on-scroll">
        <FlightDiscountsSection />
      </div>

      {/* Interactive Sede / Location */}
      <div id="location" className="scroll-mt-28 reveal-on-scroll">
        <LocationSection />
      </div>

      {/* Footer & Sponsors block */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFAB />

      {/* Checkout modal if selected */}
      {modalConfig && (
        <RegistrationModal
          key={`${modalConfig.modality}-${modalConfig.initialStep}-${modalConfig.prefill?.email ?? 'new'}`}
          modality={modalConfig.modality}
          initialStep={modalConfig.initialStep}
          prefill={modalConfig.prefill}
          onClose={() => setModalConfig(null)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

    </div>
  );
}
