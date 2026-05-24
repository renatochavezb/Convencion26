import React, { useState } from 'react';
import { Star, ShieldCheck, Mail, HelpCircle, PhoneCall } from 'lucide-react';

interface RegistrationTicketsProps {
  onSelectModality: (modality: 'individual' | 'pareja') => void;
}

export default function RegistrationTickets({ onSelectModality }: RegistrationTicketsProps) {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryCompany, setInquiryCompany] = useState('');
  const [inquiryCount, setInquiryCount] = useState(5);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setShowInquiryModal(false);
      setInquiryName('');
      setInquiryCompany('');
    }, 2500);
  };

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
              Seleccionar Individual
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
              Seleccionar Pareja
            </button>
          </div>

        </div>

        {/* Corporate / Billing Inquiry Contact details */}
        <div 
          onClick={() => setShowInquiryModal(true)}
          className="mt-6 text-center p-8 border border-dashed border-outline/30 hover:border-secondary-orange cursor-pointer hover:bg-white/5 transition-all duration-300"
        >
          <p className="font-sans text-sm text-on-surface-variant">
            Para facturación o grupos corporativos:
          </p>
          <p className="font-headline font-bold text-xl md:text-2xl mt-1.5 text-white hover:text-secondary-orange transition-colors">
            Más informes: <span className="text-[#fe9800]">614 454 01 52</span>
          </p>
          <span className="inline-block mt-2 font-mono text-[9px] text-[#fe9800] tracking-wider uppercase border border-[#fe9800]/20 px-2 py-0.5">
            📩 CLIC AQUÍ PARA COTIZAR DESCUENTOS POR VOLUMEN
          </span>
        </div>

      </div>

      {/* Corporate inquiry popup */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-deep-blue/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-card border border-secondary-orange w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1"
            >
              <XIcon />
            </button>
            
            <h4 className="font-headline font-black text-lg text-white mb-2 uppercase">SOLICITUD DE DESCUENTO CORPORATIVO</h4>
            <p className="font-sans text-xs text-on-surface-variant mb-4">
              Ofrecemos esquemas preferenciales para delegaciones de más de 3 integrantes de la misma organización.
            </p>

            {inquirySubmitted ? (
              <div className="text-center py-6 space-y-3">
                <ShieldCheck className="w-12 h-12 text-secondary-orange mx-auto animate-bounce" />
                <p className="font-headline font-bold text-sm text-white">¡INFORME SOLICITADO!</p>
                <p className="font-sans text-xs text-on-surface-variant">Un agente de EVM Chihuahua se comunicará en breve al 614 454 01 52 o por correo.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <div>
                  <label className="font-mono text-[9px] text-on-surface-variant block mb-1">Nombre del Solicitante *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Ing. Carlos Amador"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-variant p-2 text-xs text-white focus:outline-none focus:border-secondary-orange rounded-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-on-surface-variant block mb-1">Empresa / Consorcio *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Interceramic de Chihuahua"
                    value={inquiryCompany}
                    onChange={(e) => setInquiryCompany(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-variant p-2 text-xs text-white focus:outline-none focus:border-secondary-orange rounded-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-on-surface-variant block mb-1">Número de Asistentes en tu Grupo ({inquiryCount})</label>
                  <input 
                    type="range" 
                    min={3} 
                    max={25} 
                    value={inquiryCount}
                    onChange={(e) => setInquiryCount(parseInt(e.target.value))}
                    className="w-full accent-secondary-orange mt-1.5"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-on-surface-variant mt-1">
                    <span>3 Personas</span>
                    <span>25 Personas</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  id="btn-submit-corporate-inquiry"
                  className="w-full bg-secondary-orange text-deep-blue py-3 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-deep-blue transition-colors rounded-none mt-4"
                >
                  Enviar Petición de Cotización
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}

// Simple internal icon to avoid cluttering imports
function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
