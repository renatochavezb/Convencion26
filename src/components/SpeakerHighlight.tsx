import { useState } from 'react';
import { Quote } from 'lucide-react';
import { SPEAKERS } from '../data';
import { Speaker } from '../types';

export default function SpeakerHighlight() {
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | null>(null);

  const featuredNestor = SPEAKERS.find((s) => s.id === 'nestor') || SPEAKERS[0];
  const secondarySpeakers = SPEAKERS.filter((s) => s.id !== 'nestor');

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

        {/* Core speaker layout */}
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Portrait Image Block */}
          <div className="md:col-span-5 order-2 md:order-1 relative">
            <div className="group relative">
              
              {/* Outer sharp guide borders */}
              <div className="absolute -inset-4 border border-secondary-orange/30 scale-102 group-hover:scale-100 transition-transform duration-500 pointer-events-none" />

              <img 
                alt="Néstor Guerra Professional Portrait" 
                className="relative z-10 w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700 aspect-[4/5] object-cover border border-surface-variant select-none"
                src={featuredNestor.imageUrl}
              />

              {/* Bolt orange indicator sticker */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-secondary-orange p-5 w-44 hover:bg-white transition-colors duration-200 hidden lg:block select-none shadow-lg">
                <span className="font-headline font-black text-xs text-deep-blue block mb-0.5 tracking-wider">
                  ★ CONFERENCISTA
                </span>
                <p className="font-mono text-[9px] text-deep-blue font-semibold uppercase">
                  Featured Keynote
                </p>
              </div>

            </div>
          </div>

          {/* Bio information block */}
          <div className="md:col-span-7 order-1 md:order-2 space-y-8">
            <div>
              <span className="font-mono text-xs font-bold text-secondary-orange tracking-widest uppercase mb-3 block">
                CONFERENCISTA PRINCIPAL • EXCEPCIONAL
              </span>
              <h3 className="font-headline text-4xl md:text-5xl font-black text-white leading-none tracking-tight flex items-center gap-3">
                <span>NÉSTOR <span className="text-[#fe9800]">GUERRA</span></span>
                <span className="inline-block text-3xl md:text-4xl" title="España">🇪🇸</span>
              </h3>
              <p className="font-headline text-xl md:text-2xl text-[#ffc080] font-bold mt-1.5 uppercase italic">
                Conferencista Internacional IA & negocios
              </p>
            </div>

            {/* Quote design layout */}
            <div className="bg-surface-card border border-surface-card-high p-6 md:p-8 relative">
              <Quote className="w-16 h-16 text-secondary-orange/10 absolute top-4 left-4" />
              <p className="font-headline text-lg md:text-xl text-white italic relative z-10 pl-6 leading-relaxed">
                "La inteligencia artificial no es el futuro. Es una decisión del presente."
              </p>
            </div>

            {/* Interactive bio collapse */}
            <div className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-xl">
              <p>{featuredNestor.bio}</p>
              
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
            </div>

            {/* List of achievements bulletpoints */}
            <div className="border-t border-surface-card-high/60 pt-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 font-sans text-sm text-on-surface-variant">
                {featuredNestor.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-[#fe9800] shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Secondary Speakers sub-grid to support more context */}
        <div className="mt-12 pt-8 border-t border-surface-card/60">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="font-mono text-[9px] text-secondary-orange font-bold uppercase tracking-widest block mb-1">PROGRAMA ACADÉMICO</span>
              <h4 className="font-headline font-black text-xl md:text-2xl text-white tracking-tight uppercase">PANELISTAS Y EVALUADORES COMPLEMENTARIOS</h4>
            </div>
            <span className="font-mono text-xs text-on-surface-variant hidden md:inline-block">/ VER PROGRAMA</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {secondarySpeakers.map((speaker) => (
              <div 
                key={speaker.id} 
                className="bg-surface-card border border-surface-card-high p-5 hover:border-accent-orange/30 duration-200 transition-all hover:-translate-y-1"
              >
                <img 
                  alt={speaker.name}
                  src={speaker.imageUrl} 
                  className="w-14 h-14 rounded-none object-cover grayscale border border-surface-variant mb-4"
                />
                <h5 className="font-headline font-black text-[13px] leading-tight text-white uppercase">{speaker.name}</h5>
                <p className="font-sans text-xs text-secondary-orange font-medium mt-1">{speaker.role}</p>
                
                <button
                  onClick={() => setSelectedSpeakerId(selectedSpeakerId === speaker.id ? null : speaker.id)}
                  id={`btn-speaker-bio-${speaker.id}`}
                  className="mt-3 block font-mono text-[9px] text-on-surface-variant hover:text-white uppercase tracking-wider"
                >
                  {selectedSpeakerId === speaker.id ? 'Ocultar Biografía ▲' : 'Leer Biografía Completa ▼'}
                </button>

                {selectedSpeakerId === speaker.id && (
                  <p className="mt-3 p-3 bg-deep-blue text-[11px] font-sans text-on-surface-variant/90 leading-relaxed border-l border-secondary-orange animate-fadeIn">
                    {speaker.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
