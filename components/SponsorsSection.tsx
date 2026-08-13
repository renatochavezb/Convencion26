'use client';

import gobiernoLogo from '../assets/sponsors-cumbre-ventas/logo-gobierno-chihuahua-blanco.png';
import secretariaLogo from '../assets/sponsors-cumbre-ventas/logo-secretaria-innovacion-chihuahua-transparent.png';
import cuentaConmigoLogo from '../assets/sponsors-cumbre-ventas/logo-cuenta-conmigo-transparent.png';
import sponsorC10 from '../assets/sponsors-cumbre-ventas/sponsor-c10.png';
import sponsorCodichisa from '../assets/sponsors-cumbre-ventas/sponsor-codichisa.png';
import sponsorDulceNoviembre from '../assets/sponsors-cumbre-ventas/sponsor-dulce-noviembre.png';
import sponsorFatrema from '../assets/sponsors-cumbre-ventas/sponsor-fatremo.png';
import sponsorGardea from '../assets/sponsors-cumbre-ventas/sponsor-gardea.png';
import sponsorLuzande from '../assets/sponsors-cumbre-ventas/sponsor-luzande.png';
import sponsorProsesa from '../assets/sponsors-cumbre-ventas/sponsor-prosesa.png';
import sponsorSofia from '../assets/sponsors-cumbre-ventas/sponsor-sofia.png';
import sponsorTortas from '../assets/sponsors-cumbre-ventas/sponsor-tortas-tu-tio.png';
import sponsorVillalobos from '../assets/sponsors-cumbre-ventas/sponsor-villalobos.png';
import sponsorCorporativoFiscal from '../assets/sponsors-cumbre-ventas/sponsor-corporativo-fiscal.png';
import sponsorNancyMx from '../assets/sponsors-cumbre-ventas/sponsor-nancy-mx.png';
import sponsorMacopisa from '../assets/sponsors-cumbre-ventas/sponsor-macopisa.png';
import sponsorBusinessHarmony from '../assets/sponsors-cumbre-ventas/sponsor-business-harmony.png';
import sponsorHaciendaSanJose from '../assets/sponsors-cumbre-ventas/sponsor-hacienda-san-jose.png';
import sponsorArema from '../assets/sponsors-cumbre-ventas/sponsor-arema.png';
import sponsorCos from '../assets/sponsors-cumbre-ventas/sponsor-cos.png';

const PRINCIPALES = [
  {
    src: gobiernoLogo.src,
    alt: 'Gobierno Municipal de Chihuahua',
    className: 'h-14 md:h-20 w-auto max-w-[220px] md:max-w-[280px] object-contain',
    plate: 'dark' as const,
  },
  {
    src: secretariaLogo.src,
    alt: 'Secretaría de Innovación y Desarrollo Económico',
    className: 'h-12 md:h-16 w-auto max-w-[240px] md:max-w-[320px] object-contain',
    plate: 'light' as const,
  },
  {
    src: cuentaConmigoLogo.src,
    alt: 'Cuenta Conmigo',
    className: 'h-16 md:h-20 w-auto max-w-[140px] md:max-w-[170px] object-contain',
    plate: 'dark' as const,
  },
];

const SPONSORS = [
  { src: sponsorGardea.src, alt: 'Grupo Gardea', size: 'md' as const },
  { src: sponsorC10.src, alt: 'C10 Laboratorio e Imagenología', size: 'md' as const },
  { src: sponsorCodichisa.src, alt: 'Codichisa', size: 'md' as const },
  { src: sponsorProsesa.src, alt: 'Prosesa', size: 'md' as const },
  { src: sponsorVillalobos.src, alt: 'Villalobos', size: 'md' as const },
  { src: sponsorLuzande.src, alt: 'Luzandé Eventos', size: 'lg' as const },
  { src: sponsorSofia.src, alt: 'Sofía', size: 'lg' as const },
  { src: sponsorFatrema.src, alt: 'Fatrema', size: 'lg' as const },
  { src: sponsorDulceNoviembre.src, alt: 'Dulce Noviembre', size: 'lg' as const },
  { src: sponsorTortas.src, alt: 'Tortas Tu Tío', size: 'xl' as const },
  { src: sponsorCorporativoFiscal.src, alt: 'Corporativo Fiscal', size: 'xl' as const },
  { src: sponsorNancyMx.src, alt: 'Nancy MX', size: 'md' as const },
  { src: sponsorMacopisa.src, alt: 'MACOPISA', size: 'xl' as const },
  { src: sponsorBusinessHarmony.src, alt: 'Business Harmony Method', size: 'xl' as const },
  { src: sponsorHaciendaSanJose.src, alt: 'Hacienda San José Eventos', size: 'lg' as const },
  { src: sponsorArema.src, alt: 'AREMA', size: 'md' as const },
  { src: sponsorCos.src, alt: 'COS Sports, Friends & Drinks', size: 'lg' as const },
];

const LOGO_SIZE = {
  md: 'max-h-[48px] md:max-h-[56px] max-w-[132px] md:max-w-[152px]',
  lg: 'max-h-[60px] md:max-h-[70px] max-w-[148px] md:max-w-[168px]',
  xl: 'max-h-[68px] md:max-h-[80px] max-w-[156px] md:max-w-[172px]',
};

function SponsorPlate({
  src,
  alt,
  size = 'md',
}: {
  src: string;
  alt: string;
  size?: keyof typeof LOGO_SIZE;
}) {
  return (
    <div className="shrink-0 flex items-center justify-center w-[156px] md:w-[176px] h-[76px] md:h-[88px] px-2.5 md:px-3 bg-white/95 border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`block w-auto h-auto object-contain ${LOGO_SIZE[size]}`}
      />
    </div>
  );
}

export default function SponsorsSection() {
  const parade = [...SPONSORS, ...SPONSORS];

  return (
    <section id="patrocinadores" className="relative border-t border-surface-card bg-deep-blue overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute left-1/4 top-0 w-72 h-72 rounded-full bg-secondary-orange/10 blur-3xl" />
        <div className="absolute right-1/5 bottom-0 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-[80px] pt-12 md:pt-16 pb-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="font-mono text-[10px] md:text-xs font-bold text-[#fe9800] tracking-widest uppercase block mb-2">
            Con el apoyo de
          </span>
          <h3 className="font-headline font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-none">
            Patrocinadores
          </h3>
          <p className="text-on-surface-variant font-sans text-xs md:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Instituciones y empresas que impulsan la Convención Nacional COMEV 2026.
          </p>
        </div>

        <div className="mb-4">
          <p className="font-mono text-[9px] md:text-[10px] font-bold text-cyan-300/80 tracking-widest uppercase text-center mb-5">
            Patrocinadores principales
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {PRINCIPALES.map((logo) => (
              <div
                key={logo.alt}
                className={`flex items-center justify-center min-h-[88px] md:min-h-[104px] px-5 md:px-8 ${
                  logo.plate === 'light'
                    ? 'bg-white/95 border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)]'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <img src={logo.src} alt={logo.alt} className={logo.className} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative pb-12 md:pb-16">
        <p className="font-mono text-[9px] md:text-[10px] font-bold text-on-surface-variant tracking-widest uppercase text-center mb-5 px-5">
          Patrocinadores
        </p>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-deep-blue to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-deep-blue to-transparent z-10" />

          <div className="flex w-max animate-sponsors-marquee hover:[animation-play-state:paused]">
            {parade.map((logo, index) => (
              <div key={`${logo.alt}-${index}`} className="px-3 md:px-4">
                <SponsorPlate src={logo.src} alt={logo.alt} size={logo.size} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
