import { Award, Briefcase, Globe, Users } from 'lucide-react';

export default function ExecutiveHighlight() {

  const achievements = [
    {
      title: 'Fundador de Grupo Gardea',
      desc: 'Consolidó marcas líderes como 2CAP (77 tiendas en México), Bordados Gardea e Inmobiliaria OSCA.',
      icon: Briefcase
    },
    {
      title: 'Liderazgo Gremial',
      desc: 'Presidente de EVM Chihuahua (2024–2026) y del comité organizador de COMEV Nacional 2022.',
      icon: Award
    },
    {
      title: 'Impacto en el Empleo',
      desc: 'Genera desarrollo y oportunidades para más de 375 colaboradores y sus familias.',
      icon: Users
    },
    {
      title: 'Sinergia Internacional',
      desc: 'Promotor de misiones comerciales a China, ampliando horizontes para empresarios mexicanos.',
      icon: Globe
    }
  ];

  return (
    <section className="bg-[#041221] py-16 relative overflow-hidden border-t border-surface-card/60 grid-pattern">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-secondary-orange/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
        
        {/* Section Header */}
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

        {/* Outer Wrapper for Grid */}
        <div className="relative flex items-center justify-center">
          
          {/* Original Content Grid */}
          <div className="grid md:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Column: Semblance and details */}
            <div className="md:col-span-7 space-y-6 relative z-10">
              <div>
                <h4 className="font-headline text-xl md:text-3xl font-extrabold text-[#ffc080] mt-1 uppercase italic tracking-tight">
                  OSCAR OCTAVIO GARDEA ACOSTA
                </h4>
                <p className="font-sans text-xs md:text-sm text-secondary-orange/90 font-bold tracking-wide uppercase mt-1">
                  Galardonado COMEV Nacional 2026
                </p>
              </div>

              {/* Biography text */}
              <div className="space-y-4 font-sans text-sm text-on-surface-variant leading-relaxed">
                <p className="text-white font-medium text-base md:text-lg border-l-2 border-secondary-orange pl-4 italic">
                  "Para él, vender no significa únicamente concretar negocios, sino generar valor, construir alianzas y crear condiciones que permitan el crecimiento mutuo."
                </p>
                
                <p className="text-white/80">
                  Oscar Octavio Gardea Acosta es un empresario chihuahuense cuya trayectoria se ha distinguido por el emprendimiento, el liderazgo y una profunda pasión por las ventas y las negociaciones. Su visión empresarial basada en el crecimiento sostenible, la generación de empleo y la construcción de relaciones de largo plazo lo consolidan como un referente nacional.
                </p>
                {/* Full Semblance */}
                <div className="pt-2 space-y-3 border-l border-secondary-orange/30 pl-4 mt-2 text-xs md:text-sm text-justify">
                  <p>
                    Fundador y director de Grupo Gardea, ha dedicado gran parte de su vida al desarrollo de empresas orientadas a generar valor, oportunidades y crecimiento. Bajo su liderazgo se han consolidado Grupo Gardea, empresa especializada en la distribución mayorista de gorras de marcas reconocidas; Bordados Gardea, enfocada en la personalización de prendas y artículos promocionales; 2CAP, cadena comercial especializada en la venta al detalle de gorras y accesorios con 77 puntos de venta distribuidos en México; e Inmobiliaria OSCA, dedicada al desarrollo, comercialización y administración de proyectos inmobiliarios.
                  </p>
                  <p>
                    Su visión empresarial lo ha llevado a establecer relaciones comerciales internacionales y a impulsar proyectos de vinculación que han beneficiado a numerosos empresarios. Convencido de la importancia de ampliar horizontes y conocer nuevas tendencias de negocio, ha promovido y participado en diversas misiones comerciales a la República Popular China, fortaleciendo oportunidades de intercambio comercial, aprendizaje y desarrollo empresarial para empresarios mexicanos.
                  </p>
                  <p>
                    Paralelamente a su actividad empresarial, ha mantenido una participación activa y comprometida dentro de la vida gremial, colaborando en diversos proyectos orientados al fortalecimiento empresarial, la vinculación y el desarrollo de líderes. Su disposición para servir y contribuir al crecimiento de otros empresarios le ha permitido ocupar distintas responsabilidades dentro de la organización, culminando con su gestión como Presidente de EVM Chihuahua durante el periodo 2024–2026.
                  </p>
                  <p>
                    Asimismo, ha formado parte de organismos e instituciones como el Consejo Coordinador Empresarial de Chihuahua (CCE), CANACO Chihuahua, Vector Empresarial Chihuahuense, Toastmasters Business Club y el Consejo de la Junta Municipal de Agua y Saneamiento de Chihuahua, aportando su experiencia, liderazgo y visión en beneficio de la comunidad empresarial y la sociedad chihuahuense.
                  </p>
                  <p>
                    Dentro de su trayectoria gremial sobresalen la organización de diversas misiones comerciales internacionales, la promoción de programas de capacitación y vinculación empresarial, la participación como conferencista en proyectos de formación para jóvenes y empresarios, así como su destacada labor como presidente del comité organizador de la Convención Nacional COMEV “Reencuentro en Chihuahua 2022”, uno de los eventos más representativos para la organización en los últimos años.
                  </p>
                  <p>
                    Quienes han trabajado a su lado reconocen en él a un líder íntegro, cercano y comprometido con las personas; un empresario que ha sabido combinar la visión estratégica con la sencillez, la honestidad y la vocación de servicio. Su capacidad para inspirar confianza, construir equipos y transformar desafíos en oportunidades ha sido una constante a lo largo de su trayectoria.
                  </p>
                  <p>
                    Más allá de los logros empresariales alcanzados, su legado se refleja en las organizaciones que ha construido, en las oportunidades que ha generado para cientos de familias y en el ejemplo de liderazgo que ha compartido con quienes han tenido la oportunidad de trabajar a su lado. Hombre de familia, promotor de valores y firme creyente en el trabajo como motor de transformación, ha sabido transmitir su visión a las nuevas generaciones, integrando a sus hijos al desarrollo y continuidad de los proyectos empresariales que ha construido durante décadas.
                  </p>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="pt-6 border-t border-surface-card-high/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="bg-surface-card/15 border border-surface-card/40 p-4 hover:border-secondary-orange/30 hover:bg-surface-card/35 transition-all duration-300 rounded">
                        <div className="flex gap-3 items-start">
                          <div className="p-2 bg-secondary-orange/10 border border-secondary-orange/20 text-secondary-orange rounded shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider">{item.title}</h5>
                            <p className="font-sans text-[11px] md:text-xs text-on-surface-variant/80 leading-normal">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                    className="w-full aspect-[4/5] object-cover"
                    src="/assets/oscar_gardea.jpg"
                  />
                </div>

                {/* Float sticker badge */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-secondary-orange py-4 px-5 min-w-44 shadow-2xl border border-secondary-orange/20 select-none">
                  <span className="font-headline font-black text-xs text-deep-blue block tracking-wider">
                    ★ GALARDONADO NACIONAL
                  </span>
                  <p className="font-mono text-[9px] text-deep-blue font-bold uppercase mt-0.5">
                    Presidente EVM 2024–2026
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
