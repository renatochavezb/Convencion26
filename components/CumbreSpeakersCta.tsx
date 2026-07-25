'use client';

import cumbreVentasLogo from '../assets/cumbre-ventas-logo.jpg';

export default function CumbreSpeakersCta() {
  return (
    <section className="relative border-t border-cyan-500/20 bg-[#020e1a] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none select-none">
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute -left-16 top-0 w-56 h-56 rounded-full bg-secondary-orange/20 blur-3xl" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-[80px] py-6 md:py-8">
        <a
          href="https://cumbredeventas.evmchihuahua.com/"
          target="_blank"
          rel="noopener noreferrer"
          id="btn-cumbre-speakers-info"
          className="group w-full flex flex-col sm:flex-row items-center justify-between gap-5 md:gap-8 text-left cursor-pointer no-underline"
        >
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <div className="shrink-0 p-2 md:p-3 border border-cyan-400/30 bg-cyan-500/5 group-hover:border-cyan-300/60 group-hover:bg-cyan-500/10 transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(6,182,212,0.25)]">
              <img
                src={cumbreVentasLogo.src}
                alt="Cumbre de Ventas 2026"
                className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300 select-none"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <span className="font-mono text-[10px] md:text-xs font-bold text-cyan-300 tracking-widest uppercase block">
                Cumbre de Ventas 2026
              </span>
              <p className="font-headline text-sm md:text-xl font-black text-white uppercase tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
                Más información sobre speakers y ponencias
              </p>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed hidden sm:block">
                Conoce a Alejandro Núñez, Néstor Guerra y el programa académico especial.
              </p>
            </div>
          </div>

          <span className="shrink-0 font-mono text-xs font-bold text-cyan-300/80 group-hover:text-cyan-200 tracking-wider uppercase flex items-center gap-2 px-4 py-2.5 border border-cyan-400/30 group-hover:border-cyan-300/70 group-hover:bg-cyan-500/10 transition-all duration-300">
            Más información
            <span className="inline-block group-hover:translate-x-1 transition-transform duration-300" aria-hidden>
              ➔
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
