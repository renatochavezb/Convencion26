'use client';

import { useEffect, useState } from 'react';
import { Ticket, X } from 'lucide-react';

interface StickyRegisterBarProps {
  hasRegistration: boolean;
  onRegisterClick: () => void;
}

export default function StickyRegisterBar({ hasRegistration, onRegisterClick }: StickyRegisterBarProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('comev_sticky_register_dismissed') === '1') {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (hasRegistration || dismissed) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      const registration = document.getElementById('registration');
      const nearRegistration = registration
        ? registration.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;

      setVisible(window.scrollY > 420 && !nearRegistration);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasRegistration, dismissed]);

  function handleDismiss() {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem('comev_sticky_register_dismissed', '1');
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[45] px-3 pb-3 md:px-5 md:pb-4 pointer-events-none">
      <div
        className="pointer-events-auto mx-auto max-w-[1100px] border-2 border-[#ffc080] bg-[#fe9800] shadow-[0_-8px_40px_rgba(254,152,0,0.45),0_0_0_1px_rgba(0,0,0,0.2)] animate-sticky-bar-in"
        role="region"
        aria-label="Llamado a registro"
      >
        {/* Top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-deep-blue via-[#041221] to-deep-blue" />

        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 px-4 py-3.5 md:px-6 md:py-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <div className="hidden sm:flex shrink-0 w-11 h-11 items-center justify-center bg-deep-blue text-[#fe9800]">
              <Ticket className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 pr-8 sm:pr-0">
              <p className="font-headline text-base md:text-xl font-black text-deep-blue uppercase tracking-tight leading-snug">
                ¿Listos para vivir la experiencia?
              </p>
              <p className="font-sans text-xs md:text-sm text-deep-blue/75 leading-snug mt-0.5">
                Asegura tu carnet COMEV 2026 · Individual $4,000 · Pareja $7,500
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              id="btn-sticky-register"
              onClick={onRegisterClick}
              className="flex-1 sm:flex-none px-5 md:px-7 py-3 bg-deep-blue text-white font-headline text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-deep-blue transition-colors duration-150 cursor-pointer shadow-[0_0_20px_rgba(0,8,20,0.25)]"
            >
              Registrarme ahora
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 sm:static p-2 text-deep-blue/60 hover:text-deep-blue hover:bg-deep-blue/10 transition-colors cursor-pointer"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
