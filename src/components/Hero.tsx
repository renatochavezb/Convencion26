import { useState, useEffect } from 'react';
import { Play, Ticket, MapPin, Calendar, Clock } from 'lucide-react';
import logoGradiente from '../assets/logo-gradiente.png';
import comevLogo from '../assets/comev-logo.png';


interface HeroProps {
  onCtaclick: () => void;
}

export default function Hero({ onCtaclick }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Event start date: September 3, 2026 at 07:00 PM (Rompe Hielo)
      const difference = +new Date('2026-09-03T19:00:00') - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-36 pb-16 grid-pattern bg-deep-blue">
      
      {/* Heavy Blue Overlay to match the design palette tone */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#001429]/40 to-[#001429]"></div>

      {/* Giant gradient logo watermark in the background (bottom-left) without the text labels */}
      <div className="absolute -left-28 -bottom-28 w-[600px] h-[450px] overflow-hidden opacity-30 pointer-events-none z-0 select-none">
        <img 
          src={logoGradiente} 
          alt="Logo Watermark Left" 
          className="w-[600px] h-[540px] object-cover object-top filter blur-[0.5px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-[80px] grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 space-y-6">

          {/* Display Hero Title with staggered italic highlights */}
          <h2 className="font-headline text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter uppercase italic select-none">
            ¡VIVA <br />
            <span className="text-secondary-orange italic">CHIHUAHUA!</span>
          </h2>

          {/* Primary Subhead */}
          <h1 className="font-headline text-2xl md:text-[38px] font-extrabold text-white tracking-tight uppercase leading-none">
            CONVENCIÓN NACIONAL <br />
            <span className="text-[#ffc080] font-black inline-flex items-center gap-3">
              COMEV 2026
              <img src={comevLogo} alt="Logo COMEV" className="h-8 md:h-10 w-auto object-contain select-none" />
            </span>
          </h1>

          {/* Mission Statement */}
          <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
            Forma parte de la experiencia que impulsa a Chihuahua y conecta a los grandes líderes. Un encuentro estratégico diseñado para redefinir el futuro de la industria y la innovación de cara al mañana.
          </p>

          {/* Speed Stats Columns */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 items-start sm:items-center pt-2">
            <div className="border-l-[4px] border-secondary-orange pl-6 py-2 relative z-10">
              <p className="font-mono text-[10px] font-bold text-secondary-orange tracking-widest uppercase mb-1">
                FECHA DEL EVENTO
              </p>
              <p className="font-headline text-lg md:text-[22px] font-extrabold text-white leading-none">
                Del 3 al 5 de Septiembre, 2026
              </p>
            </div>

            <div className="border-l-[4px] border-secondary-orange pl-6 py-2 relative z-10">
              <p className="font-mono text-[10px] font-bold text-secondary-orange tracking-widest uppercase mb-1">
                SEDE OFICIAL
              </p>
              <p className="font-headline text-lg md:text-[22px] font-extrabold text-white leading-none uppercase">
                HOTEL MARÍA BONITA
              </p>
            </div>
          </div>

          {/* Secondary Action Link / Event Teaster to boost immersion */}
          <div className="pt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onCtaclick}
              id="hero-cta-btn"
              className="bg-[#fe9800] hover:bg-[#ffa726] text-deep-blue font-semibold tracking-wider font-headline text-sm rounded-none uppercase px-8 py-4 cursor-pointer btn-glow-orange"
            >
              ADQUIRIR ACCESO DIRECTO
            </button>
            
            <a
              href="#schedule"
              className="inline-flex items-center gap-2 text-white hover:text-secondary-orange font-mono text-[11px] font-bold uppercase tracking-wider underline underline-offset-4 decoration-2"
            >
              <Play className="w-4 h-4 fill-white" /> Ver Programa del Evento
            </a>
          </div>
        </div>

        {/* Right Column: Glassmorphic Access Ticket Card with Live Countdown */}
        <div className="lg:col-span-5 hidden lg:block relative">

          <div className="relative z-10 group">
            {/* Background glowing orb */}
            <div className="absolute -inset-2 bg-gradient-to-r from-secondary-orange via-[#fe9800]/40 to-accent-orange rounded-none blur-3xl opacity-15 group-hover:opacity-25 transition duration-1000 pointer-events-none"></div>
            
            {/* Ticket body */}
            <div 
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
              className="relative bg-[#05172b]/85 backdrop-blur-xl border border-white/10 p-8 shadow-2xl space-y-6 glass-card-glow overflow-hidden"
            >
              
              {/* Header inside ticket */}
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src={logoGradiente} alt="" className="w-11 h-11 object-contain" />
                  <span className="font-mono text-[10px] text-white tracking-wider font-bold">ACCESO CONVENCIÓN</span>
                </div>
                <span className="bg-[#fe9800]/10 text-secondary-orange text-[9px] font-mono px-2 py-0.5 border border-[#fe9800]/30 font-bold uppercase">
                  CHIHUAHUA 2026
                </span>
              </div>

              {/* Countdown timer */}
              <div className="space-y-2.5">
                <p className="font-mono text-[9px] text-on-surface-variant tracking-wider uppercase font-semibold">
                  TIEMPO RESTANTE PARA EL INICIO:
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/[0.02] border border-white/5 p-3">
                    <span className="block font-headline text-2xl font-black text-white leading-none">{timeLeft.days}</span>
                    <span className="font-mono text-[8px] text-on-surface-variant block uppercase mt-1">Días</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-3">
                    <span className="block font-headline text-2xl font-black text-white leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="font-mono text-[8px] text-on-surface-variant block uppercase mt-1">Horas</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-3">
                    <span className="block font-headline text-2xl font-black text-white leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="font-mono text-[8px] text-on-surface-variant block uppercase mt-1">Min</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-3">
                    <span className="block font-headline text-2xl font-black text-white leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="font-mono text-[8px] text-on-surface-variant block uppercase mt-1">Seg</span>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="space-y-3 pt-2 text-xs border-t border-white/5">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-on-surface-variant">Conferencista Principal:</span>
                  <span className="text-white font-bold font-mono">NÉSTOR GUERRA</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-on-surface-variant">Sede Oficial:</span>
                  <span className="text-white font-bold">Hotel María Bonita</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-on-surface-variant">Modalidad:</span>
                  <span className="text-secondary-orange font-bold uppercase tracking-wider font-mono text-[10px]">Presencial</span>
                </div>
              </div>

              {/* Barcode section */}
              <div className="pt-4 border-t border-white/10 flex flex-col items-center gap-2.5">
                <div className="w-full h-11 bg-white/90 flex items-center justify-center p-1.5 select-none rounded-[1px]">
                  {/* Styled mock barcode lines */}
                  <div className="flex gap-[3px] w-full h-full items-stretch justify-center opacity-85">
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[3px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[4px]"></div>
                    <div className="bg-black w-[2px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[3px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[5px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[2px]"></div>
                    <div className="bg-black w-[4px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[3px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[5px]"></div>
                    <div className="bg-black w-[2px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[3px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[4px]"></div>
                    <div className="bg-black w-[2px]"></div>
                    <div className="bg-black w-[1px]"></div>
                    <div className="bg-black w-[3px]"></div>
                    <div className="bg-black w-[1px]"></div>
                  </div>
                </div>
                <span className="font-mono text-[8px] text-on-surface-variant tracking-[0.3em] font-semibold uppercase">
                  *COMEV2026*
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Decorative Blueprint Corner Tags to increase "Corporate Modernism" feeling */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-on-surface-variant/30 select-none hidden lg:block">
        SYS_ID: COM26_AISTUDIO / COORD_N_28_6329
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-on-surface-variant/30 select-none hidden lg:block">
        © EVM CHIHUAHUA • 2026
      </div>

    </section>
  );
}
