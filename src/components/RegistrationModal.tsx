import React, { useState } from 'react';
import { RegistrationDetails } from '../types';
import { X, CreditCard, Landmark, CheckCircle2, Loader2, ArrowRight, Star, Tag, Smartphone } from 'lucide-react';

interface RegistrationModalProps {
  modality: 'individual' | 'pareja';
  onClose: () => void;
  onSuccess: (data: RegistrationDetails) => void;
}

export default function RegistrationModal({ modality, onClose, onSuccess }: RegistrationModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Info, Step 2: Billing & Submit
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [badgeRole, setBadgeRole] = useState<'Asistente' | 'Invitado Especial' | 'VIP' | 'Prensa'>('Asistente');
  
  // Partner Fields if "pareja"
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');

  // Payment simulated values
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);

  const price = modality === 'individual' ? 4000 : 7500;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Initial validations
    if (!name.trim() || !email.trim() || !company.trim() || !position.trim()) {
      setValidationError('Todos los campos primarios son obligatorios para generar tu credencial.');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (modality === 'pareja') {
      if (!partnerName.trim() || !partnerEmail.trim()) {
        setValidationError('La modalidad compartida requiere ingresar los datos del acompañante.');
        return;
      }
      if (!partnerEmail.includes('@')) {
        setValidationError('Por favor ingresa un correo electrónico válido para tu acompañante.');
        return;
      }
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvv) {
        setValidationError('Ingresa la información completa de tu tarjeta de crédito/débito para procesar el pago.');
        setLoading(false);
        return;
      }
    }

    // Simulate 1.5 seconds loading state
    setTimeout(() => {
      const generatedTicketId = 'CMV-' + Math.floor(100000 + Math.random() * 900000).toString();
      const payload: RegistrationDetails = {
        ticketId: generatedTicketId,
        name,
        email,
        company,
        position,
        badgeRole,
        ticketType: modality,
        partnerName: modality === 'pareja' ? partnerName : undefined,
        partnerEmail: modality === 'pareja' ? partnerEmail : undefined,
        registeredAt: new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        })
      };

      setLoading(false);
      onSuccess(payload);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-deep-blue/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-card border-2 border-secondary-orange w-full max-w-lg overflow-hidden shrink-0 relative shadow-2xl">
        
        {/* Banner header decoration */}
        <div className="bg-gradient-to-r from-secondary-orange to-accent-orange h-2 w-full" />

        {/* Modal Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1 hover:bg-white/15 cursor-pointer border border-transparent hover:border-surface-variant transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          
          <div className="mb-6">
            <span className="font-mono text-[9px] text-secondary-orange font-bold uppercase tracking-widest block mb-1">
              PROCESO DE INSCRIPCIÓN
            </span>
            <h4 className="font-headline font-black text-2xl text-white uppercase italic">
              Carnet {modality === 'individual' ? 'Individual' : 'Por Pareja'}
            </h4>
            <div className="flex items-center gap-1.5 font-mono text-xs text-on-surface-variant mt-1">
              <span>Costo total:</span>
              <span className="text-secondary-orange font-bold text-sm">${price.toLocaleString('es-MX')} MXN</span>
              <span className="opacity-50">|</span>
              <span className="bg-white/5 px-2 py-0.5 border border-surface-variant uppercase text-[10px]">
                CON ACCESO TOTAL
              </span>
            </div>
          </div>

          {validationError && (
            <div className="bg-red-950/40 border border-red-500/30 p-3 text-red-300 text-xs font-sans mb-5 leading-relaxed">
              ⚠️ {validationError}
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: ATTENDEE INFORMATION */
            <form onSubmit={handleNextStep} className="space-y-4">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pb-1 border-b border-surface-variant">
                👤 DATOS DEL TITULAR
              </p>

              <div>
                <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Nombre Completo *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Néstor Guerra"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setValidationError(null); }}
                  className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1 font-semibold">Correo Electrónico *</label>
                  <input 
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setValidationError(null); }}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Clasificación Carnet *</label>
                  <select
                    value={badgeRole}
                    onChange={(e) => setBadgeRole(e.target.value as any)}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                  >
                    <option value="Asistente">Asistente General</option>
                    <option value="VIP">Acceso VIP Gold</option>
                    <option value="Prensa">Prensa / Reportero</option>
                    <option value="Invitado Especial">Invitado Especial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Empresa / Institución *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. EVM Chihuahua"
                    value={company}
                    onChange={(e) => { setCompany(e.target.value); setValidationError(null); }}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Cargo / Puesto *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Líder de Operaciones"
                    value={position}
                    onChange={(e) => { setPosition(e.target.value); setValidationError(null); }}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                  />
                </div>
              </div>

              {/* Partner entries if shared coupon selected */}
              {modality === 'pareja' && (
                <div className="space-y-4 pt-4 border-t border-dashed border-outline-variant/30 mt-6 bg-[#04111d] p-4 font-sans">
                  <p className="font-mono text-[10px] text-secondary-orange font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-secondary-orange text-secondary-orange" /> 👥 DATOS DEL ACOMPAÑANTE
                  </p>
                  <p className="text-[11px] text-on-surface-variant leading-tight">
                    La modalidad con precio preferencial por pareja requiere de los datos del segundo asistente beneficiado.
                  </p>
                  
                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Nombre Completo Acompañante *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ej. Sandra Lozano"
                      value={partnerName}
                      onChange={(e) => { setPartnerName(e.target.value); setValidationError(null); }}
                      className="w-full bg-surface-container-lowest border border-surface-variant/70 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Correo Electrónico Acompañante *</label>
                    <input 
                      type="email"
                      required
                      placeholder="sandra@ejemplo.com"
                      value={partnerEmail}
                      onChange={(e) => { setPartnerEmail(e.target.value); setValidationError(null); }}
                      className="w-full bg-surface-container-lowest border border-surface-variant/70 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                id="btn-next-checkout"
                className="w-full bg-secondary-orange hover:bg-white text-deep-blue font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase flex items-center justify-center gap-2 mt-6"
              >
                Continuar al Pago <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: BILLING & PAYMENT */
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pb-1 border-b border-surface-variant">
                💳 INFORMACIÓN DE PAGO (SIMULACIÓN SEGURA)
              </p>

              {/* Payment Methods tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('card'); setValidationError(null); }}
                  className={`py-3 border font-mono text-xs flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-secondary-orange bg-[#ff9900]/10 text-white font-bold' 
                      : 'border-surface-variant text-on-surface-variant'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Tarjeta de Crédito
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('wire'); setValidationError(null); }}
                  className={`py-3 border font-mono text-xs flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'wire' 
                      ? 'border-secondary-orange bg-[#ff9900]/10 text-white font-bold' 
                      : 'border-surface-variant text-on-surface-variant'
                  }`}
                >
                  <Landmark className="w-4 h-4" /> Transferencia SPEI
                </button>
              </div>

              {paymentMethod === 'card' ? (
                /* Card Input form */
                <div className="space-y-3">
                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Número de Tarjeta *</label>
                    <input 
                      type="text"
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ''))}
                      className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Vencimiento *</label>
                      <input 
                        type="text"
                        maxLength={5}
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">CVC / Código *</label>
                      <input 
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Bank Wire instructions */
                <div className="bg-[#030e1a] border border-surface-variant p-4 space-y-3 font-sans text-xs text-on-surface-variant">
                  <p className="font-mono text-[10px] text-white font-bold uppercase">🏦 CLABE DE EXPENDICCIONES OFICIALES</p>
                  <p>Realiza tu transferencia SPEI y tu carnet se acreditará de forma inmediata mediante esta simulación comercial:</p>
                  <div className="space-y-1.5 p-2.5 bg-black/60 border border-surface-variant font-mono text-[11px] text-emerald-400">
                    <div>Banco: <span className="text-white">BAncomer / BBVA</span></div>
                    <div>CLABE: <span className="text-white">0121 8000 6144 5401 52</span></div>
                    <div>Referencia: <span className="text-yellow-400">COMEV-2026</span></div>
                  </div>
                  <p className="text-[10px] italic">Al dar clic en Procesar Inscripción, confirmamos la recepción bancaria inmediata.</p>
                </div>
              )}

              {/* Order recap */}
              <div className="bg-[#030e1a] border border-surface-variant p-4 font-mono text-[11px] text-on-surface-variant space-y-1 mt-6">
                <div className="flex justify-between">
                  <span>MODALIDAD:</span>
                  <span className="text-white uppercase">{modality}</span>
                </div>
                <div className="flex justify-between">
                  <span>CARGO DE ACCESO:</span>
                  <span className="text-white">${price.toLocaleString('es-MX')} MXN</span>
                </div>
                <div className="flex justify-between text-secondary-orange font-bold text-xs pt-1 border-t border-surface-variant/40 mt-1">
                  <span>TOTAL A PAGAR:</span>
                  <span>${price.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-white text-white font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase hover:bg-white/5 text-center"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  id="btn-process-payment"
                  className="w-2/3 bg-secondary-orange hover:bg-white disabled:bg-surface-variant disabled:text-on-surface-variant text-deep-blue font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-deep-blue" /> PROCESANDO...
                    </>
                  ) : (
                    <>
                      PROCESAR INSCRIPCIÓN <CheckCircle2 className="w-4 h-4 text-deep-blue" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center border-t border-surface-variant/40 pt-4">
            <p className="font-sans text-[11px] text-on-surface-variant/80 flex items-center justify-center gap-1">
              🔒 Formulario avalado por el comité nacional de EVM Chihuahua, 2026.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
