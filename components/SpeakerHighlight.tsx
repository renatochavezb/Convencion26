import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SPEAKERS } from '../data';
import { Speaker } from '../types';
import cumbreVentasLogo from '../assets/cumbre-ventas-logo.jpg';

export default function SpeakerHighlight() {
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | null>(null);
  const [activeFeaturedIdx, setActiveFeaturedIdx] = useState(0);

  const rawFeatured = SPEAKERS.filter((s) => s.featured);
  
  // Arrange chronologically: Claudia & Humberto first, Néstor second
  const orderedFeatured = [
    rawFeatured.find(s => s.id === 'invitado-keynote'),
    rawFeatured.find(s => s.id === 'nestor')
  ].filter(Boolean) as Speaker[];

  const featuredSpeakers = [
    {
      id: 'cumbre-intro',
      name: 'CUMBRE DE VENTAS 2026',
      role: 'EVENTO ESPECIAL ACADÉMICO',
      quote: '',
      bullets: [],
      imageUrl: '',
      featured: true,
      bio: ''
    },
    ...orderedFeatured
  ];

  const currentSpeaker = featuredSpeakers[activeFeaturedIdx] || featuredSpeakers[0];

  function formatSpeakerName(name: string) {
    if (name.includes('&')) {
      const [s1, s2] = name.split('&').map(s => s.trim());
      
      const parts1 = s1.split(' ');
      const lastWord1 = parts1.pop();
      
      const parts2 = s2.split(' ');
      const lastWord2 = parts2.pop();
      
      return (
        <span className="flex items-center gap-4 md:gap-5 mt-1 text-left w-full">
          {/* Big & ornament on the left */}
          <span 
            className="font-sans font-black select-none pointer-events-none leading-none shrink-0"
            style={{ 
              fontSize: '4.5rem', 
              color: 'rgba(232, 196, 74, 0.35)'
            }}
          >
            &amp;
          </span>
          {/* Names stacked on the right */}
          <span className="flex flex-col gap-1.5 md:gap-2.5 items-start">
            <span className="block text-3xl md:text-[44px] font-black tracking-tight uppercase leading-none whitespace-nowrap">
              <span className="text-[#ff8c00]">{parts1.join(' ')}</span> <span className="text-white">{lastWord1}</span>
            </span>
            <span className="block text-3xl md:text-[44px] font-black tracking-tight uppercase leading-none whitespace-nowrap">
              <span className="text-[#e8c44a]">{parts2.join(' ')}</span> <span className="text-white">{lastWord2}</span>
            </span>
          </span>
        </span>
      );
    }
    const parts = name.split(' ');
    if (parts.length <= 1) return name;
    const lastWord = parts.pop();
    return (
      <>
        {parts.join(' ')} <span className="text-[#fe9800]">{lastWord}</span>
      </>
    );
  }

  return (
    <section className="bg-surface-container-lowest py-12 relative overflow-hidden border-t border-surface-card">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="font-mono text-xs font-bold text-[#fe9800] tracking-widest block mb-2">CONFERENCISTAS DE CLASE MUNDIAL</span>
          <h3 className="font-headline font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-none">
            SPEAKERS
          </h3>
          <p className="text-on-surface-variant font-sans text-xs md:text-sm mt-3 max-w-lg leading-relaxed">
            Expertos internacionales y líderes de opinión que compartirán estrategias clave de ventas, mercadotecnia e inteligencia artificial.
          </p>
        </div>


        {/* Core speaker layout - Carousel */}
        <div className="relative">
          <div 
            key={currentSpeaker.id} 
            className="animate-fadeIn grid md:grid-cols-12 gap-12 items-center"
          >
            {/* Portrait Image Block */}
            <div className="md:col-span-5 order-2 md:order-1 relative">
              <div className="group relative overflow-hidden">
                
                {/* Outer sharp guide borders */}
                <div className="absolute -inset-4 border border-secondary-orange/30 scale-102 group-hover:scale-100 transition-transform duration-500 pointer-events-none" />

                {currentSpeaker.id === 'cumbre-intro' ? (
                  <div className="relative w-full max-w-[92%] mx-auto aspect-[4/5] select-none group/collage overflow-hidden">
                    {/* Claudia — izquierda */}
                    <div className="absolute left-[6%] bottom-[5%] w-[32%] h-[72%] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ease-out z-10 rotate-[-6deg] origin-bottom group-hover/collage:-translate-x-1 group-hover/collage:rotate-[-8deg] group-hover/collage:opacity-100 opacity-90">
                      <img 
                        src={SPEAKERS.find(s => s.id === 'invitado-keynote')?.imageUrl} 
                        alt="Claudia Alcalá Portrait" 
                        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700" 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-7 pb-2 px-1.5 pointer-events-none">
                        <p className="font-headline text-[10px] md:text-xs text-white/95 font-bold uppercase tracking-wide text-center leading-tight">
                          Claudia<br />Alcalá
                        </p>
                      </div>
                    </div>
                    
                    {/* Humberto — derecha */}
                    <div className="absolute right-[6%] bottom-[5%] w-[32%] h-[72%] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ease-out z-12 rotate-[6deg] origin-bottom group-hover/collage:translate-x-1 group-hover/collage:rotate-[8deg] group-hover/collage:opacity-100 opacity-90">
                      <img 
                        src={SPEAKERS.find(s => s.id === 'invitado-keynote')?.imageUrl2} 
                        alt="Humberto Nevárez Portrait" 
                        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700" 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-7 pb-2 px-1.5 pointer-events-none">
                        <p className="font-headline text-[10px] md:text-xs text-white/95 font-bold uppercase tracking-wide text-center leading-tight">
                          Humberto Nevárez
                        </p>
                      </div>
                    </div>

                    {/* Néstor — centro */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[30%] h-[76%] overflow-hidden border border-secondary-orange/40 shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out z-20 group-hover/collage:border-secondary-orange/70">
                      <img 
                        src={SPEAKERS.find(s => s.id === 'nestor')?.imageUrl} 
                        alt="Néstor Guerra Portrait" 
                        className="w-full h-full object-cover object-top grayscale contrast-125 hover:grayscale-0 transition-all duration-700" 
                      />
                      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/55 to-transparent pt-9 pb-2 px-1 pointer-events-none">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-secondary-orange text-base md:text-lg font-bold leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                            ★
                          </span>
                          <p className="font-headline text-[10px] md:text-xs text-white font-bold uppercase tracking-wide text-center leading-tight">
                            Néstor Guerra
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentSpeaker.imageUrl2 ? (
                  <div className="relative w-full aspect-[4/5] select-none group/duo">
                    {/* Photo 1 (Claudia - bottom-left background) */}
                    <div className="absolute left-0 bottom-0 w-[52%] h-[84%] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ease-out z-10 group-hover/duo:-translate-x-2.5 group-hover/duo:translate-y-2.5 group-hover/duo:scale-[1.02]">
                      <img 
                        src={currentSpeaker.imageUrl} 
                        alt="Claudia Alcalá Portrait"
                        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    {/* Photo 2 (Humberto - top-right foreground) */}
                    <div className="absolute right-0 top-0 w-[56%] h-[90%] overflow-hidden border-2 border-secondary-orange/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out z-20 group-hover/duo:translate-x-2.5 group-hover/duo:-translate-y-2.5 group-hover/duo:scale-[1.02] group-hover/duo:border-secondary-orange">
                      <img 
                        src={currentSpeaker.imageUrl2} 
                        alt="Humberto Nevárez Portrait"
                        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  </div>
                ) : (
                  <img 
                    alt={`${currentSpeaker.name} Professional Portrait`} 
                    className="relative z-10 w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700 aspect-[4/5] object-cover border border-surface-variant select-none"
                    src={currentSpeaker.imageUrl}
                  />
                )}

                {/* Neutral Overlay Badge for Guest Speaker */}
                {currentSpeaker.id === 'invitado-keynote' && currentSpeaker.name === 'CONFERENCISTA INVITADO' && (
                  <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 bg-deep-blue/85 border border-white/10 select-none animate-fadeIn">
                    {/* Top */}
                    <span className="font-mono text-[10px] font-bold text-secondary-orange tracking-widest uppercase">
                      ★ PROGRAMA ACADÉMICO
                    </span>
                    
                    {/* Center */}
                    <div className="text-center my-auto space-y-1">
                      <h4 className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight uppercase leading-none">
                        INVITADO<br/>ESPECIAL
                      </h4>
                      <div className="h-0.5 w-12 bg-secondary-orange mx-auto my-3" />
                      <p className="font-headline text-xs md:text-sm font-bold text-[#ffc080] tracking-widest uppercase">
                        ANUNCIO OFICIAL
                      </p>
                      <p className="font-mono text-[10px] text-white/70 font-semibold tracking-wider uppercase">
                        PRÓXIMAMENTE
                      </p>
                    </div>
                    
                    {/* Bottom */}
                    <span className="font-mono text-[9px] text-white/50 tracking-wider text-right uppercase">
                      COMEV 2026
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Bio information block */}
            <div className="md:col-span-7 order-1 md:order-2 space-y-8">
              {currentSpeaker.id === 'cumbre-intro' ? (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <img 
                      src={cumbreVentasLogo.src} 
                      className="h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.25)] mb-3 select-none" 
                      alt="Cumbre de Ventas 2026" 
                    />
                    <span className="font-mono text-xs font-bold text-secondary-orange tracking-widest uppercase mb-1 block">
                      PROGRAMA ACADÉMICO ESPECIAL
                    </span>
                    <h3 className="font-headline text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
                      CUMBRE DE VENTAS <span className="text-[#fe9800]">2026</span>
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed mt-3 max-w-xl">
                      El núcleo estratégico de la Convención. Una jornada intensiva dedicada a la transformación y productividad comercial a través de la Inteligencia Artificial, el liderazgo competitivo y la innovación práctica.
                    </p>
                  </div>

                  {/* Timetable / Horario */}
                  <div className="space-y-3 border-t border-surface-card-high/50 pt-5">
                    <h4 className="font-mono text-[9px] font-bold text-secondary-orange tracking-widest uppercase">
                      CONFERENCIAS DE LA CUMBRE:
                    </h4>
                    
                    <div className="grid gap-3.5 max-w-xl">
                      {/* Slot 1: Claudia & Humberto */}
                      <button
                        onClick={() => setActiveFeaturedIdx(1)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-card hover:bg-surface-card-high border border-surface-card-high hover:border-[#fe9800]/50 transition-all duration-300 text-left gap-3 group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <h5 className="font-headline font-bold text-white text-sm md:text-base leading-snug group-hover:text-secondary-orange transition-colors">
                            EL PODER DE LA IA EN VENTAS Y NEGOCIOS
                          </h5>
                          <p className="font-sans text-xs text-on-surface-variant">
                            Claudia Alcalá & Humberto Nevárez
                          </p>
                        </div>
                        <span className="font-mono text-xs text-secondary-orange/60 group-hover:text-[#fe9800] font-bold shrink-0 self-end sm:self-center transition-colors">
                          Ver detalles ➔
                        </span>
                      </button>

                      {/* Slot 2: Néstor */}
                      <button
                        onClick={() => setActiveFeaturedIdx(2)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-card hover:bg-surface-card-high border border-surface-card-high hover:border-cyan-500/30 transition-all duration-300 text-left gap-3 group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <h5 className="font-headline font-bold text-white text-sm md:text-base leading-snug group-hover:text-cyan-400 transition-colors">
                            IA & NEGOCIOS: DECISIÓN DEL PRESENTE
                          </h5>
                          <p className="font-sans text-xs text-on-surface-variant">
                            Néstor Guerra
                          </p>
                        </div>
                        <span className="font-mono text-xs text-cyan-400/60 group-hover:text-cyan-400 font-bold shrink-0 self-end sm:self-center transition-colors">
                          Ver detalles ➔
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-mono text-xs font-bold text-secondary-orange tracking-widest uppercase mb-3 block">
                      {currentSpeaker.name.includes('&')
                        ? 'CONFERENCISTAS INVITADOS • PARTICIPACIÓN ESPECIAL'
                        : (currentSpeaker.id === 'invitado-keynote' 
                          ? 'CONFERENCISTA INVITADO • PARTICIPACIÓN ESPECIAL' 
                          : 'CONFERENCISTA PRINCIPAL • EXCEPCIONAL')}
                    </span>
                    <h3 className="font-headline text-4xl md:text-5xl font-black text-white leading-none tracking-tight flex items-center gap-4">
                      <span>{formatSpeakerName(currentSpeaker.name)}</span>
                      {currentSpeaker.id === 'nestor' && (
                        <svg className="w-14 h-9.5 shadow-md border border-white/10 rounded-sm inline-block shrink-0" viewBox="0 0 3 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <title>España</title>
                          <rect width="3" height="2" fill="#AD1519" />
                          <rect y="0.5" width="3" height="1" fill="#FABD00" />
                        </svg>
                      )}
                    </h3>
                    <p className="font-headline text-xl md:text-2xl text-[#ffc080] font-bold mt-1.5 uppercase italic">
                      {currentSpeaker.role}
                    </p>
                  </div>

                  {/* Quote design layout */}
                  {currentSpeaker.quote && (
                    <div className="bg-surface-card border border-surface-card-high p-6 md:p-8 relative">
                      <Quote className="w-16 h-16 text-secondary-orange/10 absolute top-4 left-4" />
                      <p className="font-headline text-lg md:text-xl text-white italic relative z-10 pl-6 leading-relaxed">
                        {currentSpeaker.quote}
                      </p>
                    </div>
                  )}

                  {/* Interactive bio collapse */}
                  <div className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-xl">
                    <p>{currentSpeaker.bio}</p>
                    
                    {currentSpeaker.id === 'nestor' && (
                      <>
                        <button 
                          onClick={() => setSelectedSpeakerId(selectedSpeakerId === 'nestor' ? null : 'nestor')}
                          id="btn-learn-more-nestor"
                          className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-secondary-orange font-bold uppercase border-b border-dashed border-secondary-orange hover:text-white hover:border-white pb-0.5"
                        >
                          {selectedSpeakerId === 'nestor' ? 'Ocultar Trayectoria' : 'Ver más de su trayectoria ➔'}
                        </button>

                        {selectedSpeakerId === 'nestor' && (
                          <div className="mt-4 p-4 bg-surface-card border border-surface-card-high space-y-2 animate-fadeIn font-sans text-xs text-on-surface-variant/90 leading-relaxed border-l-2 border-secondary-orange">
                            <p>
                              Néstor Guerra se desempeña como consultor en metodologías Lean Startup y Agile. Es profesor asistente en escuelas de negocio de élite y dirige conferencias magistrales enfocadas en integrar tecnologías emergentes de IA generativa dentro de la planificación estratégica.
                            </p>
                            <p>
                              Ha colaborado con clústeres gubernamentales en México, España y Colombia definiendo regulaciones para la adopción de algoritmos responsables en corporativos multinacionales.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* List of achievements bulletpoints */}
                  <div className="border-t border-surface-card-high/60 pt-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 font-sans text-sm text-on-surface-variant">
                      {currentSpeaker.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-[#fe9800] shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
            <button
              onClick={() => setActiveFeaturedIdx((prev) => (prev === 0 ? featuredSpeakers.length - 1 : prev - 1))}
              className="p-3 rounded-full bg-surface-card/90 border border-surface-card-high hover:border-[#fe9800] text-on-surface-variant hover:text-white transition-all duration-300 cursor-pointer shadow-lg active:scale-95 flex items-center justify-center"
              aria-label="Anterior conferencista"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
            <button
              onClick={() => setActiveFeaturedIdx((prev) => (prev === featuredSpeakers.length - 1 ? 0 : prev + 1))}
              className="p-3.5 rounded-full bg-[#fe9800] text-deep-blue hover:bg-white hover:text-deep-blue transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(254,152,0,0.6)] active:scale-95 flex items-center justify-center relative group"
              aria-label="Siguiente conferencista"
            >
              {/* Pulsing notification ring */}
              <span className="absolute -inset-1.5 rounded-full border border-secondary-orange animate-ping opacity-75 pointer-events-none group-hover:opacity-100 duration-300" />
              <ChevronRight className="w-5.5 h-5.5 md:w-6 md:h-6" strokeWidth={3} />
            </button>
          </div>

        </div>

        {/* Carousel indicators (dots) */}
        <div className="flex justify-center gap-2 mt-6">
          {featuredSpeakers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFeaturedIdx(idx)}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                activeFeaturedIdx === idx 
                  ? 'bg-secondary-orange w-6' 
                  : 'bg-surface-card-high/60 hover:bg-surface-card-high w-2'
              }`}
              aria-label={`Ir al conferencista ${idx + 1}`}
            />
          ))}
        </div>



      </div>
    </section>
  );
}
