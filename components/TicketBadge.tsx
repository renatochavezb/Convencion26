import { RegistrationDetails } from '../types';
import { Download, Check, Printer, RefreshCw, Star, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import logoGradiente from '../assets/logo-gradiente.png';
import logoNaranja from '../assets/logo-naranja.png';
import logoBlanco from '../assets/logo-blanco.png';

interface TicketBadgeProps {
  registration: RegistrationDetails;
  onClear: () => void;
}

export default function TicketBadge({ registration, onClear }: TicketBadgeProps) {
  const [downloaded, setDownloaded] = useState(false);

  // Select badge logo based on attendee role
  const getBadgeLogo = () => {
    switch (registration.badgeRole) {
      case 'VIP':
        return logoGradiente.src;
      case 'Invitado Especial':
        return logoBlanco.src;
      default:
        return logoNaranja.src;
    }
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate simple repeatable hash to draw a unique customized QR code vector
  const getQrPaths = (seedStr: string) => {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const paths = [];
    for (let x = 1; x <= 6; x++) {
      for (let y = 1; y <= 6; y++) {
        // Deterministic mock generation based on ticket seed hash bits
        const active = (Math.abs(hash) + (x * 123) + (y * 456)) % 2 === 0;
        if (active) {
          paths.push(`M ${x * 4} ${y * 4} h 3 v 3 h -3 z`);
        }
      }
    }
    return paths.join(' ');
  };

  return (
    <div className="bg-surface-card border-2 border-secondary-orange p-6 md:p-8 space-y-8 animate-fadeIn relative">
      <div className="text-center">
        <span className="inline-flex items-center gap-1 bg-secondary-orange/10 text-secondary-orange px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-secondary-orange/20">
          <Check className="w-4.5 h-4.5" /> ¡REGISTRO EXITOSO!
        </span>
        <h4 className="font-headline font-black text-white text-2xl">TU CARNET DIGITAL ESTÁ LISTO</h4>
        <p className="font-sans text-sm text-on-surface-variant max-w-sm mx-auto mt-1">
          Guarda esta credencial en tu celular. Será escaneada en el mostrador principal del Hotel María Bonita.
        </p>
      </div>

      {/* Lanyard Graphic Card */}
      <div className="flex justify-center">
        <div className="w-[310px] bg-[#020d18] border-t-[14px] border-secondary-orange border-x border-b border-surface-variant p-5 text-white relative shadow-2xl overflow-hidden flex flex-col justify-between min-h-[460px] group/card">
          
          {/* Holographic shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover/card:translate-x-full ease-out" style={{ transitionDuration: '1.5s' }} />

          {/* Lanyard Loop simulation */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-black/50 border border-outline/20 rounded-t-sm" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

          {/* Badge top stats */}
          <div className="flex justify-between items-start pt-3 relative z-10 font-mono text-[9px] text-on-surface-variant">
            <span>CHIHUAHUA, MX</span>
            <span>SEPT 3-5, 2026</span>
          </div>

          <div className="flex flex-col items-center my-3 relative z-10 group/logo">
            <div className="relative overflow-hidden rounded-full p-1">
              {/* Interactive foil glow overlay for innovation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover/logo:translate-x-full ease-out" style={{ transitionDuration: '1s' }} />
              <img 
                src={getBadgeLogo()} 
                alt="COMEV Logo" 
                className="w-28 h-28 object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover/logo:scale-105"
              />
            </div>
            <p className="font-mono text-[8px] text-on-surface-variant tracking-widest uppercase mt-2">
              • Convención Nacional 2026 •
            </p>
          </div>

          {/* Badge classification category */}
          <div className="text-center relative z-10 mb-4">
            <div className={`inline-block py-1 px-4 text-xs font-mono font-black uppercase tracking-wider ${
              registration.badgeRole === 'VIP' ? 'bg-[#ffc080] text-deep-blue' :
              registration.badgeRole === 'Invitado Especial' ? 'bg-white text-deep-blue' :
              registration.badgeRole === 'Prensa' ? 'bg-[#001f3f] text-accent-orange border border-accent-orange/40' :
              'bg-secondary-orange text-deep-blue'
            }`}>
              {registration.badgeRole}
            </div>
          </div>

          {/* Dynamic details */}
          <div className="space-y-4 text-center relative z-10">
            <div>
              <p className="font-headline font-black text-[19px] leading-tight text-white uppercase line-clamp-2">
                {registration.name}
              </p>
              <p className="font-sans text-xs text-secondary-orange mt-0.5 font-medium italic">
                {registration.position}
              </p>
            </div>

            <div className="border-t border-dashed border-outline/20 pt-3">
              <p className="font-sans text-[11px] text-white font-semibold">
                {registration.company}
              </p>
              <p className="font-mono text-[8px] text-on-surface-variant uppercase mt-0.5">
                ORGANIZACIÓN / FILIACIÓN
              </p>
            </div>
          </div>

          {/* QR Code and metadata */}
          <div className="flex justify-between items-center border-t border-outline/20 pt-4 mt-4 relative z-10">
            <div className="text-left font-mono text-[9px] text-on-surface-variant space-y-1">
              <div>
                ID: <span className="text-white font-bold">{registration.ticketId}</span>
              </div>
              <div>
                REG: <span className="text-white">{registration.registeredAt}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span className="text-[8px] uppercase">CARNET ACTIVO</span>
              </div>
            </div>

            {/* Custom Deterministic Vector QR */}
            <div className="bg-white p-1.5 border border-surface-variant">
              <svg className="w-[60px] h-[60px]" viewBox="0 0 32 32">
                {/* 3 standard black corner anchor boxes */}
                <path d="M 1 1 h 8 v 8 h -8 z M 3 3 h 4 v 4 h -4 z" fill="black" />
                <path d="M 23 1 h 8 v 8 h -8 z M 25 3 h 4 v 4 h -4 z" fill="black" />
                <path d="M 1 23 h 8 v 8 h -8 z M 3 25 h 4 v 4 h -4 z" fill="black" />
                {/* Seed-based customized path code */}
                <path d={getQrPaths(registration.ticketId)} fill="black" />
              </svg>
            </div>
          </div>

          {/* Bottom Speed Stripe */}
          <div className="mt-4 flex gap-1 justify-center opacity-60">
            <div className="w-1.5 h-1.5 bg-secondary-orange" />
            <div className="w-1.5 h-1.5 bg-accent-orange" />
            <div className="w-1.5 h-1.5 bg-white" />
            <div className="w-1.5 h-1.5 bg-secondary-orange" />
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          onClick={handleDownload}
          id="btn-download-carnet"
          className="bg-secondary-orange hover:bg-white text-deep-blue font-mono text-xs font-bold leading-none tracking-widest px-6 py-4 transition-all uppercase flex items-center justify-center gap-2"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-deep-blue" /> ¡DESCARGADO!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-deep-blue" /> DESCARGAR IMAGEN
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          id="btn-print-carnet"
          className="border-2 border-white text-white hover:bg-white hover:text-deep-blue font-mono text-xs font-bold leading-none tracking-widest px-6 py-4 transition-all uppercase flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" /> IMPRIMIR EXPEDIENTE
        </button>

        <button
          onClick={onClear}
          id="btn-reregister"
          className="border border-white/20 text-on-surface-variant hover:text-white font-mono text-[10px] leading-none tracking-widest px-4 py-4 transition-all uppercase flex items-center justify-center gap-1.5 hover:bg-white/5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> REGISTRAR OTRO
        </button>
      </div>

      {/* Partnership Information */}
      {registration.ticketType === 'pareja' && (
        <div className="bg-surface-card-high border border-dashed border-outline/30 p-4 font-sans text-xs text-on-surface-variant space-y-1.5">
          <p className="font-bold text-white uppercase text-[10px] text-secondary-orange flex items-center gap-1 justify-center sm:justify-start">
            <Star className="w-3.5 h-3.5 fill-secondary-orange text-secondary-orange" /> SEGUNDA CREDENCIAL INCLUIDA (MODALIDAD PAREJA)
          </p>
          <p className="text-center sm:text-left">
            Se ha enviado un correo electrónico de enlace a <span className="text-white font-semibold">{registration.partnerEmail}</span> para que <span className="text-white font-semibold">{registration.partnerName}</span> reclame su lanyard pass independiente de forma gratuita.
          </p>
        </div>
      )}
    </div>
  );
}
