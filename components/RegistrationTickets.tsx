import React from 'react';
import { WHATSAPP_INFORMES_URL } from '../constants/whatsapp';

interface RegistrationTicketsProps {
  onSelectModality: (modality: 'individual' | 'pareja') => void;
  onBankDetailsClick: () => void;
  onProofClick: () => void;
}

export default function RegistrationTickets({ onSelectModality, onBankDetailsClick, onProofClick }: RegistrationTicketsProps) {
  return (
    <section className="py-12 bg-deep-blue border-t border-surface-card-high">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="font-headline font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-none">
            CARNET <span className="text-[#ffc080]">DE ACCESO</span>
          </h3>
          <p className="text-on-surface-variant font-sans text-base md:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            Asegura tu lugar en el evento empresarial más importante de la región. Elige la modalidad que mejor se adapte a ti.
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Individual */}
          <div 
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
            className="group bg-surface-card border border-surface-card-high p-8 md:p-12 relative hover:border-secondary-orange duration-300 transition-all flex flex-col justify-between glass-card-glow overflow-hidden"
          >
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold tracking-widest text-[#fe9800] uppercase block">
                MODALIDAD
              </span>
              <h4 className="font-headline font-black text-3xl md:text-4xl text-white uppercase italic">
                Individual
              </h4>
              
              <div className="py-4 font-sans text-on-surface-variant text-sm space-y-2 border-y border-surface-card-high/50">
                <p className="flex items-center gap-2">✔ Acceso completo a todas las ponencias del 3 al 5 de Septiembre.</p>
                <p className="flex items-center gap-2">✔ Kit de bienvenida del congresista con materiales impresos.</p>
                <p className="flex items-center gap-2">✔ Coffee break continuo durante las jornadas de conferencias.</p>
              </div>

              <div className="mb-8 pt-4">
                <span className="text-on-surface-variant font-mono text-xs block mb-1">INVERSIÓN</span>
                <span className="font-headline font-black text-4xl md:text-5xl text-white tracking-tighter">
                  $4,000 <span className="font-sans text-base text-[#fe9800] font-bold">MXN</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => onSelectModality('individual')}
              id="select-ticket-individual"
              className="w-full border-2 border-white text-white py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-white/15 transition-all cursor-pointer rounded-none btn-glow-white"
            >
              Individual
            </button>
          </div>

          {/* Por Pareja (Recommended) */}
          <div 
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
            className="group bg-surface-card-high border-2 border-secondary-orange p-8 md:p-12 relative shadow-2xl flex flex-col justify-between overflow-hidden glass-card-glow"
          >
            
            {/* Recommended Badge Ribbon */}
            <div className="absolute top-0 right-0 bg-secondary-orange text-deep-blue font-mono text-[9px] font-bold px-5 py-1 tracking-wider uppercase">
              RECOMENDADO
            </div>

            <div className="space-y-6">
              <span className="font-mono text-xs font-bold tracking-widest text-[#fe9800] uppercase block">
                MODALIDAD
              </span>
              <h4 className="font-headline font-black text-3xl md:text-4xl text-white uppercase italic">
                Por Pareja
              </h4>
              
              <div className="py-4 font-sans text-on-surface-variant text-sm space-y-2 border-y border-surface-card-high/50">
                <p className="flex items-center gap-2 text-white font-semibold">★ Incluye DOS carnets de acceso total a precio preferencial.</p>
                <p className="flex items-center gap-2">✔ Doble kit de bienvenida para ambos participantes.</p>
                <p className="flex items-center gap-2">✔ Acceso al Cóctel de Gala VIP en la Terraza Estelar el Día 4.</p>
              </div>

              <div className="mb-0 pt-4">
                <span className="text-on-surface-variant font-mono text-xs block mb-1">INVERSIÓN</span>
                <span className="font-headline font-black text-4xl md:text-5xl text-white tracking-tighter block">
                  $7,500 <span className="font-sans text-base text-[#fe9800] font-bold">MXN</span>
                </span>
                <span className="text-[10px] font-sans text-emerald-400 mt-1 block">
                  💡 Ahorra $500 MXN en comparación con compras individuales.
                </span>
              </div>
            </div>

            <button 
              onClick={() => onSelectModality('pareja')}
              id="select-ticket-couple"
              className="w-full bg-secondary-orange text-deep-blue py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#ffa726] transition-all cursor-pointer rounded-none shadow-lg mt-8 btn-glow-orange"
            >
              Pareja
            </button>
          </div>

        </div>

        {/* Registrarse + Datos bancarios + Comprobante */}
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-4">
          <button
            type="button"
            onClick={() => onSelectModality('individual')}
            id="btn-registrarse"
            className="border-2 border-[#9333ea]/70 text-[#c084fc] hover:bg-[#9333ea]/10 hover:text-white hover:border-[#d946ef] font-headline text-sm font-bold uppercase tracking-wider px-10 py-4 cursor-pointer rounded-none transition-all"
          >
            Registrarse
          </button>
          <button
            type="button"
            onClick={onBankDetailsClick}
            id="btn-datos-bancarios"
            className="border-2 border-emerald-400/70 text-emerald-300 hover:bg-emerald-400/10 hover:text-white hover:border-emerald-300 font-headline text-sm font-bold uppercase tracking-wider px-10 py-4 cursor-pointer rounded-none transition-all"
          >
            Datos bancarios
          </button>
          <button
            type="button"
            onClick={onProofClick}
            id="btn-comprobante"
            className="border-2 border-[#fe9800]/70 text-[#ffc080] hover:bg-[#fe9800]/10 hover:text-white hover:border-[#fe9800] font-headline text-sm font-bold uppercase tracking-wider px-10 py-4 cursor-pointer rounded-none transition-all"
          >
            Comprobante
          </button>
        </div>

        {/* Billing Inquiry Contact details */}
        <div className="mt-6 text-center p-8 border border-dashed border-outline/30 hover:border-secondary-orange hover:bg-white/5 transition-all duration-300">
          <p className="font-sans text-sm text-on-surface-variant">
            Para facturación o informes:
          </p>
          <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <a 
              href="tel:+526142278711"
              className="font-headline font-bold text-xl md:text-2xl text-white hover:text-secondary-orange transition-colors flex items-center gap-2 select-text"
            >
              Más informes: <span className="text-[#fe9800]">614 227 87 11</span>
            </a>
            
            <a
              href={WHATSAPP_INFORMES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-[#05172b] hover:text-white px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-[0_0_15px_rgba(37,211,102,0.2)] active:scale-95 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.503 4.883 1.504 5.428 0 9.845-4.414 9.848-9.841.002-2.63-1.018-5.101-2.871-6.958C16.6 2.002 14.127.985 11.999.985 6.574.985 2.158 5.4 2.156 10.826c-.001 1.688.455 3.336 1.32 4.793l-.988 3.606 3.693-.97c1.47.801 3.055 1.202 4.673 1.202H6.602a.01.01 0 0 0-.012.001zm11.53-3.691c-.296-.148-1.748-.862-2.019-.962-.27-.099-.467-.148-.662.148-.196.297-.76.962-.931 1.16-.171.197-.341.221-.637.074-1.28-.64-2.274-1.18-3.097-2.593-.217-.373.217-.346.621-1.152.069-.138.034-.259-.017-.358-.052-.099-.467-1.127-.64-1.54-.168-.405-.333-.351-.467-.358-.12-.006-.259-.007-.397-.007-.138 0-.363.052-.553.259-.19.208-.727.711-.727 1.733 0 1.022.744 2.01 1.848 2.158.11.015 2.137 3.262 5.178 4.57.72.311 1.282.497 1.72.636.724.23 1.381.197 1.902.12.58-.087 1.748-.714 1.993-1.401.246-.688.246-1.278.172-1.401-.074-.123-.27-.197-.566-.346z" />
              </svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
