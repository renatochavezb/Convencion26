import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SPEAKERS } from '../data';
import { Speaker } from '../types';

export default function SpeakerHighlight() {
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | null>(null);
  const [activeFeaturedIdx, setActiveFeaturedIdx] = useState(0);

  const featuredSpeakers = SPEAKERS.filter((s) => s.featured);

  const currentSpeaker = featuredSpeakers[activeFeaturedIdx] || featuredSpeakers[0];

  function formatSpeakerName(name: string) {
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

                <img 
                  alt={`${currentSpeaker.name} Professional Portrait`} 
                  className="relative z-10 w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700 aspect-[4/5] object-cover border border-surface-variant select-none"
                  src={currentSpeaker.imageUrl}
                />

                {/* Neutral Overlay Badge for Guest Speaker */}
                {currentSpeaker.id === 'invitado-keynote' && (
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

                {/* Bolt orange indicator sticker */}
                <div className="absolute -bottom-6 -right-6 z-20 bg-secondary-orange p-5 w-44 hover:bg-white transition-colors duration-200 hidden lg:block select-none shadow-lg">
                  <span className="font-headline font-black text-xs text-deep-blue block mb-0.5 tracking-wider">
                    {currentSpeaker.id === 'invitado-keynote' ? '★ INVITADO ESPECIAL' : '★ CONFERENCISTA'}
                  </span>
                  <p className="font-mono text-[9px] text-deep-blue font-semibold uppercase">
                    {currentSpeaker.id === 'invitado-keynote' ? 'Programa Académico' : 'Featured Keynote'}
                  </p>
                </div>

              </div>
            </div>

            {/* Bio information block */}
            <div className="md:col-span-7 order-1 md:order-2 space-y-8">
              <div>
                <span className="font-mono text-xs font-bold text-secondary-orange tracking-widest uppercase mb-3 block">
                  {currentSpeaker.id === 'invitado-keynote' 
                    ? 'CONFERENCISTA INVITADO • PARTICIPACIÓN ESPECIAL' 
                    : 'CONFERENCISTA PRINCIPAL • EXCEPCIONAL'}
                </span>
                <h3 className="font-headline text-4xl md:text-5xl font-black text-white leading-none tracking-tight flex items-center gap-4">
                  <span>{formatSpeakerName(currentSpeaker.name)}</span>
                  {currentSpeaker.id === 'nestor' && (
                    <svg className="w-14 h-9.5 shadow-md border border-white/10 rounded-sm inline-block shrink-0" viewBox="0 0 3 2" fill="none" xmlns="http://www.w3.org/2000/svg" title="España">
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
