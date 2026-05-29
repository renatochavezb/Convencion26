import { useState } from 'react';
import { Award, ChevronRight, FileText } from 'lucide-react';

export default function ExecutiveHighlight() {
  const [showFullSemblance, setShowFullSemblance] = useState(false);

  const achievements = [
    'Director General de Desarrollo Industrial en el Norte de México',
    'Fundador y Presidente Honorario del Clúster Aeroespacial de Chihuahua',
    'Presea al Mérito Industrial y Empresarial 2024',
    'Consejero de Vinculación y Desarrollo Tecnológico Nacional'
  ];

  return (
    <section className="bg-[#041221] py-16 relative overflow-hidden border-t border-surface-card/60 grid-pattern">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-secondary-orange/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
        
        {/* Section Header (remains sharp and readable) */}
        <div className="mb-10 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-secondary-orange/15 border border-secondary-orange/30 text-secondary-orange">
              <Award className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-secondary-orange tracking-widest uppercase">
              RECONOCIMIENTO NACIONAL
            </span>
          </div>
          <h3 className="font-headline text-3xl md:text-5xl font-black text-white leading-tight uppercase italic">
            EJECUTIVO DISTINGUIDO <span className="text-[#fe9800]">NACIONAL</span>
          </h3>
        </div>

        {/* Outer Wrapper for Teaser & Blurred Grid */}
        <div className="relative min-h-[450px] md:min-h-[400px] flex items-center justify-center">
          
          {/* Teaser Overlay Card (Glassmorphic & Premium) */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-2">
            <div className="bg-[#05172b]/90 backdrop-blur-md border-2 border-secondary-orange p-8 md:p-12 text-center shadow-2xl max-w-2xl w-full space-y-6">
              <div className="w-16 h-16 bg-secondary-orange/10 border border-secondary-orange/30 text-secondary-orange flex items-center justify-center rounded-full mx-auto animate-pulse">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h4 className="font-headline font-black text-2xl md:text-3xl text-white uppercase tracking-tight">
                  REVELACIÓN DEL GALARDONADO
                </h4>
                <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
                  El próximo <span className="text-secondary-orange font-bold text-lg">5 de Julio</span> se anunciará oficialmente al galardonado como Ejecutivo Distinguido Nacional 2026.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-center gap-4 text-xs font-mono">
                <span className="bg-secondary-orange/10 text-secondary-orange px-3 py-1 border border-secondary-orange/20">
                  📅 ANUNCIO: 05 DE JULIO, 2026
                </span>
                <span className="bg-white/5 text-white/60 px-3 py-1 border border-white/10">
                  🔒 CONTENIDO RESERVADO
                </span>
              </div>
            </div>
          </div>

          {/* Blurred Original Content Grid */}
          <div className="grid md:grid-cols-12 gap-12 items-center blur-md select-none pointer-events-none opacity-20 w-full">
            
            {/* Left Column: Semblance and details */}
            <div className="md:col-span-7 space-y-6 relative z-10">
              <div>
                <h4 className="font-headline text-xl md:text-3xl font-extrabold text-[#ffc080] mt-1 uppercase">
                  OSCAR OCTAVIO GARDEA ACOSTA
                </h4>
                <p className="font-sans text-xs md:text-sm text-secondary-orange/90 font-bold tracking-wide uppercase mt-1">
                  Galardonado COMEV Nacional 2026
                </p>
              </div>

              {/* Biography text */}
              <div className="space-y-4 font-sans text-sm text-on-surface-variant leading-relaxed">
                <p className="text-white/80 font-medium">
                  Con más de 30 años de destacada trayectoria en el sector de manufactura avanzada y desarrollo tecnológico en el norte de México, Oscar Octavio Gardea Acosta ha sido un pilar fundamental en la consolidación de Chihuahua como un hub de innovación industrial aeroespacial.
                </p>
                
                <p>
                  Su liderazgo estratégico en la vinculación academia-industria y su compromiso social lo han consolidado como un referente indiscutible del gremio empresarial nacional. Durante esta gala especial, la Convención Nacional COMEV le rinde homenaje por su legado de excelencia e impacto en la competitividad global del país.
                </p>

                {/* Show more collapsible */}
                {showFullSemblance && (
                  <div className="pt-2 space-y-3 border-l border-secondary-orange/30 pl-4 mt-2 animate-fadeIn text-xs md:text-sm">
                    <p>
                      Ha dirigido la expansión de parques tecnológicos industriales y presidido comisiones de desarrollo sustentable en la frontera. Su visión ha permitido el establecimiento de centros de diseño e ingeniería que hoy emplean a miles de técnicos calificados.
                    </p>
                    <p>
                      Además de su labor corporativa, colabora activamente con fundaciones locales enfocadas en la educación STEAM para jóvenes de comunidades vulnerables, promoviendo el talento y la movilidad social a través del conocimiento tecnológico.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowFullSemblance(!showFullSemblance)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-secondary-orange font-bold uppercase border-b border-dashed border-secondary-orange hover:text-white hover:border-white pb-0.5 mt-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {showFullSemblance ? 'Ocultar Semblanza' : 'Leer Semblanza Completa ➔'}
                </button>
              </div>

              {/* Bullets List */}
              <div className="pt-4 border-t border-surface-card-high/60">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 font-sans text-xs md:text-sm text-on-surface-variant">
                  {achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <ChevronRight className="w-4 h-4 text-secondary-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Photo Frame */}
            <div className="md:col-span-5 relative">
              <div className="group relative">
                {/* Outer guide borders */}
                <div className="absolute -inset-4 border border-secondary-orange/20 scale-102 group-hover:scale-100 transition-transform duration-500 pointer-events-none" />
                
                <div className="relative overflow-hidden border border-surface-variant bg-surface-card">
                  <img 
                    alt="Oscar Octavio Gardea Acosta Portrait" 
                    className="w-full grayscale contrast-110 hover:grayscale-0 transition-all duration-750 aspect-[4/5] object-cover"
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
                  />
                </div>

                {/* Float sticker badge */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-secondary-orange py-4 px-5 min-w-44 shadow-2xl border border-secondary-orange/20 select-none">
                  <span className="font-headline font-black text-xs text-deep-blue block tracking-wider">
                    ★ Homenajeado
                  </span>
                  <p className="font-mono text-[9px] text-deep-blue font-bold uppercase mt-0.5">
                    Gala de Clausura
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
