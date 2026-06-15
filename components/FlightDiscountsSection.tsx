import type { ReactNode } from 'react';
import { Plane, Mail, ExternalLink, FileDown } from 'lucide-react';
import {
  IHTA_FOOTER_NOTE,
  IHTA_PAYMENT_INTRO,
  IHTA_PAYMENT_STEPS,
  IHTA_REQUEST_FIELDS,
  IHTA_REQUEST_FORM_LABEL,
  IHTA_REQUEST_FORM_PDF,
  IHTA_REQUEST_INTRO,
  IHTA_SALES_EMAIL,
  IHTA_TAR_WEBSITE,
} from '../data/ihtaTerms';

const IHTA_CYAN = '#00b4c8';

function ConditionItem({ children }: { children: ReactNode }) {
  return (
    <li className="font-sans text-xs md:text-[13px] text-on-surface-variant leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#00b4c8] before:text-base before:leading-none">
      {children}
    </li>
  );
}

export default function FlightDiscountsSection() {
  return (
    <section className="py-12 bg-[#041221] border-t border-surface-card/60 grid-pattern relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-[#00b4c8]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px] relative z-10">
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-secondary-orange/15 border border-secondary-orange/30 text-secondary-orange">
              <Plane className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-secondary-orange tracking-widest uppercase">
              Llega a la convención
            </span>
          </div>
          <h3 className="font-headline text-3xl md:text-5xl font-black text-white leading-tight uppercase italic">
            DESCUENTOS EN <span className="text-[#fe9800]">VUELOS</span>
          </h3>
          <p className="font-sans text-sm md:text-base text-on-surface-variant mt-3 max-w-2xl leading-relaxed">
            Convenio COMEV 2026 con TAR México a través de IHTA Agencia de viajes. Términos y condiciones oficiales del beneficio.
          </p>
        </div>

        {/* IHTA — Términos y Condiciones (contenido completo del documento) */}
        <article className="bg-surface-card border border-surface-card-high shadow-2xl overflow-hidden">
          <header
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 md:px-10 py-6 md:py-7 border-b-[3px]"
            style={{ borderColor: IHTA_CYAN }}
          >
            <div>
              <p
                className="font-headline font-black text-4xl md:text-5xl tracking-tighter leading-none"
                style={{ color: IHTA_CYAN }}
              >
                IHT<span className="inline-block translate-y-[-2px]">★</span>A
              </p>
              <p className="font-mono text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase mt-1">
                Agencia de viajes
              </p>
            </div>
            <h4
              className="font-headline font-black text-xl md:text-2xl tracking-[0.25em] uppercase text-center md:flex-1"
              style={{ color: IHTA_CYAN }}
            >
              Términos y Condiciones
            </h4>
            <p className="hidden md:block font-headline font-black text-lg tracking-widest text-white/80 uppercase w-[120px] text-right">
              TAR<span style={{ color: IHTA_CYAN }}>·</span>MÉXICO
            </p>
          </header>

          {/* CTA principal — descarga del formato (muy visible) */}
          <a
            href={IHTA_REQUEST_FORM_PDF}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="group relative block w-full overflow-hidden border-b-4 border-deep-blue bg-secondary-orange px-6 py-8 md:px-10 md:py-10 transition-all duration-300 hover:bg-[#ffa726] hover:scale-[1.01] active:scale-[0.995] shadow-[0_0_40px_rgba(254,152,0,0.45)] hover:shadow-[0_0_55px_rgba(254,152,0,0.6)]"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_12px,rgba(0,20,41,0.08)_12px,rgba(0,20,41,0.08)_24px)] pointer-events-none" />
            <div className="absolute top-3 right-4 md:top-4 md:right-8 font-mono text-[10px] md:text-xs font-black text-deep-blue/70 uppercase tracking-[0.2em] animate-pulse">
              Paso 1 · Obligatorio
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-sm bg-deep-blue text-secondary-orange shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileDown className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="font-mono text-[11px] md:text-xs font-black text-deep-blue uppercase tracking-[0.25em] mb-1">
                    ↓ Antes de solicitar tu vuelo
                  </p>
                  <p className="font-headline font-black text-2xl md:text-4xl text-deep-blue uppercase leading-[1.05] tracking-tight">
                    Descarga el formato PDF
                  </p>
                  <p className="font-sans text-sm md:text-base font-bold text-deep-blue/85 mt-1.5 max-w-xl">
                    {IHTA_REQUEST_FORM_LABEL} — un formato por cada pasajero
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center justify-center gap-2 self-start md:self-center shrink-0 bg-deep-blue text-secondary-orange px-6 py-4 md:px-8 md:py-5 font-mono text-xs md:text-sm font-black uppercase tracking-widest shadow-xl group-hover:bg-white group-hover:text-deep-blue transition-colors duration-300">
                <FileDown className="w-5 h-5 md:w-6 md:h-6" />
                Clic aquí para descargar
              </span>
            </div>
          </a>

          <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-surface-card-high">
            {/* Columna 1: Beneficio + Consideraciones */}
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <span
                  className="inline-block text-white font-mono text-[11px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm mb-3"
                  style={{ backgroundColor: IHTA_CYAN }}
                >
                  Beneficio Especial
                </span>
                <p className="font-sans text-sm md:text-[13.5px] text-on-surface leading-relaxed">
                  Obtén el{' '}
                  <strong className="font-bold" style={{ color: IHTA_CYAN }}>
                    20% de descuento
                  </strong>{' '}
                  sobre la tarifa base Star y Flex en tu reservación con TAR México.
                </p>
              </div>

              <div>
                <h5 className="font-headline font-bold text-sm uppercase tracking-wide text-white mb-3">
                  Consideraciones Generales
                </h5>
                <ul className="space-y-2.5">
                  <ConditionItem>
                    La reserva debe solicitarse al menos <strong className="text-white">72 horas hábiles</strong> antes de la fecha de salida del vuelo.
                  </ConditionItem>
                  <ConditionItem>
                    El pago deberá realizarse el mismo día de la solicitud para mantener el descuento.
                  </ConditionItem>
                  <ConditionItem>
                    El descuento aplica sobre la tarifa base, <strong className="text-white">no incluye impuesto</strong> (IVA, TUA).
                  </ConditionItem>
                  <ConditionItem>
                    Se pueden realizar cambios hasta <strong className="text-white">24 horas hábiles</strong> antes del vuelo pagando la penalidad de <strong className="text-white">$499</strong> para la tarifa Flex y <strong className="text-white">$699</strong> para la tarifa Star, más la diferencia tarifaria.
                  </ConditionItem>
                  <ConditionItem>
                    Por ser tarifa promocional, <strong className="text-white">no se permiten cancelaciones</strong>.
                  </ConditionItem>
                </ul>
              </div>
            </div>

            {/* Columna 2: Envía tu solicitud */}
            <div className="p-6 md:p-8 space-y-5">
              <h5
                className="font-headline font-bold text-sm uppercase tracking-wide text-white pb-2 border-b-2"
                style={{ borderColor: IHTA_CYAN }}
              >
                I. Envía tu Solicitud
              </h5>

              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-secondary-orange bg-secondary-orange/10 border border-secondary-orange/30 px-3 py-2 text-center">
                Paso 2 — Llena el formato y envíalo por correo
              </p>

              <div className="bg-[#00b4c8]/10 border-l-[3px] pl-4 py-3" style={{ borderColor: IHTA_CYAN }}>
                <p className="font-sans text-[11px] text-on-surface-variant mb-1">Envía un correo a:</p>
                <a
                  href={`mailto:${IHTA_SALES_EMAIL}`}
                  className="font-sans text-sm font-bold break-all hover:underline"
                  style={{ color: IHTA_CYAN }}
                >
                  {IHTA_SALES_EMAIL}
                </a>
              </div>

              <p className="font-sans text-xs md:text-[12.5px] text-on-surface-variant leading-relaxed">
                <strong className="text-white">Primero descarga el formato (botón naranja arriba).</strong>{' '}
                {IHTA_REQUEST_INTRO}
              </p>

              <ul>
                {IHTA_REQUEST_FIELDS.map((field) => (
                  <li
                    key={field}
                    className="font-sans text-xs md:text-[13px] text-on-surface-variant py-2 pl-5 border-b border-dashed border-surface-card-high/80 relative before:content-['›'] before:absolute before:left-0 before:text-[#00b4c8] before:font-bold before:text-base"
                  >
                    {field}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${IHTA_SALES_EMAIL}?subject=COMEV%202026%20-%20Solicitud%20de%20vuelo`}
                className="inline-flex items-center gap-2 w-full justify-center py-3 font-mono text-xs font-bold uppercase tracking-widest border transition-colors hover:bg-[#00b4c8] hover:text-deep-blue hover:border-[#00b4c8]"
                style={{ borderColor: `${IHTA_CYAN}66`, color: IHTA_CYAN }}
              >
                <Mail className="w-4 h-4" />
                Enviar solicitud por correo
              </a>
            </div>

            {/* Columna 3: Cotización y pago */}
            <div className="p-6 md:p-8 space-y-5">
              <h5
                className="font-headline font-bold text-sm uppercase tracking-wide text-white pb-2 border-b-2"
                style={{ borderColor: IHTA_CYAN }}
              >
                II. Cotización y Pago
              </h5>

              <p className="font-sans text-xs md:text-[12.5px] text-on-surface-variant leading-relaxed">
                {IHTA_PAYMENT_INTRO}
              </p>

              <ol className="space-y-4">
                {IHTA_PAYMENT_STEPS.map((step, index) => (
                  <li
                    key={step}
                    className="font-sans text-xs md:text-[12.5px] text-on-surface-variant leading-relaxed pl-9 relative"
                  >
                    <span
                      className="absolute left-0 top-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold text-deep-blue"
                      style={{ backgroundColor: IHTA_CYAN }}
                    >
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 md:px-10 py-4 border-t border-surface-card-high bg-deep-blue/40">
            <p className="font-sans text-[11.5px] text-on-surface-variant leading-relaxed">
              {IHTA_FOOTER_NOTE}{' '}
              <a
                href={IHTA_TAR_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline break-all"
                style={{ color: IHTA_CYAN }}
              >
                {IHTA_TAR_WEBSITE}
              </a>
            </p>
            <p className="font-headline font-black text-lg tracking-widest text-white uppercase shrink-0">
              TAR<span style={{ color: IHTA_CYAN }}>·</span>MÉXICO
            </p>
          </footer>
        </article>

        {/* Volaris — sin información en el documento oficial aún */}
        {/* 
        <div className="mt-6 p-5 border border-dashed border-[#572A88]/40 bg-[#572A88]/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-headline font-black text-xl text-[#9b6bb8] lowercase italic">volaris</p>
            <p className="font-sans text-xs text-on-surface-variant mt-1">
              Beneficio en confirmación. Los términos de Volaris se publicarán aquí cuando estén disponibles.
            </p>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_VITE_VOLARIS_BOOKING_URL || 'https://www.volaris.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#572A88]/50 text-[#c9a8e0] px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-[#572A88]/20 transition-colors shrink-0"
          >
            Ir a Volaris
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        */}
      </div>
    </section>
  );
}
